"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { RemoveExerciseButton } from "@/components/workout/remove-exercise-button";
import { SetLogger } from "@/components/workout/set-logger";

interface WorkoutExerciseCardProps {
  exo: {
    id: number;
    name: string;
    targetMuscle: string;
    trackWeight: boolean;
    sets: any[];
  };
  index: number;
  isPlanning: boolean;
}

export function WorkoutExerciseCard({
  exo,
  index,
  isPlanning,
}: WorkoutExerciseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-all"
    >
      <div className="flex items-center h-14 px-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        {isPlanning && (
          <div
            {...attributes}
            {...listeners}
            className="shrink-0 w-8 flex items-center justify-start cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground outline-none touch-none"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}

        <div className="shrink-0 w-8 flex justify-center mr-2">
          <span className="flex items-center justify-center h-7 w-7 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold font-mono">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-center">
          <h3 className="font-bold text-sm leading-tight text-foreground truncate pr-2">
            {exo.name}
          </h3>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5 truncate">
            {exo.targetMuscle}
          </span>
        </div>

        <div className="shrink-0 w-8 flex justify-end">
          <RemoveExerciseButton id={exo.id} />
        </div>
      </div>

      {!isPlanning && (
        <div className="p-3 bg-white dark:bg-black/20">
          <SetLogger
            workoutExerciseId={exo.id}
            initialSets={exo.sets}
            trackWeight={exo.trackWeight}
          />
        </div>
      )}
    </div>
  );
}
