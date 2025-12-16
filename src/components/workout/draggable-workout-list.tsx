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
import { GripVertical } from "lucide-react";

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
        <div className={cn("space-y-6", isPending && "opacity-70")}>
          {items.map((exo, index) => (
            <SortableExerciseCard key={exo.id} id={exo.id}>
              <div className="relative bg-card dark:bg-zinc-900/40 rounded-xl border shadow-sm p-4 transition-all">
                <div className="flex justify-between items-start mb-4 border-b pb-3 border-border/40">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-6 w-6 rounded bg-primary/10 text-primary text-xs font-bold font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-bold text-lg leading-tight text-card-foreground">
                        {exo.name}
                      </h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold pl-9">
                      {exo.targetMuscle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-60 hover:opacity-100">
                    {isPlanning && (
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab p-1" />
                    )}
                    <RemoveExerciseButton id={exo.id} />
                  </div>
                </div>

                {!isPlanning && (
                  <div className="mt-2">
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
