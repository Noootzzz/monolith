"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", global: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ email: "", password: "", global: "" });

    await signIn.email({
      email: formData.email,
      password: formData.password,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: (ctx) => {
          setLoading(false);
          const serverMessage = ctx.error.message;

          if (
            serverMessage.includes("password") ||
            serverMessage.includes("credential")
          ) {
            setErrors((prev) => ({
              ...prev,
              password: "Mot de passe incorrect.",
            }));
            toast.error("Échec de la connexion");
          } else if (
            serverMessage.includes("User") ||
            serverMessage.includes("email")
          ) {
            setErrors((prev) => ({
              ...prev,
              email: "Aucun compte associé à cet email.",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              global: "Une erreur est survenue.",
            }));
            toast.error(serverMessage);
          }
        },
        onSuccess: () => {
          setLoading(false);
          router.push("/dashboard");
          toast.success("Bon retour parmi nous !");
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {errors.global && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {errors.global}
                </div>
              )}

              <FormInput
                id="email"
                type="email"
                label="Email"
                placeholder="m@exemple.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
                required
              />

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none"
                  >
                    Mot de passe
                  </label>
                  <a
                    href="#"
                    className="text-sm underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Oublié ?
                  </a>
                </div>

                <FormInput
                  id="password"
                  type="password"
                  label=""
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={errors.password}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Pas de compte ?{" "}
              <Link href="/register" className="underline">
                S'inscrire
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
