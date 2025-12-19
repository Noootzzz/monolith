"use client";

import { useState } from "react";
import { Search, User, Filter, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface ExerciseFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedMuscle: string | null;
  setSelectedMuscle: (value: string | null) => void;
  muscles: string[];
  hideSearch?: boolean;
}

export function ExerciseFilters({
  searchQuery,
  setSearchQuery,
  selectedMuscle,
  setSelectedMuscle,
  muscles,
  hideSearch = false,
}: ExerciseFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2 w-full">

      {!hideSearch && (
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between px-3",
              hideSearch ? "w-full md:w-auto" : "w-auto min-w-[140px]",
              selectedMuscle
                ? "bg-primary/10 text-primary border-primary/20"
                : ""
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <Filter className="h-4 w-4 shrink-0 opacity-50" />
              <span className="truncate">
                {selectedMuscle === "Personnel"
                  ? "Personnel"
                  : selectedMuscle || "Filtre"}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Filtrer..." />
            <CommandList>
              <CommandEmpty>Aucun résultat.</CommandEmpty>

              <CommandGroup heading="Général">
                <CommandItem
                  value="tout"
                  onSelect={() => {
                    setSelectedMuscle(null);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMuscle === null ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Tout voir
                </CommandItem>
                <CommandItem
                  value="personnel"
                  onSelect={() => {
                    setSelectedMuscle("Personnel");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMuscle === "Personnel"
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <User className="mr-2 h-3 w-3" />
                  Personnel
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Catégories">
                {muscles.map((muscle) => (
                  <CommandItem
                    key={muscle}
                    value={muscle}
                    onSelect={() => {
                      setSelectedMuscle(muscle);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedMuscle === muscle ? "opacity-100" : "opacity-0"
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
    </div>
  );
}
