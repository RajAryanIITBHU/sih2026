"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { PlannerStatsBar } from "./planner-stats";
import { TaskListPanel } from "./task-list-panel";
import { BlockSchedule } from "./block-schedule";
import { OptimizationResult } from "./optimization-result";
import { TrafficForecastChart } from "./traffic-forecast-chart";
import { AvailableBlocks } from "./available-blocks";
import { ResourceAvailability } from "./resource-availability";
import {
  mapDepartmentToRow,
  type AvailableBlockItemView,
  type OptimizationResultView,
  type PlannerStatsView,
  type PlannerTaskView,
  type RecommendedBlockView,
  type ResourceAvailabilityItemView,
  type ScheduleTaskView,
  type TrafficForecastDataView,
} from "./types";

export interface InteractivePlannerProps {
  initialTasks: PlannerTaskView[];
  initialScheduleTasks: ScheduleTaskView[];
  initialStats: PlannerStatsView;
  initialOptimizationResult: OptimizationResultView;
  recommendedBlock: RecommendedBlockView;
  corridorCode: string;
  availableBlocks?: AvailableBlockItemView[];
  resourceAvailability?: ResourceAvailabilityItemView[];
  trafficForecast?: TrafficForecastDataView;
}

/**
 * Dynamically allocate schedule task blocks on the timeline for a specific department row.
 * Selected tasks are placed within the active block possession window.
 */
function scheduleRowTasks(
  rowTasks: PlannerTaskView[],
  row: "engineering" | "electrical" | "snt",
  recStart: number,
  recEnd: number,
  conflictingTask?: PlannerTaskView
): ScheduleTaskView[] {
  const result: ScheduleTaskView[] = [];
  const blockDuration = Math.max(1, recEnd - recStart);

  if (rowTasks.length === 1) {
    const task = rowTasks[0];
    const taskHours = Math.max(1, Math.min(blockDuration, Math.round(task.durationMinutes / 60)));
    result.push({
      id: task.id,
      rawTaskId: task.rawTaskId,
      title: task.title,
      row,
      start: recStart,
      end: Math.min(22, recStart + taskHours),
      selected: true,
      conflicting: false,
      departmentName: task.department,
    });
  } else if (rowTasks.length > 1) {
    // Multiple selected tasks for this department: allocate sequentially within the possession block
    let currentStart = recStart;
    rowTasks.forEach((task, idx) => {
      const taskHours = Math.max(1, Math.round(task.durationMinutes / 60));
      const remainingTime = Math.max(1, recEnd - currentStart);
      const span =
        idx === rowTasks.length - 1
          ? Math.max(1, remainingTime)
          : Math.max(1, Math.min(taskHours, Math.floor(blockDuration / rowTasks.length)));

      const taskEnd = Math.min(22, currentStart + span);
      result.push({
        id: task.id,
        rawTaskId: task.rawTaskId,
        title: task.title,
        row,
        start: currentStart,
        end: taskEnd,
        selected: true,
        conflicting: false,
        departmentName: task.department,
      });
      currentStart = taskEnd;
    });
  }

  // Position conflicting tasks (if not already selected) outside or overlapping train traffic slots
  if (conflictingTask && !rowTasks.some((t) => t.id === conflictingTask.id)) {
    const conflictStart = Math.min(20, Math.max(8, recEnd - 1));
    const conflictEnd = Math.min(22, conflictStart + 3);
    result.push({
      id: conflictingTask.id,
      rawTaskId: conflictingTask.rawTaskId,
      title: conflictingTask.title,
      row,
      start: conflictStart,
      end: conflictEnd,
      selected: false,
      conflicting: true,
      departmentName: conflictingTask.department,
    });
  }

  return result;
}

