"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moveExercise } from "@/app/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReorderButtonsProps {
  id: number;
  isFirst: boolean;
  isLast: boolean;
}

export function ReorderButtons({ id, isFirst, isLast }: ReorderButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleMove = async (dir: "up" | "down") => {
    setLoading(true);
    try {
      await moveExercise(id, dir);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col -my-1 mr-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6 rounded-full hover:bg-muted",
          isFirst && "invisible"
        )}
        onClick={() => handleMove("up")}
        disabled={loading}
      >
        <ChevronUp className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6 rounded-full hover:bg-muted",
          isLast && "invisible"
        )}
        onClick={() => handleMove("down")}
        disabled={loading}
      >
        <ChevronDown className="h-3 w-3" />
      </Button>
    </div>
  );
}
