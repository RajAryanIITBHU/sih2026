"use client";

import * as React from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface PlanHeaderProps {
  planStatus: "Awaiting Approval" | "Approved" | "Modified";
  onApproveAll: () => void;
  onExport: (format: "csv" | "json" | "pdf") => void;
  onOpenCompare?: () => void;
  selectedHorizon: string;
  onHorizonChange: (val: string) => void;
}

export function PlanHeader({
  planStatus,
  onApproveAll,
  onExport,
  onOpenCompare,
  selectedHorizon,
  onHorizonChange,
}: PlanHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-4">
      {/* Title & context */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl text-foreground">
            Plan Review & Approval
          </h1>
          <Badge
            variant="outline"
            className={
              planStatus === "Approved"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-semibold"
                : "border-amber-500/30 bg-amber-500/10 text-amber-600 font-semibold"
            }
          >
            <span
              className={`mr-1.5 size-2 rounded-full ${
                planStatus === "Approved"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-amber-500 animate-pulse"
              }`}
            />
            {planStatus === "Approved" ? "Authorized & Published" : "Awaiting Controller Sign-off"}
          </Badge>
          <Badge variant="secondary" className="text-xs font-mono">
            COA / BDMS Sync Active
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground md:text-sm">
          Review AI-synchronized multi-department corridor blocks, verify train timetable impact, and authorize publication to engineering divisions.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Horizon Selector */}
        <div className="flex items-center">
          <Select
            value={selectedHorizon}
            onValueChange={(val) => {
              if (val) onHorizonChange(val);
            }}
          >
            <SelectTrigger className="h-9 min-w-[210px] text-xs font-medium">
              <CalendarDays className="size-3.5 mr-2 text-primary" />
              <SelectValue placeholder="Select Plan Horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week-3">Week 3 (14 Sep – 20 Sep 2025)</SelectItem>
              <SelectItem value="week-4">Week 4 (21 Sep – 27 Sep 2025)</SelectItem>
              <SelectItem value="month-sep">Full Month (September 2025)</SelectItem>
              <SelectItem value="month-oct">Advance Lookahead (October 2025)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <Download className="size-3.5" />
              <span>Export</span>
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-48 text-xs">
            <DropdownMenuItem onClick={() => onExport("csv")} className="gap-2 cursor-pointer text-xs">
              <FileSpreadsheet className="size-3.5 text-emerald-600" />
              <span>Export Schedule (CSV)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("pdf")} className="gap-2 cursor-pointer text-xs">
              <FileText className="size-3.5 text-rose-600" />
              <span>Executive Brief (PDF)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("json")} className="gap-2 cursor-pointer text-xs">
              <Sparkles className="size-3.5 text-primary" />
              <span>BDMS Payload (JSON)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Compare Baseline */}
        {onOpenCompare && (
          <Tooltip>
            <TooltipTrigger render={
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenCompare}
                className="h-9 gap-1.5 text-xs"
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Compare</span>
              </Button>
            } />
            <TooltipContent>Compare with manual departmental baseline</TooltipContent>
          </Tooltip>
        )}

        {/* Approve All Button */}
        <Button
          onClick={onApproveAll}
          size="sm"
          className="h-9 gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          <ShieldCheck className="size-4" />
          <span>Approve Complete Plan</span>
        </Button>
      </div>
    </div>
  );
}
