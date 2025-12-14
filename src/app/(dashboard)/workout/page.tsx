import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { workoutTemplates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { StartEmptyButton } from "@/components/workout/start-empty-button";
import { TemplateCard } from "@/components/workout/template-card";

export default async function WorkoutHubPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const templates = await db
    .select()
    .from(workoutTemplates)
    .where(eq(workoutTemplates.userId, session.user.id))
    .orderBy(desc(workoutTemplates.createdAt));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <DashboardHeader
        title="Salle d'entraînement"
        subtitle="Prêt à dépasser vos limites ?"
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Nouvelle Session
        </h3>
        <StartEmptyButton />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Mes Programmes
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {templates.length}
          </span>
        </h3>

        {templates.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
            Vous n'avez pas encore de programme enregistré.
            <br />
            Créez une séance et cliquez sur "Sauvegarder en modèle".
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
