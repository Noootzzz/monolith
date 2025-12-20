"use client";

import { useWorkoutSession } from "./workout-session-context";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RestTimerOverlay() {
  const { isResting, restTimeLeft, skipRest, addRestTime } =
    useWorkoutSession();

  if (!isResting) return null;

  const safeTime =
    typeof restTimeLeft === "number" && !isNaN(restTimeLeft) ? restTimeLeft : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end sm:justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Zone de clic pour fermer */}
      <div className="absolute inset-0" onClick={skipRest} />

      {/* Carte style "App" */}
      <div
        className="relative w-full sm:max-w-md bg-card text-card-foreground border-t sm:border shadow-2xl p-6 pb-10 sm:pb-6 sm:rounded-xl flex flex-col items-center gap-6 animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Temps de repos
            </span>
            <span className="text-xs text-muted-foreground">
              Récupération active
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={skipRest}
            className="h-8 w-8 rounded-full -mr-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chrono */}
        <div className="py-2">
          <div className="text-8xl font-bold tracking-tighter tabular-nums text-foreground select-none">
            {formatTime(safeTime)}
          </div>
        </div>

        {/* Contrôles avec valeurs explicites */}
        <div className="grid grid-cols-4 gap-3 w-full h-14">
          {/* Bouton -10s */}
          <Button
            variant="outline"
            className="h-full rounded-lg border-input bg-background hover:bg-accent hover:text-accent-foreground col-span-1 text-base font-bold tabular-nums"
            onClick={() => addRestTime(-10)}
          >
            -10
          </Button>

          {/* Bouton Principal */}
          <Button
            className="h-full rounded-lg text-lg font-bold col-span-2 shadow-sm"
            onClick={skipRest}
          >
            Reprendre
            <ChevronRight className="h-5 w-5 ml-1 opacity-70" />
          </Button>

          {/* Bouton +30s */}
          <Button
            variant="outline"
            className="h-full rounded-lg border-input bg-background hover:bg-accent hover:text-accent-foreground col-span-1 text-base font-bold tabular-nums"
            onClick={() => addRestTime(30)}
          >
            +30
          </Button>
        </div>

        {/* Barre de progression discrète */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(100, (safeTime / 90) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
