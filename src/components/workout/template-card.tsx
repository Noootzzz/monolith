"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { startWorkoutFromTemplate, deleteTemplate } from "@/app/actions";
import { toast } from "sonner";

export function TemplateCard({
  template,
}: {
  template: { id: number; name: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const workoutId = await startWorkoutFromTemplate(template.id);
      router.push(`/workout/${workoutId}`);
    } catch (error) {
      toast.error("Erreur lancement template.");
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce modèle ?")) return;
    try {
      await deleteTemplate(template.id);
      toast.success("Modèle supprimé");
    } catch {
      toast.error("Erreur suppression");
    }
  };

  return (
    <Card
      className="hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
      onClick={handleStart}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold truncate pr-8">
          {template.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Play className="h-4 w-4" />
          {loading ? "Création..." : "Lancer"}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
