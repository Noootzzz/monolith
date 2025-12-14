"use client";

import { useState, useMemo } from "react";
import { ExerciseList } from "./exercise-list";
import { ExerciseFilters } from "./exercise-filters";
import { Search } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  targetMuscle: string;
  isSystem: boolean;
}

export function ExerciseBrowser({ initialData }: { initialData: Exercise[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

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

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <ExerciseFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedMuscle={selectedMuscle}
        setSelectedMuscle={setSelectedMuscle}
        muscles={availableMuscles}
      />

      {filteredExercises.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">Aucun résultat</h3>
          <p className="text-muted-foreground text-sm">
            {selectedMuscle === "Personnel"
              ? "Vous n'avez pas encore créé d'exercice personnel."
              : "Essayez de modifier votre recherche."}
          </p>
        </div>
      ) : (
        <ExerciseList data={filteredExercises} />
      )}
    </div>
  );
}
