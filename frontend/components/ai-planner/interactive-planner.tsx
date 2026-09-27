"use client";

import * as React from "react";
import { PlannerStatsBar } from "./planner-stats";
import { TaskListPanel } from "./task-list-panel";
import { BlockSchedule } from "./block-schedule";
import { OptimizationResult } from "./optimization-result";
import {
  mapDepartmentToRow,
  type OptimizationResultView,
  type PlannerStatsView,
  type PlannerTaskView,
  type RecommendedBlockView,
  type ScheduleTaskView,
} from "./types";

export interface InteractivePlannerProps {
  initialTasks: PlannerTaskView[];
  initialScheduleTasks: ScheduleTaskView[];
  initialStats: PlannerStatsView;
  initialOptimizationResult: OptimizationResultView;
  recommendedBlock: RecommendedBlockView;
  corridorCode: string;
}

/**
 * Dynamically allocate schedule task blocks on the timeline for a specific department row.
 * Selected tasks are placed within the recommended block possession window as defined in SCHEMA.md.
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
}: InteractivePlannerProps) {
  const [tasks, setTasks] = React.useState<PlannerTaskView[]>(initialTasks);

  // Synchronize when initialTasks changes (e.g. corridor selection change)
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleTasksChange = (updatedTasks: PlannerTaskView[]) => {
    setTasks(updatedTasks);
  };

  // Derived selected tasks
  const selectedTasks = React.useMemo(() => {
    return tasks.filter((t) => t.selected);
  }, [tasks]);

  const selectedCount = selectedTasks.length;

  const selectedDepts = React.useMemo(() => {
    return new Set(selectedTasks.map((t) => t.department));
  }, [selectedTasks]);

  // Compute dynamic schedule tasks directly from current task selection
  const dynamicScheduleTasks = React.useMemo(() => {
    const recStart = recommendedBlock.startHour;
    const recEnd = recommendedBlock.endHour;

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
  }, [tasks, recommendedBlock, selectedTasks.length, initialScheduleTasks]);

  // Dynamic statistics
  const dynamicStats = React.useMemo<PlannerStatsView>(() => {
    return {
      ...initialStats,
      selectedTasksCount: selectedCount,
      departmentsCount: selectedDepts.size,
    };
  }, [initialStats, selectedCount, selectedDepts.size]);

  // Dynamic optimization result
  const dynamicOptimizationResult = React.useMemo<OptimizationResultView>(() => {
    return {
      ...initialOptimizationResult,
      tasksScheduledCount: selectedCount,
      departmentsCount: selectedDepts.size,
    };
  }, [initialOptimizationResult, selectedCount, selectedDepts.size]);

  return (
    <>
      {/* Statistics */}
      <PlannerStatsBar stats={dynamicStats} />

      {/* Main Planner */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[180px_minmax(0,1fr)_200px]">
        <TaskListPanel tasks={tasks} onTasksChange={handleTasksChange} />

        <BlockSchedule
          corridorCode={corridorCode}
          scheduleTasks={dynamicScheduleTasks}
          recommendedBlock={recommendedBlock}
        />

        <OptimizationResult data={dynamicOptimizationResult} />
      </div>
    </>
  );
}
