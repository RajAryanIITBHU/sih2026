"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardSectionHeader } from "./dashboard-section-header";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultData = [
  { name: "Critical", tms: 24, smms: 28, tdms: 20 },
  { name: "High", tms: 22, smms: 20, tdms: 16 },
  { name: "Medium", tms: 10, smms: 14, tdms: 12 },
  { name: "Low", tms: 7, smms: 6, tdms: 7 },
];

export interface MaintenancePrioritizationProps {
  data?: Array<{
    name: string;
    tms: number;
    smms: number;
    tdms: number;
  }>;
}

export function MaintenancePrioritization({
  data = defaultData,
}: MaintenancePrioritizationProps) {
  const chartData = data?.length > 0 ? data : defaultData;

  return (
    <Card className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
      {/* Header */}
      <CardHeader className="px-4 pb-0 pt-4 sm:px-5 sm:pt-5">
        <DashboardSectionHeader
          title="Maintenance Task Prioritization"
          // description="Active tasks categorized by urgency & department source"
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-9 shrink-0 gap-1.5 rounded-lg px-3 text-xs font-semibold"
              render={<Link href="/maintenance/tasks" />}
            >
              Tasks
              <ArrowUpRight className="size-3.5" />
            </Button>
          }
        />
      </CardHeader>

      <CardContent className="px-4 pb-5 pt-1 sm:px-5">
        {/* Legends */}
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Legend color="bg-chart-1" label="TMS" description="Track" />

          <Legend color="bg-chart-3" label="SMMS" description="Signal" />

          <Legend color="bg-chart-4" label="TDMS" description="OHE" />
        </div>

        {/* Chart */}
        <div className="h-48 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barCategoryGap="12%"
              barGap={2}
              margin={{
                top: 5,
                right: 8,
                left: 4,
                bottom: 4,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="4 4"
                opacity={0.7}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                dy={8}
                tick={{
                  fontSize: 11,
                  fontWeight: 500,
                  fill: "var(--muted-foreground)",
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{
                  fontSize: 10,
                  fontWeight: 500,
                  fill: "var(--muted-foreground)",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "var(--muted)",
                  opacity: 0.08,
                }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--popover-foreground)",
                  fontSize: "12px",
                  padding: "9px 11px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.10)",
                }}
                labelStyle={{
                  color: "var(--foreground)",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "5px",
                }}
                itemStyle={{
                  color: "var(--muted-foreground)",
                  fontSize: "11px",
                  padding: "1px 0",
                }}
              />

              {/* TMS */}
              <Bar
                dataKey="tms"
                name="TMS"
                stackId="maintenance"
                fill="var(--chart-1)"
                barSize={24}
              />

              {/* SMMS */}
              <Bar
                dataKey="smms"
                name="SMMS"
                stackId="maintenance"
                fill="var(--chart-3)"
                barSize={24}
              />

              {/* TDMS */}
              <Bar
                dataKey="tdms"
                name="TDMS"
                stackId="maintenance"
                fill="var(--chart-4)"
                barSize={24}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function Legend({
  color,
  label,
  description,
}: {
  color: string;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`size-2.5 shrink-0 rounded-[3px] ${color}`}
        aria-hidden="true"
      />

      <span className="font-semibold text-foreground">{label}</span>

      <span className="text-muted-foreground">({description})</span>
    </div>
  );
}
