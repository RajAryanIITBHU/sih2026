"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Clock3,
  Edit3,
  FileCheck2,
  FileText,
  IndianRupee,
  Layers,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MaintenanceBlock } from "./types";

export interface BlockDetailsPanelProps {
  block: MaintenanceBlock;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onModify: (block: MaintenanceBlock) => void;
}

export function BlockDetailsPanel({
  block,
  onClose,
  onApprove,
  onReject,
  onModify,
}: BlockDetailsPanelProps) {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <Card className="rounded-xl border shadow-md flex flex-col h-full overflow-hidden bg-card">
      {/* Header */}
      <CardHeader className="p-4 pb-3 border-b space-y-2 bg-muted/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {block.blockCode}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-semibold py-0 px-2 h-5 border-transparent",
                block.status === "Controller Approved" && "bg-emerald-500/15 text-emerald-600",
                block.status === "AI Suggested" && "bg-blue-500/15 text-blue-600",
                block.status === "Pending Review" && "bg-amber-500/15 text-amber-600",
                block.status === "Rejected" && "bg-rose-500/15 text-rose-600"
              )}
            >
              {block.status}
            </Badge>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Corridor & Time Window Banner */}
        <div className="flex items-start gap-2.5 pt-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              {block.corridorName} ({block.corridorId})
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium mt-0.5">
              <span>{block.date}</span>
              <span>·</span>
              <span className="font-mono text-primary font-semibold">{block.startTime} – {block.endTime}</span>
              <span>({block.durationHours} hrs)</span>
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Tabs Switcher */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-2 border-b">
          <TabsList className="w-full grid grid-cols-4 h-8 bg-muted/60 p-0.5 text-xs">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs">
              Tasks ({block.tasksCount})
            </TabsTrigger>
            <TabsTrigger value="traffic" className="text-xs">
              Traffic
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">
              Crew
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4 mt-0 focus-visible:outline-none">
            {/* AI Optimization Score Card */}
            <div className="rounded-xl border bg-gradient-to-br from-card to-emerald-500/[0.04] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                  <Sparkles className="size-3.5 text-emerald-600" />
                  <span>AI Optimization & Feasibility</span>
                </div>
                <span className="text-sm font-bold text-emerald-600 font-mono">
                  {block.aiScore} / 100
                </span>
              </div>
              <Progress
                value={block.aiScore}
                className="h-2 bg-muted [&>div]:bg-emerald-500"
              />
              <p className="text-[11px] text-muted-foreground">
                Synthesized across TMS track defects, SMMS point machines, and COA passenger train headway.
              </p>
            </div>

            {/* AI Recommendation Banner */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <ShieldCheck className="size-4" />
                <span>Recommendation: Approve for Execution</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Zero mainline passenger conflict detected during the {block.startTime}–{block.endTime} window.
                Three departmental teams (Track, OHE, S&T) operate concurrently under a unified safety possession.
              </p>
            </div>

            {/* Telemetry Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border bg-muted/20 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <FileText className="size-3 text-primary" />
                  Bundled Tasks
                </span>
                <p className="font-bold text-sm text-foreground">{block.tasksCount} Tasks</p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <TrainFront className="size-3 text-emerald-600" />
                  Train Conflicts
                </span>
                <p className="font-bold text-sm text-emerald-600">
                  {block.trainsRegulated === 0 ? "0 Conflicts" : `${block.trainsRegulated} Regulated`}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <Users className="size-3 text-sky-600" />
                  Gang Personnel
                </span>
                <p className="font-bold text-sm text-foreground">{block.crewMembers} Staff</p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-600" />
                  Safety Verification
                </span>
                <p className="font-bold text-sm text-foreground">Fully Verified</p>
              </div>
            </div>

            {/* Expected Impact Summary Cards */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-foreground">Projected Block Impact</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-2.5 text-center bg-card">
                  <span className="text-[11px] text-muted-foreground block">Downtime Saved</span>
                  <span className="text-sm font-bold text-emerald-600">
                    +{block.downtimeSavedHours}h
                  </span>
                </div>

                <div className="rounded-lg border p-2.5 text-center bg-card">
                  <span className="text-[11px] text-muted-foreground block">Availability</span>
                  <span className="text-sm font-bold text-primary">
                    +{block.availabilityGainPercent}%
                  </span>
                </div>

                <div className="rounded-lg border p-2.5 text-center bg-card">
                  <span className="text-[11px] text-muted-foreground block">Cost Savings</span>
                  <span className="text-sm font-bold text-foreground">
                    ₹{block.costSavingsLakhs}L
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 2. TASKS TAB */}
          <TabsContent value="tasks" className="space-y-3 mt-0 focus-visible:outline-none">
            <p className="text-xs text-muted-foreground">
              {block.tasks.length} maintenance tasks bundled into this corridor possession:
            </p>

            <div className="space-y-2">
              {block.tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border p-2.5 space-y-1.5 bg-card hover:border-border transition-colors"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] py-0 h-4 border-transparent font-medium",
                          task.department === "Engineering" && "bg-emerald-500/10 text-emerald-600",
                          task.department === "OHE" && "bg-sky-500/10 text-sky-600",
                          task.department === "S&T" && "bg-violet-500/10 text-violet-600"
                        )}
                      >
                        {task.department}
                      </Badge>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {task.id}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] py-0 h-4 border-transparent font-bold",
                        task.priority === "Critical" && "bg-destructive/15 text-destructive",
                        task.priority === "High" && "bg-amber-500/15 text-amber-600",
                        task.priority === "Medium" && "bg-primary/15 text-primary"
                      )}
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  <p className="font-medium text-xs text-foreground leading-snug">
                    {task.title}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>{task.sectionKm}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="size-3" />
                      {task.durationMinutes} mins
                    </span>
                  </div>

                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Wrench className="size-3 text-muted-foreground" />
                    <span>Tool/Rig: {task.equipment} ({task.crewRequired} crew)</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 3. TRAFFIC & TIMETABLE TAB */}
          <TabsContent value="traffic" className="space-y-3 mt-0 focus-visible:outline-none">
            <div className="rounded-lg border bg-muted/20 p-2.5 space-y-1">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <TrainFront className="size-3.5 text-primary" />
                COA Train Timetable Validation
              </span>
              <p className="text-xs text-muted-foreground">
                Corridor availability window cross-referenced with live Control Office Application schedules.
              </p>
            </div>

            <div className="space-y-2">
              {block.affectedTrains.map((train) => (
                <div
                  key={train.trainNo}
                  className="rounded-lg border p-2.5 space-y-1 bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-foreground font-mono">
                        {train.trainNo}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {train.trainName}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] py-0 h-4 border-transparent font-medium",
                        train.impactType === "None" && "bg-emerald-500/10 text-emerald-600",
                        train.impactType === "Regulated" && "bg-amber-500/10 text-amber-600"
                      )}
                    >
                      {train.impactType === "None" ? "Zero Delay" : `Regulated ${train.delayMinutes}m`}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Type: {train.trainType}</span>
                    <span>Scheduled Pass: {train.scheduledTime}</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground italic pt-1 border-t border-border/40">
                    {train.notes}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 4. RESOURCES & CREW TAB */}
          <TabsContent value="resources" className="space-y-3 mt-0 focus-visible:outline-none">
            <div className="space-y-2">
              <div className="rounded-lg border p-3 space-y-1.5 bg-card">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" />
                  Assigned Maintenance Units
                </span>
                <p className="text-xs text-foreground font-medium">
                  {block.assignedCrew}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Total crew strength: {block.crewMembers} technicians, linemen, and permanent-way staff.
                </p>
              </div>

              <div className="rounded-lg border p-3 space-y-1.5 bg-card">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Wrench className="size-3.5 text-primary" />
                  Heavy Track & OHE Machines
                </span>
                <ul className="space-y-1">
                  {block.assignedMachines.map((machine) => (
                    <li key={machine} className="text-xs text-foreground flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span>{machine}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border p-3 space-y-1.5 bg-card">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  Safety Protocols & Power Disconnection
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Electrical Power Block (OHE) permit to work (PTW) synchronized with traction power controller (TPC).
                  Engineering speed restriction tags will auto-clear upon block cancellation notice.
                </p>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      {/* Action Footer */}
      <div className="p-3 border-t bg-muted/15 flex items-center gap-2">
        {block.status !== "Rejected" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReject(block.id)}
            className="flex-1 h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <X className="size-3.5 mr-1" />
            <span>Reject</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onModify(block)}
          className="flex-1 h-8 text-xs"
        >
          <Edit3 className="size-3.5 mr-1" />
          <span>Modify</span>
        </Button>

        {block.status !== "Controller Approved" && (
          <Button
            type="button"
            size="sm"
            onClick={() => onApprove(block.id)}
            className="flex-1 h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
          >
            <Check className="size-3.5" />
            <span>Authorize</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
