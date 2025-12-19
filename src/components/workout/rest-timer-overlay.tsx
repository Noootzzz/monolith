"use client";

import { useWorkoutSession } from "./workout-session-context";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export function RestTimerOverlay() {
  const { isResting, restTimeLeft, skipRest, addRestTime } =
    useWorkoutSession();

  // Si on ne se repose pas, on n'affiche rien (c'est caché)
  if (!isResting) return null;

  // Formatage mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Zone cliquable pour fermer si on veut (optionnel) */}
      <div className="absolute inset-0" onClick={skipRest} />

      {/* Carte du Timer */}
      <div
        className="relative w-full max-w-md bg-zinc-900 border-t sm:border border-zinc-800 p-6 pb-safe sm:rounded-xl shadow-2xl flex flex-col items-center gap-6 animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()} // Empêche de fermer si on clique sur la carte
      >
        {/* En-tête */}
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Repos
          </span>
          <button
            onClick={skipRest}
            className="p-2 -mr-2 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Le GROS Compteur */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "text-7xl font-black font-mono tracking-tighter tabular-nums",
              restTimeLeft <= 5 ? "text-red-500 animate-pulse" : "text-white"
            )}
          >
            {formatTime(restTimeLeft)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Récupérez votre souffle
          </p>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            onClick={() => addRestTime(-10)}
          >
            <Minus className="h-6 w-6" />
          </Button>

          <Button
            className="flex-1 h-14 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={skipRest}
          >
            <SkipForward className="h-6 w-6 mr-2 fill-current" />
            Reprendre
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            onClick={() => addRestTime(30)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Barre de progression visuelle */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(100, (restTimeLeft / 90) * 100)}%` }} // Base 90s arbitraire pour la barre
          />
        </div>
      </div>
    </div>
  );
}
