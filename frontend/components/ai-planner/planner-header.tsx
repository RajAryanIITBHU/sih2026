"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
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
import type { PlannerCorridorItem } from "./types";

export interface PlannerHeaderProps {
  corridors?: PlannerCorridorItem[];
  selectedCorridorCode?: string;
  onCorridorChange?: (code: string) => void;
  selectedDate?: string;
  viewMode?: "day" | "week" | "month";
  onViewModeChange?: (mode: "day" | "week" | "month") => void;
}

export function PlannerHeader({
  corridors = [],
  selectedCorridorCode = "C-01",
  onCorridorChange,
  selectedDate = "14 September 2025",
  viewMode = "day",
  onViewModeChange,
}: PlannerHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = React.useTransition();

  const [currentView, setCurrentView] = React.useState<"day" | "week" | "month">(
    viewMode
  );
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleViewChange = (mode: "day" | "week" | "month") => {
    setCurrentView(mode);
    onViewModeChange?.(mode);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 600);
  };

  const currentCorridorValue = React.useMemo(() => {
    const match = corridors.find(
      (c) =>
        c.code.toLowerCase() === selectedCorridorCode?.toLowerCase() ||
        c.code.replace("-", "").toLowerCase() === selectedCorridorCode?.toLowerCase()
    );
    return match ? match.code : (selectedCorridorCode || "C-01");
  }, [corridors, selectedCorridorCode]);

  const handleCorridorSelect = (val: string | null) => {
    if (!val) return;
    onCorridorChange?.(val);
    startTransition(() => {
      router.push(`${pathname}?corridor=${encodeURIComponent(val)}`, {
        scroll: false,
      });
    });
  };

  const [currentDate, setCurrentDate] = React.useState(selectedDate);

  React.useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  return (
    <TooltipProvider delay={150}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              AI Block Planner
            </h1>

            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <Sparkles className="size-3" />
              AI Optimized
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            Optimize maintenance blocks with AI for minimal disruption and maximum
            efficiency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Corridor selector */}
          <div className="mr-1">
            <p className="mb-1 text-[9px] text-muted-foreground">Corridor</p>

            <Select
              value={currentCorridorValue}
              onValueChange={handleCorridorSelect}
            >
              <SelectTrigger className="h-8 min-w-[145px] text-[10px]">
                <SelectValue placeholder="Select corridor" />
              </SelectTrigger>

              <SelectContent>
                {corridors.length > 0 ? (
                  corridors.map((c) => {
                    const start = c.startStation?.name || "Delhi";
                    const end = c.endStation?.name || "Agra";
                    return (
                      <SelectItem key={c.id} value={c.code}>
                        {c.code} ({start} - {end})
                      </SelectItem>
                    );
                  })
                ) : (
                  <>
                    <SelectItem value="C-01">C-01 (Delhi - Agra)</SelectItem>
                    <SelectItem value="C-02">C-02 (Aligarh - Kanpur)</SelectItem>
                    <SelectItem value="C-03">C-03 (Lucknow - Varanasi)</SelectItem>
                    <SelectItem value="C-04">C-04 (Varanasi - Prayagraj)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date picker */}
          <div>
            <p className="mb-1 text-[9px] text-muted-foreground">Date</p>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" className="h-8 gap-2 text-[10px]">
                    <CalendarDays className="size-3.5 text-primary" />
                    <span>{currentDate}</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </Button>
                }
              />
              <DropdownMenuContent align="start" className="w-52 text-xs">
                <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Planning Date
                </DropdownMenuLabel>
                {[
                  { date: "14 September 2025", desc: "Possession Window (C-01)" },
                  { date: "15 September 2025", desc: "Tomorrow" },
                  { date: "16 September 2025", desc: "Upcoming" },
                  { date: "17 September 2025", desc: "Upcoming" },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.date}
                    className="flex items-center justify-between text-xs cursor-pointer"
                    onClick={() => setCurrentDate(item.date)}
                  >
                    <div className="flex flex-col">
                      <span>{item.date}</span>
                      <span className="text-[9px] text-muted-foreground">{item.desc}</span>
                    </div>
                    {currentDate === item.date && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* View mode toggle */}
          <div>
            <p className="mb-1 text-[9px] text-muted-foreground">View</p>

            <div className="flex">
              <Button
                size="sm"
                variant={currentView === "day" ? "default" : "outline"}
                className={`h-8 rounded-r-none text-[10px] ${
                  currentView !== "day" ? "border-r-0" : ""
                }`}
                onClick={() => handleViewChange("day")}
              >
                Day
              </Button>

              <Button
                variant={currentView === "week" ? "default" : "outline"}
                size="sm"
                className={`h-8 rounded-none border-l-0 text-[10px] ${
                  currentView !== "week" ? "border-r-0" : ""
                }`}
                onClick={() => handleViewChange("week")}
              >
                Week
              </Button>

              <Button
                variant={currentView === "month" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-l-none border-l-0 text-[10px]"
                onClick={() => handleViewChange("month")}
              >
                Month
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-end gap-1.5 ml-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    aria-label="Refresh data"
                  >
                    <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="font-medium text-xs">
                Refresh Planner Data
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    aria-label="Export plan"
                  >
                    <Download className="size-4" />
                  </Button>
                }
              />
              <TooltipContent side="bottom" className="font-medium text-xs">
                Export Block Plan
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
