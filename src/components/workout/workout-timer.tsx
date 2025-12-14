"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function WorkoutTimer({ startTime }: { startTime: Date }) {
  const [elapsed, setElapsed] = useState("00:00");

  useEffect(() => {
    const start = new Date(startTime).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hDisplay = hours > 0 ? `${hours}:` : "";
      const mDisplay = minutes < 10 ? `0${minutes}` : minutes;
      const sDisplay = seconds < 10 ? `0${seconds}` : seconds;

      setElapsed(`${hDisplay}${mDisplay}:${sDisplay}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="flex items-center gap-2 text-sm font-mono bg-muted/50 px-3 py-1 rounded-full text-muted-foreground">
      <Clock className="h-3 w-3" />
      {elapsed}
    </div>
  );
}
