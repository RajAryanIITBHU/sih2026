export type {
  AIPlannerData,
  AvailableBlockItemView,
  BlockWindowWithRelations,
  CorridorWithStations,
  PlannerCorridorItem,
  GoodsForecastRecord,
  MaintenanceTaskWithRelations,
  OptimizationResultView,
  PlanBlockWithRelations,
  PlannerStatsView,
  PlannerTaskView,
  RecommendedBlockView,
  ResourceAvailabilityItemView,
  ResourceWithDepartment,
  ScheduleTaskView,
  TaskPriority,
  TeamWithMembers,
  TimetableSlotWithTrain,
  TrafficForecastDataView,
} from "@/lib/data/ai-planner";

export function mapDepartmentToRow(
  deptCode?: string | null
): "engineering" | "electrical" | "snt" {
  if (!deptCode) return "engineering";
  const code = deptCode.toUpperCase();
  if (code.includes("ENG") || code.includes("TRACK") || code.includes("CIVIL")) {
    return "engineering";
  }
  if (code.includes("OHE") || code.includes("ELEC") || code.includes("POWER")) {
    return "electrical";
  }
  if (code.includes("SNT") || code.includes("SIG") || code.includes("TEL")) {
    return "snt";
  }
  return "engineering";
}
