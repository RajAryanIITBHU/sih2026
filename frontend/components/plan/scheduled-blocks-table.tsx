"use client";

import * as React from "react";
import {
  ArrowUpDown,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrainFront,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { BlockStatus, MaintenanceBlock } from "./types";

export interface ScheduledBlocksTableProps {
  blocks: MaintenanceBlock[];
  selectedBlockId: number | null;
  onSelectBlock: (id: number) => void;
  onApproveBlock: (id: number) => void;
  onRejectBlock: (id: number) => void;
  onModifyBlock: (block: MaintenanceBlock) => void;
  onBulkApprove?: (ids: number[]) => void;
  onBulkReject?: (ids: number[]) => void;
}

export function ScheduledBlocksTable({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onApproveBlock,
  onRejectBlock,
  onModifyBlock,
  onBulkApprove,
  onBulkReject,
}: ScheduledBlocksTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [corridorFilter, setCorridorFilter] = React.useState("all");
  const [deptFilter, setDeptFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<"date" | "corridor" | "tasks" | "score">("date");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  // Filtering
  const filteredBlocks = React.useMemo(() => {
    return blocks.filter((b) => {
      const matchesSearch =
        searchQuery === "" ||
        b.blockCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.corridorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.corridorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
        b.assignedCrew.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCorridor = corridorFilter === "all" || b.corridorId === corridorFilter;
      const matchesDept = deptFilter === "all" || b.departments.includes(deptFilter as any);
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;

      return matchesSearch && matchesCorridor && matchesDept && matchesStatus;
    });
  }, [blocks, searchQuery, corridorFilter, deptFilter, statusFilter]);

  // Sorting
  const sortedBlocks = React.useMemo(() => {
    return [...filteredBlocks].sort((a, b) => {
      let comp = 0;
      if (sortBy === "date") comp = a.id - b.id;
      else if (sortBy === "corridor") comp = a.corridorId.localeCompare(b.corridorId);
      else if (sortBy === "tasks") comp = a.tasksCount - b.tasksCount;
      else if (sortBy === "score") comp = a.aiScore - b.aiScore;

      return sortOrder === "asc" ? comp : -comp;
    });
  }, [filteredBlocks, sortBy, sortOrder]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sortedBlocks.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSort = (field: "date" | "corridor" | "tasks" | "score") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="p-4 pb-3 space-y-3">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">
              Corridor Block Possession Registry
            </CardTitle>
            <Badge variant="secondary" className="text-xs font-mono">
              {sortedBlocks.length} Scheduled
            </Badge>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search block code, gang, corridor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-[190px] md:w-[220px] pl-8 text-xs"
              />
            </div>

            <Select
              value={corridorFilter}
              onValueChange={(val) => setCorridorFilter(val || "all")}
            >
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Corridor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Corridors</SelectItem>
                <SelectItem value="C-01">C-01</SelectItem>
                <SelectItem value="C-02">C-02</SelectItem>
                <SelectItem value="C-03">C-03</SelectItem>
                <SelectItem value="C-04">C-04</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val || "all")}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="AI Suggested">AI Suggested</SelectItem>
                <SelectItem value="Controller Approved">Approved</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Action Strip when rows selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-xs animate-in fade-in-50">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="size-2 rounded-full bg-primary" />
              <span>{selectedIds.length} blocks selected</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedIds([])}
                className="h-7 text-xs"
              >
                Clear
              </Button>
              {onBulkReject && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onBulkReject(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="h-7 text-xs text-destructive hover:bg-destructive/10"
                >
                  Reject Selected
                </Button>
              )}
              {onBulkApprove && (
                <Button
                  size="sm"
                  onClick={() => {
                    onBulkApprove(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="h-7 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="size-3.5" />
                  Approve Selected
                </Button>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10 px-3">
                  <Checkbox
                    checked={
                      sortedBlocks.length > 0 &&
                      selectedIds.length === sortedBlocks.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("date")}
                  className="cursor-pointer text-xs font-semibold"
                >
                  <div className="flex items-center gap-1">
                    <span>Date & Window</span>
                    <ArrowUpDown className="size-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("corridor")}
                  className="cursor-pointer text-xs font-semibold"
                >
                  <div className="flex items-center gap-1">
                    <span>Corridor Section</span>
                    <ArrowUpDown className="size-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("tasks")}
                  className="cursor-pointer text-xs font-semibold"
                >
                  <div className="flex items-center gap-1">
                    <span>Tasks & Depts</span>
                    <ArrowUpDown className="size-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  Train Timetable Impact
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("score")}
                  className="cursor-pointer text-xs font-semibold text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>AI Score</span>
                    <ArrowUpDown className="size-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-right px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedBlocks.length > 0 ? (
                sortedBlocks.map((block) => {
                  const isSelected = selectedBlockId === block.id;
                  const isChecked = selectedIds.includes(block.id);

                  return (
                    <TableRow
                      key={block.id}
                      onClick={() => onSelectBlock(block.id)}
                      className={cn(
                        "cursor-pointer transition-colors group",
                        isSelected ? "bg-primary/[0.07] hover:bg-primary/[0.09]" : "hover:bg-muted/40"
                      )}
                    >
                      {/* Checkbox */}
                      <TableCell
                        className="px-3"
                        onClick={(e) => handleToggleSelect(block.id, e)}
                      >
                        <Checkbox checked={isChecked} />
                      </TableCell>

                      {/* Date & Window */}
                      <TableCell className="py-2.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-foreground">
                            {block.date}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                            <Clock className="size-3 text-primary" />
                            {block.startTime} – {block.endTime} ({block.durationHours}h)
                          </span>
                        </div>
                      </TableCell>

                      {/* Corridor Section */}
                      <TableCell className="py-2.5">
                        <div className="flex flex-col">
                          <span className="font-medium text-xs text-foreground flex items-center gap-1.5">
                            <Badge variant="outline" className="px-1.5 py-0 h-4 text-[10px] font-mono">
                              {block.corridorId}
                            </Badge>
                            {block.corridorName}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {block.blockType}
                          </span>
                        </div>
                      </TableCell>

                      {/* Tasks & Depts */}
                      <TableCell className="py-2.5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-semibold text-xs text-foreground">
                              {block.tasksCount} Tasks
                            </span>
                            <span className="text-[11px] text-muted-foreground">in</span>
                            {block.departments.map((dept) => (
                              <Badge
                                key={dept}
                                variant="outline"
                                className={cn(
                                  "text-[10px] py-0 px-1.5 h-4 border-transparent font-medium",
                                  dept === "Engineering" && "bg-emerald-500/10 text-emerald-600",
                                  dept === "OHE" && "bg-sky-500/10 text-sky-600",
                                  dept === "S&T" && "bg-violet-500/10 text-violet-600"
                                )}
                              >
                                {dept}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                            {block.assignedCrew}
                          </span>
                        </div>
                      </TableCell>

                      {/* Train Timetable Impact */}
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <TrainFront className={cn(
                            "size-3.5 shrink-0",
                            block.trainsRegulated === 0 ? "text-emerald-600" : "text-amber-600"
                          )} />
                          <span className={cn(
                            "text-xs font-medium",
                            block.trainsRegulated === 0 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                          )}>
                            {block.trainImpactSummary}
                          </span>
                        </div>
                      </TableCell>

                      {/* AI Optimization Score */}
                      <TableCell className="py-2.5 text-right font-mono">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-bold px-2 py-0.5 border-transparent",
                            block.aiScore >= 90
                              ? "bg-emerald-500/15 text-emerald-600"
                              : block.aiScore >= 80
                              ? "bg-primary/15 text-primary"
                              : "bg-amber-500/15 text-amber-600"
                          )}
                        >
                          <Sparkles className="size-2.5 mr-1" />
                          {block.aiScore}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-2.5 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] font-medium px-2 py-0.5 border-transparent whitespace-nowrap",
                            block.status === "Controller Approved" && "bg-emerald-500/15 text-emerald-600",
                            block.status === "AI Suggested" && "bg-blue-500/15 text-blue-600",
                            block.status === "Pending Review" && "bg-amber-500/15 text-amber-600",
                            block.status === "Rejected" && "bg-rose-500/15 text-rose-600"
                          )}
                        >
                          {block.status === "Controller Approved" && <Check className="size-3 mr-1" />}
                          {block.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-2.5 text-right px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="w-48 text-xs">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBlock(block.id);
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <Eye className="size-3.5" />
                              <span>View Block Details</span>
                            </DropdownMenuItem>

                            {block.status !== "Controller Approved" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApproveBlock(block.id);
                                }}
                                className="gap-2 cursor-pointer text-xs text-emerald-600 font-medium"
                              >
                                <CheckCircle2 className="size-3.5" />
                                <span>Authorize & Approve</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onModifyBlock(block);
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <Edit3 className="size-3.5" />
                              <span>Modify Window</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {block.status !== "Rejected" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRejectBlock(block.id);
                                }}
                                className="gap-2 cursor-pointer text-xs text-destructive"
                              >
                                <XCircle className="size-3.5" />
                                <span>Reject Block</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-xs text-muted-foreground">
                    No corridor blocks match the selected search and filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Pagination & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t p-3 text-xs text-muted-foreground">
          <span>
            Showing 1–{sortedBlocks.length} of {sortedBlocks.length} scheduled corridor blocks
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs">All blocks synchronized with COA corridor paths</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
