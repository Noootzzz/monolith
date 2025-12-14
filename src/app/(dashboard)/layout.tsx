"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

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
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
      <Sidebar onSignOut={handleSignOut} />

      <main className="flex-1 md:ml-64 p-4 pb-24 md:p-8 overflow-y-auto min-h-screen">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
