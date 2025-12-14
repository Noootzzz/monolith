"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MUSCLE_CATEGORIES } from "@/lib/constants";

interface MuscleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function MuscleSelector({ value, onValueChange }: MuscleSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-muted-foreground hover:text-foreground"
        >
          {value || "Sélectionner un muscle..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-62.5 p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un muscle..." />
          <CommandList>
            <CommandEmpty>Aucun muscle trouvé.</CommandEmpty>
            <CommandGroup>
              {MUSCLE_CATEGORIES.map((muscle) => (
                <CommandItem
                  key={muscle}
                  value={muscle}
                  onSelect={(currentValue) => {
                    onValueChange(muscle);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === muscle ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {muscle}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
