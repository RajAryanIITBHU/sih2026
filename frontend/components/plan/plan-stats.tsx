"use client";

import * as React from "react";
import {
  CalendarDays,
  FileCheck2,
  Gauge,
  Network,
  Users,
} from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { PlanKPIData } from "./types";

export interface PlanStatsProps {
  kpis: PlanKPIData;
}

export function PlanStats({ kpis }: PlanStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <DashboardStatCard
        title="Maintenance Tasks"
        value={String(kpis.totalTasks)}
        change="+20%"
        changeLabel="bundled efficiency"
        positive
        icon={<FileCheck2 className="size-4" />}
        variant="default"
      />

      <DashboardStatCard
        title="Blocks Scheduled"
        value={String(kpis.scheduledBlocks)}
        change="-12%"
        changeLabel="possession downtime"
        positive
        icon={<CalendarDays className="size-4" />}
        variant="primary"
      />

      <DashboardStatCard
        title="Corridors Covered"
        value={String(kpis.corridorsCount)}
        change="Full Span"
        changeLabel="Delhi – Bina route"
        icon={<Network className="size-4" />}
        variant="default"
      />

      <DashboardStatCard
        title="Departments Coordinated"
        value={String(kpis.departmentsCount)}
        change="Joint Execution"
        changeLabel="Engg, OHE & S&T"
        icon={<Users className="size-4" />}
        variant="default"
      />

      <DashboardStatCard
        title="Resource Utilization"
        value={`${kpis.resourceUtilization}%`}
        change={kpis.utilizationTrend}
        changeLabel="optimal gang/machine"
        positive
        icon={<Gauge className="size-4" />}
        variant="success"
      />
    </div>
  );
}
