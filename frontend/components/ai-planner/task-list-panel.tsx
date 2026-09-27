"use client";

import * as React from "react";
import { Check, Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mapDepartmentToRow, type PlannerTaskView, type TaskPriority } from "./types";

export const priorityClasses: Record<TaskPriority, string> = {
  Critical:
    "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/10",
  High: "border-transparent bg-orange-500/10 text-orange-600 hover:bg-orange-500/10",
  Medium:
    "border-transparent bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
  Low: "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${priorityClasses[priority]}`}
    >
      {priority}
    </Badge>
  );
}

export interface TaskListItemProps {
  task: PlannerTaskView;
  onToggleSelect?: (taskId: string) => void;
}

export function TaskListItem({ task, onToggleSelect }: TaskListItemProps) {
  return (
    <div
      onClick={() => onToggleSelect?.(task.id)}
      className={cn(
        "group flex cursor-pointer items-start gap-2.5 rounded-lg border border-transparent p-2.5 transition-all hover:bg-muted/60 hover:border-border/50",
        task.selected && "bg-primary/[0.04] border-primary/20"
      )}
    >
      <Checkbox
        checked={task.selected}
        onCheckedChange={() => onToggleSelect?.(task.id)}
        onClick={(e) => e.stopPropagation()}
        className="mt-0.5 size-4"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <p className="text-xs font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {task.id}
          </p>

          <PriorityBadge priority={task.priority} />
        </div>

        <p className="mt-1 text-xs font-medium leading-snug text-foreground/90 line-clamp-2">
          {task.title}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="font-semibold text-foreground/80">{task.department}</span>
          <span>•</span>
          <span>{task.duration}</span>
        </div>
      </div>
    </div>
  );
}

export interface TaskListPanelProps {
  tasks?: PlannerTaskView[];
  onTasksChange?: (tasks: PlannerTaskView[]) => void;
}

export function TaskListPanel({
  tasks = [],
  onTasksChange,
}: TaskListPanelProps) {
  const [selectedOverrides, setSelectedOverrides] = React.useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

  React.useEffect(() => {
    setSelectedOverrides({});
  }, [tasks]);

  const handleToggleSelect = (taskId: string) => {
    const isCurrentlySelected =
      selectedOverrides[taskId] !== undefined
        ? selectedOverrides[taskId]
        : (tasks.find((t) => t.id === taskId)?.selected ?? false);

    const nextSelected = !isCurrentlySelected;
    setSelectedOverrides((prev) => ({ ...prev, [taskId]: nextSelected }));

    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, selected: nextSelected } : t
    );
    onTasksChange?.(updated);
  };

  const taskList = React.useMemo(() => {
    return tasks.map((t) => ({
      ...t,
      selected:
        selectedOverrides[t.id] !== undefined
          ? selectedOverrides[t.id]
          : t.selected,
    }));
  }, [tasks, selectedOverrides]);

  const filteredTasks = React.useMemo(() => {
    return taskList.filter((task) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          task.id.toLowerCase().includes(q) ||
          task.title.toLowerCase().includes(q) ||
          task.department.toLowerCase().includes(q) ||
          task.priority.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (departmentFilter !== "all") {
        const row = mapDepartmentToRow(task.departmentCode);
        if (row !== departmentFilter && !task.department.toLowerCase().includes(departmentFilter.toLowerCase())) {
          return false;
        }
      }
      if (priorityFilter !== "all") {
        if (task.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [taskList, searchQuery, departmentFilter, priorityFilter]);

  const selectedCount = taskList.filter((t) => t.selected).length;

  const handleBulkSelect = (selectValue: boolean) => {
    const visibleIds = new Set(filteredTasks.map((t) => t.id));
    const nextOverrides = { ...selectedOverrides };
    visibleIds.forEach((id) => {
      nextOverrides[id] = selectValue;
    });
    setSelectedOverrides(nextOverrides);

    const updated = tasks.map((t) =>
      visibleIds.has(t.id) ? { ...t, selected: selectValue } : t
    );
    onTasksChange?.(updated);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    departmentFilter !== "all" ||
    priorityFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("all");
    setPriorityFilter("all");
  };

  const departmentTabs = [
    { id: "all", label: "All Tasks" },
    { id: "engineering", label: "Track" },
    { id: "electrical", label: "OHE" },
    { id: "snt", label: "S&T" },
  ];

  return (
    <Card className="flex h-[490px] max-h-[490px] flex-col rounded-xl border shadow-none overflow-hidden bg-card">
      <CardHeader className="shrink-0 space-y-2.5 p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold tracking-tight">Maintenance Tasks</CardTitle>

            <Badge
              variant="outline"
              className={cn(
                "border-transparent text-[9px] font-semibold px-2 py-0.5",
                selectedCount > 0
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {selectedCount} selected
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-[9px] font-semibold text-emerald-600 hover:text-emerald-700"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            )}
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {departmentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDepartmentFilter(tab.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
                departmentFilter === tab.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar with Filter Menu */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search tasks, defects, assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 pr-8 text-xs"
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1/2 size-6 -translate-y-1/2 rounded-md",
                    hasActiveFilters && "text-primary bg-primary/10"
                  )}
                  aria-label="Filter tasks"
                >
                  <Filter className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52 text-xs">
              <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Priority
              </DropdownMenuLabel>
              {["all", "Critical", "High", "Medium", "Low"].map((p) => (
                <DropdownMenuItem
                  key={p}
                  className="flex items-center justify-between text-xs cursor-pointer"
                  onClick={() => setPriorityFilter(p)}
                >
                  <span>{p === "all" ? "All Priorities" : p}</span>
                  {priorityFilter === p && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-xs cursor-pointer text-primary font-medium"
                onClick={() => handleBulkSelect(true)}
              >
                Select All Shown ({filteredTasks.length})
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer text-muted-foreground"
                onClick={() => handleBulkSelect(false)}
              >
                Deselect All Shown
              </DropdownMenuItem>

              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs cursor-pointer text-destructive font-medium"
                    onClick={handleResetFilters}
                  >
                    Clear All Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-y-auto px-2.5 pb-2">
        <div className="space-y-1.5">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TaskListItem
                key={task.rawTaskId || `${task.id}-${index}`}
                task={task}
                onToggleSelect={handleToggleSelect}
              />
            ))
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                No matching tasks found.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
