"use client";

import * as React from "react";
import { BrainCircuit, CheckCircle2, Gauge, HelpCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PriorityScoreFactor } from "./types";

export interface ExplainableAICardProps {
  factors?: PriorityScoreFactor[];
  totalScore?: number;
  priorityLevel?: string;
}

const defaultFactors: PriorityScoreFactor[] = [
  { label: "Failure Risk Probability", score: "28 / 30", percentage: 93, weight: "30%" },
  { label: "Asset Criticality Index", score: "18 / 20", percentage: 90, weight: "20%" },
  { label: "Overdue Maintenance Urgency", score: "14 / 15", percentage: 93, weight: "15%" },
  { label: "Network Availability Impact", score: "15 / 20", percentage: 75, weight: "20%" },
  { label: "Train Traffic Density Impact", score: "7 / 10", percentage: 70, weight: "10%" },
  { label: "Historical Breakdown Frequency", score: "8 / 10", percentage: 80, weight: "10%" },
];

const explanationChecklist = [
  "Critical rail wear defect detected on high-speed tangent section (TMS telemetry)",
  "Maintenance overdue by 2 days; risk degradation slope accelerating",
  "Zero passenger timetable conflict during 14:00 – 18:00 window (COA timetable)",
  "Freight forecast confirms Western DFC bypass available for diverted rakes",
  "Engineering, OHE, and S&T maintenance gangs verified ready at Tundla Depot",
  "Simultaneous multi-gang possession avoids 2 standalone future closures",
];

export function ExplainableAICard({
  factors = defaultFactors,
  totalScore = 88,
  priorityLevel = "High Priority",
}: ExplainableAICardProps) {
  return (
    <TooltipProvider delay={150}>
      <Card className="rounded-xl border shadow-none bg-card overflow-hidden">
        <CardHeader className="p-3.5 pb-2.5 border-b">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="size-4 text-primary" />
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  Explainable AI (XAI) Priority Scoring
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Mathematical feature attribution scoring for fixed-asset possession prioritization
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="gap-1 border-primary/30 bg-primary/10 text-primary text-xs font-semibold"
            >
              <Sparkles className="size-3" />
              Explainable Prioritization Formula
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1.1fr]">
            {/* Left Column: Factor Weight Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Scoring Attributes & Model Weights
                </span>
                <span className="text-xs text-muted-foreground">Normalized Score</span>
              </div>

              <div className="space-y-2.5">
                {factors.map((f, idx) => {
                  const barColor =
                    idx < 2
                      ? "bg-destructive"
                      : idx < 4
                      ? "bg-amber-500"
                      : "bg-emerald-500";

                  return (
                    <div key={f.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <span>{f.label}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ({f.weight})
                          </span>
                        </div>
                        <span className="font-bold font-mono text-foreground">{f.score}</span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor} transition-all duration-500`}
                          style={{ width: `${f.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Total Score Box & AI Reason Checklist */}
            <div className="space-y-3 lg:border-l lg:pl-6">
              {/* Score Highlight Box */}
              <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Composite Priority Score
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight text-foreground">
                      {totalScore}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">/ 100</span>
                  </div>
                  <Badge variant="outline" className="mt-1 border-destructive/40 bg-destructive/10 text-destructive text-[10px] font-bold">
                    {priorityLevel} • Top 12% of Assets
                  </Badge>
                </div>

                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Gauge className="size-7" />
                </div>
              </div>

              {/* Automated Checklist */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Algorithmic Attribution Summary
                </p>

                <div className="space-y-2">
                  {explanationChecklist.slice(0, 4).map((text, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/90">
                      <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
