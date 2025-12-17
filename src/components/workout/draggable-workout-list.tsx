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
// On importe notre nouveau composant
import { WorkoutExerciseCard } from "./workout-exercise-card";
import { reorderExercises } from "@/app/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    useSensor(TouchSensor),
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
            <WorkoutExerciseCard
              key={exo.id}
              exo={exo}
              index={index}
              isPlanning={isPlanning}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
