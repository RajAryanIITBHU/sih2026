"use client";

import * as React from "react";
import { Check, Clock3, Sparkles, TrainFront, Users } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import type { PlannerStatsView } from "./types";

export interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconClass?: string;
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  iconClass = "bg-primary/10 text-primary",
  className,
}: StatCardProps) {
  return (
    <DashboardStatCard
      title={label}
      value={value}
      icon={icon}
      iconClassName={iconClass}
      className={className}
    />
  );
}

export interface PlannerStatsBarProps {
  stats?: PlannerStatsView;
}

export function PlannerStatsBar({ stats }: PlannerStatsBarProps) {
  const selectedTasksValue = stats !== undefined ? String(stats.selectedTasksCount) : "0";
  const departmentsValue = stats !== undefined ? String(stats.departmentsCount) : "0";
  const recommendedBlockValue = stats?.recommendedBlock || "14:00 – 18:00";
  const trainConflictsValue = stats ? String(stats.trainConflicts) : "0";
  const scoreValue = stats ? `${stats.optimizationScore} / 100` : "94 / 100";

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-[1fr_1fr_1.45fr_1fr_1.1fr]">
      <DashboardStatCard
        title="Selected Tasks"
        value={selectedTasksValue}
        icon={<Check className="size-4" />}
        iconClassName="bg-emerald-500/10 text-emerald-600"
        variant="success"
      />

      <DashboardStatCard
        title="Departments"
        value={departmentsValue}
        icon={<Users className="size-4" />}
        iconClassName="bg-sky-500/10 text-sky-600"
        variant="primary"
      />

      {/* Increased width Recommended Block Status Card with single-line typography */}
      <DashboardStatCard
        title="Recommended Block"
        value={recommendedBlockValue}
        icon={<Clock3 className="size-4" />}
        iconClassName="bg-emerald-500/10 text-emerald-600"
        variant="success"
        className="col-span-2 sm:col-span-1 xl:col-span-1 [&_p.text-foreground]:whitespace-nowrap [&_p.text-foreground]:text-lg sm:[&_p.text-foreground]:text-xl xl:[&_p.text-foreground]:text-2xl [&_p.text-muted-foreground]:whitespace-nowrap"
      />

      <DashboardStatCard
        title="Train Conflicts"
        value={trainConflictsValue}
        icon={<TrainFront className="size-4" />}
        iconClassName="bg-muted text-muted-foreground"
      />

      <DashboardStatCard
        title="Optimization Score"
        value={scoreValue}
        icon={<Sparkles className="size-4" />}
        iconClassName="bg-amber-500/10 text-amber-600"
        variant="warning"
      />
    </div>
  );
}