export function InteractivePlanner({
  initialTasks,
  initialScheduleTasks,
  initialStats,
  initialOptimizationResult,
  recommendedBlock,
  corridorCode,
  availableBlocks,
  resourceAvailability,
  trafficForecast,
}: InteractivePlannerProps) {
  const [tasks, setTasks] = React.useState<PlannerTaskView[]>(initialTasks);
  const [activeBlock, setActiveBlock] = React.useState<RecommendedBlockView>(recommendedBlock);

  // Synchronize when initialTasks or recommendedBlock changes (e.g. corridor selection change)
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  React.useEffect(() => {
    setActiveBlock(recommendedBlock);
  }, [recommendedBlock]);

  const handleTasksChange = (updatedTasks: PlannerTaskView[]) => {
    setTasks(updatedTasks);
  };

  const handleSelectBlockWindow = (block: AvailableBlockItemView) => {
    setActiveBlock((prev) => ({
      ...prev,
      startHour: block.startHour,
      endHour: block.endHour,
      timeRangeFormatted: block.time,
      durationFormatted: `${block.endHour - block.startHour} hours`,
    }));
  };

  // Derived selected tasks
  const selectedTasks = React.useMemo(() => {
    return tasks.filter((t) => t.selected);
  }, [tasks]);

  const selectedCount = selectedTasks.length;

  const selectedDepts = React.useMemo(() => {
    return new Set(selectedTasks.map((t) => t.department));
  }, [selectedTasks]);

  // Compute dynamic schedule tasks directly from current task selection & active block window
  const dynamicScheduleTasks = React.useMemo(() => {
    const recStart = activeBlock.startHour;
    const recEnd = activeBlock.endHour;

    const engSelected = tasks.filter(
      (t) => t.selected && mapDepartmentToRow(t.departmentCode) === "engineering"
    );
    const elecSelected = tasks.filter(
      (t) => t.selected && mapDepartmentToRow(t.departmentCode) === "electrical"
    );
    const sntSelected = tasks.filter(
      (t) => t.selected && mapDepartmentToRow(t.departmentCode) === "snt"
    );

    const conflictingEng = tasks.find(
      (t) => !t.selected && mapDepartmentToRow(t.departmentCode) === "engineering"
    );
    const conflictingElec = tasks.find(
      (t) => !t.selected && mapDepartmentToRow(t.departmentCode) === "electrical"
    );
    const conflictingSnt = tasks.find(
      (t) => !t.selected && mapDepartmentToRow(t.departmentCode) === "snt"
    );

    // If no tasks are selected at all, fall back to initial schedule so timeline is not completely blank
    if (selectedTasks.length === 0) {
      return initialScheduleTasks.map((st) => ({
        ...st,
        selected: false,
      }));
    }

    return [
      ...scheduleRowTasks(engSelected, "engineering", recStart, recEnd, conflictingEng),
      ...scheduleRowTasks(elecSelected, "electrical", recStart, recEnd, conflictingElec),
      ...scheduleRowTasks(sntSelected, "snt", recStart, recEnd, conflictingSnt),
    ];
  }, [tasks, activeBlock, selectedTasks.length, initialScheduleTasks]);

  // Dynamic statistics reflecting selected window and task count
  const dynamicStats = React.useMemo<PlannerStatsView>(() => {
    return {
      ...initialStats,
      selectedTasksCount: selectedCount,
      departmentsCount: selectedDepts.size,
      recommendedBlock: activeBlock.timeRangeFormatted,
    };
  }, [initialStats, selectedCount, selectedDepts.size, activeBlock.timeRangeFormatted]);

  // Dynamic optimization result
  const dynamicOptimizationResult = React.useMemo<OptimizationResultView>(() => {
    return {
      ...initialOptimizationResult,
      recommendedBlock: activeBlock,
      tasksScheduledCount: selectedCount,
      departmentsCount: selectedDepts.size,
    };
  }, [initialOptimizationResult, activeBlock, selectedCount, selectedDepts.size]);

  return (
    <TooltipProvider delay={150}>
      <div className="space-y-4">
        {/* Statistics Bar */}
        <PlannerStatsBar stats={dynamicStats} />

        {/* 2-Column AI Planner Grid: Increased width TaskListPanel (330px-360px) + Expansive BlockSchedule */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <TaskListPanel tasks={tasks} onTasksChange={handleTasksChange} />

          <BlockSchedule
            corridorCode={corridorCode}
            scheduleTasks={dynamicScheduleTasks}
            recommendedBlock={activeBlock}
          />
        </div>

        {/* AI Optimization Result in Landscape Row Layout below Maintenance Tasks and Block Schedule */}
        <OptimizationResult data={dynamicOptimizationResult} />

        {/* Bottom Corridor Telemetry & Resources Section */}
        {availableBlocks && resourceAvailability && trafficForecast && (
          <div className="space-y-2.5 pt-1">
            <DashboardSectionHeader
              title="Corridor Telemetry & Resource Availability"
              description="Real-time train traffic forecast, available possession block windows, and maintenance crew deployment readiness."
              titleSize="sm"
              spacing="compact"
            />

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.9fr_1.5fr]">
              <TrafficForecastChart
                data={trafficForecast}
                corridorCode={corridorCode}
                dateFormatted={trafficForecast.dateFormatted}
              />

              <AvailableBlocks
                blocks={availableBlocks}
                dateFormatted={trafficForecast.dateFormatted}
                activeBlockTime={activeBlock.timeRangeFormatted}
                onSelectBlock={handleSelectBlockWindow}
              />

              <ResourceAvailability
                resources={resourceAvailability}
                dateFormatted={trafficForecast.dateFormatted}
              />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
