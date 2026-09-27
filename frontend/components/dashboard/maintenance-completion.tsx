"use client";

import {
  Bar,
  BarChart,
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

const defaultCompletionData = [
  { month: "Apr", value: 70 },
  { month: "May", value: 67 },
  { month: "Jun", value: 71 },
  { month: "Jul", value: 75 },
  { month: "Aug", value: 83 },
  { month: "Sep", value: 85 },
];

export interface MaintenanceCompletionProps {
  data?: Array<{
    month: string;
    value: number;
  }>;
}

export function MaintenanceCompletion({ data }: MaintenanceCompletionProps) {
  const chartData = data && data.length > 0 ? data : defaultCompletionData;

  return (
    <Card className="rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border">
      <CardHeader className="p-4 sm:p-5 pb-0">
        <DashboardSectionHeader
          title="Maintenance Completion Rate"
          description="Monthly resolution efficiency over the last 6 months"
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold"
              render={<Link href="/reports" />}
            >
              <span>Trends</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          }
        />
      </CardHeader>

      <CardContent className="h-[180px] p-4 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barSize={16}
            margin={{
              top: 15,
              right: 8,
              left: -20,
              bottom: 0,
            }}
          >
            <YAxis
              domain={[0, 100]}
              tick={{
                fontSize: 10,
                fill: "var(--muted-foreground)",
              }}
              axisLine={false}
              tickLine={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 11,
                fill: "var(--muted-foreground)",
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                color: "var(--popover-foreground)",
                fontSize: "12px",
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "var(--popover-foreground)" }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 700 }}
              formatter={(val: unknown) => [`${Number(val)}%`, "Completion Rate"]}
            />

            <Bar
              dataKey="value"
              fill="var(--chart-2)"
              radius={[3, 3, 0, 0]}
              label={{
                position: "top",
                fontSize: 10,
                fill: "var(--muted-foreground)",
                formatter: (val: unknown) => `${Number(val)}%`,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
