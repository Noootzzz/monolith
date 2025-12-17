"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, LayoutDashboard, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const leftItems = [
    { name: "Accueil", href: "/dashboard", icon: LayoutDashboard },
    { name: "Exercices", href: "/exercises", icon: Dumbbell },
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
          "flex flex-col items-center justify-center w-1/2 h-full space-y-1 transition-all duration-200 active:scale-75",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
        <span className="text-[10px] font-medium truncate">{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t z-50 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center h-full max-w-md mx-auto relative px-2">
        {/* Groupe Gauche */}
        <div className="flex items-center justify-around flex-1 h-full">
          {leftItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
        <div className="flex-shrink-0 w-20 h-full flex items-center justify-center px-1">
          <Link href="/workout" className="group">
            <div className="flex flex-col items-center justify-center cursor-pointer transition-transform duration-100 active:scale-90">
              <div className="h-9 w-14 bg-primary rounded-full flex items-center justify-center shadow-md shadow-primary/25 transition-all">
                <Dumbbell className="h-5 w-5 text-primary-foreground fill-current" />
              </div>

              <span className="text-[10px] font-bold text-primary mt-1 tracking-wide">
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
