"use client";

import * as React from "react";
import {
  ArrowDownUp,
  ArrowUp,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileUp,
  Filter,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wrench,
  X,
  MapPin,
  FileText,
  History,
  Link2,
  UserRound,
  StickyNote,
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type MaintenanceStatus = "Pending" | "Planned" | "Completed";

type Priority = "Critical" | "High" | "Medium" | "Low";

type MaintenanceTask = {
  id: string;
  asset: string;
  assetName: string;
  department: string;
  priority: Priority;
  dueDate: string;
  risk: number;
  status: MaintenanceStatus;
};

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  change: string;
  icon: React.ReactNode;
  variant?: "default" | "danger" | "warning" | "success";
};

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const maintenanceTasks: MaintenanceTask[] = [
  {
    id: "M104",
    asset: "TRK-C01-024",
    assetName: "Track Segment",
    department: "Engineering",
    priority: "Critical",
    dueDate: "Today",
    risk: 92,
    status: "Pending",
  },
  {
    id: "M105",
    asset: "SIG-C01-018",
    assetName: "Signal System",
    department: "S&T",
    priority: "High",
    dueDate: "2 days",
    risk: 81,
    status: "Pending",
  },
  {
    id: "M106",
    asset: "OHE-C03-012",
    assetName: "OHE Mast",
    department: "Electrical",
    priority: "High",
    dueDate: "3 days",
    risk: 74,
    status: "Planned",
  },
  {
    id: "M107",
    asset: "TRK-C02-088",
    assetName: "Track Segment",
    department: "Engineering",
    priority: "Medium",
    dueDate: "7 days",
    risk: 42,
    status: "Pending",
  },
  {
    id: "M108",
    asset: "PWR-C01-045",
    assetName: "Traction Power",
    department: "Electrical",
    priority: "Medium",
    dueDate: "10 Sep 2025",
    risk: 56,
    status: "Planned",
  },
  {
    id: "M109",
    asset: "SIG-C02-031",
    assetName: "Interlocking",
    department: "S&T",
    priority: "High",
    dueDate: "11 Sep 2025",
    risk: 68,
    status: "Pending",
  },
  {
    id: "M110",
    asset: "TRL-C03-011",
    assetName: "Turnout",
    department: "Engineering",
    priority: "Low",
    dueDate: "12 Sep 2025",
    risk: 28,
    status: "Pending",
  },
  {
    id: "M111",
    asset: "OHE-C01-027",
    assetName: "OHE Wire",
    department: "Electrical",
    priority: "Medium",
    dueDate: "14 Sep 2025",
    risk: 39,
    status: "Planned",
  },
  {
    id: "M112",
    asset: "TRK-C04-019",
    assetName: "Bridge Segment",
    department: "Engineering",
    priority: "High",
    dueDate: "15 Sep 2025",
    risk: 73,
    status: "Pending",
  },
  {
    id: "M113",
    asset: "SIG-C03-007",
    assetName: "Interlocking",
    department: "S&T",
    priority: "Low",
    dueDate: "17 Sep 2025",
    risk: 21,
    status: "Planned",
  },
];

/* -------------------------------------------------------------------------- */
/*                              UTILITY HELPERS                               */
/* -------------------------------------------------------------------------- */

function getRiskClass(risk: number) {
  if (risk >= 80) {
    return "bg-destructive";
  }

  if (risk >= 60) {
    return "bg-orange-500";
  }

  if (risk >= 40) {
    return "bg-amber-500";
  }

  return "bg-emerald-500";
}

function getRiskTrackClass(risk: number) {
  if (risk >= 80) {
    return "bg-destructive/15";
  }

  if (risk >= 60) {
    return "bg-orange-500/15";
  }

  if (risk >= 40) {
    return "bg-amber-500/15";
  }

  return "bg-emerald-500/15";
}

/* -------------------------------------------------------------------------- */
/*                              STAT CARD                                     */
/* -------------------------------------------------------------------------- */

function StatCard({
  title,
  value,
  description,
  change,
  icon,
  variant = "default",
}: StatCardProps) {
  const iconStyles = {
    default: "bg-primary/10 text-primary",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-orange-500/10 text-orange-600",
    success: "bg-emerald-500/10 text-emerald-600",
  };

  return (
    <Card className="rounded-xl border shadow-none">
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconStyles[variant]}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>

          <p className="mt-0.5 text-xl font-bold tracking-tight">{value}</p>

          <div className="mt-1 flex items-center gap-1 text-[10px]">
            <span
              className={
                variant === "danger"
                  ? "font-semibold text-destructive"
                  : "font-semibold text-emerald-600"
              }
            >
              {change}
            </span>

            <span className="text-muted-foreground">{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PAGE HEADER                                   */
/* -------------------------------------------------------------------------- */

function PageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Maintenance Management
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View, prioritize and manage all maintenance tasks across the railway
          network.
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
  );
}

/* -------------------------------------------------------------------------- */
/*                              STATS SECTION                                 */
/* -------------------------------------------------------------------------- */

