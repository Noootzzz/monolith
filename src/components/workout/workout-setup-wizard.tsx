"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Trash2,
  Clock,
  Layers,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkoutExercisePicker } from "./workout-exercise-picker";
import {
  removeExerciseFromWorkout,
  startWorkoutWithConfig,
} from "@/app/actions";
import { toast } from "sonner";

export function WorkoutSetupWizard({
  workout,
  initialWorkoutExercises,
  allExercises,
}: any) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [exercisesConfig, setExercisesConfig] = useState(
    initialWorkoutExercises
  );

  useEffect(() => {
    setExercisesConfig((currentConfig: any[]) => {
      const currentMap = new Map(currentConfig.map((ex) => [ex.id, ex]));
      return initialWorkoutExercises.map((serverExo: any) => {
        if (currentMap.has(serverExo.id)) {
          return currentMap.get(serverExo.id);
        }
        return serverExo;
      });
    });
  }, [initialWorkoutExercises]);

  const updateExerciseConfig = (exoId: number, newData: any) => {
    setExercisesConfig((prev: any) =>
      prev.map((ex: any) => (ex.id === exoId ? { ...ex, ...newData } : ex))
    );
  };

  const handleStartWorkout = async () => {
    toast.loading("Lancement de la séance...");
    try {
      await startWorkoutWithConfig(workout.id, exercisesConfig);
      toast.dismiss();
      toast.success("C'est parti ! 🔥");
    } catch (e) {
      toast.error("Erreur au lancement");
    }
  };

  // --- ÉTAPE 1 : CHOIX DES EXOS ---
  if (step === 1) {
    return (
      // CONTENEUR PRINCIPAL
      // min-h-[calc...] permet de forcer le footer en bas même si peu de contenu
      // -m-4 md:-m-8 annule les paddings du dashboard pour aller de bord à bord
      <div className="flex flex-col min-h-[calc(100vh-4rem)] -m-4 md:-m-8 bg-background relative">
        {/* HEADER : Sticky (reste en haut au scroll) */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b w-full">
          <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2"
                onClick={() => router.push("/dashboard")}
              >
                Annuler
              </Button>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Étape 1/2
              </span>
              <div className="w-12" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold">
              Composez votre séance
            </h1>
            <p className="text-muted-foreground text-sm">
              Sélectionnez les mouvements du jour.
            </p>
          </div>
        </div>

        {/* CONTENU CENTRAL */}
        {/* pb-40 sur mobile pour ne pas être caché par le footer fixe */}
        <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 pb-40 md:pb-8 space-y-4">
          <WorkoutExercisePicker
            workoutId={workout.id}
            exercises={allExercises}
            existingExerciseIds={exercisesConfig.map(
              (we: any) => we.exerciseId
            )}
          />

          <div className="space-y-2 mt-6">
            <h3 className="font-semibold text-sm text-muted-foreground px-1">
              Sélection actuelle ({exercisesConfig.length})
            </h3>
            {exercisesConfig.map((we: any) => (
              <div
                key={we.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg animate-in slide-in-from-left-2 shadow-sm"
              >
                <span className="font-medium text-sm md:text-base">
                  {we.exercise.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => removeExerciseFromWorkout(we.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        {/* MOBILE: Fixed bottom (flotte au dessus du menu nav) */}
        <div className="md:hidden fixed left-0 right-0 bottom-[65px] z-40 bg-background/95 backdrop-blur border-t p-4">
          <div className="max-w-3xl mx-auto">
            <Button
              className="w-full h-12 text-lg font-bold shadow-lg"
              disabled={exercisesConfig.length === 0}
              onClick={() => setStep(2)}
            >
              Continuer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* DESKTOP: Sticky bottom (reste en bas de la vue, respecte la sidebar) */}
        <div className="hidden md:block sticky bottom-0 z-30 bg-background/95 backdrop-blur border-t w-full mt-auto">
          <div className="max-w-3xl mx-auto p-8">
            <Button
              className="w-full h-12 text-lg font-bold"
              disabled={exercisesConfig.length === 0}
              onClick={() => setStep(2)}
            >
              Continuer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- ÉTAPE 2 : CONFIGURATION ---
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] -m-4 md:-m-8 bg-background relative">
      {/* HEADER Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b w-full">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Retour
            </Button>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Étape 2/2
            </span>
            <div className="w-16" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold">
            Objectifs & Repos
          </h1>
          <p className="text-muted-foreground text-sm">
            Préparez le terrain avant de foncer.
          </p>
        </div>
      </div>

      {/* CONTENU CENTRAL */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 pb-40 md:pb-8 space-y-4">
        {exercisesConfig.map((we: any) => (
          <ConfigCard
            key={we.id}
            item={we}
            onUpdate={(newData) => updateExerciseConfig(we.id, newData)}
          />
        ))}
        {exercisesConfig.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Aucun exercice sélectionné.
          </div>
        )}
      </div>

      {/* FOOTER MOBILE (Fixed) */}
      <div className="md:hidden fixed left-0 right-0 bottom-[65px] z-40 bg-background/95 backdrop-blur border-t p-4">
        <div className="max-w-3xl mx-auto">
          <Button
            className="w-full h-12 text-lg font-black uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.01] transition-transform"
            onClick={handleStartWorkout}
          >
            <Play className="mr-2 h-5 w-5 fill-current" /> COMMENCER
          </Button>
        </div>
      </div>

      {/* FOOTER DESKTOP (Sticky) */}
      <div className="hidden md:block sticky bottom-0 z-30 bg-background/95 backdrop-blur border-t w-full mt-auto">
        <div className="max-w-3xl mx-auto p-8">
          <Button
            className="w-full h-12 text-lg font-black uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.01] transition-transform"
            onClick={handleStartWorkout}
          >
            <Play className="mr-2 h-5 w-5 fill-current" /> COMMENCER
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfigCard({
  item,
  onUpdate,
}: {
  item: any;
  onUpdate: (data: any) => void;
}) {
  const handleRestChange = (val: number) => {
    onUpdate({ restTime: Math.max(0, val) });
  };

  const handleAddSet = () => {
    const newSet = { weight: "0", reps: 0 };
    onUpdate({ sets: [...item.sets, newSet] });
  };

  const handleRemoveSet = () => {
    if (item.sets.length === 0) return;
    const newSets = item.sets.slice(0, -1);
    onUpdate({ sets: newSets });
  };

  const handleSetUpdate = (
    index: number,
    field: "weight" | "reps",
    value: string
  ) => {
    const newSets = [...item.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    onUpdate({ sets: newSets });
  };

  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base md:text-lg">{item.exercise.name}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-muted/30 p-2 md:p-3 rounded-lg border flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
            <Layers className="h-3.5 w-3.5" />
            <span className="text-[10px] md:text-xs font-bold uppercase">
              Séries
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-background"
              onClick={handleRemoveSet}
              disabled={item.sets.length === 0}
            >
              <Minus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>

            <div className="flex flex-col items-center min-w-[20px]">
              <span className="text-xl md:text-2xl font-black tabular-nums leading-none">
                {item.sets.length}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-background"
              onClick={handleAddSet}
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 p-2 md:p-3 rounded-lg border flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-primary mb-2">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[10px] md:text-xs font-bold uppercase">
              Repos
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full hover:bg-background"
              onClick={() => handleRestChange(item.restTime - 15)}
            >
              <Minus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <span className="text-lg md:text-xl font-bold tabular-nums min-w-[3ch]">
              {Math.floor(item.restTime / 60)}:
              {String(item.restTime % 60).padStart(2, "0")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full hover:bg-background"
              onClick={() => handleRestChange(item.restTime + 15)}
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {item.sets.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-dashed">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase px-2">
            <span className="flex-1 text-center">Objectif Poids</span>
            <span className="flex-1 text-center">Objectif Reps</span>
          </div>
          {item.sets.map((set: any, i: number) => (
            <div
              key={i}
              className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-200"
            >
              <span className="w-5 text-[10px] md:text-xs text-muted-foreground font-bold shrink-0 text-center">
                #{i + 1}
              </span>
              <div className="relative flex-1">
                <Input
                  placeholder="kg"
                  className="h-9 text-center pr-6 bg-background"
                  value={set.weight}
                  onChange={(e) => handleSetUpdate(i, "weight", e.target.value)}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                  kg
                </span>
              </div>
              <div className="relative flex-1">
                <Input
                  placeholder="reps"
                  className="h-9 text-center pr-8 bg-background"
                  value={set.reps}
                  onChange={(e) => handleSetUpdate(i, "reps", e.target.value)}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                  reps
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
