"use client";

import { useWorkoutSession } from "./workout-session-context";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export function RestTimerOverlay() {
  const { isResting, restDuration, cancelRest, addTime } = useWorkoutSession();

  if (!isResting) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-[5.5rem] md:bottom-6 left-0 right-0 z-50 px-4 animate-in slide-in-from-bottom-10 duration-300 pointer-events-none">
      <div className="mx-auto max-w-md bg-zinc-900 text-white rounded-2xl shadow-xl p-3 pl-5 flex items-center justify-between pointer-events-auto ring-1 ring-white/10">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            Repos
          </span>
          <span className="text-3xl font-bold font-mono tabular-nums leading-none tracking-tight">
            {formatTime(restDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addTime(30)}
            className="h-10 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            + 30s
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addTime(-30)}
            className="h-10 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            - 30s
          </Button>

          <Button
            size="sm"
            onClick={cancelRest}
            className="h-10 px-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-transform active:scale-95"
          >
            Reprendre
          </Button>
        </div>
      </div>
    </div>
  );
}
