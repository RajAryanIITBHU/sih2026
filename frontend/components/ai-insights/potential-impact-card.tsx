"use client";

import * as React from "react";
import { Clock3, IndianRupee, ShieldCheck, TrainFront, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PotentialImpactStat } from "./types";

export interface PotentialImpactCardProps {
  stats: PotentialImpactStat[];
}

export function PotentialImpactCard({ stats }: PotentialImpactCardProps) {
  const getIcon = (type: PotentialImpactStat["iconName"]) => {
    switch (type) {
      case "clock":
        return <Clock3 className="size-4 text-sky-600" />;
      case "train":
        return <TrainFront className="size-4 text-emerald-600" />;
      case "shield":
        return <ShieldCheck className="size-4 text-emerald-600" />;
      case "currency":
        return <IndianRupee className="size-4 text-amber-600" />;
    }
  };

  const getIconBg = (type: PotentialImpactStat["iconName"]) => {
    switch (type) {
      case "clock":
        return "bg-sky-500/10";
      case "train":
        return "bg-emerald-500/10";
      case "shield":
        return "bg-emerald-500/10";
      case "currency":
        return "bg-amber-500/10";
    }
  };

  return (
    <Card className="flex flex-col h-full rounded-xl border shadow-none bg-card overflow-hidden">
      <CardHeader className="p-3.5 pb-2.5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-foreground">
              Cumulative System Impact
            </CardTitle>
          </div>

          <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
            Validated Gains
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 grid grid-cols-2 gap-3 items-center">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between rounded-xl border p-3 h-full bg-muted/15 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${getIconBg(
                  stat.iconName
                )}`}
              >
                {getIcon(stat.iconName)}
              </div>

              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                ↑ {stat.change}
              </span>
            </div>

            <div>
              <p className="text-base font-extrabold text-foreground leading-tight tracking-tight">
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
