"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  ExternalLink,
  Flame,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
  TrainFront,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WhatIfScenario } from "./types";

export interface ScenarioSimulatorCardProps {
  scenarios: WhatIfScenario[];
}

export function ScenarioSimulatorCard({ scenarios }: ScenarioSimulatorCardProps) {
  const [selectedScenarioId, setSelectedScenarioId] = React.useState<string>(
    scenarios[0]?.id || "SCEN-1"
  );

  const activeScenario = React.useMemo(() => {
    return scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  }, [scenarios, selectedScenarioId]);

  return (
    <Card className="flex flex-col h-full rounded-xl border shadow-none bg-card overflow-hidden">
      <CardHeader className="p-3.5 pb-2.5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-foreground">
              What-If Scenario Simulation
            </CardTitle>
          </div>

          <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
            CP-SAT Simulation Engine
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between p-4 space-y-4">
        {/* Scenario Selectors */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Select Operational Condition
          </p>

          <div className="space-y-1.5">
            {scenarios.map((scen) => {
              const isSelected = scen.id === selectedScenarioId;

              return (
                <div
                  key={scen.id}
                  onClick={() => setSelectedScenarioId(scen.id)}
                  className={cn(
                    "rounded-lg border p-2.5 transition-all cursor-pointer",
                    isSelected
                      ? "border-emerald-500/60 bg-emerald-500/[0.08] shadow-xs"
                      : "border-border/60 hover:bg-muted/40 hover:border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{scen.name}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] py-0 h-4 border-transparent font-semibold",
                        scen.score >= 90
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : scen.score >= 80
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          : "bg-destructive/15 text-destructive"
                      )}
                    >
                      {scen.score} / 100
                    </Badge>
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                    {scen.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Simulated Impact Box */}
        {activeScenario && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Simulated Outcome Metrics
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                Target: {activeScenario.corridor}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-card p-2 border">
                <span className="block text-[10px] text-muted-foreground">Downtime Saved</span>
                <span className="block text-xs font-bold text-emerald-600 mt-0.5">
                  {activeScenario.downtimeSaved}
                </span>
              </div>

              <div className="rounded-lg bg-card p-2 border">
                <span className="block text-[10px] text-muted-foreground">Availability Gain</span>
                <span className="block text-xs font-bold text-foreground mt-0.5">
                  {activeScenario.availabilityDelta}
                </span>
              </div>

              <div className="rounded-lg bg-card p-2 border">
                <span className="block text-[10px] text-muted-foreground">Train Conflicts</span>
                <span className={cn(
                  "block text-xs font-bold mt-0.5",
                  activeScenario.trainConflicts === 0 ? "text-emerald-600" : "text-destructive"
                )}>
                  {activeScenario.trainConflicts}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <Link href="/digital-twin">
          <Button className="h-9 w-full text-xs font-bold gap-1.5 shadow-xs">
            <span>Explore Scenario in Digital Twin</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
