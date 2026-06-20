# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from inside `fintrack/` using pnpm:

```bash
pnpm dev      # start dev server at localhost:3000
pnpm build    # production build
pnpm lint     # run ESLint
```

There are no tests configured yet.

## Architecture

### Two distinct layers

**Root-level JSX prototypes** (`report.jsx`, `report-slider.jsx`, `fintrack.jsx`) are standalone React components built as Claude artifacts. They were designed to run in Claude's canvas environment — `fintrack.jsx` in particular calls `window.storage.get/set` which is Claude's artifact storage API, not a browser API. These files are prototypes/references, not part of the Next.js app.

**`fintrack/`** is the actual Next.js 16 app (App Router, TypeScript, Tailwind v4, pnpm). This is where active development happens. It is currently in early scaffolding: only `app/page.tsx` and `app/components/Sidebar.tsx` exist beyond boilerplate.

### What the app is becoming

FinTrack is a personal finance dashboard. The intended route structure (from the Sidebar nav config) includes:
- `/dashboard`, `/analytics` (Overview group)
- `/transactions`, `/banks`, `/cards`, `/budget` (Finances group)
- `/goals`, `/savings` (Savings group)
- `/calendar`, `/alerts`, `/settings` (Tools group)

None of these routes exist yet — only the Sidebar shell is in place.

### Sidebar pattern

`app/components/Sidebar.tsx` is a `"use client"` component. The nav items are defined as a `menu` array of grouped items. Active state uses `usePathname()`. Lucide React icons and a `cn()` utility are imported but currently commented out (those packages are not installed). When adding icons/utility class merging, install them first.

### Styling

Tailwind v4 — uses `@import "tailwindcss"` in `globals.css` (no `tailwind.config.js`). Theme tokens (`--color-background`, `--font-sans`, etc.) are declared via `@theme inline`. The Sidebar references CSS variable-backed color names like `bg-background`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground` — these are shadcn/ui conventions but shadcn is not installed. Add those CSS variables to `globals.css` or install shadcn before using those class names.

### Fonts

`app/layout.tsx` loads Geist Sans and Geist Mono via `next/font/google` and exposes them as CSS variables `--font-geist-sans` / `--font-geist-mono`.

### Reference implementation

`fintrack.jsx` (the prototype) contains the full intended feature set as a single-file component:
- `SetupWizard` — 3-step onboarding (income → accounts → goals)
- `DashboardView` — stat cards, pay-cycle progress bar, budget-vs-spent bar chart, pie chart, recent transactions
- `ExpensesView` — filterable transaction list
- `AccountsView` — bank accounts and credit cards with utilization bars
- `GoalsView` — savings goals with progress and monthly projection
- `BudgetView` — per-category % allocation table + weekly spending plan

The pay cycle resets on day 13 of each month (`PAYDAY = 13`). `paydayInfo()` in the prototype computes days since/until last/next payday and which weekly slice (30/25/25/20) is current.
