"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  CloudSun,
  FileDown,
  Network,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
  highlight?: boolean;
}

export function DashboardHeader() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("Today, 10 Sep");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 600);
  };

  const quickActions: QuickActionItem[] = [
    {
      id: "create-task",
      label: "Create Maintenance Task",
      icon: Plus,
      href: "/maintenance/tasks",
      highlight: true,
    },
    {
      id: "plan-block",
      label: "Plan New Possession Block",
      icon: CalendarPlus,
      href: "/block-planning/ai-planner",
    },
    {
      id: "ai-optimizer",
      label: "Run Multi-Agent Optimization",
      icon: Sparkles,
      href: "/ai-insights",
      highlight: true,
    },
    {
      id: "digital-twin",
      label: "Digital Twin Network Simulator",
      icon: Network,
      href: "/digital-twin",
    },
    {
      id: "export-reports",
      label: "Export Operations Report",
      icon: FileDown,
      href: "/reports",
    },
  ];

  return (
    <TooltipProvider delay={150}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-1">
        {/* Left: Operations Title & Status Indicators */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Network Operations Overview
            </h1>

            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry • 4 Corridors
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            Real-time track possession, multi-department task alignment & traffic forecasting.
          </p>
        </div>

        {/* Right: Quick Action Icon Buttons with Tooltips & Context Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Action Icon Dock */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card p-1 shadow-xs">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const buttonElement = (
                <Button
                  variant={action.highlight ? "default" : "ghost"}
                  size="icon"
                  className={`size-9 rounded-lg transition-all ${
                    action.highlight
                      ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-label={action.label}
                  onClick={action.onClick}
                >
                  <Icon className="size-4" />
                </Button>
              );

              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger
                    render={
                      action.href ? (
                        <Link href={action.href} className="inline-flex">
                          {buttonElement}
                        </Link>
                      ) : (
                        buttonElement
                      )
                    }
                  />
                  <TooltipContent side="bottom" className="font-medium text-xs">
                    {action.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Refresh Action */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    aria-label="Refresh Telemetry"
                  >
                    <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="font-medium text-xs">
                Refresh Live Telemetry
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Interactive Date Period Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-11 gap-2 rounded-xl border-border bg-card px-3.5 text-xs font-semibold text-foreground shadow-xs hover:bg-accent"
                >
                  <CalendarDays className="size-4 text-primary" />
                  <span>{selectedPeriod}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSelectedPeriod("Today, 10 Sep")}>
                Today (10 Sep)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Tomorrow, 11 Sep")}>
                Tomorrow (11 Sep)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Weekly View (W37)")}>
                Weekly View (W37)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Monthly (Sep 2026)")}>
                Monthly (Sep 2026)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Environmental / Weather Indicator */}
          <div className="hidden h-11 items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3 lg:flex">
            <CloudSun className="size-5 text-amber-500" />
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-foreground">28°C</span>
                <span className="text-[10px] text-muted-foreground">• Clear Track</span>
              </div>
              <p className="text-[9px] font-semibold text-primary">Northern Trunk (NR/NCR)</p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
