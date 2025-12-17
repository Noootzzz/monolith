import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Calendar, Clock, ChevronRight, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- FONCTIONS UTILITAIRES ---

// Formatter la date (ex: "Lundi 12")
function formatDay(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
  }).format(date);
}

// Formatter le mois (ex: "Décembre 2024")
function formatMonth(date: Date | null) {
  if (!date) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// Formatter la durée (ex: "1h 15m")
function formatDuration(seconds: number | null) {
  if (!seconds) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default async function HistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // 1. Récupérer toutes les séances terminées
  const history = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, session.user.id),
        eq(workouts.status, "COMPLETED")
      )
    )
    .orderBy(desc(workouts.endTime));

  // 2. Grouper par mois
  const groupedHistory: Record<string, typeof history> = {};

  history.forEach((workout) => {
    const monthKey = formatMonth(workout.endTime);
    if (!groupedHistory[monthKey]) {
      groupedHistory[monthKey] = [];
    }
    groupedHistory[monthKey].push(workout);
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-4xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* EN-TÊTE */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
        <p className="text-muted-foreground">
          Retrouvez toutes vos séances passées et analysez votre progression.
        </p>
      </div>

      {/* LISTE DES SÉANCES */}
      <div className="space-y-8">
        {Object.keys(groupedHistory).length === 0 ? (
          // État vide
          <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">Aucune séance terminée</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
              Lancez votre première séance depuis l'accueil pour commencer à
              remplir votre historique.
            </p>
          </Card>
        ) : (
          // Affichage groupé par mois
          Object.entries(groupedHistory).map(([month, workouts]) => (
            <div key={month} className="space-y-4">
              <h2 className="text-lg font-semibold capitalize flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                {month}
              </h2>

              <div className="grid gap-3">
                {workouts.map((workout) => (
                  <Link href={`/workout/${workout.id}`} key={workout.id}>
                    <Card className="p-4 hover:bg-muted/40 transition-colors group border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        {/* Titre de la séance */}
                        <span className="font-bold text-base md:text-lg group-hover:text-primary transition-colors">
                          {workout.name}
                        </span>

                        {/* Infos (Date & Durée) */}
                        <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                          <span className="capitalize">
                            {formatDay(workout.endTime)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(workout.duration)}
                          </div>
                        </div>
                      </div>

                      {/* Chevron à droite */}
                      <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
