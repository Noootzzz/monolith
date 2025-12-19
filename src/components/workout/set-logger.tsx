"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { addSet } from "@/app/actions";
import { SetRow } from "./set-row";

interface SetLoggerProps {
  workoutExerciseId: number;
  sets: any[];
  trackWeight: boolean;
  isPlanning: boolean;
}

export function SetLogger({
  workoutExerciseId,
  sets,
  trackWeight,
  isPlanning,
}: SetLoggerProps) {
  return (
    <div className="space-y-1">
      {/* En-têtes de colonnes */}
      <div className="flex gap-3 px-1 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
        <div className="w-6">Set</div>
        <div className="flex-1">{trackWeight ? "KG" : ""}</div>
        <div className="flex-1">Reps</div>
        <div className="w-14">{isPlanning ? "" : "Valid."}</div>
      </div>

      {/* Liste des séries */}
      <div className="space-y-2">
        {sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            trackWeight={trackWeight}
            isPlanning={isPlanning}
          />
        ))}
      </div>

      {/* Bouton Ajouter Série */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-2 text-muted-foreground hover:text-primary border border-dashed border-muted-foreground/20 hover:border-primary/50"
        onClick={() => addSet(workoutExerciseId)}
      >
        <Plus className="h-4 w-4 mr-2" /> Ajouter une série
      </Button>
    </div>
  );
}
