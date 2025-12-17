"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableExerciseCardProps {
  id: number;
  children: React.ReactNode;
}

export function SortableExerciseCard({
  id,
  children,
}: SortableExerciseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group touch-none">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-3 z-20 cursor-grab active:cursor-grabbing p-1 transition-opacity"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div
        className={cn(
          isDragging && "shadow-xl ring-2 ring-primary/20 rounded-xl"
        )}
      >
        {children}
      </div>
    </div>
  );
}
