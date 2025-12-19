"use client";

import { useState, useMemo, useEffect } from "react"; // Ajoutez useEffect
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { ExerciseFilters } from "./exercise-filters";
import { Search, Dumbbell, Star, Loader2 } from "lucide-react"; // Ajoutez Loader2
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Exercise {
  id: number;
  name: string;
  targetMuscle: string;
  isSystem: boolean;
  isFavorite: boolean;
  instructions: string | null;
}

export function ExerciseBrowser({ initialData }: { initialData: Exercise[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const availableMuscles = useMemo(() => {
    const muscles = new Set(initialData.map((ex) => ex.targetMuscle));
    return Array.from(muscles).sort();
  }, [initialData]);

  const filteredExercises = initialData.filter((exo) => {
    const matchesSearch = exo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (selectedMuscle === "Personnel") {
      matchesCategory = !exo.isSystem;
    } else if (selectedMuscle) {
      matchesCategory = exo.targetMuscle === selectedMuscle;
    }

    const matchesFav = showFavoritesOnly ? exo.isFavorite : true;

    return matchesSearch && matchesCategory && matchesFav;
  });

  if (!isMounted) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <ExerciseFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedMuscle={selectedMuscle}
            setSelectedMuscle={setSelectedMuscle}
            muscles={availableMuscles}
          />
        </div>

        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={cn(
            "w-full md:w-auto transition-all gap-2",
            showFavoritesOnly &&
              "bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-500"
          )}
        >
          <Star
            className={cn("h-4 w-4", showFavoritesOnly && "fill-current")}
          />
          {showFavoritesOnly ? "Favoris affichés" : "Voir Favoris"}
        </Button>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 mt-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              {initialData.length === 0 ? (
                <Dumbbell className="h-8 w-8 text-muted-foreground/50" />
              ) : (
                <Search className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
          </div>
          <h3 className="text-lg font-semibold">Aucun exercice trouvé</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {initialData.length === 0
              ? "Votre bibliothèque est vide."
              : "Essayez de modifier vos filtres."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {filteredExercises.map((exo) => (
            <ExerciseCard key={exo.id} exercise={exo} />
          ))}
        </div>
      )}
    </div>
  );
}
