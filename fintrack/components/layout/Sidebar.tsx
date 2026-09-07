"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  Wallet,
  BarChart2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menu: MenuGroup[] = [
  {
    title: "Principal",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    ],
  },
  {
    title: "Finanzas",
    items: [
      { title: "Gastos", icon: Receipt, href: "/gastos" },
      { title: "Cuentas y Tarjetas", icon: Landmark, href: "/cuentas-tarjetas" },
      { title: "Presupuesto", icon: Wallet, href: "/presupuesto" },
    ],
  },
  {
    title: "Análisis",
    items: [
      { title: "Reportes", icon: BarChart2, href: "/reportes" },
    ],
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">F</span>
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-foreground">FinTrack</p>
            <p className="mt-0.5 text-[11px] leading-none text-muted-foreground">
              Personal Finance
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {menu.map((group) => (
          <div key={group.title}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, pathname);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                      <span className={cn("font-medium", active && "font-semibold")}>
                        {item.title}
                      </span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/40">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            EC
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">Ernesto</p>
            <p className="truncate text-xs text-muted-foreground">Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
