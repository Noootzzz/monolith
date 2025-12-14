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

import { Badge } from "@/components/ui/badge";
import { RemoveExerciseButton } from "@/components/workout/remove-exercise-button";
import { SetLogger } from "@/components/workout/set-logger";

interface WorkoutExerciseWithSets {
  id: number;
  name: string;
  targetMuscle: string;
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
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
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
          toast.error("Erreur de sauvegarde de l'ordre");
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
        <div
          className={cn(
            "space-y-4",
            isPending && "opacity-70 transition-opacity"
          )}
        >
          {items.map((exo, index) => (
            <SortableExerciseCard key={exo.id} id={exo.id}>
              <div className="bg-card border rounded-xl overflow-hidden shadow-sm transition-all">
                <div
                  className={cn(
                    "p-3 flex justify-between items-center pl-10",
                    !isPlanning ? "border-b bg-muted/30" : "bg-card"
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-sm mr-2 shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-semibold select-none">
                      {exo.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] hidden sm:flex"
                    >
                      {exo.targetMuscle}
                    </Badge>
                    <RemoveExerciseButton id={exo.id} />
                  </div>
                </div>

                {!isPlanning && (
                  <div className="p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <SetLogger
                      workoutExerciseId={exo.id}
                      initialSets={exo.sets}
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
