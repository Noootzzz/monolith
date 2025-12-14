import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <DashboardHeader
        title="Mon Compte"
        subtitle="Gérez vos préférences et informations personnelles."
      />

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{session.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md text-muted-foreground bg-muted">
              <Mail className="h-4 w-4" />
              {session.user.email}
            </div>
            <p className="text-[10px] text-muted-foreground">
              L'email ne peut pas être modifié pour le moment.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Version 0.1.0 • Monolith
      </div>
    </div>
  );
}
