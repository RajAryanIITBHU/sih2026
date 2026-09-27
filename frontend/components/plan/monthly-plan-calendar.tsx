"use client";

import * as React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingDown,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface MonthlyPlanCalendarProps {
  onSelectWeek: (weekId: string) => void;
}

export function MonthlyPlanCalendar({ onSelectWeek }: MonthlyPlanCalendarProps) {
  const weeksData = [
    {
      id: "week-1",
      label: "Week 1",
      dateRange: "1 Sep – 7 Sep 2025",
      status: "Executed & Verified",
      blocks: 6,
      tasks: 19,
      durationHours: 21.5,
      punctualityImpact: "98.4%",
      departmentDistribution: { engg: 45, ohe: 30, snt: 25 },
      active: false,
    },
    {
      id: "week-2",
      label: "Week 2",
      dateRange: "8 Sep – 13 Sep 2025",
      status: "Executed & Verified",
      blocks: 8,
      tasks: 24,
      durationHours: 26.0,
      punctualityImpact: "97.8%",
      departmentDistribution: { engg: 40, ohe: 35, snt: 25 },
      active: false,
    },
    {
      id: "week-3",
      label: "Week 3 (Current)",
      dateRange: "14 Sep – 20 Sep 2025",
      status: "Awaiting Controller Sign-off",
      blocks: 7,
      tasks: 22,
      durationHours: 23.0,
      punctualityImpact: "98.1% (Simulated)",
      departmentDistribution: { engg: 42, ohe: 33, snt: 25 },
      active: true,
    },
    {
      id: "week-4",
      label: "Week 4",
      dateRange: "21 Sep – 27 Sep 2025",
      status: "AI Preliminary Plan",
      blocks: 6,
      tasks: 18,
      durationHours: 19.5,
      punctualityImpact: "98.7% (Simulated)",
      departmentDistribution: { engg: 50, ohe: 28, snt: 22 },
      active: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Monthly Overview Summary Banner */}
      <Card className="rounded-xl border bg-gradient-to-r from-card via-card to-primary/[0.04]">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calendar className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                September 2025 Monthly Horizon Plan
              </h2>
              <p className="text-xs text-muted-foreground">
                Multi-week rolling corridor possession view for Agra Division (Delhi – Bina Section)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Month Bundling Gain</span>
              <span className="text-sm font-bold text-emerald-600">38.5 hrs downtime saved</span>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Overall Punctuality</span>
              <span className="text-sm font-bold text-primary">98.2% maintained</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {weeksData.map((week) => (
          <Card
            key={week.id}
            className={`rounded-xl border transition-all ${
              week.active
                ? "ring-2 ring-primary border-primary shadow-sm bg-card"
                : "border-border/70 hover:border-border hover:shadow-xs"
            }`}
          >
            <CardHeader className="p-4 pb-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{week.label}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] py-0 h-5 border-transparent ${
                    week.active
                      ? "bg-amber-500/15 text-amber-600 font-semibold"
                      : week.status.includes("Executed")
                      ? "bg-emerald-500/15 text-emerald-600 font-medium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {week.active ? "Current Focus" : week.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{week.dateRange}</p>
            </CardHeader>

            <CardContent className="p-4 pt-1 space-y-3">
              {/* Metric Row */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Blocks</span>
                  <span className="font-bold text-foreground">{week.blocks} Blocks</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Tasks Bundled</span>
                  <span className="font-bold text-foreground">{week.tasks} Tasks</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Possession Time</span>
                  <span className="font-bold text-foreground">{week.durationHours} hrs</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Punctuality</span>
                  <span className="font-bold text-emerald-600">{week.punctualityImpact}</span>
                </div>
              </div>

              {/* Department Distribution Stack */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Track ({week.departmentDistribution.engg}%)</span>
                  <span>OHE ({week.departmentDistribution.ohe}%)</span>
                  <span>S&T ({week.departmentDistribution.snt}%)</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${week.departmentDistribution.engg}%` }}
                    className="bg-emerald-500 h-full"
                    title="Track"
                  />
                  <div
                    style={{ width: `${week.departmentDistribution.ohe}%` }}
                    className="bg-sky-500 h-full"
                    title="OHE"
                  />
                  <div
                    style={{ width: `${week.departmentDistribution.snt}%` }}
                    className="bg-violet-500 h-full"
                    title="S&T"
                  />
                </div>
              </div>

              {/* Action */}
              <Button
                variant={week.active ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectWeek(week.id)}
                className="w-full h-8 text-xs gap-1.5"
              >
                <span>{week.active ? "Inspect Week 3 Schedule" : "View Week Details"}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
