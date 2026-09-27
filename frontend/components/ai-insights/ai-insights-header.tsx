"use client";

import * as React from "react";
import Link from "next/link";
import {
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  Layers,
  Network,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { InsightCategory } from "./types";

export interface AIInsightsHeaderProps {
  activeCategory: InsightCategory;
  onCategoryChange: (category: InsightCategory) => void;
  selectedCorridor: string;
  onCorridorChange: (corridor: string) => void;
  selectedHorizon: string;
  onHorizonChange: (horizon: string) => void;
  onRefresh?: () => void;
}

export function AIInsightsHeader({
  activeCategory,
  onCategoryChange,
  selectedCorridor,
  onCorridorChange,
  selectedHorizon,
  onHorizonChange,
  onRefresh,
}: AIInsightsHeaderProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const categories: { id: InsightCategory; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Intelligence", icon: <Brain className="size-3.5" /> },
    { id: "risk", label: "Risk Analysis", icon: <Sparkles className="size-3.5" /> },
    { id: "optimization", label: "Possession Bundling", icon: <Layers className="size-3.5" /> },
    { id: "traffic", label: "Traffic & Headways", icon: <Network className="size-3.5" /> },
  ];

  const horizons = [
    { label: "Last 7 Days", sub: "3 Sep – 9 Sep 2025" },
    { label: "Upcoming 7 Days", sub: "10 Sep – 16 Sep 2025" },
    { label: "Monthly Window", sub: "September 2025" },
  ];

  return (
    <TooltipProvider delay={150}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Title & Badges */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              AI Maintenance Insights
            </h1>

            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Multi-Agent Engine Active
            </Badge>

            <Badge variant="secondary" className="text-[10px] font-medium hidden sm:inline-flex">
              TMS • SMMS • TDMS • COA Synchronized
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            Predictive asset intelligence, automated possession coordination, and timetable impact analysis.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right-Side Controls */}
        <div className="flex flex-wrap items-end gap-2.5">
          {/* Corridor Selection */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Corridor Focus
            </p>
            <Select
              value={selectedCorridor || null}
              onValueChange={(val) => onCorridorChange(val ?? "all")}
            >
              <SelectTrigger className="h-8 min-w-[155px] text-xs">
                <SelectValue placeholder="All Corridors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Corridors (NR/NCR)</SelectItem>
                <SelectItem value="C-01">C-01 (Delhi - Agra)</SelectItem>
                <SelectItem value="C-02">C-02 (Aligarh - Kanpur)</SelectItem>
                <SelectItem value="C-03">C-03 (Lucknow - Varanasi)</SelectItem>
                <SelectItem value="C-04">C-04 (Varanasi - Prayagraj)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Horizon Dropdown */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Time Horizon
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                    <CalendarDays className="size-3.5 text-primary" />
                    <span>{selectedHorizon}</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 text-xs">
                <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Evaluation Horizon
                </DropdownMenuLabel>
                {horizons.map((h) => (
                  <DropdownMenuItem
                    key={h.label}
                    className="flex items-center justify-between text-xs cursor-pointer"
                    onClick={() => onHorizonChange(h.label)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{h.label}</span>
                      <span className="text-[10px] text-muted-foreground">{h.sub}</span>
                    </div>
                    {selectedHorizon === h.label && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick Action Dock */}
          <div className="flex items-center gap-1.5 border-l pl-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={handleRefreshClick}
                    disabled={isRefreshing}
                    aria-label="Refresh AI Telemetry"
                  >
                    <RefreshCw className={cn("size-4", isRefreshing && "animate-spin text-primary")} />
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="text-xs font-medium">
                Re-calculate AI Insights
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Link href="/digital-twin">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-lg"
                      aria-label="What-if Simulation"
                    >
                      <Sparkles className="size-4 text-emerald-600" />
                    </Button>
                  </Link>
                }
              />
              <TooltipContent side="bottom" className="text-xs font-medium">
                Open Digital Twin Simulator
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    aria-label="Export Insights Report"
                  >
                    <Download className="size-4" />
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="text-xs font-medium">
                Export Insights Summary PDF
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
