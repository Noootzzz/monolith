import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { workouts, workoutExercises, sets, exercises } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

import { WorkoutHeader } from "@/components/workout/workout-header";
import { DraggableWorkoutList } from "@/components/workout/draggable-workout-list";
import { WorkoutExercisePicker } from "@/components/workout/workout-exercise-picker";
import { StartWorkoutButton } from "@/components/workout/start-workout-button";
import { WorkoutSessionProvider } from "@/components/workout/workout-session-context";
import { RestTimerOverlay } from "@/components/workout/rest-timer-overlay";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const workoutId = parseInt(resolvedParams.id);
  if (isNaN(workoutId)) notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");

  // 1. Récupérer la séance
  const workout = await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId),
  });
  if (!workout || workout.userId !== session.user.id) notFound();

  // 2. Récupérer les exercices et séries
  // (Note: db.query nécessite que les relations soient définies dans schema.ts)
  const workoutExos = await db.query.workoutExercises.findMany({
    where: eq(workoutExercises.workoutId, workoutId),
    with: {
      exercise: true,
      sets: {
        orderBy: [asc(sets.orderIndex)], // Utilise bien orderIndex
      },
    },
    orderBy: [asc(workoutExercises.orderIndex)],
  });

  // 3. Formater les données pour l'UI
  const items = workoutExos.map((we) => ({
    id: we.id,
    name: we.exercise.name,
    targetMuscle: we.exercise.targetMuscle,
    trackWeight: we.exercise.trackWeight,
    sets: we.sets.map((s, index) => ({
      id: s.id,
      index: index + 1,
      weight: s.weight,
      reps: s.reps,
      isCompleted: s.isCompleted,
    })),
  }));

  // 4. Liste de tous les exos pour le picker (ajout d'exos)
  const allExercises = await db
    .select({
      id: exercises.id,
      name: exercises.name,
      targetMuscle: exercises.targetMuscle,
      isSystem: exercises.isSystem,
      isFavorite: exercises.isFavorite,
    })
    .from(exercises);

  const existingIds = workoutExos.map((we) => we.exerciseId);

  // Détermine si on est en phase de préparation
  const isPlanning = workout.status === "PLANNING";

  return (
    // Le Provider englobe toute la page pour que SetRow et RestTimerOverlay puissent communiquer
    <WorkoutSessionProvider>
      <div className="flex flex-col min-h-screen bg-background pb-24 relative">
        {/* L'Overlay de repos (invisible sauf si repos actif) */}
        <RestTimerOverlay />

        {/* En-tête (Timer global ou statut planning) */}
        <WorkoutHeader
          workoutId={workoutId}
          workoutName={workout.name}
          startTime={workout.startTime}
          status={workout.status}
          duration={workout.duration}
        />

        <div className="flex-1 w-full max-w-md mx-auto p-4 space-y-6">
          {/* Liste des exercices */}
          <DraggableWorkoutList
            items={items}
            isPlanning={isPlanning} // On passe l'état pour masquer les boutons valider
          />

          {/* Sélecteur d'exercices (Sauf si terminé) */}
          {workout.status !== "COMPLETED" && (
            <WorkoutExercisePicker
              workoutId={workoutId}
              exercises={allExercises}
              existingExerciseIds={existingIds}
            />
          )}
        </div>

        {/* Le gros bouton "COMMENCER" (Uniquement en mode Planning) */}
        {isPlanning && <StartWorkoutButton workoutId={workoutId} />}
      </div>
    </WorkoutSessionProvider>
  );
}
