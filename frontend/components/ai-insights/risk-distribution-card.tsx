"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InsightImpact, RiskDistributionItem } from "./types";

export interface RiskDistributionCardProps {
  distribution: RiskDistributionItem[];
  selectedLevel?: InsightImpact | null;
  onSelectLevel?: (level: InsightImpact) => void;
}

export function RiskDistributionCard({
  distribution,
  selectedLevel,
  onSelectLevel,
}: RiskDistributionCardProps) {
  const totalAssets = React.useMemo(() => {
    return distribution.reduce((acc, curr) => acc + curr.count, 0);
  }, [distribution]);

  const criticalItem = distribution.find((d) => d.level === "Critical");
  const criticalCount = criticalItem ? criticalItem.count : 62;

  return (
    <Card className="flex flex-col h-[530px] rounded-xl border shadow-none bg-card overflow-hidden">
      <CardHeader className="p-3.5 pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-orange-600" />
            <CardTitle className="text-sm font-bold text-foreground">
              Maintenance Risk Distribution
            </CardTitle>
          </div>

          <Badge variant="outline" className="text-[10px] font-semibold">
            {totalAssets.toLocaleString()} Fixed Assets
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between p-4 space-y-4">
        {/* Visual Donut Chart + Legend */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          {/* SVG Donut */}
          <div className="relative flex size-[140px] shrink-0 items-center justify-center">
            <svg viewBox="0 0 36 36" className="size-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3.8"
                className="text-muted/40"
              />
              {/* Critical slice: 5% */}
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="5 95"
                strokeDashoffset="0"
                className="transition-all duration-500"
              />
              {/* High slice: 18% */}
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="18 82"
                strokeDashoffset="-5"
                className="transition-all duration-500"
              />
              {/* Medium slice: 32% */}
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeDasharray="32 68"
                strokeDashoffset="-23"
                className="transition-all duration-500"
              />
              {/* Low slice: 45% */}
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="45 55"
                strokeDashoffset="-55"
                className="transition-all duration-500"
              />
            </svg>

            {/* Donut Center */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {totalAssets.toLocaleString()}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                Assets Tracked
              </span>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="flex-1 w-full space-y-2">
            {distribution.map((item) => {
              const isSelected = selectedLevel === item.level;

              return (
                <div
                  key={item.level}
                  onClick={() => onSelectLevel?.(item.level)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border/60 hover:bg-muted/50 hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn("size-2.5 rounded-full shrink-0", item.color)} />
                    <span className="font-semibold text-foreground">{item.level} Risk</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {item.percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      ({item.count})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Alert Callout Banner */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-destructive text-white">
              <TriangleAlert className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-destructive">
                {criticalCount} assets flagged in Critical Condition
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                4 new rail fissures and insulator flashover alerts detected in the last 48 hours. Urgent maintenance window required.
              </p>
            </div>
          </div>

          <Link href="/maintenance/tasks">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/15 gap-1.5"
            >
              <span>View Critical Tasks in Maintenance Hub</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
