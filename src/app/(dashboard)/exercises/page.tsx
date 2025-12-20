import { db } from "@/db";
import { exercises } from "@/db/schema";
import { eq, or, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { AddExerciseDialog } from "@/components/exercises/add-exercise-dialog";
import { ExerciseBrowser } from "@/components/exercises/exercise-browser";
import { unstable_cache } from "next/cache";

// Fonction de récupération avec cache
const getCachedExercises = unstable_cache(
  async (userId: string) => {
    return await db
      .select({
        id: exercises.id,
        name: exercises.name,
        targetMuscle: exercises.targetMuscle,
        isSystem: exercises.isSystem,
        isFavorite: exercises.isFavorite,
        instructions: exercises.instructions,
      })
      .from(exercises)
      .where(or(eq(exercises.isSystem, true), eq(exercises.userId, userId)))
      .orderBy(asc(exercises.name));
  },
  ["user-exercises"], // Clé interne
  {
    tags: ["exercises"], // Tag pour revalidateTag
    revalidate: 3600, // Cache valide 1h par défaut
  }
);

export default async function ExercisesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // Appel de la version cachée
  const allExercises = await getCachedExercises(session.user.id);

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
