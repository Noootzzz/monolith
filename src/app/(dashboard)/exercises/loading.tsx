import { Skeleton } from "@/components/ui/skeleton";

export default function ExercisesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Simulation du DashboardHeader (Titre + Bouton) */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Titre */}
          <Skeleton className="h-4 w-64" /> {/* Sous-titre */}
        </div>
        <Skeleton className="h-10 w-full md:w-32" /> {/* Bouton Nouveau */}
      </div>

      {/* 2. Simulation des Filtres (Barre de recherche + Bouton Favoris) */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          {/* Barre de recherche + Select */}
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px] hidden md:block" />
        </div>
        <Skeleton className="h-10 w-full md:w-32" /> {/* Bouton Favoris */}
      </div>

      {/* 3. Simulation de la Grille d'exercices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Icône */}
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  {/* Nom de l'exo */}
                  <Skeleton className="h-5 w-32" />
                  {/* Muscle */}
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              {/* Bouton action */}
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            {/* Lignes de description */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
