"use client";

import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface Filters {
  search: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
}

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const selectClass =
  "rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function clear() {
    onChange({ search: "", category: "", type: "", startDate: "", endDate: "" });
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Buscar transacciones…"
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Row filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.category}
          onChange={(e) => set("category", e.target.value)}
          className={selectClass}
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
          className={selectClass}
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
          className={selectClass}
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => {
            set("endDate", e.target.value); 
            console.log(filters.endDate);
          }}
          className={selectClass}
        />

        {hasFilters && (
          <button
            onClick={clear}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <X size={12} />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
