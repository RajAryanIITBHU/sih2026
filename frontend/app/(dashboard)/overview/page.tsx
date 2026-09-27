import {
  AIInsights,
  AssetHealthOverview,
  BlockUtilization,
  CorridorActivity,
  DashboardHeader,
  DashboardStats,
  MaintenanceCompletion,
  MaintenancePrioritization,
  TrainTraffic,
  UpcomingMaintenance,
} from "@/components/dashboard";
import { Separator } from "@/components/ui/separator";
import { getOverviewDashboardData } from "@/lib/data/overview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getOverviewDashboardData();

  return (
    <main className="min-h-screen bg-background text-foreground p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-5">
        <DashboardHeader />

        <Separator className="opacity-60" />

        <DashboardStats stats={data.stats} />

        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr_0.9fr]">
          <MaintenancePrioritization data={data.prioritization} />
          <BlockUtilization data={data.blockUtilization} />
          <AIInsights insights={data.aiInsights} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.7fr]">
          <CorridorActivity corridors={data.corridorActivity} />
          <UpcomingMaintenance blocks={data.upcomingMaintenance} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <AssetHealthOverview data={data.assetHealth} />
          <TrainTraffic data={data.trainTraffic} />
          <MaintenanceCompletion data={data.completionRate} />
        </div>
      </div>
    </main>
  );
}

