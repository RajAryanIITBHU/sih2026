"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock, Layers, MapPin } from "lucide-react";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DashboardSectionHeader } from "./dashboard-section-header";

const defaultMaintenanceBlocks = [
  {
    id: "1",
    date: "10 Sep",
    time: "11:00 – 15:00",
    block: "C-01",
    tasks: "3 tasks (Track + OHE + S&T)",
    status: "Confirmed",
  },
  {
    id: "2",
    date: "11 Sep",
    time: "09:00 – 12:00",
    block: "C-03",
    tasks: "2 tasks (Turnout + Axle Counter)",
    status: "Planned",
  },
  {
    id: "3",
    date: "12 Sep",
    time: "14:00 – 18:00",
    block: "C-02",
    tasks: "2 tasks (Catenary Sag + Tamping)",
    status: "Planned",
  },
  {
    id: "4",
    date: "14 Sep",
    time: "11:00 – 15:00",
    block: "C-01",
    tasks: "3 tasks (Combined Possession)",
    status: "AI Suggested",
  },
  {
    id: "5",
    date: "15 Sep",
    time: "10:00 – 13:00",
    block: "C-04",
    tasks: "1 task (Auto-Tension Pulley)",
    status: "Tentative",
  },
];

export interface UpcomingMaintenanceBlock {
  id: string;
  date: string;
  time: string;
  block: string;
  tasks: string;
  status: string;
}

export interface UpcomingMaintenanceProps {
  blocks?: UpcomingMaintenanceBlock[];
}

const statusBadgeVariants = cva("h-6 justify-center px-2 text-[11px] font-semibold border", {
  variants: {
    status: {
      Confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      Planned: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      "AI Suggested": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      Tentative: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      default: "bg-muted text-muted-foreground border-border",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

export function UpcomingMaintenance({ blocks }: UpcomingMaintenanceProps) {
  const displayBlocks = blocks && blocks.length > 0 ? blocks : defaultMaintenanceBlocks;
  const [selectedBlock, setSelectedBlock] = React.useState<UpcomingMaintenanceBlock | null>(null);

  return (
    <Card className="rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border">
      <CardHeader className="p-4 sm:p-5 pb-0">
        <DashboardSectionHeader
          title="Upcoming Maintenance Blocks"
          description="Coordinated corridor possession windows"
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold"
              render={<Link href="/block-planning/weekly" />}
            >
              <span>Weekly Plan</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          }
        />
      </CardHeader>

      <CardContent className="p-4 pt-1">
        <div className="divide-y divide-border/60">
          {displayBlocks.map((block) => (
            <div
              key={`${block.id || block.date}-${block.block}`}
              onClick={() => setSelectedBlock(block)}
              className="group flex items-center justify-between gap-3 py-2.5 px-2 -mx-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/50"
            >
              {/* Date badge */}
              <div className="flex flex-col items-center justify-center size-10 rounded-lg bg-muted/60 border border-border/60 shrink-0">
                <span className="text-[11px] font-bold text-foreground">
                  {block.date.split(" ")[0]}
                </span>
                <span className="text-[9px] font-semibold uppercase text-muted-foreground">
                  {block.date.split(" ")[1]}
                </span>
              </div>

              {/* Timing & Task description */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">{block.time}</p>
                  <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-medium border-border/70">
                    {block.block}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground mt-0.5">{block.tasks}</p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <StatusBadge status={block.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Block Details Popup Dialog */}
      <Dialog open={!!selectedBlock} onOpenChange={(open) => !open && setSelectedBlock(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-bold">Possession Block Details</DialogTitle>
              {selectedBlock && <StatusBadge status={selectedBlock.status} />}
            </div>
            <DialogDescription className="text-xs">
              Detailed multi-agent possession window allocation for corridor operations.
            </DialogDescription>
          </DialogHeader>

          {selectedBlock && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/40 p-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">Corridor</p>
                    <p className="font-semibold text-foreground">{selectedBlock.block}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">Scheduled Date</p>
                    <p className="font-semibold text-foreground">{selectedBlock.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">Window Duration</p>
                    <p className="font-semibold text-foreground">{selectedBlock.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">Bundled Tasks</p>
                    <p className="font-semibold text-foreground">{selectedBlock.tasks}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedBlock(null)}>
                  Close
                </Button>
                <Button size="sm" render={<Link href="/block-planning/ai-planner" />}>
                  View in AI Planner
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variantKey = (status in {
    Confirmed: true,
    Planned: true,
    "AI Suggested": true,
    Tentative: true,
  }
    ? status
    : "default") as "Confirmed" | "Planned" | "AI Suggested" | "Tentative" | "default";

  return (
    <Badge
      variant="outline"
      className={statusBadgeVariants({ status: variantKey })}
    >
      {status}
    </Badge>
  );
}
