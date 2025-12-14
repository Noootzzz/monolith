import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell, BarChart3, History, Layers } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-foreground text-background rounded-lg flex items-center justify-center">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span>Monolith</span>
        </div>
        <nav className="flex items-center gap-2">
          <ModeToggle />
          <div className="w-px h-6 bg-border mx-2 hidden sm:block" />{" "}
          <Link href="/login">
            <Button variant="ghost">Se connecter</Button>
          </Link>
          <Link href="/register">
            <Button>S'inscrire</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 space-y-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/20 rounded-full blur-[100px] -z-10 opacity-50" />

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl">
              Votre progression, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/50">
                gravée dans la roche.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              L'application de musculation sans distraction. Planifiez vos
              séances, notez vos performances et visualisez vos progrès.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-lg gap-2">
                Commencer maintenant <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 px-6 border-t bg-muted/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layers className="h-10 w-10 text-primary" />}
              title="Planification Intuitive"
              description="Créez vos séances en un éclair. Glissez-déposez vos exercices pour réorganiser votre entraînement à la volée."
            />
            <FeatureCard
              icon={<Dumbbell className="h-10 w-10 text-primary" />}
              title="Suivi Précis"
              description="Notez chaque série, répétition et charge. Utilisez l'échelle de difficulté pour gérer votre intensité et éviter la stagnation."
            />
            <FeatureCard
              icon={<History className="h-10 w-10 text-primary" />}
              title="Historique & Progression"
              description="Retrouvez instantanément vos performances passées. Visualisez vos progrès au fil du temps."
            />
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Monolith</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-all">
      <div className="mb-4 p-3 bg-primary/10 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
