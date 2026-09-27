"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-[9px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
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
    <div className="flex items-center gap-2 text-[9px]">
      <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        {icon}
      </div>

      <span>{text}</span>
    </div>
  );
}

export interface OptimizationResultProps {
  data?: OptimizationResultView;
}

export function OptimizationResult({ data }: OptimizationResultProps) {
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
  const downtimeSavedText = `${data?.downtimeHoursSaved ?? 6} hours total downtime saved`;
  const availabilityGainText = `+${data?.availabilityGainPercent ?? 7}% asset availability`;

  return (
    <Card className="rounded-xl border shadow-none">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xs">AI Optimization Result</CardTitle>
          </div>

          <Badge className="bg-emerald-600 text-[8px] hover:bg-emerald-600">
            Optimal Plan
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-3 pt-1">
        <div>
          <p className="text-[9px] font-semibold">Recommended Block</p>

          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-[9px]">
              <CalendarDays className="size-3 text-muted-foreground" />
              <span>{dateFormatted}</span>
            </div>

            <div className="flex items-center gap-2 text-[9px]">
              <Clock3 className="size-3 text-muted-foreground" />
              <span>{timeFormatted}</span>
            </div>

            <div className="flex items-center gap-2 text-[9px]">
              <MapPin className="size-3 text-muted-foreground" />
              <span>{corridorName}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <ResultMetric label="Tasks Scheduled" value={tasksScheduled} />
          <ResultMetric label="Departments" value={departments} />
          <ResultMetric label="Crew Utilization" value={crewUtilization} />
          <ResultMetric label="Train Conflicts" value={trainConflicts} />
          <ResultMetric label="Safety Conflicts" value={safetyConflicts} />
        </div>

        <div className="rounded-lg bg-emerald-500/10 p-3">
          <p className="text-[9px] font-medium text-muted-foreground">
            Optimization Score
          </p>

          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-600" />

              <span className="text-lg font-bold text-emerald-700">{score}</span>

              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>

          <Progress value={score} className="mt-2 h-1.5" />
        </div>

        <div>
          <p className="mb-2 text-[9px] font-semibold">Expected Impact</p>

          <div className="space-y-2">
            <ImpactItem
              icon={<Check className="size-3" />}
              text={blocksAvoidedText}
            />

            <ImpactItem
              icon={<Clock3 className="size-3" />}
              text={downtimeSavedText}
            />

            <ImpactItem
              icon={<Zap className="size-3" />}
              text={availabilityGainText}
            />
          </div>
        </div>

        <Button
          className="h-8 w-full text-[9px]"
          render={<Link href="/digital-twin" />}
        >
          Review in Digital Twin
          <ArrowRight className="ml-1 size-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
