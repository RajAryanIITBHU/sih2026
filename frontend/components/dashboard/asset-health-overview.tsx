"use client";

import * as React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Info,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DashboardSectionHeader } from "./dashboard-section-header";

export const healthStatusVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border transition-colors",
  {
    variants: {
      status: {
        optimal:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        critical:
          "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
      },
    },
    defaultVariants: {
      status: "optimal",
    },
  }
);

export const progressBarVariants = cva("h-full rounded-full transition-all duration-500", {
  variants: {
    status: {
      optimal: "bg-emerald-500",
      warning: "bg-amber-500",
      critical: "bg-rose-500",
    },
  },
  defaultVariants: {
    status: "optimal",
  },
});

function getHealthStatus(value: number): "optimal" | "warning" | "critical" {
  if (value >= 80) return "optimal";
  if (value >= 70) return "warning";
  return "critical";
}

function getHealthStatusLabel(status: "optimal" | "warning" | "critical") {
  switch (status) {
    case "optimal":
      return { label: "Optimal", icon: CheckCircle2 };
    case "warning":
      return { label: "Attention", icon: Info };
    case "critical":
      return { label: "Critical", icon: AlertTriangle };
  }
}

const defaultAssetHealth = [
  { name: "Track", value: 82 },
  { name: "Signal", value: 68 },
  { name: "OHE", value: 76 },
  { name: "Rolling Stock", value: 81 },
];

export interface AssetHealthOverviewProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

export function AssetHealthOverview({
  data,
  className,
}: AssetHealthOverviewProps) {
  const displayData = data && data.length > 0 ? data : defaultAssetHealth;
  const [selectedAsset, setSelectedAsset] = React.useState<{
    name: string;
    value: number;
  } | null>(null);

  const averageHealth = Math.round(
    displayData.reduce((acc, curr) => acc + curr.value, 0) /
      Math.max(1, displayData.length)
  );
  const avgStatus = getHealthStatus(averageHealth);

  return (
    <>
      <Card
        className={cn(
          "rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border",
          className
        )}
      >
        <CardHeader className="p-4 sm:p-5 pb-0">
          <DashboardSectionHeader
            title="Asset Health Index"
            description="Condition score across critical railway infrastructure"
            badge={
              <span
                className={cn(
                  "hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border",
                  avgStatus === "optimal" &&
                    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  avgStatus === "warning" &&
                    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  avgStatus === "critical" &&
                    "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                <ShieldCheck className="size-3" />
                Avg: {averageHealth}%
              </span>
            }
            action={
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold"
                render={<Link href="/digital-twin" />}
              >
                <span>Digital Twin</span>
                <ArrowUpRight className="size-3.5" />
              </Button>
            }
          />
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-3 space-y-4">
          <div className="space-y-3">
            {displayData.map((asset) => {
              const status = getHealthStatus(asset.value);
              const { label, icon: StatusIcon } = getHealthStatusLabel(status);

              return (
                <div
                  key={asset.name}
                  onClick={() => setSelectedAsset(asset)}
                  className="group -mx-2 flex cursor-pointer flex-col gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedAsset(asset);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {asset.name}
                      </span>
                      <span className={healthStatusVariants({ status })}>
                        <StatusIcon className="size-3" />
                        {label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                        {asset.value}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80">
                    <div
                      className={progressBarVariants({ status })}
                      style={{ width: `${Math.min(100, Math.max(0, asset.value))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-primary" />
              Continuous telemetry monitoring
            </span>
            <Link
              href="/maintenance/defects"
              className="font-medium text-primary hover:underline hover:text-primary/80"
            >
              View flagged defects &rarr;
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Asset Diagnostic Dialog */}
      <Dialog
        open={!!selectedAsset}
        onOpenChange={(open) => !open && setSelectedAsset(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Wrench className="size-4 text-primary" />
              {selectedAsset?.name} Health Diagnostic
            </DialogTitle>
            <DialogDescription>
              Telemetry breakdown and current health status for {selectedAsset?.name} subsystem.
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Subsystem Integrity Score
                </span>
                <span className="text-xl font-bold text-foreground">
                  {selectedAsset.value}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">Assessment:</span>
                  <span className="font-semibold text-foreground">
                    {selectedAsset.value >= 80
                      ? "Operational - Low Degradation"
                      : selectedAsset.value >= 70
                      ? "Inspection Advisory Required"
                      : "Defect Threshold Exceeded"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">Maintenance Status:</span>
                  <span className="font-semibold text-foreground">
                    {selectedAsset.value >= 80 ? "Scheduled Routine" : "Priority Action Active"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">Recommended Window:</span>
                  <span className="font-semibold text-foreground">
                    {selectedAsset.value < 75 ? "Next Shadow Block" : "Normal Interval"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAsset(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  render={<Link href="/digital-twin" />}
                  onClick={() => setSelectedAsset(null)}
                >
                  Open in Digital Twin
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
