import { db } from "@/db";
import { exercises } from "@/db/schema";
import { eq, or, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { EmptyState } from "@/components/ui/empty-state";
import { AddExerciseDialog } from "@/components/exercises/add-exercise-dialog";
import { ExerciseBrowser } from "@/components/exercises/exercise-browser";

export default async function ExercisesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const allExercises = await db
    .select()
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

      {allExercises.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="Aucun exercice"
          description="Votre bibliothèque est vide."
        />
      ) : (
        <ExerciseBrowser initialData={allExercises} />
      )}
    </>
  );
}
