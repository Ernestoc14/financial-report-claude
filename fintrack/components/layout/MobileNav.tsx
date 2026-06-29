"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Landmark, Wallet, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Gastos", icon: Receipt, href: "/gastos" },
  { title: "Cuentas", icon: Landmark, href: "/cuentas" },
  { title: "Presupuesto", icon: Wallet, href: "/presupuesto" },
  { title: "Reportes", icon: BarChart2, href: "/reportes" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card md:hidden">
      {items.map(({ title, icon: Icon, href }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="font-medium">{title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
