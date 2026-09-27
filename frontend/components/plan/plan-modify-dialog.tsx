"use client";

import * as React from "react";
import { Clock, Edit3, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaintenanceBlock } from "./types";

export interface PlanModifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: MaintenanceBlock | null;
  onSave: (updated: MaintenanceBlock) => void;
}

export function PlanModifyDialog({
  open,
  onOpenChange,
  block,
  onSave,
}: PlanModifyDialogProps) {
  const [startTime, setStartTime] = React.useState(block?.startTime || "11:00");
  const [endTime, setEndTime] = React.useState(block?.endTime || "15:00");
  const [blockType, setBlockType] = React.useState<any>(block?.blockType || "Full Possession");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (block) {
      setStartTime(block.startTime);
      setEndTime(block.endTime);
      setBlockType(block.blockType);
      setReason("");
    }
  }, [block]);

  if (!block) return null;

  const handleSave = () => {
    // Parse duration
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let dur = endH + endM / 60 - (startH + startM / 60);
    if (dur <= 0) dur += 24;

    const updated: MaintenanceBlock = {
      ...block,
      startTime,
      endTime,
      durationHours: Number(dur.toFixed(1)),
      blockType,
      status: "Pending Review",
    };

    onSave(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Edit3 className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Modify Block Timing & Possession
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Adjust window for {block.blockCode} ({block.corridorName})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Possession Category</label>
            <Select value={blockType} onValueChange={(val) => setBlockType(val as any)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Possession">Full Possession (All Traffic Suspended)</SelectItem>
                <SelectItem value="Shadow Block">Shadow Block (Adjacent Line Active)</SelectItem>
                <SelectItem value="Power Disconnection Only">Power Disconnection Only (Diesel Trains Permitted)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Controller Justification Note</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Shifted 30 mins to allow punctual run of 12002 Shatabdi"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="text-xs h-8 font-semibold bg-primary text-primary-foreground gap-1.5"
          >
            <Save className="size-3.5" />
            <span>Apply Changes</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
