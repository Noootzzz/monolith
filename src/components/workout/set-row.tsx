"use client";

import { useState } from "react";
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
}

export function SetRow({ set, trackWeight = true }: SetRowProps) {
  const formatValue = (val: string | number) => {
    if (val === 0 || val === "0") return "";
    return val.toString();
  };

  const [weight, setWeight] = useState(formatValue(set.weight));
  const [reps, setReps] = useState(formatValue(set.reps));

  const [completed, setCompleted] = useState(!!set.isCompleted);
  const { startRest } = useWorkoutSession();

  const handleBlur = async (field: "weight" | "reps", value: string) => {
    if (field === "weight" && value === set.weight) return;
    if (field === "reps" && parseInt(value) === set.reps) return;
    try {
      await updateSet(set.id, field, value);
    } catch {}
  };

  const toggleComplete = async () => {
    const newState = !completed;
    setCompleted(newState);
    if (newState) startRest(90);
    try {
      await updateSet(set.id, "isCompleted", newState);
    } catch {
      setCompleted(!newState);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 mb-3 last:mb-0 transition-all duration-300",
        completed && "opacity-50 grayscale"
      )}
    >
      <div className="w-6 text-center text-xs font-bold text-muted-foreground/50 shrink-0">
        #{set.index}
      </div>

      <div className="flex-1 flex items-center gap-3">
        {trackWeight && (
          <>
            <div className="relative flex-1 group">
              <Input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onBlur={(e) => handleBlur("weight", e.target.value)}
                className="h-12 text-lg font-bold text-center bg-zinc-100 dark:bg-zinc-950 border-transparent dark:border-zinc-800 dark:border focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary rounded-lg shadow-sm transition-all"
                placeholder="-"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-400 group-focus-within:text-primary pointer-events-none uppercase">
                KG
              </span>
            </div>
            <span className="text-muted-foreground/30 font-medium">✕</span>
          </>
        )}

        <div className="relative flex-1 group">
          <Input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onBlur={(e) => handleBlur("reps", e.target.value)}
            className="h-12 text-lg font-bold text-center bg-zinc-100 dark:bg-zinc-950 border-transparent dark:border-zinc-800 dark:border focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary rounded-lg shadow-sm transition-all"
            placeholder="-"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-400 group-focus-within:text-primary pointer-events-none uppercase">
            {trackWeight ? "REPS" : "REPS/SEC"}
          </span>
        </div>
      </div>

      <button
        onClick={toggleComplete}
        className={cn(
          "h-12 w-14 rounded-lg flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm",
          completed
            ? "bg-green-500 text-white shadow-green-500/20"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        )}
      >
        <Check
          className={cn(
            "h-7 w-7 stroke-[3]",
            completed ? "scale-100" : "scale-90"
          )}
        />
      </button>
    </div>
  );
}
