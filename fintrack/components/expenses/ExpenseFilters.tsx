"use client";

import { CATEGORIES } from "@/lib/constants";

interface Filters {
  category: string;
  type: string;
  startDate: string;
  endDate: string;
}

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.category}
        onChange={(e) => set("category", e.target.value)}
        className={inputClass}
      >
        <option value="">Todas las categorías</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => set("type", e.target.value)}
        className={inputClass}
      >
        <option value="">Todos los tipos</option>
        <option value="expense">Gasto</option>
        <option value="income">Ingreso</option>
        <option value="transfer">Transferencia</option>
      </select>

      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => set("startDate", e.target.value)}
        className={inputClass}
      />
      <input
        type="date"
        value={filters.endDate}
        onChange={(e) => set("endDate", e.target.value)}
        className={inputClass}
      />
    </div>
  );
}
