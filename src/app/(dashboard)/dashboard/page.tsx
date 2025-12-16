import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import {
  Plus,
  ArrowRight,
  Timer,
  Activity,
  Dumbbell,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function formatDate(date: Date | null) {
  if (!date) return "Date inconnue";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(date);
  } catch (e) {
    return "-";
  }
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const recentWorkouts = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, session.user.id),
        eq(workouts.status, "COMPLETED")
      )
    )
    .orderBy(desc(workouts.endTime))
    .limit(5);

  const stats = await db
    .select({
      count: sql<number>`count(*)`,
      totalDuration: sql<number>`sum(${workouts.duration})`,
    })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, session.user.id),
        eq(workouts.status, "COMPLETED")
      )
    );

  const totalSessions = Number(stats[0]?.count || 0);
  const totalSeconds = Number(stats[0]?.totalDuration || 0);
  const totalHours = Math.round(totalSeconds / 3600);

  const volumeStats = await db
    .select({ count: sql<number>`count(*)` })
    .from(sets)
    .innerJoin(
      workoutExercises,
      eq(sets.workoutExerciseId, workoutExercises.id)
    )
    .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
    .where(
      and(eq(workouts.userId, session.user.id), eq(sets.isCompleted, true))
    );

  const totalSets = Number(volumeStats[0]?.count || 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const monthlyActivity = await db
    .select({
      date: workouts.endTime,
      duration: workouts.duration,
    })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, session.user.id),
        gte(workouts.endTime, thirtyDaysAgo),
        eq(workouts.status, "COMPLETED")
      )
    )
    .orderBy(desc(workouts.endTime));

  const chartData = monthlyActivity
    .map((w) => ({
      date: w.date ? formatDate(w.date) : "",
      total: w.duration ? Math.round(w.duration / 60) : 0,
    }))
    .reverse();

  const musclesWorked = await db
    .select({ muscle: exercises.targetMuscle, count: sql<number>`count(*)` })
    .from(workoutExercises)
    .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
    .where(eq(workouts.userId, session.user.id))
    .groupBy(exercises.targetMuscle)
    .orderBy(desc(sql`count(*)`))
    .limit(3);

  const maxMuscleCount =
    musclesWorked.length > 0 ? Number(musclesWorked[0].count) : 1;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground">
            Aperçu de vos performances et de votre régularité.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/workout/new">
            <Button
              size="lg"
              className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Séance
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Séances</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Séances terminées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Total</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}h</div>
            <p className="text-xs text-muted-foreground">À la salle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume (Sets)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSets}</div>
            <p className="text-xs text-muted-foreground">Séries validées</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Muscle Favori</CardTitle>
            <Flame className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {musclesWorked[0]?.muscle || "-"}
            </div>
            <p className="text-xs text-muted-foreground">Top fréquence</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Durée des séances</CardTitle>
            <CardDescription>
              Votre temps d'entraînement sur les 30 derniers jours (minutes).
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {chartData.length > 0 && chartData.some((d) => d.total > 0) ? (
              <OverviewChart data={chartData} />
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-md bg-muted/10">
                <Activity className="h-8 w-8 mb-2 opacity-20" />
                <p>Aucune donnée significative.</p>
                <p className="text-xs mt-1">
                  Complétez une séance avec du temps pour voir le graphique.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Historique Récent</CardTitle>
            <CardDescription>Vos dernières sessions terminées.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentWorkouts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 flex flex-col items-center">
                  <p>Aucune séance terminée récemment.</p>
                  <Link href="/workout/new" className="mt-4">
                    <Button variant="outline" size="sm">
                      Commencer
                    </Button>
                  </Link>
                </div>
              ) : (
                recentWorkouts.map((workout) => (
                  <Link
                    key={workout.id}
                    href={`/workout/${workout.id}`}
                    className="flex items-center group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors -mx-2"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {(workout.name || "S").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {workout.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(workout.endTime)}</span>
                      </div>
                    </div>
                    <div className="ml-auto font-medium">
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {Math.round((workout.duration || 0) / 60)} min
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Muscles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {musclesWorked.map((m) => (
              <div key={m.muscle} className="flex items-center">
                <div className="w-full flex-1 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{m.muscle}</span>
                    <span className="text-muted-foreground">
                      {Number(m.count)} exos
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(Number(m.count) / maxMuscleCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {musclesWorked.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Aucune donnée musculaire.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
