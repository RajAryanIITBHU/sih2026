"use client";

import * as React from "react";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  Settings2,
  Sparkles,
  StickyNote,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import type { MaintenanceTask } from "./types";

/* -------------------------------------------------------------------------- */
/*                              INFO ITEM                                     */
/* -------------------------------------------------------------------------- */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[10px] font-medium">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DETAIL CARD                                   */
/* -------------------------------------------------------------------------- */

function DetailCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="px-3 py-2.5">
        <CardTitle className="flex items-center gap-2 text-[10px] font-semibold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-3">{children}</CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                         ASSET INFORMATION                                  */
/* -------------------------------------------------------------------------- */

function AssetInformation({ task }: { task: MaintenanceTask }) {
  return (
    <DetailCard
      title="Asset Information"
      icon={<Settings2 className="size-3.5" />}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <InfoItem label="Asset Code" value={task.asset} />
        <InfoItem label="Asset Type" value={task.assetName} />
        <InfoItem label="Corridor" value="C-01 (Delhi - Agra)" />
        <InfoItem label="Track" value="Km 124.5 - 124.8" />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-3 h-7 w-full text-[10px]"
      >
        <MapPin className="mr-1.5 size-3" />
        View on Map
      </Button>
    </DetailCard>
  );
}

/* -------------------------------------------------------------------------- */
/*                         MAINTENANCE DETAILS                                */
/* -------------------------------------------------------------------------- */

function MaintenanceDetails({ task }: { task: MaintenanceTask }) {
  return (
    <DetailCard
      title="Maintenance Details"
      icon={<Wrench className="size-3.5" />}
    >
      <div className="space-y-3">
        <div>
          <p className="text-[9px] text-muted-foreground">
            Issue / Description
          </p>

          <p className="mt-0.5 text-[10px] font-medium">
            Rail wear detected on inner track.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="Department" value={task.department} />
          <InfoItem label="Estimated Duration" value="4 hours" />
          <InfoItem label="Priority" value={task.priority} />

          <div>
            <p className="text-[9px] text-muted-foreground">Due Date</p>

            <p
              className={`mt-0.5 text-[10px] font-medium ${
                task.dueDate === "Today" ? "text-destructive" : ""
              }`}
            >
              {task.dueDate === "Today"
                ? "Today (9 Sep 2025)"
                : task.dueDate}
            </p>
          </div>
        </div>
      </div>
    </DetailCard>
  );
}

/* -------------------------------------------------------------------------- */
/*                           AI ASSESSMENT                                    */
/* -------------------------------------------------------------------------- */

function AIAssessment({ task }: { task: MaintenanceTask }) {
  return (
    <DetailCard title="AI Assessment" icon={<Sparkles className="size-3.5" />}>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[9px]">
            <span className="text-muted-foreground">Failure Risk</span>
            <span className="font-semibold text-destructive">{task.risk}%</span>
          </div>

          <Progress value={task.risk} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            label="Asset Impact"
            value={task.risk >= 70 ? "High" : task.risk >= 40 ? "Medium" : "Low"}
          />
          <InfoItem label="Urgency" value={task.priority} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-muted-foreground">
              Priority Score
            </span>

            <span className="text-xs font-bold text-emerald-600">
              {Math.min(task.risk + 2, 100)} / 100
            </span>
          </div>

          <div className="mt-1 h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min(task.risk + 2, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </DetailCard>
  );
}

/* -------------------------------------------------------------------------- */
/*                         RECOMMENDED ACTION                                 */
/* -------------------------------------------------------------------------- */

function RecommendedAction() {
  return (
    <DetailCard
      title="Recommended Action"
      icon={<CheckCircle2 className="size-3.5" />}
    >
      <div className="rounded-md bg-muted/50 p-2.5">
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Schedule within the next available maintenance block. Can be combined
          with OHE and S&T tasks in C-01.
        </p>

        <Button size="sm" className="mt-2 h-7 w-full text-[10px]">
          <CalendarDays className="mr-1.5 size-3" />
          Find Suitable Block
        </Button>
      </div>
    </DetailCard>
  );
}

/* -------------------------------------------------------------------------- */
/*                           DETAIL ACTIONS                                   */
/* -------------------------------------------------------------------------- */

function DetailActions() {
  return (
    <div className="grid grid-cols-3 gap-2 border-t pt-3">
      <Button variant="outline" size="sm" className="h-8 text-[9px]">
        <FileText className="mr-1 size-3" />
        Create Work Order
      </Button>

      <Button variant="outline" size="sm" className="h-8 text-[9px]">
        <Users className="mr-1 size-3" />
        Assign Team
      </Button>

      <Button variant="outline" size="sm" className="h-8 text-[9px]">
        <StickyNote className="mr-1 size-3" />
        Add Note
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         TASK DETAIL PANEL                                  */
/* -------------------------------------------------------------------------- */

export function TaskDetailPanel({
  task,
  onClose,
}: {
  task: MaintenanceTask;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="flex items-start justify-between p-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">{task.id}</h2>

            <Badge
              variant="outline"
              className="border-transparent bg-destructive/10 text-[10px] text-destructive"
            >
              {task.priority}
            </Badge>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Rail replacement
          </p>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-3">
        <Tabs defaultValue={0}>
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value={0} className="text-[10px]">
              Overview
            </TabsTrigger>
            <TabsTrigger value={1} className="text-[10px]">
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value={2} className="text-[10px]">
              History
            </TabsTrigger>
            <TabsTrigger value={3} className="text-[10px]">
              Related Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value={0}>
            <div className="flex-1 space-y-3 overflow-y-auto py-3">
              <AssetInformation task={task} />
              <MaintenanceDetails task={task} />

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <AIAssessment task={task} />
                <RecommendedAction />
              </div>
            </div>
          </TabsContent>

          <TabsContent value={1}>
            <div className="py-6 text-center text-xs text-muted-foreground">
              AI analysis details will appear here.
            </div>
          </TabsContent>

          <TabsContent value={2}>
            <div className="py-6 text-center text-xs text-muted-foreground">
              Maintenance history will appear here.
            </div>
          </TabsContent>

          <TabsContent value={3}>
            <div className="py-6 text-center text-xs text-muted-foreground">
              Related tasks will appear here.
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto p-3">
        <DetailActions />
      </div>
    </div>
  );
}
