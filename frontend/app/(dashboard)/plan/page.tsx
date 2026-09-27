"use client";

import * as React from "react";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  FileText,
  MoreHorizontal,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  TrainFront,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ============================================================================
   TYPES
============================================================================ */

type Department = "Engineering" | "OHE" | "S&T" | "Other";

type MaintenanceBlock = {
  id: number;
  date: string;
  shortDate: string;
  day: string;
  blockTime: string;
  corridor: string;
  tasks: number;
  departments: string;
  trainImpact: string;
  aiScore: number;
  status: "AI Suggested" | "Pending";
  color: string;
};

type TaskBlock = {
  corridor: string;
  title: string;
  date: string;
  time: string;
  tasks: number;
  color: string;
};

/* ============================================================================
   DATA
============================================================================ */

const blocks: MaintenanceBlock[] = [
  {
    id: 1,
    date: "14 Sep 2025",
    shortDate: "14 Sep",
    day: "Sun",
    blockTime: "11:00 – 15:00",
    corridor: "C-01",
    tasks: 5,
    departments: "Engg, OHE, S&T",
    trainImpact: "0 trains",
    aiScore: 94,
    status: "AI Suggested",
    color: "bg-emerald-500",
  },
  {
    id: 2,
    date: "14 Sep 2025",
    shortDate: "14 Sep",
    day: "Sun",
    blockTime: "15:00 – 18:00",
    corridor: "C-03",
    tasks: 2,
    departments: "OHE, Engg",
    trainImpact: "1 train",
    aiScore: 86,
    status: "AI Suggested",
    color: "bg-sky-500",
  },
  {
    id: 3,
    date: "15 Sep 2025",
    shortDate: "15 Sep",
    day: "Mon",
    blockTime: "10:00 – 13:00",
    corridor: "C-02",
    tasks: 3,
    departments: "S&T, Engg",
    trainImpact: "0 trains",
    aiScore: 89,
    status: "AI Suggested",
    color: "bg-blue-500",
  },
  {
    id: 4,
    date: "16 Sep 2025",
    shortDate: "16 Sep",
    day: "Tue",
    blockTime: "12:00 – 16:00",
    corridor: "C-01",
    tasks: 4,
    departments: "Engg, OHE",
    trainImpact: "2 trains",
    aiScore: 78,
    status: "Pending",
    color: "bg-amber-400",
  },
  {
    id: 5,
    date: "17 Sep 2025",
    shortDate: "17 Sep",
    day: "Wed",
    blockTime: "09:00 – 12:00",
    corridor: "C-04",
    tasks: 2,
    departments: "OHE",
    trainImpact: "0 trains",
    aiScore: 82,
    status: "Pending",
    color: "bg-sky-400",
  },
  {
    id: 6,
    date: "18 Sep 2025",
    shortDate: "18 Sep",
    day: "Thu",
    blockTime: "14:00 – 16:00",
    corridor: "C-04",
    tasks: 3,
    departments: "Engg, S&T",
    trainImpact: "1 train",
    aiScore: 80,
    status: "Pending",
    color: "bg-emerald-400",
  },
  {
    id: 7,
    date: "19 Sep 2025",
    shortDate: "19 Sep",
    day: "Fri",
    blockTime: "10:00 – 14:00",
    corridor: "C-03",
    tasks: 3,
    departments: "Engg, S&T",
    trainImpact: "0 trains",
    aiScore: 88,
    status: "Pending",
    color: "bg-emerald-400",
  },
];

const taskBlocks: TaskBlock[] = [
  {
    corridor: "C-01",
    title: "Delhi – Agra",
    date: "14 Sep",
    time: "11:00 – 15:00",
    tasks: 5,
    color: "bg-emerald-300",
  },
  {
    corridor: "C-02",
    title: "Agra – Gwalior",
    date: "15 Sep",
    time: "10:00 – 13:00",
    tasks: 3,
    color: "bg-sky-300",
  },
  {
    corridor: "C-03",
    title: "Gwalior – Jhansi",
    date: "14 Sep",
    time: "15:00 – 18:00",
    tasks: 2,
    color: "bg-violet-300",
  },
  {
    corridor: "C-03",
    title: "Gwalior – Jhansi",
    date: "18 Sep",
    time: "10:00 – 14:00",
    tasks: 3,
    color: "bg-emerald-300",
  },
  {
    corridor: "C-04",
    title: "Jhansi – Bina",
    date: "17 Sep",
    time: "09:00 – 12:00",
    tasks: 2,
    color: "bg-sky-300",
  },
  {
    corridor: "C-04",
    title: "Jhansi – Bina",
    date: "19 Sep",
    time: "14:00 – 18:00",
    tasks: 3,
    color: "bg-emerald-300",
  },
];

