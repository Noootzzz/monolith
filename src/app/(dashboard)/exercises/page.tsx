import { db } from "@/db";
import { exercises } from "@/db/schema";
import { eq, or, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { AddExerciseDialog } from "@/components/exercises/add-exercise-dialog";
// On réutilise votre browser (qui gère les filtres)
import { ExerciseBrowser } from "@/components/exercises/exercise-browser";

export default async function ExercisesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const allExercises = await db
    .select({
      id: exercises.id,
      name: exercises.name,
      targetMuscle: exercises.targetMuscle,
      isSystem: exercises.isSystem,
      isFavorite: exercises.isFavorite,
      instructions: exercises.instructions,
    })
    .from(exercises)
    .where(
      or(eq(exercises.isSystem, true), eq(exercises.userId, session.user.id))
    )
    .orderBy(asc(exercises.name));

  return (
    <>
      <DashboardHeader
        title="Bibliothèque"
        subtitle="Gérez vos mouvements et exercices."
      >
        <AddExerciseDialog />
      </DashboardHeader>
      <ExerciseBrowser initialData={allExercises} />
    </>
  );
}
