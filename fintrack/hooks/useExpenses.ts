"use client";

import useSWR from "swr";
import type { Expense } from "@/types/fintrack";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface UseExpensesOptions {
  category?: string;
  type?: Expense["type"];
  startDate?: string;
  endDate?: string;
  accountId?: number;
  page?: number;
  pageSize?: number;
}

export function useExpenses(opts: UseExpensesOptions = {}) {
  const params = new URLSearchParams();
  params.set("populate", "*");
  params.set("sort", "date:desc");
  if (opts.category) params.set("filters[category][$eq]", opts.category);
  if (opts.type) params.set("filters[type][$eq]", opts.type);
  if (opts.startDate) params.set("filters[date][$gte]", opts.startDate);
  if (opts.endDate) params.set("filters[date][$lte]", opts.endDate);
  if (opts.accountId) params.set("filters[account][id][$eq]", String(opts.accountId));
  params.set("pagination[page]", String(opts.page ?? 1));
  params.set("pagination[pageSize]", String(opts.pageSize ?? 25));

  const { data, error, isLoading, mutate } = useSWR<{
    data: Expense[];
    meta: { pagination: { total: number; pageCount: number } };
  }>(`/api/strapi/expenses?${params}`, fetcher);

  return {
    expenses: data?.data ?? [],
    pagination: data?.meta?.pagination,
    isLoading,
    error,
    mutate,
  };
}