/* ============================================================================
   HEADER
============================================================================ */

function PageHeader() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-[20px] font-bold tracking-tight md:text-2xl">
          Plan Review & Approval
        </h1>

        <p className="text-[10px] text-muted-foreground md:text-xs">
          Review AI-generated maintenance plan, make adjustments, and publish to
          departments.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Date */}
        <Button
          variant="outline"
          className="h-10 min-w-[160px] justify-between px-3"
        >
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4" />

            <span className="text-left">
              <span className="block text-[10px] font-semibold">
                September 2025
              </span>

              <span className="block text-[8px] text-muted-foreground">
                Week 3 (14 Sep – 20 Sep)
              </span>
            </span>
          </span>

          <ChevronDown className="size-3" />
        </Button>

        {/* Approval status */}
        <div className="flex h-10 min-w-[150px] items-center gap-2 rounded-md border bg-emerald-500/5 px-3">
          <span className="size-2.5 rounded-full bg-amber-400" />

          <div>
            <p className="text-[10px] font-semibold">Awaiting Approval</p>

            <p className="text-[7px] text-muted-foreground">
              Generated on 9 Sep 2025, 10:24 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   KPI CARDS
============================================================================ */

function KPISection() {
  return (
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-5">
      <KpiCard
        icon={<FileText />}
        iconClass="bg-primary/10 text-primary"
        value="12"
        label="Maintenance Tasks"
        change="20%"
        trend="up"
        changeText="from last week"
      />

      <KpiCard
        icon={<CalendarDays />}
        iconClass="bg-emerald-500/10 text-emerald-600"
        value="7"
        label="Blocks Scheduled"
        change="12%"
        trend="down"
        destructive
        changeText="from last week"
      />

      <KpiCard
        icon={<Network />}
        iconClass="bg-violet-500/10 text-violet-600"
        value="4"
        label="Corridors"
        change="No change"
        changeText=""
        trend="neutral"
      />

      <KpiCard
        icon={<Users />}
        iconClass="bg-primary/10 text-primary"
        value="6"
        label="Departments"
        change="1"
        trend="up"
        changeText="more than last week"
      />

      <KpiCard
        icon={<ActivityIcon />}
        iconClass="bg-emerald-500/10 text-emerald-600"
        value="91%"
        label="Resource Utilization"
        change="6%"
        trend="up"
        changeText="from last week"
      />
    </div>
  );
}

function ActivityIcon() {
  return <GaugeIcon />;
}

function GaugeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
    >
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 10l3 4" />
      <path d="M5 18h14" />
    </svg>
  );
}

