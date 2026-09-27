"use client";

import * as React from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FilePlus2,
  MapPin,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  TrainFront,
  Wrench,
  Zap,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRequestDialog({
  open,
  onOpenChange,
}: CreateRequestDialogProps) {
  const [requestType, setRequestType] = React.useState<"task" | "emergency">("task");
  const [department, setDepartment] = React.useState("Engineering");
  const [corridor, setCorridor] = React.useState("C-01");
  const [title, setTitle] = React.useState("");
  const [locationKm, setLocationKm] = React.useState("");
  const [priority, setPriority] = React.useState("High");
  const [duration, setDuration] = React.useState("2.5");
  const [machineNeeded, setMachineNeeded] = React.useState("CSM Tamper");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [generatedId, setGeneratedId] = React.useState("");

  const handleReset = () => {
    setTitle("");
    setLocationKm("");
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `REQ-${Date.now().toString().slice(-6)}`;
    setGeneratedId(id);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {isSubmitted ? (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Request Dispatched Successfully
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Operational request has been logged into the event pipeline and forwarded to the multi-agent AI planner.
              </p>
            </div>

            <div className="w-full rounded-xl border bg-muted/20 p-3 space-y-2 text-left text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Request Identifier</span>
                <span className="font-mono font-bold text-primary">{generatedId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Department</span>
                <Badge variant="outline" className="text-[10px] py-0 h-4 border-transparent bg-primary/10 text-primary">
                  {department}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Corridor Target</span>
                <span className="font-semibold">{corridor} · {locationKm || "KM 124.0"}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/50 text-[11px] text-emerald-600">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="size-3" />
                  Kafka Event Ingested
                </span>
                <span className="font-mono">bdms.request.queued</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1 h-9 text-xs"
              >
                Log Another Request
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 h-9 text-xs font-semibold bg-primary text-primary-foreground"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FilePlus2 className="size-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    Log New Operational Request
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Create maintenance defect, TMS inspection entry, or BDMS block possession request
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Mode Switcher Tabs */}
            <Tabs
              value={requestType}
              onValueChange={(v) => setRequestType(v as "task" | "emergency")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 h-8 w-full p-0.5 bg-muted/60 text-xs">
                <TabsTrigger value="task" className="text-xs gap-1.5">
                  <Wrench className="size-3" />
                  <span>Maintenance Defect / Task</span>
                </TabsTrigger>
                <TabsTrigger value="emergency" className="text-xs gap-1.5">
                  <ShieldAlert className="size-3 text-destructive" />
                  <span>Emergency Block Request</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="task" className="space-y-3 pt-2 mt-0 focus-visible:outline-none">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Task / Defect Summary <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Catenary dropper slackening & insulator washing"
                    className="h-8 text-xs"
                  />
                </div>

                {/* Department & Corridor Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Department</label>
                    <Select
                      value={department}
                      onValueChange={(val) => {
                        if (val) setDepartment(val);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering (Track & Works)</SelectItem>
                        <SelectItem value="OHE">OHE (Traction Distribution)</SelectItem>
                        <SelectItem value="S&T">S&T (Signals & Telecom)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Corridor Section</label>
                    <Select
                      value={corridor}
                      onValueChange={(val) => {
                        if (val) setCorridor(val);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="C-01">C-01 (Delhi – Agra)</SelectItem>
                        <SelectItem value="C-02">C-02 (Agra – Gwalior)</SelectItem>
                        <SelectItem value="C-03">C-03 (Gwalior – Jhansi)</SelectItem>
                        <SelectItem value="C-04">C-04 (Jhansi – Bina)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location KM & Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Track Chainage / KM <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={locationKm}
                      onChange={(e) => setLocationKm(e.target.value)}
                      placeholder="e.g. KM 134.6 Down Line"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Urgency / Priority</label>
                    <Select
                      value={priority}
                      onValueChange={(val) => {
                        if (val) setPriority(val);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical (Action &lt; 24h)</SelectItem>
                        <SelectItem value="High">High (Next Window &lt; 48h)</SelectItem>
                        <SelectItem value="Medium">Medium (Routine Weekly)</SelectItem>
                        <SelectItem value="Low">Low (Monthly Overhaul)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration & Machinery */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Est. Duration (Hours)
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="8"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Machinery Required</label>
                    <Select
                      value={machineNeeded}
                      onValueChange={(val) => {
                        if (val) setMachineNeeded(val);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSM Tamper">CSM-952 Track Tamper</SelectItem>
                        <SelectItem value="BCM Ballast Cleaner">BCM-303 Ballast Cleaner</SelectItem>
                        <SelectItem value="Tower Wagon TW-04">Tower Wagon TW-04</SelectItem>
                        <SelectItem value="USFD Rig">USFD Rail Flaw Rig</SelectItem>
                        <SelectItem value="Manual Gang Only">Manual Gang Only (No Heavy Rig)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-3 pt-2 mt-0 focus-visible:outline-none">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-destructive font-bold">
                    <AlertTriangle className="size-4" />
                    <span>Emergency Corridor Possession Alert</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    This triggers immediate priority escalation in the Traffic Agent and alerts section controllers.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Critical Incident Justification <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Suspected weld fracture on Up Main line between Palwal – Kosi Kalan"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Corridor Target</label>
                    <Select
                      value={corridor}
                      onValueChange={(val) => {
                        if (val) setCorridor(val);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="C-01">C-01 (Delhi – Agra)</SelectItem>
                        <SelectItem value="C-02">C-02 (Agra – Gwalior)</SelectItem>
                        <SelectItem value="C-03">C-03 (Gwalior – Jhansi)</SelectItem>
                        <SelectItem value="C-04">C-04 (Jhansi – Bina)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Kilometer Post <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={locationKm}
                      onChange={(e) => setLocationKm(e.target.value)}
                      placeholder="e.g. KM 89.2"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Immediate Block Window</label>
                    <Select defaultValue="immediate">
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate Handover (1.0 hr)</SelectItem>
                        <SelectItem value="next-slot">Next Freight Gap (2.0 hrs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Speed Restriction (TSR)</label>
                    <Select defaultValue="stop">
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stop">Total Traffic Suspension (0 km/h)</SelectItem>
                        <SelectItem value="caution-20">Caution 20 km/h on Adjacent Track</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-9 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                <Send className="size-3.5" />
                <span>Submit & Queue in AI Planner</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
