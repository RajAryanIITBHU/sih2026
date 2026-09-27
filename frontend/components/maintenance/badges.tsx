import { Badge } from "@/components/ui/badge";
import type { Priority, MaintenanceStatus } from "./types";
import { getRiskClass, getRiskTrackClass, priorityStyles, statusStyles } from "./utils";

/* -------------------------------------------------------------------------- */
/*                              PRIORITY BADGE                                */
/* -------------------------------------------------------------------------- */

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${priorityStyles[priority]}`}
    >
      {priority}
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/*                               STATUS BADGE                                 */
/* -------------------------------------------------------------------------- */

export function StatusBadge({ status }: { status: MaintenanceStatus }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}
    >
      {status}
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/*                                RISK CELL                                   */
/* -------------------------------------------------------------------------- */

export function RiskCell({ risk }: { risk: number }) {
  return (
    <div className="flex min-w-[80px] items-center gap-2">
      <span className="w-7 text-[10px] font-medium">{risk}%</span>

      <div
        className={`h-1.5 flex-1 overflow-hidden rounded-full ${getRiskTrackClass(risk)}`}
      >
        <div
          className={`h-full rounded-full ${getRiskClass(risk)}`}
          style={{ width: `${risk}%` }}
        />
      </div>
    </div>
  );
}
