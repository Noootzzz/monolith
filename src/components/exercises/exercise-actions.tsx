"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/ui/form-input";
import { MuscleSelector } from "@/components/ui/muscle-selector";
import { deleteExercise, updateExercise } from "@/app/actions";
import { toast } from "sonner";

interface ExerciseActionsProps {
  exercise: {
    id: number;
    name: string;
    targetMuscle: string;
  };
}

export function ExerciseActions({ exercise }: ExerciseActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muscle, setMuscle] = useState(exercise.targetMuscle);

  const handleDelete = async () => {
    if (confirm("Voulez-vous vraiment supprimer cet exercice ?")) {
      try {
        await deleteExercise(exercise.id);
        toast.success("Exercice supprimé");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    formData.append("targetMuscle", muscle);
    try {
      await updateExercise(exercise.id, formData);
      toast.success("Exercice modifié");
      setIsEditOpen(false);
    } catch {
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setIsEditOpen(true)}
          title="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleDelete}
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'exercice</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-4">
            <FormInput
              id="name"
              name="name"
              label="Nom"
              defaultValue={exercise.name}
              required
            />

            <div className="grid gap-2">
              <label className="text-sm font-medium">Muscle cible</label>
              <MuscleSelector value={muscle} onValueChange={setMuscle} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Sauvegarde..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
