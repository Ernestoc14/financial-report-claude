"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DESIGN_TOKENS } from "@/lib/constants";
import { fmt, fmtShortDate } from "@/lib/formatters";

interface DataPoint {
  date: string;
  amount: number;
}

interface ExpenseTrendChartProps {
  data: DataPoint[];
}

export function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tendencia de Gastos
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DESIGN_TOKENS.border} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => fmtShortDate(v)}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: DESIGN_TOKENS.card,
              border: `1px solid ${DESIGN_TOKENS.border}`,
              borderRadius: 8,
              color: "#E2E8F0",
              fontSize: 12,
            }}
            formatter={(v) => [fmt(Number(v)), "Gasto"]}
            labelFormatter={(l) => fmtShortDate(l)}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={DESIGN_TOKENS.gold}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: DESIGN_TOKENS.gold }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
