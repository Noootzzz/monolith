import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { workouts, workoutExercises, sets, exercises } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
// 👇 Assurez-vous d'avoir ces imports
import { WorkoutSetupWizard } from "@/components/workout/workout-setup-wizard";
import { ActiveSessionView } from "@/components/workout/active-session-view";
import { WorkoutSessionProvider } from "@/components/workout/workout-session-context";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const workoutId = parseInt(resolvedParams.id);
  if (isNaN(workoutId)) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // 1. Récupérer la séance
  const workout = await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId),
  });
  if (!workout || workout.userId !== session.user.id) notFound();

  // 2. Si c'est fini, on redirige vers le dashboard
  if (workout.status === "COMPLETED") redirect("/dashboard");

  // 3. Récupérer les détails (Exos + Séries)
  const workoutExos = await db.query.workoutExercises.findMany({
    where: eq(workoutExercises.workoutId, workoutId),
    with: {
      exercise: true,
      sets: { orderBy: [asc(sets.orderIndex)] },
    },
    orderBy: [asc(workoutExercises.orderIndex)],
  });

  // 4. Liste de tous les exos (pour le sélecteur d'ajout)
  const allExercises = await db.select().from(exercises);

  // --- AIGUILLAGE ---

  // CAS 1 : MODE PRÉPARATION (Wizard)
  // On utilise le Wizard qui ne plante pas car il n'utilise pas SetRow
  if (workout.status === "PLANNING" || workout.status === "DRAFT") {
    return (
      <WorkoutSetupWizard
        workout={workout}
        initialWorkoutExercises={workoutExos}
        allExercises={allExercises}
      />
    );
  }

  // CAS 2 : MODE ACTIF (Live)
  // On englobe dans le Provider pour que SetRow puisse accéder au Timer
  return (
    <WorkoutSessionProvider>
      <ActiveSessionView workout={workout} initialData={workoutExos} />
    </WorkoutSessionProvider>
  );
}
