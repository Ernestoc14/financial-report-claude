"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { useFinanceStore } from "@/store/useFinanceStore";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { accounts, addTransaction } = useFinanceStore();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "expense" as "expense" | "income" | "transfer",
    accountId: "",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addTransaction({
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
      category: form.category,
      type: form.type,
      accountId: parseInt(form.accountId),
    });
    setForm({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      type: "expense",
      accountId: "",
    });
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Descripción</label>
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            placeholder="Ej: Supermercado"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Monto (USD)</label>
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
          <label className={labelClass}>Fecha</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Tipo</label>
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
          <label className={labelClass}>Categoría</label>
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

        <div className="sm:col-span-2">
          <label className={labelClass}>Cuenta</label>
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

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Guardar
      </button>
    </form>
  );
}
