"use client";

import * as React from "react";
import { TrainFront } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RecommendedBlockView, ScheduleTaskView } from "./types";

export const scheduleHours = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

export function ScheduleHeader() {
  return (
    <div className="relative ml-[100px] flex h-8 border-b">
      {scheduleHours.map((hour) => (
        <div
          key={hour}
          className="flex-1 text-center text-[8px] text-muted-foreground"
        >
          {hour}
        </div>
      ))}
    </div>
  );
}

export function TrafficRow({
  title,
  subtitle,
  type,
}: {
  title: string;
  subtitle: string;
  type: "passenger" | "goods";
}) {
  return (
    <div className="flex h-8 items-center">
      <div className="w-[100px] shrink-0 pr-2">
        <p className="text-[9px] font-semibold">{title}</p>
        <p className="text-[7px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="relative flex h-full flex-1 items-center">
        {scheduleHours.slice(0, 7).map((_, index) => (
          <div key={index} className="h-full flex-1 border-l border-muted/50" />
        ))}

        <div className="absolute inset-0 flex items-center justify-around px-3">
          {[0, 1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className={
                type === "passenger" ? "text-sky-600" : "text-emerald-600"
              }
            >
              {item % 2 === 0 ? (
                <TrainFront className="size-3" />
              ) : (
                <div className="size-2 rounded-sm bg-current" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScheduleTaskBlock({ task }: { task: ScheduleTaskView }) {
  /*
   * Timeline starts at 08:00 and ends at 22:00.
   * 14 total hours.
   */
  const clampedStart = Math.max(8, Math.min(21, task.start));
  const clampedEnd = Math.max(clampedStart + 1, Math.min(22, task.end));
  const left = ((clampedStart - 8) / 14) * 100;
  const width = ((clampedEnd - clampedStart) / 14) * 100;

  let classes =
    "absolute top-1/2 -translate-y-1/2 rounded-md px-2 py-1.5 text-[8px] shadow-sm";

  if (task.selected) {
    classes += " border border-orange-400/30 bg-orange-500 text-white";
  } else if (task.conflicting) {
    classes +=
      " border border-dashed border-muted-foreground/30 bg-muted/60 text-muted-foreground";
  }

  return (
    <div
      className={classes}
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
    >
      <p className="font-semibold">{task.id}</p>

      <p className="truncate">{task.title}</p>
    </div>
  );
}

export function ScheduleRow({
  department,
  subtitle,
  row,
  tasks = [],
}: {
  department: string;
  subtitle: string;
  row: ScheduleTaskView["row"];
  tasks?: ScheduleTaskView[];
}) {
  const rowTasks = tasks.filter((task) => task.row === row);

  return (
    <div className="flex h-[56px] border-b">
      <div className="flex w-[100px] shrink-0 flex-col justify-center border-r pr-2">
        <p className="text-[9px] font-semibold">{department}</p>
        <p className="text-[7px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="relative flex-1">
        {scheduleHours.slice(0, 7).map((_, index) => (
          <div
            key={index}
            className="absolute bottom-0 top-0 border-l border-muted/50"
            style={{
              left: `${(index / 7) * 100}%`,
            }}
          />
        ))}

        {rowTasks.map((task, index) => (
          <ScheduleTaskBlock
            key={`${task.rawTaskId || task.id}-${task.row}-${task.start}-${index}`}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}

export function RecommendedBlock({
  recommendedBlock,
}: {
  recommendedBlock?: RecommendedBlockView;
}) {
  const startHour = recommendedBlock?.startHour ?? 14;
  const endHour = recommendedBlock?.endHour ?? 18;
  const timeRange = recommendedBlock?.timeRangeFormatted ?? "14:00 – 18:00";

  const left = ((startHour - 8) / 14) * 100;
  const width = ((endHour - startHour) / 14) * 100;

  return (
    <div className="relative ml-[100px] h-12">
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded-md border border-emerald-500 bg-emerald-500/10 px-3 py-1.5 text-center"
        style={{
          left: `${left}%`,
          width: `${width}%`,
        }}
      >
        <p className="text-[8px] font-semibold text-emerald-700">
          AI Recommended Block
        </p>

        <p className="text-[7px] text-emerald-700">{timeRange}</p>
      </div>
    </div>
  );
}

export interface BlockScheduleProps {
  corridorCode?: string;
  scheduleTasks?: ScheduleTaskView[];
  recommendedBlock?: RecommendedBlockView;
}

export function BlockSchedule({
  corridorCode = "C-01",
  scheduleTasks = [],
  recommendedBlock,
}: BlockScheduleProps) {
  return (
    <Card className="min-h-[480px] rounded-xl border shadow-none">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs">
            Block Schedule – {corridorCode}
          </CardTitle>

          <div className="flex items-center gap-3 text-[8px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-sky-500" />
              Passenger Train
            </span>

            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              Goods Train
            </span>

            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-emerald-400" />
              Maintenance Block
            </span>

            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-orange-500" />
              Selected Task
            </span>

            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-destructive" />
              Conflicting
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        <ScheduleHeader />

        <TrafficRow
          title="Train Traffic"
          subtitle="Passenger Trains"
          type="passenger"
        />

        <TrafficRow title="" subtitle="Goods Trains" type="goods" />

        <Separator className="my-1" />

        <ScheduleRow
          department="Engineering"
          subtitle="Track & Civil"
          row="engineering"
          tasks={scheduleTasks}
        />

        <ScheduleRow
          department="Electrical"
          subtitle="OHE & Power"
          row="electrical"
          tasks={scheduleTasks}
        />

        <ScheduleRow
          department="S&T"
          subtitle="Signaling & Telecom"
          row="snt"
          tasks={scheduleTasks}
        />

        <RecommendedBlock recommendedBlock={recommendedBlock} />
      </CardContent>
    </Card>
  );
}
