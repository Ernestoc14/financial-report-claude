"use client";

import useSWR from "swr";
import { useMemo } from "react";
import type { BudgetConfig, Expense } from "@/types/fintrack";
import { WEEKLY_SPLITS, PAYDAY } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useBudgetConfig() {
  const { data, error, isLoading, mutate } = useSWR<{ data: BudgetConfig }>(
    "/api/strapi/budget-config",
    fetcher
  );
  return { config: data?.data ?? null, isLoading, error, mutate };
}

export function useCurrentWeek(): number {
  return useMemo(() => {
    const today = new Date();
    const day = today.getDate();
    const daysSincePayday = day >= PAYDAY ? day - PAYDAY : day + (31 - PAYDAY);
    if (daysSincePayday < 7) return 1;
    if (daysSincePayday < 14) return 2;
    if (daysSincePayday < 21) return 3;
    return 4;
  }, []);
}

export function useWeeklyBudget(config: BudgetConfig | null, expenses: Expense[]) {
  return useMemo(() => {
    if (!config) return null;
    const variablePool = (config.salary * config.variable) / 100;
    const week = useCurrentWeek();
    const weeklyAllocation = (variablePool * WEEKLY_SPLITS[week - 1]) / 100;
    const weeklySpent = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      week,
      allocation: weeklyAllocation,
      spent: weeklySpent,
      remaining: weeklyAllocation - weeklySpent,
      pct: weeklySpent / weeklyAllocation,
    };
  }, [config, expenses]);
}
