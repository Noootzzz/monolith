"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { finishWorkout } from "@/app/actions";
import { toast } from "sonner";

export function FinishWorkoutButton({ workoutId }: { workoutId: number }) {
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!confirm("Avez-vous terminé votre séance ?")) return;

    setLoading(true);
    try {
      await finishWorkout(workoutId);
      toast.success("Séance terminée ! Bravo 💪");
    } catch {
      toast.error("Erreur lors de la finalisation");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFinish}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white gap-2 font-semibold"
    >
      <CheckCircle2 className="h-4 w-4" />
      {loading ? "Fin..." : "Terminer"}
    </Button>
  );
}
