"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { WorkoutExerciseCard } from "./workout-exercise-card";
import { reorderExercises } from "@/app/actions";
import { toast } from "sonner";
import { useState } from "react"; // important pour l'optimistic UI

interface DraggableWorkoutListProps {
  items: any[];
  isPlanning: boolean; // <-- NOUVELLE PROP
}

export function DraggableWorkoutList({
  items,
  isPlanning,
}: DraggableWorkoutListProps) {
  // On utilise un état local pour que le Drag&Drop soit instantané visuellement
  const [exercises, setExercises] = useState(items);

  // Met à jour l'état local si les props changent (ex: ajout d'un exo)
  if (JSON.stringify(items) !== JSON.stringify(exercises)) {
    setExercises(items);
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // 1. Mise à jour Optimiste (Instantanée)
    const newExercises = Array.from(exercises);
    const [moved] = newExercises.splice(sourceIndex, 1);
    newExercises.splice(destinationIndex, 0, moved);
    setExercises(newExercises);

    // 2. Sauvegarde Serveur
    const updates = newExercises.map((exo, index) => ({
      id: exo.id,
      orderIndex: index,
    }));

    try {
      await reorderExercises(updates);
    } catch {
      toast.error("Erreur lors de la réorganisation");
      setExercises(items); // Rollback
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="workout-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {exercises.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
                isDragDisabled={!isPlanning} // On ne bouge plus les exos une fois la séance lancée (optionnel)
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <WorkoutExerciseCard
                      item={item}
                      isPlanning={isPlanning} // <-- On transmet l'info
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
