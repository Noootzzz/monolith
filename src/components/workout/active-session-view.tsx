"use client";

import { useWorkoutSession } from "./workout-session-context";
import { WorkoutHeader } from "./workout-header";
import { SetRow } from "./set-row";
import { RestTimerOverlay } from "./rest-timer-overlay";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cancelWorkout } from "@/app/actions";

export function ActiveSessionView({ workout, initialData }: any) {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-24 relative">
      <RestTimerOverlay />

      <WorkoutHeader
        workoutId={workout.id}
        workoutName={workout.name}
        startTime={workout.startTime}
        status={workout.status}
        duration={workout.duration}
      />

      {/* CORRECTION LAYOUT: 
        w-full max-w-3xl mx-auto -> Largeur confortable sur PC (768px env)
        p-3 md:p-4 -> Marges plus fines sur mobile 
      */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-3 md:p-4 space-y-6">
        {initialData.map((we: any) => (
          <div key={we.id} className="space-y-4">
            <div className="flex items-center justify-between sticky top-16 bg-background/95 backdrop-blur z-20 py-3 border-b">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 truncate">
                {we.exercise.name}
              </h2>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded shrink-0">
                Repos: {Math.floor(we.restTime / 60)}:
                {(we.restTime % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <div className="grid gap-2">
              <div className="flex gap-2 px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                <div className="w-6">Set</div>
                <div className="flex-1">Kg</div>
                <div className="flex-1">Reps</div>
                <div className="w-[52px]">Valid.</div>
              </div>

              {we.sets.map((set: any) => (
                <SetRow
                  key={set.id}
                  set={set}
                  trackWeight={we.exercise.trackWeight}
                  restTime={we.restTime}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 z-0">
        <form action={() => cancelWorkout(workout.id)}>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-red-500 text-xs h-8 px-2"
          >
            <X className="h-3 w-3 mr-1" /> Annuler
          </Button>
        </form>
      </div>
    </div>
  );
}
