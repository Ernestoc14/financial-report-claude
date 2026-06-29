"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/gastos": "Gastos",
  "/cuentas": "Cuentas y Tarjetas",
  "/presupuesto": "Presupuesto",
  "/reportes": "Reportes",
};

export default function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "FinTrack";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
      </div>
    </header>
  );
}
