"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/ui/form-input";
import { createExercise } from "@/app/actions";
import { toast } from "sonner";
import { MuscleSelector } from "@/components/ui/muscle-selector";

export function AddExerciseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muscle, setMuscle] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    if (!muscle) {
      toast.error("Veuillez choisir un muscle.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("targetMuscle", muscle);

    try {
      await createExercise(formData);
      toast.success("Exercice ajouté !");
      setOpen(false);
      setMuscle("");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création ou doublon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button suppressHydrationWarning>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un exercice</DialogTitle>
          <DialogDescription>
            Créez un nouvel exercice pour vos séances.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <FormInput
            id="name"
            name="name"
            label="Nom de l'exercice"
            placeholder="Ex: Élévations Y"
            required
          />

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              Muscle cible
            </label>
            <MuscleSelector value={muscle} onValueChange={setMuscle} />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
