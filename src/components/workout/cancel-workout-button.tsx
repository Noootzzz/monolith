"use client";

import { Button } from "@/components/ui/button";
import { cancelWorkout } from "@/app/actions";
import { toast } from "sonner";
import { useState } from "react";

export function CancelWorkoutButton({ workoutId }: { workoutId: number }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (
      !confirm("Voulez-vous vraiment annuler cette séance ? Tout sera perdu.")
    )
      return;

    setLoading(true);
    try {
      await cancelWorkout(workoutId);
      toast.info("Séance annulée");
    } catch {
      toast.error("Erreur lors de l'annulation");
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={handleCancel}
      disabled={loading}
    >
      {loading ? "..." : "Annuler"}
    </Button>
  );
}
