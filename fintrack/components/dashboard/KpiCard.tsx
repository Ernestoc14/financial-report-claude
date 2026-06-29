import { cn } from "@/lib/utils";
import { fmt, pct } from "@/lib/formatters";

interface KpiCardProps {
  label: string;
  value: number | string;
  delta?: number;
  format?: "currency" | "percent" | "raw";
  className?: string;
}

export function KpiCard({ label, value, delta, format = "currency", className }: KpiCardProps) {
  const display =
    typeof value === "string"
      ? value
      : format === "currency"
        ? fmt(value)
        : format === "percent"
          ? pct(value)
          : String(value);

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 font-mono text-2xl font-bold text-foreground">{display}</p>
      {delta !== undefined && (
        <p
          className={cn(
            "mt-1.5 text-xs font-medium",
            delta >= 0 ? "text-positive" : "text-negative"
          )}
        >
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% vs mes anterior
        </p>
      )}
    </div>
  );
}
