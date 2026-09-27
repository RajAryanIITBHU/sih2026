"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardSectionHeader } from "./dashboard-section-header";

const defaultData = [
  {
    name: "Allocated",
    value: 82,
  },
  {
    name: "Available",
    value: 38,
  },
];

export interface BlockUtilizationProps {
  data?: {
    allocatedMinutes: number;
    availableMinutes: number;
    percentage: number;
    slices: Array<{ name: string; value: number }>;
  };
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlockUtilization({ data }: BlockUtilizationProps) {
  const chartData = data?.slices && data.slices.length > 0 ? data.slices : defaultData;
  const percentage = data ? `${data.percentage}%` : "68%";
  const totalDisplay = data
    ? `${Math.round((data.allocatedMinutes + data.availableMinutes) / 60)} hrs`
    : "120 hrs";
  const allocatedDisplay = data
    ? `${Math.round(data.allocatedMinutes / 60)} hrs`
    : "82 hrs";
  const availableDisplay = data
    ? `${Math.round(data.availableMinutes / 60)} hrs`
    : "38 hrs";

  return (
    <Card className="rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border">
      <CardHeader className="p-4 sm:p-5 pb-0">
        <DashboardSectionHeader
          title="Block Utilization"
          // description="Possession capacity allocated vs available"
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold"
              render={<Link href="/block-planning/available" />}
            >
              <span>Capacity</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          }
        />
      </CardHeader>

      <CardContent className="flex h-[230px] items-center gap-4 p-4 pt-1">
        <div className="h-[170px] w-[170px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={52}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
              >
                <Cell fill="var(--primary)" />
                <Cell fill="var(--muted)" />
              </Pie>

              <text
                x="50%"
                y="46%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-2xl font-bold tracking-tight"
              >
                {percentage}
              </text>

              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs font-medium"
              >
                Utilized
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3 pl-2 border-l border-border/60">
          <Metric label="Total Possession Window" value={totalDisplay} />
          <Metric label="Allocated for Work" value={allocatedDisplay} valueClass="text-primary font-bold" />
          <Metric label="Available Shadow Time" value={availableDisplay} />

          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUp className="size-3.5" />
            11% gain via co-possession
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  valueClass = "text-card-foreground",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${valueClass}`}>{value}</p>
    </div>
  );
}