function StatsSection() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
      <StatCard
        title="Total Tasks"
        value="186"
        change="↑ 12%"
        description="from last month"
        icon={<ClipboardList className="size-5" />}
        variant="default"
      />

      <StatCard
        title="Critical Priority"
        value="24"
        change="↑ 33%"
        description="from last month"
        icon={<ShieldAlert className="size-5" />}
        variant="danger"
      />

      <StatCard
        title="Overdue Tasks"
        value="42"
        change="↑ 19%"
        description="from last week"
        icon={<Clock3 className="size-5" />}
        variant="danger"
      />

      <StatCard
        title="Planned"
        value="57"
        change="↑ 8%"
        description="from last month"
        icon={<Wrench className="size-5" />}
        variant="success"
      />

      <StatCard
        title="Completed"
        value="63"
        change="↑ 21%"
        description="from last month"
        icon={<CheckCircle2 className="size-5" />}
        variant="success"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               FILTER BAR                                   */
/* -------------------------------------------------------------------------- */

function FilterSelect({
  placeholder,
  children,
}: {
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <Select>
      <SelectTrigger className="h-9 w-[108px] text-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-[145px]">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search maintenance tasks..."
          className="h-9 pl-8 text-xs"
        />
      </div>

      <FilterSelect placeholder="Department">
        <SelectItem value="engineering">Engineering</SelectItem>
        <SelectItem value="electrical">Electrical</SelectItem>
        <SelectItem value="s&t">S&T</SelectItem>
      </FilterSelect>

      <FilterSelect placeholder="Priority">
        <SelectItem value="critical">Critical</SelectItem>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="low">Low</SelectItem>
      </FilterSelect>

      <FilterSelect placeholder="Asset Type">
        <SelectItem value="track">Track</SelectItem>
        <SelectItem value="signal">Signal</SelectItem>
        <SelectItem value="ohe">OHE</SelectItem>
      </FilterSelect>

      <FilterSelect placeholder="Corridor">
        <SelectItem value="c01">C-01</SelectItem>
        <SelectItem value="c02">C-02</SelectItem>
        <SelectItem value="c03">C-03</SelectItem>
      </FilterSelect>

      <FilterSelect placeholder="Status">
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="planned">Planned</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </FilterSelect>

      <FilterSelect placeholder="Due Date">
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
      </FilterSelect>

      <div className="ml-auto flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <Checkbox />

          <span className="hidden sm:inline">Show only overdue</span>
        </label>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-emerald-600"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PRIORITY BADGE                                */
/* -------------------------------------------------------------------------- */

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    Critical:
      "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/10",
    High: "border-transparent bg-orange-500/10 text-orange-600 hover:bg-orange-500/10",
    Medium:
      "border-transparent bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
    Low: "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${styles[priority]}`}
    >
      {priority}
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/*                               STATUS BADGE                                 */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: MaintenanceStatus }) {
  const styles: Record<MaintenanceStatus, string> = {
    Pending:
      "border-transparent bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
    Planned:
      "border-transparent bg-sky-500/10 text-sky-600 hover:bg-sky-500/10",
    Completed:
      "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${styles[status]}`}
    >
      {status}
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/*                                RISK CELL                                   */
/* -------------------------------------------------------------------------- */

function RiskCell({ risk }: { risk: number }) {
  return (
    <div className="flex min-w-[80px] items-center gap-2">
      <span className="w-7 text-[10px] font-medium">{risk}%</span>

      <div
        className={`h-1.5 flex-1 overflow-hidden rounded-full ${getRiskTrackClass(
          risk,
        )}`}
      >
        <div
          className={`h-full rounded-full ${getRiskClass(risk)}`}
          style={{ width: `${risk}%` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            TASK TABLE                                      */
/* -------------------------------------------------------------------------- */

function MaintenanceTable({
  selectedTask,
  onSelectTask,
}: {
  selectedTask: MaintenanceTask;
  onSelectTask: (task: MaintenanceTask) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-9">
              <Checkbox />
            </TableHead>

            <TableHead className="text-xs">
              <button className="flex items-center gap-1">
                ID
                <ArrowDownUp className="size-3 text-muted-foreground" />
              </button>
            </TableHead>

            <TableHead className="text-xs">
              <button className="flex items-center gap-1">
                Asset
                <ArrowDownUp className="size-3 text-muted-foreground" />
              </button>
            </TableHead>

            <TableHead className="text-xs">Department</TableHead>

            <TableHead className="text-xs">Priority</TableHead>

            <TableHead className="text-xs">
              <button className="flex items-center gap-1">
                Due Date
                <ArrowDownUp className="size-3 text-muted-foreground" />
              </button>
            </TableHead>

            <TableHead className="text-xs">AI Risk</TableHead>

            <TableHead className="text-xs">Status</TableHead>

            <TableHead className="w-14 text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {maintenanceTasks.map((task) => {
            const active = task.id === selectedTask.id;

            return (
              <TableRow
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`cursor-pointer transition-colors ${
                  active ? "bg-primary/[0.03]" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={active}
                    onCheckedChange={() => onSelectTask(task)}
                    onClick={(event) => event.stopPropagation()}
                  />
                </TableCell>

                <TableCell className="text-xs font-medium">{task.id}</TableCell>

                <TableCell>
                  <div>
                    <p className="text-xs font-medium">{task.asset}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {task.assetName}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-xs">{task.department}</TableCell>

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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TableFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              TABLE FOOTER                                  */
/* -------------------------------------------------------------------------- */

function TableFooter() {
  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[10px] text-muted-foreground">
        Showing 1–10 of 186 tasks
      </p>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="size-7">
          <ChevronLeft className="size-3.5" />
        </Button>

        <Button size="icon" className="size-7 text-xs">
          1
        </Button>

        <Button variant="outline" size="icon" className="size-7 text-xs">
          2
        </Button>

        <Button variant="outline" size="icon" className="size-7 text-xs">
          3
        </Button>

        <Button variant="outline" size="icon" className="size-7 text-xs">
          4
        </Button>

        <Button variant="outline" size="icon" className="size-7 text-xs">
          5
        </Button>

        <span className="px-1 text-xs text-muted-foreground">...</span>

        <Button variant="outline" size="icon" className="size-7 text-xs">
          19
        </Button>

        <Button variant="outline" size="icon" className="size-7">
          <ChevronRight className="size-3.5" />
        </Button>

        <Select defaultValue="10">
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
/*                           DETAIL HEADER                                    */
/* -------------------------------------------------------------------------- */

function DetailHeader({ task }: { task: MaintenanceTask }) {
  return (
    <div className="flex items-start justify-between">
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

        <p className="mt-0.5 text-xs text-muted-foreground">Rail replacement</p>
      </div>

      <Button variant="ghost" size="icon" className="size-7">
        <X className="size-4" />
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            DETAIL TABS                                     */
/* -------------------------------------------------------------------------- */

function DetailTabs() {
  return (
    <div className="flex items-center gap-4 border-b">
      {[
        { label: "Overview", active: true },
        { label: "AI Analysis", active: false },
        { label: "History", active: false },
        { label: "Related Tasks", active: false },
      ].map((tab) => (
        <button
          key={tab.label}
          className={`relative pb-2 text-[10px] font-medium ${
            tab.active
              ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
              : "text-muted-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          DETAIL CARD                                      */
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

function AssetInformation() {
  return (
    <DetailCard
      title="Asset Information"
      icon={<Settings2 className="size-3.5" />}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <InfoItem label="Asset Code" value="TRK-C01-024" />
        <InfoItem label="Asset Type" value="Track Segment" />
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
/*                            INFO ITEM                                       */
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
/*                         MAINTENANCE DETAILS                                */
/* -------------------------------------------------------------------------- */

function MaintenanceDetails() {
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
          <InfoItem label="Department" value="Engineering" />
          <InfoItem label="Estimated Duration" value="4 hours" />
          <InfoItem label="Priority" value="Critical" />

          <div>
            <p className="text-[9px] text-muted-foreground">Due Date</p>

            <p className="mt-0.5 text-[10px] font-medium text-destructive">
              Today (9 Sep 2025)
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

function AIAssessment() {
  return (
    <DetailCard title="AI Assessment" icon={<Sparkles className="size-3.5" />}>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[9px]">
            <span className="text-muted-foreground">Failure Risk</span>
            <span className="font-semibold text-destructive">92%</span>
          </div>

          <Progress value={92} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="Asset Impact" value="High" />
          <InfoItem label="Urgency" value="Critical" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-muted-foreground">
              Priority Score
            </span>

            <span className="text-xs font-bold text-emerald-600">94 / 100</span>
          </div>

          <div className="mt-1 h-1.5 rounded-full bg-muted">
            <div className="h-full w-[94%] rounded-full bg-emerald-500" />
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

function TaskDetailPanel({ task }: { task: MaintenanceTask }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <div className="p-3">
        <DetailHeader task={task} />
      </div>

      <div className="px-3">
        <DetailTabs />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        <AssetInformation />

        <MaintenanceDetails />

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <AIAssessment />
          <RecommendedAction />
        </div>
      </div>

      <div className="p-3">
        <DetailActions />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            MAIN PAGE                                       */
/* -------------------------------------------------------------------------- */

export default function MaintenanceManagementPage() {
  const [selectedTask, setSelectedTask] = React.useState<MaintenanceTask>(
    maintenanceTasks[0],
  );

  return (
    <main className="min-h-screen bg-muted/30 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4">
        {/* Header */}
        <PageHeader />

        {/* Statistics */}
        <StatsSection />

        {/* Filters */}
        <Card className="rounded-xl border shadow-none">
          <CardContent className="p-3">
            <FilterBar />
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid min-h-[650px] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* Table */}
          <MaintenanceTable
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
          />

          {/* Details */}
          <TaskDetailPanel task={selectedTask} />
        </div>
      </div>
    </main>
  );
}
