import { fmt } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/fintrack";
import { BANKS } from "@/lib/constants";

interface AccountCardProps {
  account: Account;
  className?: string;
}

export function AccountCard({ account, className }: AccountCardProps) {
  const bankName = BANKS[account.bank]?.name ?? account.bank;
  const isPositive = account.balance >= 0;

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {bankName}
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{account.name}</p>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {account.type}
        </span>
      </div>
      <p
        className={cn(
          "mt-3 font-mono text-xl font-bold",
          isPositive ? "text-foreground" : "text-negative"
        )}
      >
        {fmt(account.balance)}
      </p>
    </div>
  );
}
