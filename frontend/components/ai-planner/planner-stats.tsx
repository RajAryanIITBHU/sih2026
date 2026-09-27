"use client";

import * as React from "react";
import { Check, Clock3, Sparkles, TrainFront, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PlannerStatsView } from "./types";

export interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconClass?: string;
}

export function StatCard({
  icon,
  value,
  label,
  iconClass = "bg-primary/10 text-primary",
}: StatCardProps) {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardContent className="flex items-center gap-3 p-3">
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-md ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold leading-none">{value}</p>
          <p className="mt-1 text-[9px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
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
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={<Check className="size-4" />}
        value={selectedTasksValue}
        label="Selected Tasks"
        iconClass="bg-emerald-500/10 text-emerald-600"
      />

      <StatCard
        icon={<Users className="size-4" />}
        value={departmentsValue}
        label="Departments"
        iconClass="bg-sky-500/10 text-sky-600"
      />

      <StatCard
        icon={<Clock3 className="size-4" />}
        value={recommendedBlockValue}
        label="Recommended Block"
        iconClass="bg-emerald-500/10 text-emerald-600"
      />

      <StatCard
        icon={<TrainFront className="size-4" />}
        value={trainConflictsValue}
        label="Train Conflicts"
        iconClass="bg-muted text-muted-foreground"
      />

      <StatCard
        icon={<Sparkles className="size-4" />}
        value={scoreValue}
        label="Optimization Score"
        iconClass="bg-amber-500/10 text-amber-600"
      />
    </div>
  );
}
