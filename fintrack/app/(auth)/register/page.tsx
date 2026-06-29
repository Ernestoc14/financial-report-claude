"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/strapi/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message ?? "Error al registrar");
      }
      router.push("/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <span className="text-lg font-bold text-primary-foreground">F</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Únete a FinTrack
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(["username", "email", "password"] as const).map((field) => (
          <div key={field}>
            <label className="mb-1.5 block text-sm font-medium text-foreground capitalize">
              {field === "username" ? "Usuario" : field === "email" ? "Email" : "Contraseña"}
            </label>
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
