"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { saveAsTemplate } from "@/app/actions";
import { toast } from "sonner";

export function SaveTemplateDialog({ workoutId }: { workoutId: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await saveAsTemplate(workoutId, name);
      toast.success("Modèle sauvegardé !");
      setOpen(false);
      setName("");
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Sauvegarder en modèle</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sauvegarder comme modèle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Nom du modèle (ex: Pectoraux / Biceps)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "Sauvegarde..." : "Confirmer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
