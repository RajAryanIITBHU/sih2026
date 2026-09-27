"use client";

import * as React from "react";
import { PlanHeader } from "./plan-header";
import { PlanStats } from "./plan-stats";
import { PlanViewControls } from "./plan-view-controls";
import { WeeklyPlanMatrix } from "./weekly-plan-matrix";
import { MonthlyPlanCalendar } from "./monthly-plan-calendar";
import { ScheduledBlocksTable } from "./scheduled-blocks-table";
import { BlockDetailsPanel } from "./block-details-panel";
import { PlanApprovalDialog } from "./plan-approval-dialog";
import { PlanModifyDialog } from "./plan-modify-dialog";
import { initialBlocks, initialPlanKPIs } from "./mock-data";
import { MaintenanceBlock, PlanViewMode } from "./types";

export function PlanView() {
  const [blocks, setBlocks] = React.useState<MaintenanceBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = React.useState<number | null>(1);
  const [showDetails, setShowDetails] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<PlanViewMode>("week");
  const [selectedCorridor, setSelectedCorridor] = React.useState("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = React.useState("all");
  const [selectedHorizon, setSelectedHorizon] = React.useState("week-3");
  const [planStatus, setPlanStatus] = React.useState<"Awaiting Approval" | "Approved" | "Modified">(
    "Awaiting Approval"
  );

  // Dialogs
  const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = React.useState(false);
  const [modifyingBlock, setModifyingBlock] = React.useState<MaintenanceBlock | null>(null);

  // Active selected block
  const currentBlock = React.useMemo(() => {
    return blocks.find((b) => b.id === selectedBlockId) || blocks[0] || null;
  }, [blocks, selectedBlockId]);

  // Actions
  const handleApproveBlock = (id: number) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "Controller Approved",
              approvalAudit: {
                approvedBy: "Chief Section Controller",
                approvedAt: new Date().toLocaleTimeString(),
              },
            }
          : b
      )
    );
  };

  const handleRejectBlock = (id: number) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "Rejected" } : b
      )
    );
  };

  const handleOpenModify = (block: MaintenanceBlock) => {
    setModifyingBlock(block);
    setModifyDialogOpen(true);
  };

  const handleSaveModified = (updated: MaintenanceBlock) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
    setPlanStatus("Modified");
  };

  const handleBulkApprove = (ids: number[]) => {
    setBlocks((prev) =>
      prev.map((b) =>
        ids.includes(b.id) ? { ...b, status: "Controller Approved" } : b
      )
    );
  };

  const handleBulkReject = (ids: number[]) => {
    setBlocks((prev) =>
      prev.map((b) =>
        ids.includes(b.id) ? { ...b, status: "Rejected" } : b
      )
    );
  };

  const handleConfirmPlanApproval = (note: string) => {
    setBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        status: "Controller Approved",
        approvalAudit: {
          approvedBy: "Chief Section Controller",
          approvedAt: new Date().toLocaleTimeString(),
          note,
        },
      }))
    );
    setPlanStatus("Approved");
  };

  const handleExport = (format: "csv" | "json" | "pdf") => {
    if (format === "csv") {
      const headers = "ID,Code,Date,Time,Corridor,Tasks,Status,AI_Score\n";
      const rows = blocks
        .map(
          (b) =>
            `${b.id},"${b.blockCode}","${b.date}","${b.startTime}-${b.endTime}","${b.corridorId}",${b.tasksCount},"${b.status}",${b.aiScore}`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `corridor-blocks-${selectedHorizon}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(blocks, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `corridor-blocks-${selectedHorizon}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Header */}
      <PlanHeader
        planStatus={planStatus}
        onApproveAll={() => setApprovalDialogOpen(true)}
        onExport={handleExport}
        selectedHorizon={selectedHorizon}
        onHorizonChange={setSelectedHorizon}
      />

      {/* 2. KPI Cards */}
      <PlanStats kpis={initialPlanKPIs} />

      {/* 3. View Controls */}
      <PlanViewControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCorridor={selectedCorridor}
        onCorridorChange={setSelectedCorridor}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails((prev) => !prev)}
        selectedDeptFilter={selectedDeptFilter}
        onDeptFilterChange={setSelectedDeptFilter}
      />

      {/* 4. Main Body Layout */}
      {viewMode === "month" ? (
        <MonthlyPlanCalendar
          onSelectWeek={(weekId) => {
            setSelectedHorizon(weekId);
            setViewMode("week");
          }}
        />
      ) : (
        <div
          className={`grid items-start gap-4 ${
            showDetails && currentBlock
              ? "xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]"
              : "grid-cols-1"
          }`}
        >
          {/* Main Left Column */}
          <div className="min-w-0 space-y-4">
            {viewMode === "week" && (
              <WeeklyPlanMatrix
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={(id) => {
                  setSelectedBlockId(id);
                  setShowDetails(true);
                }}
                corridorFilter={selectedCorridor}
                deptFilter={selectedDeptFilter}
              />
            )}

            <ScheduledBlocksTable
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={(id) => {
                setSelectedBlockId(id);
                setShowDetails(true);
              }}
              onApproveBlock={handleApproveBlock}
              onRejectBlock={handleRejectBlock}
              onModifyBlock={handleOpenModify}
              onBulkApprove={handleBulkApprove}
              onBulkReject={handleBulkReject}
            />
          </div>

          {/* Right Column: Block Details Side Panel */}
          {showDetails && currentBlock && (
            <div className="xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)]">
              <BlockDetailsPanel
                block={currentBlock}
                onClose={() => setShowDetails(false)}
                onApprove={handleApproveBlock}
                onReject={handleRejectBlock}
                onModify={handleOpenModify}
              />
            </div>
          )}
        </div>
      )}

      {/* 5. Modals */}
      <PlanApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        blocks={blocks}
        onConfirmApproval={handleConfirmPlanApproval}
      />

      <PlanModifyDialog
        open={modifyDialogOpen}
        onOpenChange={setModifyDialogOpen}
        block={modifyingBlock}
        onSave={handleSaveModified}
      />
    </div>
  );
}
