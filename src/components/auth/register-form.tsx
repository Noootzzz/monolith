"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
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

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ name: "", email: "", password: "" });

    await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: (ctx) => {
          setLoading(false);
          const msg = ctx.error.message;

          if (msg.includes("already exists")) {
            setErrors((prev) => ({
              ...prev,
              email: "Cet email est déjà utilisé.",
            }));
            toast.error("Erreur lors de l'inscription");
          } else if (msg.includes("password") || msg.includes("short")) {
            setErrors((prev) => ({
              ...prev,
              password: "Le mot de passe est trop court (8 min).",
            }));
          } else if (msg.includes("name")) {
            setErrors((prev) => ({ ...prev, name: "Le nom est invalide." }));
          } else {
            toast.error(msg);
          }
        },
        onSuccess: () => {
          setLoading(false);
          router.push("/dashboard");
          toast.success("Compte créé avec succès !");
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez Monolith pour suivre votre progression.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <FormInput
                id="name"
                label="Nom complet"
                placeholder="Ex: Arnold"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
                required
              />

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
                helperText="Nous ne partagerons jamais votre email."
                required
              />

              <FormInput
                id="password"
                type="password"
                label="Mot de passe"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                helperText="Au moins 8 caractères."
                required
              />

              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Création..." : "S'inscrire"}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled
                >
                  S'inscrire avec Google (Bientôt)
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Déjà un compte ?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
