"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createWorkout } from "@/app/actions";
import { toast } from "sonner";

export function StartWorkoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const workoutId = await createWorkout();
      toast.success("Séance démarrée !");

      router.push(`/workout/${workoutId}`);
    } catch (error) {
      toast.error("Impossible de démarrer la séance.");
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full md:w-auto gap-2 text-lg py-6"
      onClick={handleStart}
      disabled={loading}
    >
      <Play className="fill-current h-5 w-5" />
      {loading ? "Création..." : "Démarrer une séance"}
    </Button>
  );
}
