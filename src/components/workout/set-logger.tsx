"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addSet } from "@/app/actions";
import { SetRow } from "./set-row";

interface SetLoggerProps {
  workoutExerciseId: number;
  initialSets: any[];
  trackWeight?: boolean;
}

export function SetLogger({
  workoutExerciseId,
  initialSets,
  trackWeight = true,
}: SetLoggerProps) {
  const sets = initialSets.sort((a, b) => a.index - b.index);

  return (
    <div className="w-full">
      <div className="space-y-3">
        {sets.map((set) => (
          <SetRow key={set.id} set={set} trackWeight={trackWeight} />
        ))}
      </div>

      <Button
        variant="ghost"
        className="w-full mt-3 h-10 border border-dashed border-zinc-300 dark:border-zinc-800 text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-lg"
        onClick={() => addSet(workoutExerciseId)}
      >
        <Plus className="mr-2 h-4 w-4" /> Ajouter une série
      </Button>
    </div>
  );
}
