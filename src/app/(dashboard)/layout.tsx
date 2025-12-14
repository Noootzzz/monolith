"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Déconnexion réussie");
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Sidebar onSignOut={handleSignOut} />

      <header className="md:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-900 sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="h-7 w-7 rounded-lg bg-black text-white flex items-center justify-center dark:bg-white dark:text-black">
            M
          </div>
          Monolith
        </div>
        <ModeToggle />
      </header>

      <main className="flex-1 md:ml-64 p-4 pb-24 md:p-8 overflow-y-auto min-h-screen">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
