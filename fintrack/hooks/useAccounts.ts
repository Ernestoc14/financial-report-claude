"use client";

import useSWR from "swr";
import type { Account, CreditCard } from "@/types/fintrack";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAccounts() {
  const { data, error, isLoading, mutate } = useSWR<{ data: Account[] }>(
    "/api/strapi/accounts?populate=*&sort=bank:asc",
    fetcher
  );
  return {
    accounts: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useCreditCards() {
  const { data, error, isLoading, mutate } = useSWR<{ data: CreditCard[] }>(
    "/api/strapi/credit-cards?populate=*",
    fetcher
  );
  return {
    cards: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
}