function KpiCard({
  icon,
  iconClass,
  value,
  label,
  change,
  changeText,
  trend,
  destructive,
}: {
  icon: React.ReactNode;
  iconClass: string;
  value: string;
  label: string;
  change: string;
  changeText: string;
  trend: "up" | "down" | "neutral";
  destructive?: boolean;
}) {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardContent className="flex items-center gap-2.5 p-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-md ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-base font-bold leading-none md:text-lg">{value}</p>

          <p className="mt-1 text-[7px] text-muted-foreground md:text-[8px]">
            {label}
          </p>

          <div className="mt-1 flex items-center gap-0.5 text-[7px]">
            {trend === "up" && (
              <ArrowUp
                className={`size-2.5 ${
                  destructive ? "text-destructive" : "text-emerald-600"
                }`}
              />
            )}

            {trend === "down" && (
              <ArrowDown className="size-2.5 text-destructive" />
            )}

            <span
              className={
                trend === "neutral"
                  ? "text-muted-foreground"
                  : destructive || trend === "down"
                    ? "text-destructive"
                    : "text-emerald-600"
              }
            >
              {change}
            </span>

            {changeText && (
              <span className="text-muted-foreground">{changeText}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================================
   VIEW CONTROLS
============================================================================ */

function ViewControls() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Button size="sm" className="h-7 rounded-md px-3 text-[8px]">
          Week View
        </Button>

        <Button variant="outline" size="sm" className="h-7 px-3 text-[8px]">
          Month View
        </Button>

        <Button variant="outline" size="sm" className="h-7 px-3 text-[8px]">
          List View
        </Button>
      </div>

      <div className="flex items-center gap-3 text-[7px] text-muted-foreground">
        <Legend color="bg-emerald-500" label="Engineering" />
        <Legend color="bg-sky-500" label="OHE" />
        <Legend color="bg-violet-500" label="S&T" />
        <Legend color="bg-amber-400" label="Other" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`size-1.5 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

/* ============================================================================
   WEEKLY MAINTENANCE PLAN
============================================================================ */

function WeeklyMaintenancePlan({
  selectedBlock,
  onSelectBlock,
}: {
  selectedBlock: number;
  onSelectBlock: (id: number) => void;
}) {
  const dates = [
    ["14 Sep", "Sun"],
    ["15 Sep", "Mon"],
    ["16 Sep", "Tue"],
    ["17 Sep", "Wed"],
    ["18 Sep", "Thu"],
    ["19 Sep", "Fri"],
    ["20 Sep", "Sat"],
  ];

  const corridorRows = [
    ["C-01", "Delhi – Agra"],
    ["C-02", "Agra – Gwalior"],
    ["C-03", "Gwalior – Jhansi"],
    ["C-04", "Jhansi – Bina"],
  ];

  return (
    <Card className="overflow-hidden rounded-lg border shadow-none">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-xs">Weekly Maintenance Plan</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto p-2 pt-0">
        <div className="min-w-[700px]">
          {/* Date Header */}
          <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b">
            <div className="px-2 py-2 text-[7px] text-muted-foreground">
              Corridor
            </div>

            {dates.map(([date, day]) => (
              <div key={date} className="border-l px-1 py-1.5 text-center">
                <p className="text-[8px] font-semibold">{date}</p>

                <p className="text-[6px] text-muted-foreground">{day}</p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {corridorRows.map(([corridor, name], rowIndex) => {
            const rowBlocks = taskBlocks.filter(
              (block) => block.corridor === corridor,
            );

            return (
              <div
                key={corridor}
                className="grid min-h-[52px] grid-cols-[70px_repeat(7,1fr)] border-b last:border-0"
              >
                <div className="px-2 py-2">
                  <p className="text-[8px] font-semibold">{corridor}</p>

                  <p className="text-[6px] leading-tight text-muted-foreground">
                    {name}
                  </p>
                </div>

                {dates.map(([date]) => {
                  const block = rowBlocks.find((item) => item.date === date);

                  return (
                    <div
                      key={date}
                      className="relative border-l bg-muted/5 p-1"
                    >
                      {block && (
                        <button
                          onClick={() => {
                            const matching = blocks.find(
                              (item) =>
                                item.corridor === corridor &&
                                item.shortDate === date,
                            );

                            if (matching) {
                              onSelectBlock(matching.id);
                            }
                          }}
                          className={`absolute inset-x-1 top-2 rounded-md px-2 py-1.5 text-left shadow-sm transition hover:ring-2 hover:ring-primary/30 ${block.color}`}
                        >
                          <p className="text-[7px] font-semibold text-foreground">
                            {block.time}
                          </p>

                          <p className="mt-0.5 text-[6px] text-foreground/80">
                            {block.tasks} tasks
                          </p>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================================
   SCHEDULED BLOCKS TABLE
============================================================================ */

function ScheduledBlocksTable({
  selectedBlock,
  onSelectBlock,
}: {
  selectedBlock: number;
  onSelectBlock: (id: number) => void;
}) {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="gap-3 p-3 pb-2">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <CardTitle className="text-xs">Scheduled Blocks (7)</CardTitle>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search blocks..."
                className="h-7 w-[130px] pl-7 text-[7px]"
              />
            </div>

            <FilterSelect
              placeholder="Corridor"
              options={["C-01", "C-02", "C-03", "C-04"]}
            />

            <FilterSelect
              placeholder="Department"
              options={["Engineering", "OHE", "S&T"]}
            />

            <FilterSelect
              placeholder="Status"
              options={["AI Suggested", "Pending"]}
            />

            <Button variant="outline" size="sm" className="h-7 text-[7px]">
              <Download className="mr-1.5 size-3" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="h-8 px-2 text-[7px]">Date</TableHead>

                <TableHead className="h-8 px-2 text-[7px]">
                  Block Time
                </TableHead>

                <TableHead className="h-8 px-2 text-[7px]">Corridor</TableHead>

                <TableHead className="h-8 px-2 text-[7px]">Tasks</TableHead>

                <TableHead className="h-8 px-2 text-[7px]">
                  Departments
                </TableHead>

                <TableHead className="h-8 px-2 text-[7px]">
                  Train Impact
                </TableHead>

                <TableHead className="h-8 px-2 text-[7px]">AI Score</TableHead>

                <TableHead className="h-8 px-2 text-[7px]">Status</TableHead>

                <TableHead className="h-8 px-2 text-[7px]">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {blocks.map((block) => {
                const selected = selectedBlock === block.id;

                return (
                  <TableRow
                    key={block.id}
                    onClick={() => onSelectBlock(block.id)}
                    className={`cursor-pointer transition-colors ${
                      selected ? "bg-primary/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <TableCell className="px-2 py-2 text-[7px]">
                      {block.date}
                    </TableCell>

                    <TableCell className="px-2 py-2 text-[7px] font-medium">
                      {block.blockTime}
                    </TableCell>

                    <TableCell className="px-2 py-2 text-[7px]">
                      {block.corridor}
                    </TableCell>

                    <TableCell className="px-2 py-2 text-[7px]">
                      {block.tasks}
                    </TableCell>

                    <TableCell className="px-2 py-2 text-[7px]">
                      {block.departments}
                    </TableCell>

                    <TableCell className="px-2 py-2 text-[7px]">
                      <span
                        className={
                          block.trainImpact === "0 trains"
                            ? "text-muted-foreground"
                            : "font-semibold text-destructive"
                        }
                      >
                        {block.trainImpact}
                      </span>
                    </TableCell>

                    <TableCell className="px-2 py-2">
                      <span
                        className={`text-[8px] font-semibold ${
                          block.aiScore >= 90
                            ? "text-emerald-600"
                            : block.aiScore >= 80
                              ? "text-primary"
                              : "text-amber-600"
                        }`}
                      >
                        {block.aiScore}
                      </span>
                    </TableCell>

                    <TableCell className="px-2 py-2">
                      <Badge
                        variant="outline"
                        className={`h-5 whitespace-nowrap border-transparent px-1.5 text-[6px] ${
                          block.status === "AI Suggested"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {block.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-2 py-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        <MoreHorizontal className="size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t px-3 py-2">
          <span className="text-[7px] text-muted-foreground">
            Showing 1–7 of 7 blocks
          </span>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-6">
              <ChevronLeft className="size-3" />
            </Button>

            <Button size="icon" className="size-6 text-[7px]">
              1
            </Button>

            <Button variant="outline" size="icon" className="size-6">
              <ChevronRight className="size-3" />
            </Button>

            <Select defaultValue="10">
              <SelectTrigger className="ml-1 h-6 w-[75px] text-[7px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>

                <SelectItem value="20">20 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  placeholder,
  options,
}: {
  placeholder: string;
  options: string[];
}) {
  return (
    <Select>
      <SelectTrigger className="h-7 w-[80px] text-[7px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ============================================================================
   BLOCK DETAILS
============================================================================ */

function BlockDetails({
  block,
  onClose,
}: {
  block: MaintenanceBlock;
  onClose: () => void;
}) {
  return (
    <Card className="h-fit rounded-lg border shadow-none xl:sticky xl:top-4">
      <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
        <div>
          <CardTitle className="text-xs">Block Details</CardTitle>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={onClose}
        >
          <X className="size-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 p-3 pt-1">
        {/* Block Header */}

        <div className="rounded-md bg-primary/5 p-2.5">
          <div className="flex items-start gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
              <CalendarDays className="size-4" />
            </div>

            <div>
              <p className="text-sm font-bold">{block.date}</p>

              <p className="text-[8px] font-medium">
                {block.blockTime} (4 hours)
              </p>

              <p className="mt-1 text-[7px] text-muted-foreground">
                Corridor: {block.corridor} (Delhi – Agra)
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}

        <div className="flex border-b">
          {["Overview", "Tasks", "Conflicts", "Resources", "Train Impact"].map(
            (tab, index) => (
              <button
                key={tab}
                className={`flex-1 border-b-2 px-1 py-2 text-[7px] font-medium ${
                  index === 0
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* Metrics */}

        <div className="grid grid-cols-2 gap-2">
          <DetailMetric
            icon={<FileText />}
            label="Tasks"
            value={String(block.tasks)}
          />

          <DetailMetric
            icon={<ShieldCheck />}
            label="Train Conflicts"
            value={
              block.trainImpact === "0 trains"
                ? "No conflicts"
                : block.trainImpact
            }
          />

          <DetailMetric
            icon={<Users />}
            label="Departments"
            value="Engineering, OHE, S&T"
          />

          <DetailMetric
            icon={<Clock3 />}
            label="Expected Delay"
            value="0 minutes"
          />

          <DetailMetric
            icon={<UserRound />}
            label="Crew Members"
            value="12 members"
          />

          <DetailMetric
            icon={<ShieldCheck />}
            label="Safety Constraints"
            value="All satisfied"
          />

          <DetailMetric
            icon={<FileText />}
            label="Block Type"
            value="Full Possession"
          />

          <DetailMetric
            icon={<Sparkles />}
            label="Weather Forecast"
            value="Clear (28°C)"
          />
        </div>

        {/* AI Score */}

        <div className="rounded-md border bg-muted/20 p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-emerald-600" />

              <span className="text-[8px] font-medium">
                AI Optimization Score
              </span>
            </div>

            <span className="text-sm font-bold text-emerald-600">
              {block.aiScore} / 100
            </span>
          </div>

          <Progress
            value={block.aiScore}
            className="mt-2 h-1.5 [&>div]:bg-emerald-500"
          />
        </div>

        {/* Recommendation */}

        <div className="rounded-md bg-emerald-500/10 p-2.5">
          <div className="flex items-start gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white">
              <Sparkles className="size-3.5" />
            </div>

            <div>
              <p className="text-[9px] font-semibold text-emerald-700">
                AI Recommendation
              </p>

              <p className="mt-1 text-[7px] leading-relaxed text-muted-foreground">
                Approve this block. All tasks are compatible, no train
                conflicts, and optimal resource utilization.
              </p>
            </div>
          </div>
        </div>

        {/* Impact */}

        <div>
          <p className="mb-2 text-[9px] font-semibold">Expected Impact</p>

          <div className="grid grid-cols-3 gap-1.5">
            <ImpactCard
              icon={<ArrowDown />}
              value="6 hours"
              label="Downtime saved"
              destructive
            />

            <ImpactCard
              icon={<ArrowUp />}
              value="+7.8%"
              label="Asset availability"
            />

            <ImpactCard
              icon={<span className="text-xs">₹</span>}
              value="~₹12.4L"
              label="Cost savings"
            />
          </div>
        </div>

        {/* Actions */}

        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <Button
            variant="outline"
            className="h-8 border-destructive/40 text-[7px] text-destructive hover:bg-destructive/5"
          >
            <X className="mr-1 size-3" />
            Reject
          </Button>

          <Button variant="outline" className="h-8 text-[7px]">
            <Edit3 className="mr-1 size-3" />
            Modify
          </Button>

          <Button className="h-8 text-[7px]">
            <Check className="mr-1 size-3" />
            Approve Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md p-1">
      <div className="mt-0.5 text-muted-foreground">
        {React.cloneElement(
          icon as React.ReactElement<{
            className?: string;
          }>,
          {
            className: "size-3",
          },
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[6px] text-muted-foreground">{label}</p>

        <p className="mt-0.5 text-[7px] font-medium leading-tight">{value}</p>
      </div>
    </div>
  );
}

function ImpactCard({
  icon,
  value,
  label,
  destructive,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  destructive?: boolean;
}) {
  return (
    <div className="rounded-md border p-2">
      <div
        className={`mb-1 ${
          destructive ? "text-destructive" : "text-emerald-600"
        }`}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{
                className?: string;
              }>,
              {
                className: "size-3",
              },
            )
          : icon}
      </div>

      <p className="text-[8px] font-bold">{value}</p>

      <p className="mt-0.5 text-[6px] leading-tight text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/* ============================================================================
   PAGE
============================================================================ */

export default function PlanReviewPage() {
  const [selectedBlock, setSelectedBlock] = React.useState(1);

  const [showDetails, setShowDetails] = React.useState(true);

  const currentBlock =
    blocks.find((block) => block.id === selectedBlock) ?? blocks[0];

  return (
    <main className="min-h-screen bg-muted/20 p-3 md:p-4">
      <div className="mx-auto max-w-[1600px] space-y-3">
        {/* HEADER */}

        <PageHeader />

        {/* KPI */}

        <KPISection />

        {/* VIEW CONTROLS */}

        <ViewControls />

        {/* MAIN CONTENT */}

        <div
          className={`grid items-start gap-2 ${
            showDetails
              ? "xl:grid-cols-[minmax(0,1fr)_265px]"
              : "xl:grid-cols-1"
          }`}
        >
          <div className="min-w-0 space-y-2">
            <WeeklyMaintenancePlan
              selectedBlock={selectedBlock}
              onSelectBlock={(id) => {
                setSelectedBlock(id);
                setShowDetails(true);
              }}
            />

            <ScheduledBlocksTable
              selectedBlock={selectedBlock}
              onSelectBlock={(id) => {
                setSelectedBlock(id);
                setShowDetails(true);
              }}
            />
          </div>

          {showDetails && (
            <BlockDetails
              block={currentBlock}
              onClose={() => setShowDetails(false)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
