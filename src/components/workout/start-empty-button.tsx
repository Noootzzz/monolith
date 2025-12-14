"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react"; // Import Loader2
import { Button } from "@/components/ui/button";
import { createEmptyWorkout } from "@/app/actions";
import { toast } from "sonner";

export function StartEmptyButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const workoutId = await createEmptyWorkout();
      // On garde loading true pendant la redirection pour éviter le double-clic
      router.push(`/workout/${workoutId}`);
    } catch (error) {
      toast.error("Impossible de créer la séance.");
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className="w-full h-auto py-8 flex flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all"
      onClick={handleStart}
      disabled={loading}
    >
      <div className="bg-primary/10 p-3 rounded-full">
        {loading ? (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        ) : (
          <Plus className="h-6 w-6 text-primary" />
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="font-semibold text-lg">
          {loading ? "Création..." : "Séance Vide"}
        </span>
        <span className="text-sm text-muted-foreground font-normal">
          Partir de zéro
        </span>
      </div>
    </Button>
  );
}
