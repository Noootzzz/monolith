"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MoreVertical, Trash2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { finishWorkout, cancelWorkout } from "@/app/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkoutHeaderProps {
  workoutId: number;
  workoutName: string;
  startTime: Date | null;
  status: string; // "PLANNING" | "IN_PROGRESS" | "COMPLETED"
  duration: number | null;
}

export function WorkoutHeader({
  workoutId,
  workoutName,
  startTime,
  status,
  duration,
}: WorkoutHeaderProps) {
  const [elapsed, setElapsed] = useState(
    status === "COMPLETED" && duration ? duration : 0
  );
  const router = useRouter();

  useEffect(() => {
    // CAS 1 : Séance finie
    if (status === "COMPLETED") {
      if (duration) setElapsed(duration);
      return;
    }

    // CAS 2 : Planification (Pas de timer)
    if (status === "PLANNING" || !startTime) {
      setElapsed(0);
      return;
    }

    // CAS 3 : En cours (Timer actif)
    const start = new Date(startTime).getTime();
    setElapsed(Math.floor((Date.now() - start) / 1000));

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, status, duration]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleFinish = async () => {
    toast.promise(finishWorkout(workoutId), {
      loading: "Finalisation...",
      success: () => {
        router.push("/dashboard");
        return "Séance terminée ! Bravo 💪";
      },
      error: "Erreur",
    });
  };

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b h-16 flex items-center justify-between shadow-sm w-full px-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm leading-tight line-clamp-1 max-w-[150px] sm:max-w-xs">
            {workoutName}
          </h1>

          {/* AFFICHAGE DU STATUT */}
          {status === "PLANNING" ? (
            <Badge
              variant="outline"
              className="font-mono text-[10px] font-normal h-4 px-1.5 w-fit mt-0.5 text-muted-foreground border-dashed"
            >
              <CalendarClock className="h-3 w-3 mr-1" />
              Préparation
            </Badge>
          ) : (
            <Badge
              variant={status === "COMPLETED" ? "outline" : "secondary"}
              className="font-mono text-[10px] font-normal h-4 px-1.5 w-fit mt-0.5"
            >
              {formatTime(elapsed)}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Le bouton Terminer n'apparait QUE si c'est En Cours */}
        {status === "IN_PROGRESS" && (
          <Button
            size="sm"
            onClick={handleFinish}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm h-8"
          >
            Terminer
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <form action={() => cancelWorkout(workoutId)}>
              <button className="w-full">
                <DropdownMenuItem className="text-red-500 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" /> Annuler la séance
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
