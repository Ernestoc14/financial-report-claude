"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { CATEGORIES } from "@/lib/constants";
import { fmt } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Filters {
  search: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "",
  type: "",
  startDate: "",
  endDate: "",
};

export default function GastosPage() {
  const transactions = useFinanceStore((s) => s.transactions);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.search && !tx.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category && tx.category !== filters.category) return false;
      if (filters.type && tx.type !== filters.type) return false;
      if (filters.startDate && tx.date < filters.startDate) return false;
      if (filters.endDate && tx.date > filters.endDate) return false;
      return true;
    });
  }, [transactions, filters]);

  const summary = useMemo(() => {
    const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const transfers = filtered.filter((t) => t.type === "transfer").reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net: income - expenses, transfers };
  }, [filtered]);

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gastos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} transaccion{filtered.length !== 1 ? "es" : ""}
            {hasFilters ? " (filtradas)" : ""}
          </p>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              <Plus size={16} />
              Nuevo Gasto
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader className="mb-6">
              <SheetTitle>Nueva Transacción</SheetTitle>
            </SheetHeader>
            <ExpenseForm onSuccess={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Ingresos" value={summary.income} variant="positive" />
        <SummaryCard label="Gastos" value={summary.expenses} variant="negative" />
        <SummaryCard
          label="Neto"
          value={summary.net}
          variant={summary.net >= 0 ? "positive" : "negative"}
        />
      </div>

      {/* Filters */}
      <ExpenseFilters filters={filters} onChange={setFilters} />

      {/* List */}
      <ExpenseList expenses={filtered} />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-mono text-xl font-bold tabular-nums",
          variant === "positive" && "text-positive",
          variant === "negative" && "text-negative",
          variant === "neutral" && "text-foreground"
        )}
      >
        {value >= 0 ? "" : "−"}
        {fmt(Math.abs(value))}
      </p>
    </div>
  );
}
