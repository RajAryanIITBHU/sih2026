"use client";

import * as React from "react";
import {
  Brain,
  CheckCircle2,
  Clock3,
  Layers,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";

export interface AIInsightsStatsProps {
  totalRecommendations?: number;
  criticalAlerts?: number;
  actionedCount?: number;
  downtimeSaved?: string;
  costSavings?: string;
}

export function AIInsightsStats({
  totalRecommendations = 24,
  criticalAlerts = 8,
  actionedCount = 16,
  downtimeSaved = "6.2 hrs",
  costSavings = "₹12.4L",
}: AIInsightsStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <DashboardStatCard
        title="AI Recommendations"
        value={String(totalRecommendations)}
        icon={<Brain className="size-4" />}
        iconClassName="bg-primary/10 text-primary"
        variant="primary"
        change="+33%"
        positive
      />

      <DashboardStatCard
        title="Immediate Risk Alerts"
        value={String(criticalAlerts)}
        icon={<TriangleAlert className="size-4" />}
        iconClassName="bg-destructive/10 text-destructive"
        variant="destructive"
        change="+2 tracks"
        negative
      />

      <DashboardStatCard
        title="Bundled Possessions"
        value={String(actionedCount)}
        icon={<Layers className="size-4" />}
        iconClassName="bg-emerald-500/10 text-emerald-600"
        variant="success"
        change="+14%"
        positive
      />

      <DashboardStatCard
        title="Downtime Reduction"
        value={downtimeSaved}
        icon={<Clock3 className="size-4" />}
        iconClassName="bg-emerald-500/10 text-emerald-600"
        variant="success"
        change="+28%"
        positive
      />

      <DashboardStatCard
        title="Cost Avoidance"
        value={costSavings}
        icon={<Sparkles className="size-4" />}
        iconClassName="bg-amber-500/10 text-amber-600"
        variant="warning"
        change="+18%"
        positive
      />
    </div>
  );
}
