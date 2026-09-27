"use client";

import * as React from "react";

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  ExternalLink,
  Fullscreen,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  TrainFront,
  Wrench,
  X,
} from "lucide-react";

import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const CorridorMap = dynamic(
  () =>
    import("@/components/digital-twin/corridor-map").then(
      (mod) => mod.CorridorMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex h-full min-h-[400px] items-center justify-center rounded-xl border bg-muted">
        <p className="text-xs text-muted-foreground">Loading GIS Map...</p>
      </div>
    ),
  }
);

/* -------------------------------------------------------------------------- */
/*                           ASSET DETAILS                                    */
/* -------------------------------------------------------------------------- */

function AssetDetails() {
  return (
    <Card className="flex h-full min-h-[400px] flex-col rounded-xl border shadow-none">
      <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
        <CardTitle className="text-xs">Asset Details</CardTitle>

        <Button variant="ghost" size="icon" className="size-6">
          <X className="size-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-3 pt-0">
        {/* Asset image placeholder */}
        <div className="relative h-[100px] overflow-hidden rounded-md bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <TrainFront className="size-12 text-muted-foreground/30" />
          </div>
        </div>

        <div className="mt-2">
          <Badge
            variant="outline"
            className="border-transparent bg-destructive/10 text-[8px] text-destructive"
          >
            High Risk
          </Badge>

          <h2 className="mt-1 text-sm font-bold">TRK-C01-024</h2>

          <p className="text-[9px] text-muted-foreground">Track Segment</p>

          <p className="text-[8px] text-muted-foreground">Km 102.4 – 103.1</p>
        </div>

        {/* Tabs */}
        <div className="mt-3 flex border-b">
          {["Overview", "History", "Maintenance", "Related"].map(
            (tab, index) => (
              <button
                key={tab}
                className={`relative px-2 pb-2 text-[9px] ${
                  index === 0
                    ? "font-semibold text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <HealthScore />

          <div className="space-y-2">
            <InfoItem label="Asset Type" value="Track Segment" />

            <InfoItem label="Corridor" value="C-01 (Delhi – Agra)" />

            <InfoItem label="Length" value="0.7 km" />
          </div>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="Installation Year" value="2015" />

          <InfoItem label="Department" value="Engineering" />

          <InfoItem label="Last Inspection" value="12 Aug 2025" />

          <InfoItem label="Next Maintenance" value="14 Sep 2025" danger />
        </div>

        <div className="mt-3">
          <p className="text-[8px] text-muted-foreground">Criticality</p>

          <p className="mt-0.5 flex items-center gap-1 text-[9px] font-medium text-destructive">
            <span className="size-1.5 rounded-full bg-destructive" />
            Critical
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[9px]">
            View on Map
          </Button>

          <Button size="sm" className="h-8 text-[9px]">
            View Full History
            <ArrowRight className="ml-1 size-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HealthScore() {
  return (
    <div>
      <p className="text-[8px] text-muted-foreground">Health Score</p>

      <div className="mt-2 flex flex-col items-center">
        <div className="relative flex size-16 items-center justify-center rounded-full border-[7px] border-orange-400">
          <div className="text-center">
            <p className="text-sm font-bold">68%</p>
            <p className="text-[7px] text-destructive">At Risk</p>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-[8px] text-muted-foreground">Failure Risk</p>

        <div className="mt-1 flex items-center gap-2">
          <Progress value={92} className="h-1.5" />

          <span className="text-[9px] font-semibold text-destructive">92%</span>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <p className="text-[8px] text-muted-foreground">{label}</p>

      <p
        className={`mt-0.5 text-[9px] font-medium ${
          danger ? "text-destructive" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                        TRAIN MOVEMENT                                      */
/* -------------------------------------------------------------------------- */

function TrainMovement() {
  const rows = [
    {
      name: "Delhi",
      y: 20,
      points: [25, 55, 82, 112, 142, 175, 204],
    },
    {
      name: "Faridabad",
      y: 35,
      points: [38, 67, 96, 126, 156, 187],
    },
    {
      name: "Mathura",
      y: 50,
      points: [50, 80, 108, 138, 169, 197],
    },
    {
      name: "Agra",
      y: 65,
      points: [60, 90, 120, 150, 180, 210],
    },
  ];

  return (
    <Card className="rounded-xl border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
        <div>
          <CardTitle className="text-xs">Train Movement (Today)</CardTitle>

          <div className="mt-1 flex gap-3 text-[7px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-sky-500" />
              Scheduled Trains
            </span>

            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Goods Trains
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="h-6 text-[8px]">
          Today
          <ChevronDown className="ml-1 size-3" />
        </Button>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="relative h-[105px]">
          {/* Grid */}
          <div className="absolute inset-0 ml-8">
            {[0, 1, 2, 3, 4, 5, 6].map((x) => (
              <div
                key={x}
                className="absolute bottom-0 top-0 border-l border-muted"
                style={{
                  left: `${(x / 6) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Labels */}
          <div className="absolute left-0 top-0 space-y-3">
            {rows.map((row) => (
              <p key={row.name} className="text-[7px] text-muted-foreground">
                {row.name}
              </p>
            ))}
          </div>

          {/* Train dots */}
          <div className="absolute bottom-4 left-8 right-0 top-0">
            {rows.map((row) =>
              row.points.map((x, index) => (
                <span
                  key={`${row.name}-${index}`}
                  className={`absolute size-1.5 rounded-full ${
                    index % 3 === 0 ? "bg-emerald-500" : "bg-sky-500"
                  }`}
                  style={{
                    left: `${(x / 220) * 100}%`,
                    top: `${row.y}%`,
                  }}
                />
              )),
            )}

            {/* Selected block */}
            <div
              className="absolute top-0 h-[78px] w-[34px] rounded-sm border-x-2 border-destructive bg-destructive/10"
              style={{
                left: "46%",
              }}
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-destructive px-1.5 py-1 text-[6px] text-white">
                11:00 – 15:00
                <br />
                Selected Block
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[7px] text-muted-foreground">
            <span>06:00</span>
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          <MiniMetric
            icon={<TrainFront />}
            value="124"
            label="Passenger Trains"
            sub="+6% vs avg"
          />

          <MiniMetric
            icon={<TrainFront />}
            value="86"
            label="Goods Trains"
            sub="+18% vs avg"
            green
          />

          <MiniMetric
            icon={<ShieldCheck />}
            value="0"
            label="Conflicts"
            sub="in selected block"
            green
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniMetric({
  icon,
  value,
  label,
  sub,
  green = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
  green?: boolean;
}) {
  return (
    <div className="rounded-md border bg-muted/20 p-2">
      <div className="flex items-center gap-1">
        <div className={green ? "text-emerald-600" : "text-sky-600"}>
          {icon}
        </div>

        <span className="text-sm font-bold">{value}</span>
      </div>

      <p className="mt-1 text-[7px] font-medium">{label}</p>

      <p
        className={`text-[7px] ${
          green ? "text-emerald-600" : "text-muted-foreground"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                        HEALTH DISTRIBUTION                                 */
/* -------------------------------------------------------------------------- */

function AssetHealthDistribution() {
  return (
    <Card className="rounded-xl border shadow-none">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs">Asset Health Distribution</CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="flex items-center gap-5">
          {/* Donut */}
          <div
            className="relative flex size-24 shrink-0 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(#22c55e 0 68%, #f59e0b 68% 86%, #ef4444 86% 93%, #60a5fa 93% 100%)",
            }}
          >
            <div className="flex size-14 flex-col items-center justify-center rounded-full bg-card">
              <span className="text-base font-bold">842</span>
              <span className="text-[7px] text-muted-foreground">
                Total Assets
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <HealthLegend
              label="Healthy"
              value="68%"
              className="bg-emerald-500"
            />

            <HealthLegend
              label="Warning"
              value="18%"
              className="bg-amber-500"
            />

            <HealthLegend
              label="Critical"
              value="7%"
              className="bg-destructive"
            />

            <HealthLegend
              label="Under Maintenance"
              value="7%"
              className="bg-sky-500"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-500/10 p-2">
          <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-2.5" />
          </div>

          <p className="flex-1 text-[8px] text-muted-foreground">
            Overall asset health is stable.
            <br />4 assets require immediate attention.
          </p>

          <ArrowRight className="size-3 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function HealthLegend({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[8px]">
      <span className={`size-2 rounded-full ${className}`} />

      <span className="w-24 text-muted-foreground">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                     MAINTENANCE ACTIVITIES                                */
/* -------------------------------------------------------------------------- */

function MaintenanceActivities() {
  const activities = [
    [
      "11:00 – 15:00",
      "TRK-C01-024",
      "Rail replacement",
      "Engineering",
      "Planned",
    ],
    ["11:00 – 15:00", "OHE-C01-118", "OHE inspection", "Electrical", "Planned"],
    ["12:00 – 14:00", "SIG-C01-031", "Signal testing", "S&T", "Planned"],
    [
      "13:00 – 15:00",
      "TRK-C01-027",
      "Track geometry",
      "Engineering",
      "Planned",
    ],
    ["11:00 – 15:00", "OHE-C01-045", "Tensioning", "Electrical", "Planned"],
  ];

  return (
    <Card className="rounded-xl border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
        <CardTitle className="text-xs">
          Maintenance Activities (Selected Block)
        </CardTitle>

        <Button variant="outline" size="sm" className="h-6 text-[8px]">
          View all
        </Button>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="grid grid-cols-[72px_90px_1fr_70px_50px] border-b pb-1 text-[7px] font-medium text-muted-foreground">
          <span>Time</span>
          <span>Asset</span>
          <span>Activity</span>
          <span>Department</span>
          <span>Status</span>
        </div>

        <div className="divide-y">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="grid grid-cols-[72px_90px_1fr_70px_50px] items-center py-2 text-[7px]"
            >
              <span>{activity[0]}</span>
              <span>{activity[1]}</span>
              <span className="truncate">{activity[2]}</span>
              <span>{activity[3]}</span>

              <Badge
                variant="outline"
                className="h-4 justify-center border-transparent bg-sky-500/10 px-1 text-[6px] text-sky-600"
              >
                {activity[4]}
              </Badge>
            </div>
          ))}
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
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Digital Twin</h1>

        <p className="text-xs text-muted-foreground">
          Visualize railway infrastructure, assets, and maintenance activities
          in real-time.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div>
          <p className="mb-1 text-[8px] text-muted-foreground">Corridor</p>

          <Select defaultValue="c01">
            <SelectTrigger className="h-8 w-[115px] text-[9px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="c01">C-01 (Delhi – Agra)</SelectItem>

              <SelectItem value="c02">C-02 (Delhi – Jaipur)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-1 text-[8px] text-muted-foreground">View Mode</p>

          <div className="flex">
            <Button size="sm" className="h-8 rounded-r-none text-[9px]">
              Live View
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-l-none border-l-0 text-[9px]"
            >
              Simulation
            </Button>
          </div>
        </div>

        <Button variant="outline" size="sm" className="h-8 text-[9px]">
          <CalendarDays className="mr-1.5 size-3.5" />

          <span className="font-semibold">14 Sep 2025</span>

          <span className="ml-1 text-[7px] text-muted-foreground">
            11:00 – 15:00 (Selected Block)
          </span>
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             MAIN PAGE                                      */
/* -------------------------------------------------------------------------- */

export default function DigitalTwinPage() {
  return (
    <main className="min-h-screen bg-muted/30 p-4 md:p-5">
      <div className="mx-auto max-w-[1600px] space-y-3">
        {/* Header */}
        <PageHeader />

        {/* Main Map + Details */}
        <div className="grid min-h-[400px] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
          <CorridorMap />

          <AssetDetails />
        </div>

        {/* Bottom Dashboard */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.05fr_0.85fr_1.3fr]">
          <TrainMovement />

          <AssetHealthDistribution />

          <MaintenanceActivities />
        </div>
      </div>
    </main>
  );
}
