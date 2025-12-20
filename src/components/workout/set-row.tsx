"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateSet } from "@/app/actions";
import { useWorkoutSession } from "./workout-session-context";

interface SetRowProps {
  set: {
    id: number;
    index: number;
    weight: string;
    reps: number;
    isCompleted: boolean | null;
  };
  trackWeight?: boolean;
  isPlanning?: boolean;
  restTime?: number;
}

export function SetRow({
  set,
  trackWeight = true,
  isPlanning = false,
  restTime = 90,
}: SetRowProps) {
  const formatValue = (val: string | number) => {
    if (val === 0 || val === "0") return "";
    return val.toString();
  };

  const [weight, setWeight] = useState(formatValue(set.weight));
  const [reps, setReps] = useState(formatValue(set.reps));
  const [completed, setCompleted] = useState(!!set.isCompleted);

  const { startRest } = useWorkoutSession();

  useEffect(() => {
    setWeight(formatValue(set.weight));
    setReps(formatValue(set.reps));
    setCompleted(!!set.isCompleted);
  }, [set]);

  const handleBlur = async (field: "weight" | "reps", value: string) => {
    if (field === "weight" && value === set.weight) return;
    if (field === "reps" && parseInt(value) === set.reps) return;
    try {
      await updateSet(set.id, field, value);
    } catch {}
  };

  const toggleComplete = async () => {
    if (isPlanning) return;

    const newState = !completed;
    setCompleted(newState);

    // Vibration courte et sèche (très discret)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }

    if (newState) {
      startRest(restTime);
    }

    try {
      await updateSet(set.id, "isCompleted", newState);
    } catch {
      setCompleted(!newState);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 mb-2 last:mb-0 transition-opacity duration-200",
        // Si validé, on réduit l'opacité pour se concentrer sur la suite
        completed ? "opacity-60" : "opacity-100"
      )}
    >
      {/* Numéro de série (Discret) */}
      <div
        className={cn(
          "w-6 text-center text-xs font-bold shrink-0 transition-colors",
          completed ? "text-emerald-600" : "text-muted-foreground/50"
        )}
      >
        #{set.index}
      </div>

      {/* INPUTS */}
      <div className="flex-1 flex items-center gap-2">
        {trackWeight && (
          <div className="relative flex-1">
            <Input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onBlur={(e) => handleBlur("weight", e.target.value)}
              // On change le fond si c'est validé pour montrer que c'est "figé"
              className={cn(
                "h-10 text-center font-semibold rounded-md border-0 shadow-sm ring-1 ring-inset transition-all",
                completed
                  ? "bg-transparent text-foreground ring-transparent cursor-default"
                  : "bg-zinc-50 dark:bg-zinc-900 ring-zinc-200 dark:ring-zinc-800 focus:ring-2 focus:ring-primary focus:bg-background"
              )}
              placeholder="-"
              disabled={completed} // Ergonomie : on empêche la modif si validé
            />
            {!completed && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none uppercase">
                kg
              </span>
            )}
          </div>
        )}

        <div className="relative flex-1">
          <Input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onBlur={(e) => handleBlur("reps", e.target.value)}
            className={cn(
              "h-10 text-center font-semibold rounded-md border-0 shadow-sm ring-1 ring-inset transition-all",
              completed
                ? "bg-transparent text-foreground ring-transparent cursor-default"
                : "bg-zinc-50 dark:bg-zinc-900 ring-zinc-200 dark:ring-zinc-800 focus:ring-2 focus:ring-primary focus:bg-background"
            )}
            placeholder="-"
            disabled={completed}
          />
          {!completed && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none uppercase">
              {trackWeight ? "reps" : "sec"}
            </span>
          )}
        </div>
      </div>

      {/* BOUTON DE VALIDATION (STYLE ÉPURÉ) */}
      {!isPlanning ? (
        <button
          onClick={toggleComplete}
          className={cn(
            "h-10 px-3 rounded-md flex items-center justify-center gap-1 transition-all duration-200 shrink-0 font-bold text-xs select-none active:scale-95",
            completed
              ? "bg-emerald-500 text-white shadow-sm" // Validé : Vert solide, texte blanc
              : "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground hover:bg-zinc-300 dark:hover:bg-zinc-700" // A faire : Gris neutre
          )}
        >
          {completed ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
            </>
          ) : (
            <>
              <span className="mb-px">OK</span>
            </>
          )}
        </button>
      ) : (
        // Placeholder
        <div className="w-[52px] h-10 flex items-center justify-center opacity-10">
          <div className="h-1.5 w-1.5 rounded-full bg-current" />
        </div>
      )}
    </div>
  );
}
