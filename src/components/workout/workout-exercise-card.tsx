"use client";

import { MoreHorizontal, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeExerciseFromWorkout } from "@/app/actions";
import { SetLogger } from "./set-logger"; // Assurez-vous d'avoir ce composant
import { Badge } from "@/components/ui/badge";

export function WorkoutExerciseCard({
  item,
  isPlanning,
}: {
  item: any;
  isPlanning: boolean;
}) {
  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      {/* En-tête de l'exercice */}
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-sm md:text-base line-clamp-1">
            {item.name}
          </h3>
          <Badge
            variant="secondary"
            className="w-fit text-[10px] h-4 px-1 mt-1 font-normal text-muted-foreground"
          >
            {item.targetMuscle}
          </Badge>
        </div>

        {/* Menu d'actions (Supprimer, etc) - Toujours utile même pendant la séance */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => removeExerciseFromWorkout(item.id)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Liste des séries */}
      <div className="p-3">
        <SetLogger
          workoutExerciseId={item.id}
          sets={item.sets}
          trackWeight={item.trackWeight}
          isPlanning={isPlanning} // <-- On transmet encore
        />
      </div>
    </div>
  );
}
