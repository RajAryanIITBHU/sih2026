"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  FileCheck,
  Layers,
  Lock,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MaintenanceBlock } from "./types";

export interface PlanApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blocks: MaintenanceBlock[];
  onConfirmApproval: (note: string) => void;
}

export function PlanApprovalDialog({
  open,
  onOpenChange,
  blocks,
  onConfirmApproval,
}: PlanApprovalDialogProps) {
  const [controllerNote, setControllerNote] = React.useState(
    "Approved by Chief Section Controller / Northern Central Railway. Authorized for BDMS broadcast."
  );
  const [safetyVerified, setSafetyVerified] = React.useState(true);

  const pendingBlocks = blocks.filter((b) => b.status !== "Controller Approved");
  const totalTasks = blocks.reduce((acc, b) => acc + b.tasksCount, 0);
  const totalDowntimeSaved = blocks.reduce((acc, b) => acc + b.downtimeSavedHours, 0);

  const handleConfirm = () => {
    onConfirmApproval(controllerNote);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Authorize Multi-Department Maintenance Plan
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Formal electronic sign-off and broadcast to BDMS, TMS, SMMS, and COA
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 py-1 text-xs">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border p-2.5 bg-muted/20 text-center">
              <span className="text-[11px] text-muted-foreground block">Blocks to Sign</span>
              <span className="font-bold text-sm text-foreground">{blocks.length} Blocks</span>
            </div>
            <div className="rounded-lg border p-2.5 bg-muted/20 text-center">
              <span className="text-[11px] text-muted-foreground block">Bundled Tasks</span>
              <span className="font-bold text-sm text-foreground">{totalTasks} Tasks</span>
            </div>
            <div className="rounded-lg border p-2.5 bg-muted/20 text-center">
              <span className="text-[11px] text-muted-foreground block">Downtime Saved</span>
              <span className="font-bold text-sm text-emerald-600">+{totalDowntimeSaved}h</span>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="rounded-xl border p-3 bg-card space-y-2">
            <span className="font-semibold text-xs text-foreground block">
              Automated Safety & Regulatory Verification
            </span>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Zero passenger train cancellations across all scheduled slots</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Traction Power Controller (TPC) OHE de-energization permits ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Track machines (CSM, BCM) and gang crew rosters matched and verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Complies with Indian Railways General Rules (GR 4.08 & SR 4.09)</span>
              </div>
            </div>
          </div>

          {/* Controller Sign-off note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileCheck className="size-3.5 text-primary" />
              <span>Controller Authorization Endorsement</span>
            </label>
            <Input
              value={controllerNote}
              onChange={(e) => setControllerNote(e.target.value)}
              className="text-xs h-9"
              placeholder="Enter authorization reference or controller instructions..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            className="text-xs h-9 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
          >
            <ShieldCheck className="size-4" />
            <span>Authorize & Publish Plan</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
