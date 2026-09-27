"use client";

import * as React from "react";
import { TrainFront } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <div className="relative ml-[115px] flex h-8 border-b items-center">
      {scheduleHours.map((hour) => (
        <div
          key={hour}
          className="flex-1 text-center text-xs font-semibold text-muted-foreground tracking-tight"
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
    <div className="flex h-9 items-center">
      <div className="w-[115px] shrink-0 pr-2.5">
        <p className="text-xs font-bold leading-tight text-foreground">{title}</p>
        <p className="text-[10px] text-muted-foreground leading-tight">{subtitle}</p>
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
                <TrainFront className="size-3.5" />
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

  const startFormatted = `${String(clampedStart).padStart(2, "0")}:00`;
  const endFormatted = `${String(clampedEnd).padStart(2, "0")}:00`;
  const durationHrs = clampedEnd - clampedStart;

  let classes =
    "absolute top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1.5 shadow-sm cursor-default transition-opacity hover:opacity-90";

  if (task.selected) {
    classes += " border border-orange-400/40 bg-orange-500 text-white shadow-xs";
  } else if (task.conflicting) {
    classes +=
      " border border-dashed border-destructive/50 bg-destructive/10 text-destructive";
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div
            role="button"
            tabIndex={0}
            className={classes}
            style={{
              left: `${left}%`,
              width: `${width}%`,
            }}
          >
            <p className="text-[11px] font-bold leading-tight">{task.id}</p>
            <p className="truncate text-[10px] font-medium leading-tight opacity-95">{task.title}</p>
          </div>
        }
      />
      <TooltipContent side="top" className="max-w-[220px] text-xs">
        <p className="font-semibold text-xs">{task.id}: {task.title}</p>
        <p className="text-[11px] opacity-80 mt-0.5">
          {startFormatted} – {endFormatted} ({durationHrs}h)
          {task.departmentName && ` · ${task.departmentName}`}
        </p>
        {task.conflicting && (
          <p className="text-[11px] text-amber-300 font-medium mt-1">
            ⚠ Conflicting with scheduled train traffic slot
          </p>
        )}
      </TooltipContent>
    </Tooltip>
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
    <div className="flex h-[60px] border-b">
      <div className="flex w-[115px] shrink-0 flex-col justify-center border-r pr-2.5">
        <p className="text-xs font-bold leading-tight text-foreground">{department}</p>
        <p className="text-[10px] text-muted-foreground leading-tight">{subtitle}</p>
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
    <div className="relative ml-[115px] h-12">
      <Tooltip>
        <TooltipTrigger
          render={
            <div
              role="button"
              tabIndex={0}
              className="absolute top-1/2 -translate-y-1/2 rounded-md border-2 border-emerald-500 bg-emerald-500/15 px-3 py-1.5 text-center cursor-default transition-colors hover:bg-emerald-500/20 shadow-xs whitespace-nowrap flex items-center justify-center gap-1.5"
              style={{
                left: `${left}%`,
                width: `max(${width}%, 220px)`,
              }}
            >
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 leading-tight">
                AI Recommended Block:
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 leading-tight">
                {timeRange}
              </span>
            </div>
          }
        />
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-semibold text-xs">AI-Optimized Possession Window</p>
          <p className="text-[11px] opacity-80 mt-0.5">
            {timeRange} · Zero passenger disruption · All crews synchronized
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             LEGEND ITEM                                    */
/* -------------------------------------------------------------------------- */

function LegendItem({
  color,
  shape = "circle",
  label,
}: {
  color: string;
  shape?: "circle" | "square";
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <span
        className={`size-2.5 ${color} ${
          shape === "circle" ? "rounded-full" : "rounded-sm"
        }`}
      />
      {label}
    </span>
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
    <Card className="min-h-[490px] rounded-xl border shadow-none bg-card">
      <CardHeader className="p-3.5 pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm sm:text-base font-bold tracking-tight text-foreground">
            Block Schedule – {corridorCode}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-3">
            <LegendItem color="bg-sky-500" label="Passenger Train" />
            <LegendItem color="bg-emerald-500" label="Goods Train" />
            <LegendItem color="bg-emerald-500" shape="square" label="Maintenance Block" />
            <LegendItem color="bg-orange-500" shape="square" label="Selected Task" />
            <LegendItem color="bg-destructive" shape="square" label="Conflicting" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 pt-2">
        <ScheduleHeader />

        <TrafficRow
          title="Train Traffic"
          subtitle="Passenger Trains"
          type="passenger"
        />

        <TrafficRow title="" subtitle="Goods Trains" type="goods" />

        <Separator className="my-1.5" />

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
