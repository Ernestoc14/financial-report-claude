"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import type { Account } from "@/types/fintrack";

interface ExpenseFormProps {
  accounts: Account[];
  onSuccess?: () => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function ExpenseForm({ accounts, onSuccess }: ExpenseFormProps) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "expense" as "expense" | "income" | "transfer",
    accountId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/strapi/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...form,
            amount: parseFloat(form.amount),
            accountId: parseInt(form.accountId),
          },
        }),
      });
      if (!res.ok) throw new Error("Error al guardar el gasto");
      setForm({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        type: "expense",
        accountId: "",
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Descripción
          </label>
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            placeholder="Ej: Supermercado"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Monto (USD)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            required
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Fecha
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Tipo
          </label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className={inputClass}
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Categoría
          </label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Seleccionar…</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Cuenta
          </label>
          <select
            value={form.accountId}
            onChange={(e) => set("accountId", e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Seleccionar…</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Guardando…" : "Guardar gasto"}
      </button>
    </form>
  );
}
