"use client";

import { useState, useEffect, useId, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableExerciseCard } from "./sortable-exercise-card";
import { reorderExercises } from "@/app/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { RemoveExerciseButton } from "@/components/workout/remove-exercise-button";
import { SetLogger } from "@/components/workout/set-logger";

interface WorkoutExerciseWithSets {
  id: number;
  name: string;
  targetMuscle: string;
  trackWeight: boolean;
  sets: any[];
}

interface DraggableWorkoutListProps {
  items: WorkoutExerciseWithSets[];
  isPlanning: boolean;
}

export function DraggableWorkoutList({
  items: initialItems,
  isPlanning,
}: DraggableWorkoutListProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const dndContextId = useId();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      const updates = newItems.map((item, index) => ({
        id: item.id,
        orderIndex: index,
      }));
      startTransition(async () => {
        try {
          await reorderExercises(updates);
        } catch (error) {
          toast.error("Erreur");
          setItems(items);
        }
      });
    }
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("space-y-4", isPending && "opacity-70")}>
          {items.map((exo, index) => (
            <SortableExerciseCard key={exo.id} id={exo.id}>
              <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-all">
                <div className="flex items-center h-14 px-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50">
                  <div className="shrink-0 w-8 flex items-center justify-start cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground"></div>
                  <div className="shrink-0 w-8 flex justify-center mr-2">
                    <span className="flex items-center justify-center h-7 w-7 rounded-md bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold font-mono border border-zinc-200 dark:border-zinc-700 shadow-sm">
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
            </SortableExerciseCard>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
