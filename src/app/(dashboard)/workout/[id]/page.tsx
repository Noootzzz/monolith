import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { workouts, exercises, workoutExercises, sets } from "@/db/schema";
import { eq, and, or, asc, inArray } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, Dumbbell, Play } from "lucide-react";
import { WorkoutExercisePicker } from "@/components/workout/workout-exercise-picker";
import { CancelWorkoutButton } from "@/components/workout/cancel-workout-button";
import { FinishWorkoutButton } from "@/components/workout/finish-button";
import { WorkoutTimer } from "@/components/workout/workout-timer";
import { SaveTemplateDialog } from "@/components/workout/save-template-dialog";
import { Button } from "@/components/ui/button";
import { startTimer } from "@/app/actions";
import { DraggableWorkoutList } from "@/components/workout/draggable-workout-list";

export default async function ActiveWorkoutPage({
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

  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id))
    )
    .limit(1);

  if (!workout) notFound();

  const workoutExos = await db
    .select({
      id: workoutExercises.id,
      exerciseId: exercises.id,
      name: exercises.name,
      targetMuscle: exercises.targetMuscle,
      orderIndex: workoutExercises.orderIndex,
    })
    .from(workoutExercises)
    .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(eq(workoutExercises.workoutId, workoutId))
    .orderBy(asc(workoutExercises.orderIndex));

  let allSets: any[] = [];
  if (workoutExos.length > 0) {
    const workoutExerciseIds = workoutExos.map((we) => we.id);
    allSets = await db
      .select()
      .from(sets)
      .where(inArray(sets.workoutExerciseId, workoutExerciseIds))
      .orderBy(asc(sets.index));
  }

  const allExercises = await db
    .select()
    .from(exercises)
    .where(
      or(eq(exercises.isSystem, true), eq(exercises.userId, session.user.id))
    )
    .orderBy(asc(exercises.name));

  const existingExerciseIds = workoutExos.map((exo) => exo.exerciseId);

  const isPlanning = workout.status === "PLANNING";

  const exercisesWithSets = workoutExos.map((exo) => ({
    ...exo,
    sets: allSets.filter((s) => s.workoutExerciseId === exo.id),
  }));

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] pb-6 relative">
      <div className="flex flex-col gap-4 mb-6 border-b pb-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-20 pt-4 -mt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/workout"
            className="text-sm text-muted-foreground flex items-center hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>

          {!isPlanning && workout.startTime && (
            <WorkoutTimer startTime={workout.startTime} />
          )}

          <div className="flex gap-2">
            <SaveTemplateDialog workoutId={workoutId} />
            <CancelWorkoutButton workoutId={workoutId} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              {isPlanning ? (
                <span className="flex items-center text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded text-xs font-medium">
                  Planification
                </span>
              ) : (
                <span className="flex items-center text-green-600 bg-green-500/10 px-2 py-0.5 rounded text-xs font-medium">
                  En cours
                </span>
              )}
              • {workoutExos.length} exos
            </p>
          </div>

          {isPlanning ? (
            <form
              action={async () => {
                "use server";
                await startTimer(workoutId);
              }}
            >
              <Button
                size="lg"
                className="gap-2 font-bold shadow-lg shadow-primary/20 animate-pulse"
              >
                <Play className="h-5 w-5 fill-current" />
                LANCER
              </Button>
            </form>
          ) : (
            <FinishWorkoutButton workoutId={workoutId} />
          )}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {workoutExos.length === 0 ? (
          <div className="border border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Dumbbell className="h-6 w-6 opacity-50" />
            </div>
            <p>Ajoutez des exercices pour préparer votre séance.</p>
          </div>
        ) : (
          <DraggableWorkoutList
            items={exercisesWithSets}
            isPlanning={isPlanning}
          />
        )}
      </div>

      <div className="sticky bottom-6 mt-8 z-10 w-full">
        <WorkoutExercisePicker
          workoutId={workoutId}
          exercises={allExercises}
          existingExerciseIds={existingExerciseIds}
        />
      </div>
    </div>
  );
}
