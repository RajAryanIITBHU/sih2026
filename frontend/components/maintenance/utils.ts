import type { Priority, MaintenanceStatus } from "./types";

/* -------------------------------------------------------------------------- */
/*                              RISK HELPERS                                  */
/* -------------------------------------------------------------------------- */

export function getRiskClass(risk: number) {
  if (risk >= 80) return "bg-destructive";
  if (risk >= 60) return "bg-orange-500";
  if (risk >= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

export function getRiskTrackClass(risk: number) {
  if (risk >= 80) return "bg-destructive/15";
  if (risk >= 60) return "bg-orange-500/15";
  if (risk >= 40) return "bg-amber-500/15";
  return "bg-emerald-500/15";
}

/* -------------------------------------------------------------------------- */
/*                              BADGE STYLES                                  */
/* -------------------------------------------------------------------------- */

export const priorityStyles: Record<Priority, string> = {
  Critical:
    "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/10",
  High: "border-transparent bg-orange-500/10 text-orange-600 hover:bg-orange-500/10",
  Medium:
    "border-transparent bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
  Low: "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
};

export const statusStyles: Record<MaintenanceStatus, string> = {
  Pending:
    "border-transparent bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
  Planned:
    "border-transparent bg-sky-500/10 text-sky-600 hover:bg-sky-500/10",
  Completed:
    "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
};
