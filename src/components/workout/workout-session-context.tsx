"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { RestTimerOverlay } from "./rest-timer-overlay";

interface WorkoutSessionContextType {
  isResting: boolean;
  restDuration: number;
  targetRestTime: number;
  startRest: (duration?: number) => void;
  cancelRest: () => void;
  addTime: (seconds: number) => void;
}

const WorkoutSessionContext = createContext<
  WorkoutSessionContextType | undefined
>(undefined);

const STORAGE_KEY = "monolith_rest_end_time";

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const [isResting, setIsResting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [targetRestTime, setTargetRestTime] = useState(90);

  useEffect(() => {
    const savedEndTime = localStorage.getItem(STORAGE_KEY);
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const now = Date.now();
      const diff = Math.ceil((endTime - now) / 1000);

      if (diff > 0) {
        setTimeRemaining(diff);
        setIsResting(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setIsResting(false);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResting) {
      interval = setInterval(() => {
        const savedEndTime = localStorage.getItem(STORAGE_KEY);

        if (savedEndTime) {
          const endTime = parseInt(savedEndTime, 10);
          const now = Date.now();
          const diff = Math.ceil((endTime - now) / 1000);

          if (diff <= 0) {
            setIsResting(false);
            setTimeRemaining(0);
            localStorage.removeItem(STORAGE_KEY);
          } else {
            setTimeRemaining(diff);
          }
        } else {
          setIsResting(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting]);

  const startRest = (duration: number = 90) => {
    const now = Date.now();
    const endTime = now + duration * 1000;

    localStorage.setItem(STORAGE_KEY, endTime.toString());

    setTargetRestTime(duration);
    setTimeRemaining(duration);
    setIsResting(true);
  };

  const cancelRest = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsResting(false);
    setTimeRemaining(0);
  };

  const addTime = (seconds: number) => {
    const savedEndTime = localStorage.getItem(STORAGE_KEY);
    if (savedEndTime) {
      const currentEndTime = parseInt(savedEndTime, 10);
      const newEndTime = currentEndTime + seconds * 1000;

      localStorage.setItem(STORAGE_KEY, newEndTime.toString());

      setTimeRemaining((prev) => prev + seconds);
    }
  };

  return (
    <WorkoutSessionContext.Provider
      value={{
        isResting,
        restDuration: timeRemaining,
        targetRestTime,
        startRest,
        cancelRest,
        addTime,
      }}
    >
      {children}
      <RestTimerOverlay />
    </WorkoutSessionContext.Provider>
  );
}

export const useWorkoutSession = () => {
  const context = useContext(WorkoutSessionContext);
  if (!context)
    throw new Error(
      "useWorkoutSession must be used within a WorkoutSessionProvider"
    );
  return context;
};
