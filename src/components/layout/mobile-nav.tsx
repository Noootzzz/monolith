"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  Library,
  LayoutDashboard,
  History,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const leftItems = [
    { name: "Accueil", href: "/dashboard", icon: LayoutDashboard },
    { name: "Exercices", href: "/exercises", icon: Library },
  ];

  const rightItems = [
    { name: "Historique", href: "/history", icon: History },
    { name: "Compte", href: "/settings", icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        href={item.href}
        className={cn(
          "flex flex-col items-center justify-center w-1/2 h-full space-y-1 transition-all duration-200 active:scale-90",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
        <span
          className={cn(
            "text-[10px] font-medium truncate",
            isActive && "font-bold"
          )}
        >
          {item.name}
        </span>
      </Link>
    );
  };

  const isWorkoutActive = pathname.startsWith("/workout");

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t z-50 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center h-full max-w-md mx-auto relative px-2">
        {/* Groupe Gauche */}
        <div className="flex items-center justify-around flex-1 h-full">
          {leftItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>

        <div className="shrink-0 w-20 h-full flex items-center justify-center px-1">
          <Link
            href="/workout"
            className="group w-full h-full flex items-center justify-center"
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-90",
                isWorkoutActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Dumbbell
                className={cn(
                  "h-8 w-8 mb-0.5",
                  isWorkoutActive && "drop-shadow-sm"
                )}
                strokeWidth={2.5}
              />

              <span
                className={cn(
                  "text-[10px] font-bold tracking-wide uppercase",
                  isWorkoutActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                SÉANCE
              </span>
            </div>
          </Link>
        </div>

        {/* Groupe Droite */}
        <div className="flex items-center justify-around flex-1 h-full">
          {rightItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
