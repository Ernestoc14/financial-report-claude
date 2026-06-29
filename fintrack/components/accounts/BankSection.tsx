import { AccountCard } from "@/components/accounts/AccountCard";
import { CreditCardWidget } from "@/components/accounts/CreditCardWidget";
import type { Account, CreditCard } from "@/types/fintrack";

interface BankSectionProps {
  bankName: string;
  accounts: Account[];
  cards?: CreditCard[];
}

export function BankSection({ bankName, accounts, cards = [] }: BankSectionProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{bankName}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
        {cards.map((card) => (
          <CreditCardWidget key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
