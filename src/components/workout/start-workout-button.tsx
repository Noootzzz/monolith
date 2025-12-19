"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startWorkout } from "@/app/actions";
import { toast } from "sonner";

export function StartWorkoutButton({ workoutId }: { workoutId: number }) {
  const handleStart = async () => {
    try {
      await startWorkout(workoutId);
      toast.success("Séance démarrée ! Bon courage 🔥");
    } catch {
      toast.error("Erreur au démarrage");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-50 safe-area-bottom">
      <div className="max-w-md mx-auto">
        <Button
          className="w-full h-14 text-lg font-bold uppercase tracking-wide shadow-xl shadow-primary/20 animate-in slide-in-from-bottom-4"
          size="lg"
          onClick={handleStart}
        >
          <Play className="h-6 w-6 mr-2 fill-current" />
          Commencer la séance
        </Button>
      </div>
    </div>
  );
}
