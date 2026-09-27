"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { OptimizationResultView } from "./types";

export function ResultMetric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          highlight
            ? "font-bold text-emerald-600 dark:text-emerald-400"
            : "font-semibold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function ImpactItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        {icon}
      </div>

      <span className="text-foreground/90 font-medium">{text}</span>
    </div>
  );
}

export interface OptimizationResultProps {
  data?: OptimizationResultView;
}

export function OptimizationResult({ data }: OptimizationResultProps) {
  const [isApproved, setIsApproved] = React.useState(false);

  const dateFormatted = data?.recommendedBlock.dateFormatted || "14 September 2025";
  const timeFormatted = data?.recommendedBlock
    ? `${data.recommendedBlock.timeRangeFormatted} (${data.recommendedBlock.durationFormatted})`
    : "14:00 – 18:00 (4 hours)";
  const corridorName = data?.recommendedBlock.corridorName || "Corridor C-01 (Delhi - Agra)";

  const tasksScheduled = data ? String(data.tasksScheduledCount) : "5";
  const departments = data ? String(data.departmentsCount) : "3";
  const crewUtilization = data?.crewUtilization || "91%";
  const trainConflicts = data ? String(data.trainConflictsCount) : "0";
  const safetyConflicts = data ? String(data.safetyConflictsCount) : "0";
  const score = data?.optimizationScore ?? 94;

  const blocksAvoidedText = `${data?.blocksAvoided ?? 2} blocks avoided`;
  const downtimeSavedText = `${data?.downtimeHoursSaved ?? 6} hours downtime saved`;
  const availabilityGainText = `+${data?.availabilityGainPercent ?? 7}% asset availability`;

  const handleApprove = () => {
    setIsApproved(true);
  };

  return (
    <Card className="rounded-xl border shadow-none bg-card overflow-hidden">
      <CardHeader className="p-3.5 pb-2.5 border-b bg-muted/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                AI Optimization Result
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Joint possession plan optimized via CP-SAT constraint engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isApproved && (
              <Badge className="gap-1.5 border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs py-0.5 px-2.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Request Queued
              </Badge>
            )}

            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 py-0.5 px-2.5"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Optimal Multi-Department Plan
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Landscape Row Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.3fr_1.1fr_1.4fr_1.2fr_1.1fr] lg:items-center">
          {/* 1. Recommended Block Window */}
          <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Recommended Block Window
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Clock3 className="size-4 text-primary shrink-0" />
                <span>{timeFormatted}</span>
              </div>

              <div className="flex items-center gap-2 font-medium text-foreground/80">
                <CalendarDays className="size-3.5 text-muted-foreground shrink-0" />
                <span>{dateFormatted}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                <span className="truncate text-[11px]">{corridorName}</span>
              </div>
            </div>
          </div>

          {/* 2. Score & Fit */}
          <div className="rounded-lg bg-emerald-500/10 dark:bg-emerald-950/25 p-3 border border-emerald-500/20 flex flex-col justify-between h-full min-h-[110px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  Optimization Score
                </span>
                <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight">
                  {score}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <Progress value={score} className="h-2 bg-emerald-200 dark:bg-emerald-900" />
              <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                Optimal Multi-Agent Fit
              </p>
            </div>
          </div>

          {/* 3. Core Metrics */}
          <div className="space-y-2 lg:border-l lg:border-r lg:px-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Operational Metrics
            </p>

            <div className="space-y-1.5">
              <ResultMetric label="Tasks Scheduled" value={tasksScheduled} highlight={Number(tasksScheduled) > 0} />
              <ResultMetric label="Departments Coordinated" value={departments} />
              <ResultMetric label="Crew Utilization" value={crewUtilization} />
              <ResultMetric label="Train Conflicts" value={trainConflicts} highlight={trainConflicts === "0"} />
              <ResultMetric label="Safety Margin Violations" value={safetyConflicts} highlight={safetyConflicts === "0"} />
            </div>
          </div>

          {/* 4. Expected Impact */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Expected Impact
            </p>

            <div className="space-y-2">
              <ImpactItem
                icon={<Check className="size-3.5" />}
                text={blocksAvoidedText}
              />
              <ImpactItem
                icon={<Clock3 className="size-3.5" />}
                text={downtimeSavedText}
              />
              <ImpactItem
                icon={<Zap className="size-3.5" />}
                text={availabilityGainText}
              />
            </div>
          </div>

          {/* 5. Action Buttons */}
          <div className="flex flex-col gap-2 justify-center lg:border-l lg:pl-4">
            <Button
              size="default"
              className="h-9 w-full text-xs font-bold gap-1.5 shadow-xs"
              onClick={handleApprove}
              disabled={isApproved}
            >
              {isApproved ? (
                <>
                  <Check className="size-4" />
                  Request Queued
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Approve Possession Block
                </>
              )}
            </Button>

            <Link href="/digital-twin" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full text-xs font-medium gap-1.5"
              >
                <span>Simulate in Digital Twin</span>
                <ExternalLink className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
