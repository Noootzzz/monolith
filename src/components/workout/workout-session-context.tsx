"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface WorkoutSessionContextType {
  // Timer Global de la séance
  elapsedTime: number;
  isSessionActive: boolean;

  // Timer de Repos (Rest Timer)
  isResting: boolean;
  restTimeLeft: number;
  startRest: (duration: number) => void;
  skipRest: () => void;
  addRestTime: (seconds: number) => void;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextType | null>(
  null
);

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  // --- ÉTAT SÉANCE ---
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true); // Tu pourras le lier au status DB plus tard

  // --- ÉTAT REPOS ---
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);

  // Effet pour le Timer GLOBAL (durée totale)
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Effet pour le Timer DE REPOS (Décompte)
  useEffect(() => {
    if (!isResting || restTimeLeft <= 0) {
      if (isResting && restTimeLeft <= 0) {
        // Fin du repos automatique
        setIsResting(false);
        toast.info("Repos terminé ! Au boulot 💪", { duration: 3000 });
        // Ici on pourrait jouer un son
      }
      return;
    }

    const interval = setInterval(() => {
      setRestTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  // --- ACTIONS ---

  const startRest = (duration: number) => {
    setRestTimeLeft(duration);
    setIsResting(true);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const addRestTime = (seconds: number) => {
    setRestTimeLeft((prev) => prev + seconds);
  };

  return (
    <WorkoutSessionContext.Provider
      value={{
        elapsedTime,
        isSessionActive,
        isResting,
        restTimeLeft,
        startRest,
        skipRest,
        addRestTime,
      }}
    >
      {children}
    </WorkoutSessionContext.Provider>
  );
}

export function useWorkoutSession() {
  const context = useContext(WorkoutSessionContext);
  if (!context)
    throw new Error(
      "useWorkoutSession must be used within a WorkoutSessionProvider"
    );
  return context;
}
