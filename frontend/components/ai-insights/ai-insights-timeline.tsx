"use client";

import * as React from "react";
import { Activity, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimelineEventItem } from "./types";

export interface AIInsightsTimelineProps {
  events: TimelineEventItem[];
}

export function AIInsightsTimeline({ events }: AIInsightsTimelineProps) {
  return (
    <Card className="flex flex-col h-full rounded-xl border shadow-none bg-card overflow-hidden">
      <CardHeader className="p-3.5 pb-2.5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Multi-Agent Activity Log
            </CardTitle>
          </div>

          <Badge variant="outline" className="text-[10px] font-semibold">
            Live Event Stream
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="relative">
          {/* Vertical Timeline Guide */}
          <div className="absolute top-2 bottom-2 left-[7px] w-px bg-border/80" />

          <div className="space-y-4">
            {events.map((ev, idx) => {
              const dotColor =
                ev.type === "critical"
                  ? "bg-destructive ring-destructive/20"
                  : ev.type === "warning"
                  ? "bg-amber-500 ring-amber-500/20"
                  : ev.type === "success"
                  ? "bg-emerald-500 ring-emerald-500/20"
                  : "bg-sky-500 ring-sky-500/20";

              return (
                <div key={ev.id || idx} className="relative flex items-start gap-3 pl-0.5">
                  {/* Dot */}
                  <div className={cn("relative z-10 size-3.5 rounded-full ring-4 shrink-0 mt-0.5", dotColor)} />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-foreground">{ev.title}</span>
                        <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4 font-semibold">
                          {ev.agent}
                        </Badge>
                      </div>

                      <span className="text-[10px] text-muted-foreground shrink-0">{ev.time}</span>
                    </div>

                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {ev.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
