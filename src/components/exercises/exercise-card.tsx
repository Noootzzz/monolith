"use client";

import { useState } from "react";
import { Star, Dumbbell, Info, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleExerciseFavorite } from "@/app/actions";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExerciseCardProps {
  exercise: {
    id: number;
    name: string;
    targetMuscle: string;
    isFavorite: boolean;
    instructions: string | null;
  };
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [isFav, setIsFav] = useState(exercise.isFavorite);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isFav;
    setIsFav(newState);

    try {
      await toggleExerciseFavorite(exercise.id);
      toast.success(newState ? "Ajouté aux favoris" : "Retiré des favoris");
    } catch {
      setIsFav(!newState);
      toast.error("Erreur lors de la modification");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="group relative flex items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0 group-hover:scale-105 transition-transform">
            <Dumbbell className="h-6 w-6 fill-current opacity-80" />
          </div>

          <div className="flex-1 min-w-0 mr-2">
            <h3 className="font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
              {exercise.name}
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {exercise.targetMuscle}
            </span>
          </div>

          <button
            onClick={handleToggleFav}
            className="p-2 -mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
          >
            <Star
              className={cn(
                "h-5 w-5 transition-all",
                isFav
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-muted-foreground/40 hover:text-yellow-400"
              )}
            />
          </button>
        </div>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] sm:h-full sm:max-w-md rounded-t-4xl sm:rounded-none"
      >
        <SheetHeader className="text-left space-y-4 pb-6 border-b">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="w-fit text-primary border-primary/20 bg-primary/5"
            >
              {exercise.targetMuscle}
            </Badge>
            {isFav && (
              <Badge className="bg-yellow-400 hover:bg-yellow-500 text-black">
                Favori
              </Badge>
            )}
          </div>

          <SheetTitle className="text-3xl font-extrabold">
            {exercise.name}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-8 overflow-y-auto h-full pb-24">
          {/* Section Placeholder VIDEO (Si tu veux ajouter des vidéos plus tard) */}
          <div className="aspect-video w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-zinc-300 dark:border-zinc-700">
            <PlayCircle className="h-12 w-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">Vidéo de démonstration</span>
          </div>

          {/* Section INSTRUCTIONS */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-lg">
              <Info className="h-5 w-5 text-primary" />
              Instructions
            </h4>
            <div className="text-sm leading-relaxed text-muted-foreground space-y-4">
              {exercise.instructions ? (
                <p className="whitespace-pre-wrap">{exercise.instructions}</p>
              ) : (
                <div className="italic opacity-60">
                  <p>
                    1. Installez-vous confortablement sur la machine ou avec vos
                    poids.
                  </p>
                  <p>
                    2. Contrôlez la phase excentrique (négative) du mouvement.
                  </p>
                  <p>3. Expirez lors de l'effort.</p>
                  <p className="mt-4 text-xs font-medium text-foreground">
                    (Description détaillée à venir prochainement)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bouton d'action en bas */}
          <div className="pt-4">
            <Button
              className="w-full font-bold shadow-lg shadow-primary/20"
              size="lg"
              onClick={handleToggleFav}
            >
              {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
