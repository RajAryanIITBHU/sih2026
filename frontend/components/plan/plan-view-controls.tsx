"use client";

import * as React from "react";
import {
  Calendar,
  CalendarDays,
  Columns3,
  Filter,
  ListFilter,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanViewMode } from "./types";

export interface PlanViewControlsProps {
  viewMode: PlanViewMode;
  onViewModeChange: (mode: PlanViewMode) => void;
  selectedCorridor: string;
  onCorridorChange: (corridor: string) => void;
  showDetails: boolean;
  onToggleDetails: () => void;
  selectedDeptFilter: string;
  onDeptFilterChange: (dept: string) => void;
}

export function PlanViewControls({
  viewMode,
  onViewModeChange,
  selectedCorridor,
  onCorridorChange,
  showDetails,
  onToggleDetails,
  selectedDeptFilter,
  onDeptFilterChange,
}: PlanViewControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card/60 p-2.5">
      {/* View Switcher */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="inline-flex rounded-lg bg-muted/60 p-1 border">
          <Button
            type="button"
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("week")}
            className="h-7 px-3 text-xs gap-1.5"
          >
            <CalendarDays className="size-3.5" />
            <span>Week Matrix</span>
          </Button>

          <Button
            type="button"
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("month")}
            className="h-7 px-3 text-xs gap-1.5"
          >
            <Calendar className="size-3.5" />
            <span>Monthly Lookahead</span>
          </Button>

          <Button
            type="button"
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-7 px-3 text-xs gap-1.5"
          >
            <ListFilter className="size-3.5" />
            <span>List & Audit</span>
          </Button>
        </div>

        {/* Quick Corridor Filter */}
        <Select
          value={selectedCorridor}
          onValueChange={(val) => {
            if (val) onCorridorChange(val);
          }}
        >
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="All Corridors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Corridors (4)</SelectItem>
            <SelectItem value="C-01">C-01: Delhi – Agra</SelectItem>
            <SelectItem value="C-02">C-02: Agra – Gwalior</SelectItem>
            <SelectItem value="C-03">C-03: Gwalior – Jhansi</SelectItem>
            <SelectItem value="C-04">C-04: Jhansi – Bina</SelectItem>
          </SelectContent>
        </Select>

        {/* Quick Dept Filter */}
        <Select
          value={selectedDeptFilter}
          onValueChange={(val) => {
            if (val) onDeptFilterChange(val);
          }}
        >
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Depts</SelectItem>
            <SelectItem value="Engineering">Engineering (Track)</SelectItem>
            <SelectItem value="OHE">OHE (Electrical)</SelectItem>
            <SelectItem value="S&T">S&T (Signals)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right side: Legend and Toggle sidebar */}
      <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
        {/* Department Colors Legend */}
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Track</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-500" />
            <span>OHE</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-violet-500" />
            <span>S&T</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            <span>Joint Bundle</span>
          </span>
        </div>

        {/* Sidebar Toggle */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleDetails}
          className="h-8 gap-1.5 text-xs"
        >
          {showDetails ? (
            <>
              <PanelRightClose className="size-3.5" />
              <span>Hide Details</span>
            </>
          ) : (
            <>
              <PanelRightOpen className="size-3.5" />
              <span>Show Details</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
