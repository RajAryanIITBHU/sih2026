"use client";

import * as React from "react";
import {
  ArrowDownUp,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  FileText,
  FileUp,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  Wrench,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";

import { PriorityBadge, StatusBadge, RiskCell } from "./badges";
import {
  maintenanceTasks,
  DEPARTMENTS,
  PRIORITIES,
  STATUSES,
  ASSET_TYPES,
  CORRIDORS,
  DUE_DATE_FILTERS,
} from "./types";
import type { MaintenanceTask, Priority, MaintenanceStatus } from "./types";
import { TaskDetailPanel } from "./task-detail-panel";

/* -------------------------------------------------------------------------- */
/*                              FILTER STATE                                  */
/* -------------------------------------------------------------------------- */

type Filters = {
  search: string;
  department: string;
  priority: string;
  assetType: string;
  corridor: string;
  status: string;
  dueDate: string;
  overdueOnly: boolean;
};

const INITIAL_FILTERS: Filters = {
  search: "",
  department: "",
  priority: "",
  assetType: "",
  corridor: "",
  status: "",
  dueDate: "",
  overdueOnly: false,
};

/* -------------------------------------------------------------------------- */
/*                            SORT STATE                                      */
/* -------------------------------------------------------------------------- */

type SortField = "id" | "asset" | "dueDate" | "risk";
type SortDir = "asc" | "desc";

function compareTasks(
  a: MaintenanceTask,
  b: MaintenanceTask,
  field: SortField,
  dir: SortDir,
): number {
  let cmp = 0;

  switch (field) {
    case "id":
      cmp = a.id.localeCompare(b.id);
      break;
    case "asset":
      cmp = a.asset.localeCompare(b.asset);
      break;
    case "dueDate":
      cmp = a.dueDate.localeCompare(b.dueDate);
      break;
    case "risk":
      cmp = a.risk - b.risk;
      break;
  }

  return dir === "asc" ? cmp : -cmp;
}

/* -------------------------------------------------------------------------- */
/*                           FILTER LOGIC                                     */
/* -------------------------------------------------------------------------- */

function applyFilters(
  tasks: MaintenanceTask[],
  filters: Filters,
): MaintenanceTask[] {
  return tasks.filter((task) => {
    if (
      filters.search &&
      !task.id.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.asset.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.assetName.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    if (filters.department && task.department !== filters.department) {
      return false;
    }

    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    if (filters.status && task.status !== filters.status) {
      return false;
    }

    if (filters.overdueOnly && task.dueDate !== "Today") {
      return false;
    }

    return true;
  });
}

/* -------------------------------------------------------------------------- */
/*                          FILTER SELECT                                     */
/* -------------------------------------------------------------------------- */

function FilterSelect({
  placeholder,
  value,
  onValueChange,
  children,
}: {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Select
      value={value || null}
      onValueChange={(v) => onValueChange(v ?? "")}
    >
      <SelectTrigger className="h-9 w-[108px] text-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

/* -------------------------------------------------------------------------- */
/*                            FILTER BAR                                      */
/* -------------------------------------------------------------------------- */

function FilterBar({
  filters,
  onChange,
  onReset,
  activeCount,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  activeCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-[145px]">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search maintenance tasks..."
          className="h-9 pl-8 text-xs"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <FilterSelect
        placeholder="Department"
        value={filters.department}
        onValueChange={(v) => onChange({ department: v })}
      >
        {DEPARTMENTS.map((d) => (
          <SelectItem key={d} value={d}>
            {d}
          </SelectItem>
        ))}
      </FilterSelect>

      <FilterSelect
        placeholder="Priority"
        value={filters.priority}
        onValueChange={(v) => onChange({ priority: v })}
      >
        {PRIORITIES.map((p) => (
          <SelectItem key={p} value={p}>
            {p}
          </SelectItem>
        ))}
      </FilterSelect>

      <FilterSelect
        placeholder="Asset Type"
        value={filters.assetType}
        onValueChange={(v) => onChange({ assetType: v })}
      >
        {ASSET_TYPES.map((a) => (
          <SelectItem key={a} value={a}>
            {a}
          </SelectItem>
        ))}
      </FilterSelect>

      <FilterSelect
        placeholder="Corridor"
        value={filters.corridor}
        onValueChange={(v) => onChange({ corridor: v })}
      >
        {CORRIDORS.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </FilterSelect>

      <FilterSelect
        placeholder="Status"
        value={filters.status}
        onValueChange={(v) => onChange({ status: v })}
      >
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </FilterSelect>

      <FilterSelect
        placeholder="Due Date"
        value={filters.dueDate}
        onValueChange={(v) => onChange({ dueDate: v })}
      >
        {DUE_DATE_FILTERS.map((d) => (
          <SelectItem key={d} value={d}>
            {d}
          </SelectItem>
        ))}
      </FilterSelect>

      <div className="ml-auto flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={filters.overdueOnly}
            onCheckedChange={(checked) =>
              onChange({ overdueOnly: checked === true })
            }
          />

          <span className="hidden sm:inline">Show only overdue</span>
        </label>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-emerald-600"
            onClick={onReset}
          >
            Reset ({activeCount})
          </Button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          SORTABLE HEADER                                   */
/* -------------------------------------------------------------------------- */

function SortableHeader({
  label,
  field,
  currentField,
  currentDir,
  onSort,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  return (
    <button
      className="flex items-center gap-1"
      onClick={() => onSort(field)}
    >
      {label}
      <ArrowDownUp
        className={`size-3 ${
          currentField === field
            ? "text-foreground"
            : "text-muted-foreground"
        }`}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                           ROW ACTION MENU                                  */
/* -------------------------------------------------------------------------- */

function RowActionMenu({ task }: { task: MaintenanceTask }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="size-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Eye className="mr-2 size-3.5" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Pencil className="mr-2 size-3.5" />
          Edit Task
        </DropdownMenuItem>

        <DropdownMenuItem>
          <FileText className="mr-2 size-3.5" />
          Create Work Order
        </DropdownMenuItem>

        <DropdownMenuItem>
          <CalendarDays className="mr-2 size-3.5" />
          Schedule Block
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive">
          <Trash2 className="mr-2 size-3.5" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------------------------------------------------------------------------- */
/*                           TABLE PAGINATION                                 */
/* -------------------------------------------------------------------------- */

function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[10px] text-muted-foreground">
        Showing {start}–{end} of {totalItems} tasks
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <span className="sr-only">Previous page</span>
          ‹
        </Button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
          (p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              className="size-7 text-xs"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ),
        )}

        {totalPages > 5 && (
          <>
            <span className="px-1 text-xs text-muted-foreground">...</span>
            <Button
              variant="outline"
              size="icon"
              className="size-7 text-xs"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          className="size-7"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="sr-only">Next page</span>
          ›
        </Button>

        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v ?? pageSize))}
        >
          <SelectTrigger className="ml-2 h-7 w-[90px] text-[10px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                        BULK ACTIONS BAR                                    */
/* -------------------------------------------------------------------------- */

function BulkActionsBar({
  count,
  onClear,
}: {
  count: number;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
      <span className="text-xs font-medium text-primary">
        {count} task{count > 1 ? "s" : ""} selected
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="outline" size="sm" className="h-7 text-[10px]">
          <CalendarDays className="mr-1.5 size-3" />
          Schedule Block
        </Button>

        <Button variant="outline" size="sm" className="h-7 text-[10px]">
          <FileText className="mr-1.5 size-3" />
          Create Work Orders
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px]"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                      MAINTENANCE TASKS VIEW                                */
/* -------------------------------------------------------------------------- */

export function MaintenanceTasksView() {
  // State
  const [filters, setFilters] = React.useState<Filters>(INITIAL_FILTERS);
  const [sortField, setSortField] = React.useState<SortField>("risk");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    new Set([maintenanceTasks[0].id]),
  );
  const [activeTaskId, setActiveTaskId] = React.useState<string>(
    maintenanceTasks[0].id,
  );
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Derived
  const filteredTasks = React.useMemo(
    () => applyFilters(maintenanceTasks, filters),
    [filters],
  );

  const sortedTasks = React.useMemo(
    () => [...filteredTasks].sort((a, b) => compareTasks(a, b, sortField, sortDir)),
    [filteredTasks, sortField, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / pageSize));
  const paginatedTasks = sortedTasks.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const activeTask =
    maintenanceTasks.find((t) => t.id === activeTaskId) ?? maintenanceTasks[0];

  const activeFilterCount = Object.entries(filters).filter(([key, val]) => {
    if (key === "overdueOnly") return val === true;
    return val !== "";
  }).length;

  // Handlers
  const handleFilterChange = (patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleRowClick = (task: MaintenanceTask) => {
    setActiveTaskId(task.id);
  };

  const handleCheckboxToggle = (taskId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedTasks.map((t) => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const allSelected =
    paginatedTasks.length > 0 &&
    paginatedTasks.every((t) => selectedIds.has(t.id));

  // Stats derived from full data set
  const stats = React.useMemo(() => {
    const total = maintenanceTasks.length;
    const critical = maintenanceTasks.filter(
      (t) => t.priority === "Critical",
    ).length;
    const overdue = maintenanceTasks.filter(
      (t) => t.dueDate === "Today",
    ).length;
    const planned = maintenanceTasks.filter(
      (t) => t.status === "Planned",
    ).length;
    const completed = maintenanceTasks.filter(
      (t) => t.status === "Completed",
    ).length;
    return { total, critical, overdue, planned, completed };
  }, []);

  return (
    <TooltipProvider delay={150}>
      <main className="min-h-screen bg-muted/30 p-4 md:p-6">
        <div className="mx-auto max-w-[1600px] space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Maintenance Management
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                View, prioritize and manage all maintenance tasks across the
                railway network.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileUp className="mr-2 size-4" />
                Import Data
              </Button>

              <Button size="sm">
                <Plus className="mr-2 size-4" />
                New Maintenance Task
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            <DashboardStatCard
              title="Total Tasks"
              value={String(stats.total)}
              change="↑ 12%"
              changeLabel="from last month"
              icon={<ClipboardList className="size-5" />}
              iconClassName="bg-primary/10 text-primary"
              positive
            />

            <DashboardStatCard
              title="Critical Priority"
              value={String(stats.critical)}
              change="↑ 33%"
              changeLabel="from last month"
              icon={<ShieldAlert className="size-5" />}
              iconClassName="bg-destructive/10 text-destructive"
              variant="destructive"
              negative
            />

            <DashboardStatCard
              title="Overdue Tasks"
              value={String(stats.overdue)}
              change="↑ 19%"
              changeLabel="from last week"
              icon={<Clock3 className="size-5" />}
              iconClassName="bg-destructive/10 text-destructive"
              variant="destructive"
              negative
            />

            <DashboardStatCard
              title="Planned"
              value={String(stats.planned)}
              change="↑ 8%"
              changeLabel="from last month"
              icon={<Wrench className="size-5" />}
              iconClassName="bg-emerald-500/10 text-emerald-600"
              variant="success"
              positive
            />

            <DashboardStatCard
              title="Completed"
              value={String(stats.completed)}
              change="↑ 21%"
              changeLabel="from last month"
              icon={<CheckCircle2 className="size-5" />}
              iconClassName="bg-emerald-500/10 text-emerald-600"
              variant="success"
              positive
            />
          </div>

          {/* Filters */}
          <Card className="rounded-xl border shadow-none">
            <CardContent className="p-3">
              <FilterBar
                filters={filters}
                onChange={handleFilterChange}
                onReset={() => {
                  setFilters(INITIAL_FILTERS);
                  setPage(1);
                }}
                activeCount={activeFilterCount}
              />
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          <BulkActionsBar
            count={selectedIds.size}
            onClear={() => setSelectedIds(new Set())}
          />

          {/* Main Content */}
          <div className="grid min-h-[650px] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* Table */}
            <div className="overflow-hidden rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-9">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          handleSelectAll(checked === true)
                        }
                      />
                    </TableHead>

                    <TableHead className="text-xs">
                      <SortableHeader
                        label="ID"
                        field="id"
                        currentField={sortField}
                        currentDir={sortDir}
                        onSort={handleSort}
                      />
                    </TableHead>

                    <TableHead className="text-xs">
                      <SortableHeader
                        label="Asset"
                        field="asset"
                        currentField={sortField}
                        currentDir={sortDir}
                        onSort={handleSort}
                      />
                    </TableHead>

                    <TableHead className="text-xs">Department</TableHead>

                    <TableHead className="text-xs">Priority</TableHead>

                    <TableHead className="text-xs">
                      <SortableHeader
                        label="Due Date"
                        field="dueDate"
                        currentField={sortField}
                        currentDir={sortDir}
                        onSort={handleSort}
                      />
                    </TableHead>

                    <TableHead className="text-xs">
                      <SortableHeader
                        label="AI Risk"
                        field="risk"
                        currentField={sortField}
                        currentDir={sortDir}
                        onSort={handleSort}
                      />
                    </TableHead>

                    <TableHead className="text-xs">Status</TableHead>

                    <TableHead className="w-14 text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <p className="text-sm text-muted-foreground">
                          No tasks match the current filters.
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs text-emerald-600"
                          onClick={() => setFilters(INITIAL_FILTERS)}
                        >
                          Reset filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTasks.map((task) => {
                      const isActive = task.id === activeTaskId;
                      const isSelected = selectedIds.has(task.id);

                      return (
                        <TableRow
                          key={task.id}
                          onClick={() => handleRowClick(task)}
                          className={`cursor-pointer transition-colors ${
                            isActive ? "bg-primary/[0.03]" : ""
                          }`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                handleCheckboxToggle(task.id)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>

                          <TableCell className="text-xs font-medium">
                            {task.id}
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="text-xs font-medium">
                                {task.asset}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {task.assetName}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="text-xs">
                            {task.department}
                          </TableCell>

                          <TableCell>
                            <PriorityBadge priority={task.priority} />
                          </TableCell>

                          <TableCell>
                            <span
                              className={`text-xs ${
                                task.dueDate === "Today"
                                  ? "font-medium text-destructive"
                                  : ""
                              }`}
                            >
                              {task.dueDate}
                            </span>
                          </TableCell>

                          <TableCell>
                            <RiskCell risk={task.risk} />
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={task.status} />
                          </TableCell>

                          <TableCell>
                            <RowActionMenu task={task} />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              <TablePagination
                page={page}
                totalPages={totalPages}
                totalItems={sortedTasks.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </div>

            {/* Detail Panel */}
            <TaskDetailPanel task={activeTask} />
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
