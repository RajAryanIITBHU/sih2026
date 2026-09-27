"use client";

import * as React from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Sparkles,
  TrainFront,
  Wrench,
  Zap,
  Radio,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MaintenanceBlock } from "./types";
import { corridorMetadata, weekDates } from "./mock-data";

export interface WeeklyPlanMatrixProps {
  blocks: MaintenanceBlock[];
  selectedBlockId: number | null;
  onSelectBlock: (id: number) => void;
  corridorFilter?: string;
  deptFilter?: string;
}

export function WeeklyPlanMatrix({
  blocks,
  selectedBlockId,
  onSelectBlock,
  corridorFilter = "all",
  deptFilter = "all",
}: WeeklyPlanMatrixProps) {
  const filteredCorridors = React.useMemo(() => {
    if (corridorFilter === "all") return corridorMetadata;
    return corridorMetadata.filter((c) => c.id === corridorFilter);
  }, [corridorFilter]);

  const getDepartmentColor = (depts: string[]) => {
    if (depts.length > 1) return "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/70";
    if (depts.includes("Engineering")) return "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/70";
    if (depts.includes("OHE")) return "border-sky-500/40 bg-sky-500/5 hover:border-sky-500/70";
    if (depts.includes("S&T")) return "border-violet-500/40 bg-violet-500/5 hover:border-violet-500/70";
    return "border-border bg-card";
  };

  const totalHours = blocks.reduce((acc, curr) => acc + curr.durationHours, 0);

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <CardTitle className="text-sm font-semibold">
            Weekly Corridor Block Allocation
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-mono">
            {blocks.length} Blocks · {totalHours}h Possession
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Click any block card to review task bundles & train clearances</span>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[840px]">
          {/* Days of Week Header */}
          <div className="grid grid-cols-[160px_repeat(7,1fr)] border-b bg-muted/30">
            <div className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Corridor
            </div>
            {weekDates.map((d) => (
              <div
                key={d.shortDate}
                className="border-l p-2.5 text-center flex flex-col items-center justify-center"
              >
                <span className="text-xs font-bold text-foreground">{d.shortDate}</span>
                <span className="text-[11px] font-medium text-muted-foreground uppercase">{d.day}</span>
              </div>
            ))}
          </div>

          {/* Matrix Rows per Corridor */}
          <div className="divide-y divide-border/60">
            {filteredCorridors.map((corridor) => {
              const corridorBlocks = blocks.filter(
                (b) => b.corridorId === corridor.id
              );

              return (
                <div
                  key={corridor.id}
                  className="grid grid-cols-[160px_repeat(7,1fr)] min-h-[96px] transition-colors hover:bg-muted/10"
                >
                  {/* Corridor Meta Column */}
                  <div className="p-3 flex flex-col justify-center bg-muted/15 border-r border-border/60">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-primary">{corridor.id}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">({corridor.maxSpeed} km/h)</span>
                    </div>
                    <p className="text-xs font-medium text-foreground mt-0.5 line-clamp-1">
                      {corridor.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                      {corridor.trackType}
                    </p>
                  </div>

                  {/* 7 Days Columns */}
                  {weekDates.map((day) => {
                    const block = corridorBlocks.find(
                      (b) => b.shortDate === day.shortDate
                    );

                    // If deptFilter is active, check match
                    const matchesDept =
                      !block ||
                      deptFilter === "all" ||
                      block.departments.includes(deptFilter as any);

                    const isSelected = block && selectedBlockId === block.id;

                    return (
                      <div
                        key={day.shortDate}
                        className="relative border-l border-border/60 p-1.5 flex flex-col justify-center bg-background/50 hover:bg-muted/30 transition-colors min-h-[96px]"
                      >
                        {block && matchesDept ? (
                          <TooltipProvider key={block.id}>
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <button
                                    type="button"
                                    onClick={() => onSelectBlock(block.id)}
                                    className={cn(
                                      "w-full h-full flex flex-col justify-between text-left rounded-lg p-2 border transition-all text-xs cursor-pointer shadow-xs",
                                      getDepartmentColor(block.departments),
                                      isSelected
                                        ? "ring-2 ring-primary border-primary shadow-sm bg-primary/10"
                                        : ""
                                    )}
                                  >
                                    {/* Top: Time & AI Score */}
                                    <div className="flex items-center justify-between gap-1 w-full">
                                      <span className="font-bold text-[11px] text-foreground flex items-center gap-1">
                                        <Clock className="size-3 text-muted-foreground" />
                                        {block.startTime}–{block.endTime}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "px-1 py-0 text-[10px] h-4 font-mono font-semibold border-transparent",
                                          block.aiScore >= 90
                                            ? "bg-emerald-500/15 text-emerald-600"
                                            : "bg-primary/15 text-primary"
                                        )}
                                      >
                                        AI {block.aiScore}
                                      </Badge>
                                    </div>

                                    {/* Mid: Tasks count & Dept indicators */}
                                    <div className="my-1 flex items-center justify-between gap-1">
                                      <span className="text-[11px] font-medium text-muted-foreground">
                                        {block.tasksCount} Tasks
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {block.departments.map((d) => (
                                          <span
                                            key={d}
                                            title={d}
                                            className={cn(
                                              "size-2 rounded-full",
                                              d === "Engineering" && "bg-emerald-500",
                                              d === "OHE" && "bg-sky-500",
                                              d === "S&T" && "bg-violet-500"
                                            )}
                                          />
                                        ))}
                                      </div>
                                    </div>

                                    {/* Bottom: Status & train conflict pill */}
                                    <div className="flex items-center justify-between gap-1 pt-0.5 border-t border-border/40">
                                      <span className="text-[10px] text-muted-foreground truncate">
                                        {block.trainsRegulated === 0 ? "0 conflict" : "1 regulated"}
                                      </span>
                                      {block.status === "Controller Approved" ? (
                                        <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                                      ) : (
                                        <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                                      )}
                                    </div>
                                  </button>
                                }
                              />
                              <TooltipContent side="top" className="text-xs p-2.5 max-w-xs space-y-1">
                                <div className="font-bold text-background flex items-center justify-between">
                                  <span>{block.blockCode}</span>
                                  <span>{block.durationHours}h Window</span>
                                </div>
                                <div className="text-muted text-[11px]">
                                  {block.corridorName} ({block.corridorId})
                                </div>
                                <div className="text-[11px]">
                                  Departments: {block.departments.join(", ")}
                                </div>
                                <div className="text-[11px]">
                                  COA Impact: {block.trainImpactSummary}
                                </div>
                                <div className="text-[10px] text-muted pt-1 border-t border-muted/30">
                                  Machines: {block.assignedMachines.join(", ")}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div className="h-full flex items-center justify-center text-center opacity-40 hover:opacity-80 transition-opacity">
                            <span className="text-[10px] text-muted-foreground/70 italic">
                              Free Window
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
