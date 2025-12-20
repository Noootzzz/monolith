"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";

export const NAVIGATION_ITEMS = [
  { name: "Accueil", href: "/dashboard", icon: LayoutDashboard },
  { name: "Exercices", href: "/exercises", icon: Dumbbell },
  { name: "Historique", href: "/history", icon: History },
  { name: "Compte", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onSignOut: () => void;
}

export function Sidebar({ className, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = () => {
    toast.info("Déconnexion en cours...", { duration: 2000 });
    onSignOut();
  };

  return (
    <aside
      className={cn(
        "hidden md:flex w-64 flex-col border-r bg-white dark:bg-zinc-900 px-4 py-6 justify-between fixed h-full z-50",
        className
      )}
    >
      <div>
        <div className="mb-6 flex items-center gap-2 px-2 text-xl font-bold tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center dark:bg-white dark:text-black">
            M
          </div>
          Monolith
        </div>

        <div className="px-2 mb-6">
          <Link href="/workout" prefetch={true}>
            <Button className="w-full justify-start gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
              <Plus className="h-5 w-5" />
              Nouvelle Séance
            </Button>
          </Link>
        </div>

        <nav className="flex flex-col gap-2">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true} // 👈 AJOUT CRUCIAL ICI
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Thème
          </span>
          <ModeToggle />
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
