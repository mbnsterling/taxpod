import { auth } from "~/server/auth";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { StatsCards } from "~/components/dashboard/stats-cards";
import { ChartsRow } from "~/components/dashboard/charts-row";
import { RecentIncome } from "~/components/dashboard/recent-income";
import { ComplianceWidget } from "~/components/dashboard/compliance-widget";
import { QuickActions } from "~/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader userName={session?.user?.name} />

      <main className="flex-1 p-5 md:p-6 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Welcome banner */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-900 p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"}!
              </h2>
              <p className="text-emerald-300 text-sm mt-1 font-medium">
                Here&apos;s your tax overview for 2025/2026
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-200 bg-emerald-700/50 border border-emerald-600/50 px-3 py-1 rounded-full">
                Freelancer
              </span>
              <span className="text-xs font-semibold text-amber-300 bg-amber-900/40 border border-amber-700/50 px-3 py-1 rounded-full">
                Not Started
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Charts */}
        <ChartsRow />

        {/* Income + Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <RecentIncome hasData={false} />
          <ComplianceWidget />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </main>
    </div>
  );
}
