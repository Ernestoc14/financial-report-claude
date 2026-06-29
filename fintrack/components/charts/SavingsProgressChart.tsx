"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DESIGN_TOKENS } from "@/lib/constants";
import { fmt } from "@/lib/formatters";
import type { SavingsGoal } from "@/types/fintrack";

interface SavingsProgressChartProps {
  goals: SavingsGoal[];
}

export function SavingsProgressChart({ goals }: SavingsProgressChartProps) {
  const data = goals.map((g) => ({
    name: g.name,
    current: g.currentAmount,
    remaining: Math.max(g.targetAmount - g.currentAmount, 0),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Progreso de Metas
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DESIGN_TOKENS.border} horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: DESIGN_TOKENS.card,
              border: `1px solid ${DESIGN_TOKENS.border}`,
              borderRadius: 8,
              color: "#E2E8F0",
              fontSize: 12,
            }}
            formatter={(v, name) => [
              fmt(Number(v)),
              name === "current" ? "Ahorrado" : "Pendiente",
            ]}
          />
          <Bar dataKey="current" stackId="a" fill={DESIGN_TOKENS.green} radius={[0, 0, 0, 0]} />
          <Bar dataKey="remaining" stackId="a" fill={DESIGN_TOKENS.border} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
