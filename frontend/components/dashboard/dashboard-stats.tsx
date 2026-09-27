import {
  AlertTriangle,
  Clock3,
  Gauge,
  ShieldCheck,
  TrainFront,
  Wrench,
} from "lucide-react";

import { DashboardStatCard } from "./dashboard-stat-card";

export interface DashboardStatsProps {
  stats?: {
    totalAssets?: number;
    openTasks?: number;
    criticalDefects?: number;
    todayBlocks?: number;
    atRiskAssets?: number;
    assetAvailability?: string;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const totalAssets = stats?.totalAssets ? stats.totalAssets.toLocaleString() : "13";
  const openTasks = stats?.openTasks !== undefined ? stats.openTasks.toString() : "34";
  const overdueTasks = stats?.criticalDefects !== undefined ? stats.criticalDefects.toString() : "2";
  const todayBlocks = stats?.todayBlocks !== undefined ? stats.todayBlocks.toString() : "5";
  const atRisk = stats?.atRiskAssets !== undefined ? stats.atRiskAssets.toString() : "9";
  const availability = stats?.assetAvailability || "76.0%";

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
      <DashboardStatCard
        title="Total Assets"
        value={totalAssets}
        change="2.4%"
        changeLabel="monitored"
        positive
        icon={<TrainFront className="size-5 text-primary" />}
        iconClassName="bg-primary/10"
        variant="primary"
        href="/digital-twin"
      />

      <DashboardStatCard
        title="Open Tasks"
        value={openTasks}
        change="TMS • SMMS • TDMS"
        negative
        icon={<Wrench className="size-5 text-amber-600 dark:text-amber-400" />}
        iconClassName="bg-amber-500/10"
        variant="warning"
        href="/maintenance/tasks"
      />

      <DashboardStatCard
        title="Critical Defects"
        value={overdueTasks}
        change="Requires Block"
        negative
        icon={<AlertTriangle className="size-5 text-destructive" />}
        iconClassName="bg-destructive/10"
        variant="destructive"
        href="/maintenance/defects"
      />

      <DashboardStatCard
        title="Today's Blocks"
        value={todayBlocks}
        change="84%"
        changeLabel="efficiency"
        positive
        icon={<Clock3 className="size-5 text-primary" />}
        iconClassName="bg-primary/10"
        variant="primary"
        href="/block-planning/ai-planner"
      />

      <DashboardStatCard
        title="At-Risk Assets"
        value={atRisk}
        change="Predicted Flaws"
        negative
        icon={<Gauge className="size-5 text-amber-600 dark:text-amber-400" />}
        iconClassName="bg-amber-500/10"
        variant="warning"
        href="/ai-insights"
      />

      <DashboardStatCard
        title="Availability"
        value={availability}
        change="Avg Health"
        positive
        icon={<ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />}
        iconClassName="bg-emerald-500/10"
        variant="success"
        href="/overview"
      />
    </div>
  );
}
