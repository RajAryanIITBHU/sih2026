"use client";

import * as React from "react";
import Link from "next/link";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Check, ChevronDown, TrainFront } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DashboardSectionHeader } from "./dashboard-section-header";

const defaultTrafficData = [
  { time: "06:00", passenger: 8, goods: 5 },
  { time: "08:00", passenger: 16, goods: 9 },
  { time: "10:00", passenger: 24, goods: 11 },
  { time: "12:00", passenger: 29, goods: 12 },
  { time: "14:00", passenger: 35, goods: 18 },
  { time: "16:00", passenger: 31, goods: 14 },
  { time: "18:00", passenger: 28, goods: 12 },
  { time: "20:00", passenger: 30, goods: 16 },
  { time: "22:00", passenger: 21, goods: 14 },
];

export interface TrainTrafficData {
  passengerCount: number;
  goodsCount: number;
  passengerRuns: number;
  delayedGoodsCount: number;
  hourlyData: Array<{
    time: string;
    passenger: number;
    goods: number;
  }>;
}

export interface TrainTrafficProps {
  data?: TrainTrafficData;
}

export function TrainTraffic({ data }: TrainTrafficProps) {
  const [timeFilter, setTimeFilter] = React.useState("Today");
  const chartData = data?.hourlyData && data.hourlyData.length > 0 ? data.hourlyData : defaultTrafficData;
  const passengerValue = data ? String(data.passengerCount) : "6";
  const goodsValue = data ? String(data.goodsCount) : "7";

  return (
    <Card className="rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border">
      <CardHeader className="p-4 sm:p-5 pb-0">
        <DashboardSectionHeader
          title="Train Traffic Overview"
          description="Passenger vs goods density along active corridors"
          action={
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                    >
                      <span>{timeFilter}</span>
                      <ChevronDown className="size-3 text-muted-foreground" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-36">
                  {["Today", "Yesterday", "Last 7 Days", "Next 7 Days"].map((option) => (
                    <DropdownMenuItem
                      key={option}
                      className="flex items-center justify-between text-xs"
                      onClick={() => setTimeFilter(option)}
                    >
                      <span>{option}</span>
                      {timeFilter === option && <Check className="size-3.5 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                render={<Link href="/operations/schedule" />}
                aria-label="View Full Schedule"
              >
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          }
        />
      </CardHeader>

      <CardContent className="p-4 pt-1">
        {/* Legend */}
        <div className="mb-2.5 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="size-2 rounded-full bg-chart-5" />
            Passenger Trains
          </span>

          <span className="flex items-center gap-1.5 font-medium">
            <span className="size-2 rounded-full bg-chart-1" />
            Goods / Freight Trains
          </span>
        </div>

        {/* Chart */}
        <div className="h-[135px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                left: -20,
                right: 5,
                top: 5,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />

              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
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
              />

              <Line
                type="monotone"
                dataKey="passenger"
                stroke="var(--chart-5)"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: "var(--chart-5)" }}
                activeDot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="goods"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: "var(--chart-1)" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* High-weight summary metrics */}
        <div className="mt-3.5 grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
          <TrafficMetric
            icon={<TrainFront className="size-7 text-chart-5" />}
            value={passengerValue}
            label="Active Passenger Trains"
            change="16 Runs (94% On-Time)"
            positive
          />

          <TrafficMetric
            icon={<TrainFront className="size-7 text-chart-1" />}
            value={goodsValue}
            label="Goods Trains & Forecast"
            change="4 Rakes Delayed"
            positive={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TrafficMetric({
  icon,
  value,
  label,
  change,
  positive,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 p-2">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>

          <span
            className={`text-[11px] font-semibold ${
              positive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {change}
          </span>
        </div>

        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
