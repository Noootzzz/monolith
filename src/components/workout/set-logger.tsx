"use client";

import { useState, useEffect } from "react";
import { Check, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateSet, removeSet, addSet } from "@/app/actions";
import { useDebounce } from "@/hooks/use-debounce";
import { RPE_OPTIONS } from "@/lib/constants";

export function SetLogger({ workoutExerciseId, initialSets }: any) {
  const [sets, setSets] = useState(initialSets);
  useEffect(() => {
    setSets(initialSets);
  }, [initialSets]);

  const handleAddSet = async () => {
    await addSet(workoutExerciseId);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[25px_1fr_1fr_1fr_70px] gap-2 px-1 mb-1">
        <span className="text-[10px] font-bold text-muted-foreground text-center uppercase self-end pb-1">
          Série
        </span>
        <span className="text-[10px] font-bold text-muted-foreground text-center uppercase self-end pb-1">
          KG
        </span>
        <span className="text-[10px] font-bold text-muted-foreground text-center uppercase self-end pb-1">
          Reps
        </span>
        <span className="text-[10px] font-bold text-muted-foreground text-center uppercase self-end pb-1">
          Difficulté
        </span>
        <span className="text-[10px] font-bold text-muted-foreground text-center uppercase self-end pb-1">
          Validé
        </span>
      </div>

      <div className="space-y-2">
        {sets.map((set: any, index: number) => (
          <SetRow
            key={set.id}
            set={set}
            index={index}
            previousSet={index > 0 ? sets[index - 1] : null}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddSet}
        className="w-full mt-2 border-dashed border border-border text-muted-foreground hover:bg-accent/50 h-8 text-xs uppercase tracking-wide"
      >
        + Ajouter une série
      </Button>
    </div>
  );
}

function SetRow({ set, index, previousSet }: any) {
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);
  const [rpe, setRpe] = useState(set.rpe || "");
  const [isCompleted, setIsCompleted] = useState(set.isCompleted);
  const debouncedWeight = useDebounce(weight, 500);
  const debouncedReps = useDebounce(reps, 500);
  const debouncedRpe = useDebounce(rpe, 500);

  useEffect(() => {
    if (debouncedWeight !== set.weight)
      updateSet(set.id, "weight", debouncedWeight);
  }, [debouncedWeight, set.id, set.weight]);

  useEffect(() => {
    if (debouncedReps !== set.reps) updateSet(set.id, "reps", debouncedReps);
  }, [debouncedReps, set.id, set.reps]);

  useEffect(() => {
    const currentRpe = set.rpe === null ? "" : set.rpe;
    if (debouncedRpe !== currentRpe) updateSet(set.id, "rpe", debouncedRpe);
  }, [debouncedRpe, set.id, set.rpe]);

  const toggleComplete = async () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    await updateSet(set.id, "isCompleted", newState);
  };

  const handleDelete = async () => {
    if (confirm("Supprimer cette série ?")) {
      await removeSet(set.id);
    }
  };

  const currentOption = RPE_OPTIONS.find(
    (opt) => opt.value.toString() === rpe.toString()
  );

  return (
    <div
      className={cn(
        "relative grid grid-cols-[25px_1fr_1fr_1fr_70px] gap-2 items-center group transition-colors rounded-md p-1",
        isCompleted
          ? "bg-emerald-500/10 dark:bg-emerald-500/20"
          : "bg-transparent hover:bg-accent/30"
      )}
    >
      <div className="flex justify-center">
        <span
          className={cn(
            "text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground bg-muted/50 transition-colors",
            isCompleted && "bg-emerald-500 text-white"
          )}
        >
          {index + 1}
        </span>
      </div>

      <Input
        type="number"
        inputMode="decimal"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder={previousSet?.weight || "-"}
        className={cn(
          "h-9 text-center px-1 font-medium transition-all shadow-none",
          isCompleted
            ? "border-emerald-500/20 text-emerald-700 dark:text-emerald-400 bg-transparent focus-visible:ring-emerald-500/50"
            : "bg-background focus-visible:ring-primary"
        )}
      />

      <Input
        type="number"
        inputMode="numeric"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        placeholder={previousSet?.reps || "-"}
        className={cn(
          "h-9 text-center px-1 font-medium transition-all shadow-none",
          isCompleted
            ? "border-emerald-500/20 text-emerald-700 dark:text-emerald-400 bg-transparent focus-visible:ring-emerald-500/50"
            : "bg-background focus-visible:ring-primary"
        )}
      />

      <div className="relative h-9 w-full">
        <select
          value={rpe}
          onChange={(e) => setRpe(e.target.value)}
          className={cn(
            "w-full h-full appearance-none text-center text-xs font-medium rounded-md border shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
            isCompleted
              ? "border-emerald-500/20 text-emerald-700 dark:text-emerald-400 bg-transparent"
              : "bg-background border-input",
            currentOption?.color
          )}
        >
          <option value="" className="text-muted-foreground">
            -
          </option>
          {RPE_OPTIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className={cn("text-black dark:text-white py-1", opt.color)}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {!rpe && !isCompleted && (
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50 pointer-events-none" />
        )}
      </div>

      <div className="flex items-center gap-1 justify-end">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleComplete}
          className={cn(
            "h-9 w-9 shrink-0 transition-all rounded-md",
            isCompleted
              ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
          )}
        >
          <Check className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-9 md:static md:opacity-100 md:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
