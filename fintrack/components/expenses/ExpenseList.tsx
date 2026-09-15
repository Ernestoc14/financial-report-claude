import { fmt, fmtDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORIES } from "@/lib/constants";
import type { Expense } from "@/types/fintrack";

interface ExpenseListProps {
  expenses: Expense[];
}

const TYPE_LABEL: Record<string, string> = {
  expense: "Gasto",
  income: "Ingreso",
  transfer: "Transferencia",
};

function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function groupByDate(expenses: Expense[]): [string, Expense[]][] {
  const map = new Map<string, Expense[]>();
  for (const tx of expenses) {
    const group = map.get(tx.date) ?? [];
    group.push(tx);
    map.set(tx.date, group);
  }
  return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (!expenses.length) {
    return (
      <div className="rounded-xl border border-border bg-card py-16 text-center text-sm text-muted-foreground">
        No hay transacciones con los filtros seleccionados
      </div>
    );
  }

  const groups = groupByDate(expenses);

  return (
    <div className="space-y-4">
      {groups.map(([date, txs]) => (
        <div key={date}>
          <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {fmtDate(date)}
          </p>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {txs.map((tx, i) => {
              const isExpense = tx.type === "expense";
              const isIncome = tx.type === "income";
              const color = CATEGORY_COLORS[tx.category] ?? "#64748B";

              return (
                <div
                  key={tx.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3",
                    i < txs.length - 1 && "border-b border-border"
                  )}
                >
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {tx.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getCategoryLabel(tx.category)} · {TYPE_LABEL[tx.type]}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "shrink-0 font-mono text-sm font-semibold tabular-nums",
                      isIncome
                        ? "text-positive"
                        : isExpense
                          ? "text-negative"
                          : "text-muted-foreground"
                    )}
                  >
                    {isIncome ? "+" : isExpense ? "−" : ""}
                    {fmt(tx.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
