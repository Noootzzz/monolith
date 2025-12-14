"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Check,
  Loader2,
  Dumbbell,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ExerciseFilters } from "@/components/exercises/exercise-filters";
import { addExercisesToWorkout } from "@/app/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Exercise {
  id: number;
  name: string;
  targetMuscle: string;
  isSystem: boolean;
}

interface WorkoutExercisePickerProps {
  workoutId: number;
  exercises: Exercise[];
  existingExerciseIds: number[];
}

export function WorkoutExercisePicker({
  workoutId,
  exercises,
  existingExerciseIds,
}: WorkoutExercisePickerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const availableMuscles = useMemo(() => {
    const muscles = new Set(exercises.map((ex) => ex.targetMuscle));
    return Array.from(muscles).sort();
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exo) => {
      const matchesSearch = exo.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      let matchesCategory = true;
      if (selectedMuscle === "Personnel") matchesCategory = !exo.isSystem;
      else if (selectedMuscle)
        matchesCategory = exo.targetMuscle === selectedMuscle;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchQuery, selectedMuscle]);

  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    filteredExercises.forEach((ex) => {
      if (!groups[ex.targetMuscle]) groups[ex.targetMuscle] = [];
      groups[ex.targetMuscle].push(ex);
    });
    return groups;
  }, [filteredExercises]);

  const toggleSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  const handleValidate = async () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    try {
      await addExercisesToWorkout(workoutId, selectedIds);
      toast.success(`${selectedIds.length} exercices ajoutés`);
      setOpen(false);
      setSelectedIds([]);
      setSearchQuery("");
      setSelectedMuscle(null);
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const PickerContent = (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b bg-background z-10 shrink-0">
        <ExerciseFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedMuscle={selectedMuscle}
          setSelectedMuscle={setSelectedMuscle}
          muscles={availableMuscles}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {Object.keys(groupedExercises).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
            <Search className="h-10 w-10 opacity-20" />
            <p>Aucun exercice trouvé.</p>
          </div>
        ) : (
          Object.entries(groupedExercises)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([muscle, exos]) => (
              <div key={muscle} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                  {muscle}
                </h3>
                <div className="space-y-2">
                  {exos.map((exo) => {
                    const isSelected = selectedIds.includes(exo.id);
                    const isAlreadyAdded = existingExerciseIds.includes(exo.id);

                    return (
                      <button
                        key={exo.id}
                        onClick={() =>
                          !isAlreadyAdded && toggleSelection(exo.id)
                        }
                        disabled={isAlreadyAdded}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left group",
                          isAlreadyAdded
                            ? "opacity-50 bg-muted cursor-not-allowed border-transparent"
                            : isSelected
                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                            : "bg-card hover:bg-accent/50 hover:border-primary/50"
                        )}
                      >
                        <div className="pr-4">
                          <div
                            className={cn(
                              "font-semibold text-sm line-clamp-2",
                              isSelected && "text-primary"
                            )}
                          >
                            {exo.name}
                          </div>
                        </div>

                        {!isAlreadyAdded ? (
                          <div
                            className={cn(
                              "h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-all",
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                        ) : (
                          <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
        )}
      </div>

      <div className="p-4 border-t bg-background shrink-0 pb-8 md:pb-4">
        <Button
          className="w-full h-12 text-base shadow-lg"
          onClick={handleValidate}
          disabled={selectedIds.length === 0 || loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Plus className="h-5 w-5 mr-2" />
          )}
          {loading
            ? "Ajout..."
            : `Ajouter la sélection (${selectedIds.length})`}
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full gap-2 text-base h-12 shadow-md hover:shadow-lg transition-all"
            suppressHydrationWarning
          >
            <Plus className="h-5 w-5" /> Ajouter un exercice
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl h-[80vh] p-0 gap-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 pb-2 border-b shrink-0">
            <DialogTitle>Bibliothèque d'exercices</DialogTitle>
          </DialogHeader>
          {PickerContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-full gap-2 text-base h-12 shadow-md mb-20 md:mb-0"
          suppressHydrationWarning
        >
          <Plus className="h-5 w-5" /> Ajouter un exercice
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] flex flex-col rounded-t-xl outline-none">
        <DrawerHeader className="text-left border-b p-4 shrink-0">
          <DrawerTitle>Bibliothèque d'exercices</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">{PickerContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
