"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// import {
//   LayoutDashboard,
//   ArrowLeftRight,
//   Landmark,
//   CreditCard,
//   PiggyBank,
//   Target,
//   Wallet,
//   BarChart3,
//   CalendarDays,
//   Bell,
//   Settings,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// import { cn } from "@/lib/utils";

const menu = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: "LayoutDashboard",
        href: "/dashboard",
      },
      {
        title: "Analytics",
        icon: "BarChart3",
        href: "/analytics",
      },
    ],
  },

  {
    title: "Finances",
    items: [
      {
        title: "Transactions",
        icon: "ArrowLeftRight",
        href: "/transactions",
      },
      {
        title: "Banks",
        icon: "Landmark",
        href: "/banks",
      },
      {
        title: "Cards",
        icon: "CreditCard",
        href: "/cards",
      },
      {
        title: "Budget",
        icon: "Wallet",
        href: "/budget",
      },
    ],
  },

  {
    title: "Savings",
    items: [
      {
        title: "Goals",
        icon: "Target",
        href: "/goals",
      },
      {
        title: "Savings",
        icon: "PiggyBank",
        href: "/savings",
      },
    ],
  },

  {
    title: "Tools",
    items: [
      {
        title: "Calendar",
        icon: "CalendarDays",
        href: "/calendar",
      },
      {
        title: "Alerts",
        icon: "Bell",
        href: "/alerts",
        badge: 3,
      },
      {
        title: "Settings",
        icon: "Settings",
        href: "/settings",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div>
          <h1 className="text-lg font-bold">FinTrack</h1>
          <p className="text-xs text-muted-foreground">Personal Finance</p>
        </div>
        <button className="rounded-lg p-2 hover:bg-muted">
          {/* <ChevronLeft size={18} /> */}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menu.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="mb-2 px-3 text-xs uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "flex items-center justify-between rounded-xl px-3 py-2.5 transition-all"}
                      // active
                      //   ? "bg-primary text-primary-foreground"
                      //   : "hover:bg-muted",
                    // )}
                  >
                    <div className="flex items-center gap-3">
                      {/* <Icon size={18} /> */}
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
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

      {/* Bottom */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
            EC
          </div>
          <div>
            <p className="font-medium">Ernesto</p>
            <p className="text-xs text-muted-foreground">Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
