import { getMonthWeekLabel } from "@/lib/date-utils";
import { DashboardKpis } from "@/components/dashboard/DashboardKpis";
import { PayCycleBar } from "@/components/dashboard/PayCycleBar";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export const metadata = { title: "Dashboard · FinTrack" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">{getMonthWeekLabel()}</p>
      </div>

      <DashboardKpis />
      <PayCycleBar />
      <RecentTransactions />
    </div>
  );
}
