import { fmt, fmtShortDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/constants";
import type { Expense } from "@/types/fintrack";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
}

export function ExpenseList({ expenses, isLoading }: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-card" />
        ))}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
        No hay transacciones
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {expenses.map((expense) => {
        const isExpense = expense.type === "expense";
        const color = CATEGORY_COLORS[expense.category] ?? "#64748B";

        return (
          <div
            key={expense.id}
            className="flex items-center justify-between rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {expense.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {expense.category} · {fmtShortDate(expense.date)}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "font-mono text-sm font-semibold",
                isExpense ? "text-negative" : "text-positive"
              )}
            >
              {isExpense ? "-" : "+"}{fmt(expense.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
