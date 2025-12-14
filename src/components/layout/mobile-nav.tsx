"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "./sidebar";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-zinc-900 md:hidden pb-safe block">
      <div className="flex h-16 items-center justify-around">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full",
                isActive ? "text-primary" : "text-zinc-500"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "fill-current/20")}
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
