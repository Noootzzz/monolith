"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeExerciseFromWorkout } from "@/app/actions";
import { toast } from "sonner";
import { useState } from "react";

export function RemoveExerciseButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeExerciseFromWorkout(id);
      toast.success("Exercice retiré");
    } catch {
      toast.error("Impossible de retirer l'exercice");
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
      onClick={handleRemove}
      disabled={loading}
      title="Retirer de la séance"
    >
      <X className="h-3 w-3" />
    </Button>
  );
}
