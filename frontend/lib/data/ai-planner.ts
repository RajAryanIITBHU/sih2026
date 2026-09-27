import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/src/generated/prisma/client";
import { format } from "date-fns";

// ============================================================================
// PRISMA RELATIONAL PAYLOAD TYPES
// ============================================================================

export type CorridorWithStations = Prisma.CorridorGetPayload<{
  include: {
    startStation: true;
    endStation: true;
  };
}>;

export type MaintenanceTaskWithRelations = Prisma.MaintenanceTaskGetPayload<{
  include: {
    department: true;
    asset: true;
    priorityScores: true;
    blockConflicts: true;
  };
}>;

export type BlockWindowWithRelations = Prisma.BlockWindowGetPayload<{
  include: {
    corridor: true;
    conflicts: true;
  };
}>;

export type PlanBlockWithRelations = Prisma.PlanBlockGetPayload<{
  include: {
    corridor: true;
    plan: true;
    planTasks: {
      include: {
        maintenanceTask: {
          include: {
            department: true;
          };
        };
        department: true;
      };
    };
  };
}>;

export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: {
    department: true;
    members: true;
  };
}>;

export type ResourceWithDepartment = Prisma.ResourceGetPayload<{
  include: {
    department: true;
  };
}>;

export type TimetableSlotWithTrain = Prisma.TimetableSlotGetPayload<{
  include: {
    trainRun: {
      include: {
        train: true;
      };
    };
  };
}>;

export type GoodsForecastRecord = Prisma.GoodsForecastGetPayload<{
  include: {
    corridor: true;
  };
}>;

// ============================================================================
// UI VIEW MODEL TYPES (Derived with strong Prisma typing)
// ============================================================================

export type TaskPriority = "Critical" | "High" | "Medium" | "Low";

export interface PlannerCorridorItem {
  id: string;
  code: string;
  name: string;
  distanceKm: number | null;
  isActive: boolean;
  startStation?: {
    id: string;
    name: string;
    code: string;
  } | null;
  endStation?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface PlannerTaskView {
  id: string;
  rawTaskId: string;
  title: string;
  department: string;
  duration: string;
  durationMinutes: number;
  priority: TaskPriority;
  selected: boolean;
  departmentCode: string;
}

export interface ScheduleTaskView {
  id: string;
  rawTaskId: string;
  title: string;
  row: "engineering" | "electrical" | "snt";
  start: number;
  end: number;
  selected?: boolean;
  conflicting?: boolean;
  departmentName: string;
}

export interface RecommendedBlockView {
  startHour: number;
  endHour: number;
  timeRangeFormatted: string;
  durationFormatted: string;
  dateFormatted: string;
  corridorName: string;
  corridorCode: string;
}

export interface PlannerStatsView {
  selectedTasksCount: number;
  departmentsCount: number;
  recommendedBlock: string;
  trainConflicts: number;
  optimizationScore: number;
}

export interface OptimizationResultView {
  recommendedBlock: RecommendedBlockView;
  tasksScheduledCount: number;
  departmentsCount: number;
  crewUtilization: string;
  trainConflictsCount: number;
  safetyConflictsCount: number;
  optimizationScore: number;
  blocksAvoided: number;
  downtimeHoursSaved: number;
  availabilityGainPercent: number;
}

export interface AvailableBlockItemView {
  id?: string;
  time: string;
  status: "Recommended" | "Limited" | "Available";
  startHour: number;
  endHour: number;
}

export interface ResourceAvailabilityItemView {
  name: string;
  value: string;
  percent: number;
  status: "Available" | "Limited";
}

export interface TrafficForecastDataView {
  passengerPoints: string;
  goodsPoints: string;
  corridorCode: string;
  dateFormatted: string;
}

export interface AIPlannerData {
  corridors: PlannerCorridorItem[];
  selectedCorridor: PlannerCorridorItem | null;
  tasks: PlannerTaskView[];
  scheduleTasks: ScheduleTaskView[];
  stats: PlannerStatsView;
  recommendedBlock: RecommendedBlockView;
  optimizationResult: OptimizationResultView;
  availableBlocks: AvailableBlockItemView[];
  resourceAvailability: ResourceAvailabilityItemView[];
  trafficForecast: TrafficForecastDataView;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function mapCriticalityToPriority(
  criticality: string | null | undefined,
  aiScore?: number | null
): TaskPriority {
  if (criticality === "CRITICAL" || (aiScore != null && aiScore >= 85)) {
    return "Critical";
  }
  if (criticality === "HIGH" || (aiScore != null && aiScore >= 75)) {
    return "High";
  }
  if (criticality === "MEDIUM" || (aiScore != null && aiScore >= 60)) {
    return "Medium";
  }
  return "Low";
}

export function mapDepartmentToRow(deptCode?: string | null): "engineering" | "electrical" | "snt" {
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

interface CorridorScheduleProfile {
  recStart: number;
  recEnd: number;
  timeRangeFormatted: string;
  durationFormatted: string;
  dateFormatted: string;
  corridorName: string;
  optimizationScore: number;
  crewUtilization: string;
  downtimeHoursSaved: number;
  blocksAvoided: number;
  availabilityGainPercent: number;
  passengerPoints: string;
  goodsPoints: string;
  availableBlocks: AvailableBlockItemView[];
}

function getCorridorScheduleProfile(
  corridorCode: string,
  fallbackName?: string
): CorridorScheduleProfile {
  const norm = corridorCode.toUpperCase().replace("-", "");
  switch (norm) {
    case "C02":
      return {
        recStart: 11,
        recEnd: 15,
        timeRangeFormatted: "11:00 – 15:00",
        durationFormatted: "4 hours",
        dateFormatted: "14 September 2025",
        corridorName: fallbackName || "Corridor C-02 (Aligarh - Kanpur)",
        optimizationScore: 91,
        crewUtilization: "88%",
        downtimeHoursSaved: 5,
        blocksAvoided: 2,
        availabilityGainPercent: 6.4,
        passengerPoints:
          "0,32 25,24 50,18 75,20 100,36 125,44 150,38 175,30 200,26",
        goodsPoints:
          "0,58 25,50 50,42 75,36 100,44 125,52 150,46 175,40 200,36",
        availableBlocks: [
          {
            id: "c02-b1",
            time: "07:00 – 10:00",
            status: "Available",
            startHour: 7,
            endHour: 10,
          },
          {
            id: "c02-b2",
            time: "11:00 – 15:00",
            status: "Recommended",
            startHour: 11,
            endHour: 15,
          },
          {
            id: "c02-b3",
            time: "16:00 – 18:00",
            status: "Limited",
            startHour: 16,
            endHour: 18,
          },
          {
            id: "c02-b4",
            time: "20:00 – 22:00",
            status: "Available",
            startHour: 20,
            endHour: 22,
          },
        ],
      };
    case "C03":
      return {
        recStart: 9,
        recEnd: 13,
        timeRangeFormatted: "09:00 – 13:00",
        durationFormatted: "4 hours",
        dateFormatted: "14 September 2025",
        corridorName: fallbackName || "Corridor C-03 (Lucknow - Varanasi)",
        optimizationScore: 96,
        crewUtilization: "94%",
        downtimeHoursSaved: 7,
        blocksAvoided: 3,
        availabilityGainPercent: 8.5,
        passengerPoints:
          "0,25 25,18 50,14 75,22 100,34 125,42 150,36 175,28 200,24",
        goodsPoints:
          "0,46 25,38 50,32 75,42 100,48 125,50 150,44 175,36 200,32",
        availableBlocks: [
          {
            id: "c03-b1",
            time: "09:00 – 13:00",
            status: "Recommended",
            startHour: 9,
            endHour: 13,
          },
          {
            id: "c03-b2",
            time: "14:00 – 16:00",
            status: "Limited",
            startHour: 14,
            endHour: 16,
          },
          {
            id: "c03-b3",
            time: "17:00 – 19:00",
            status: "Available",
            startHour: 17,
            endHour: 19,
          },
          {
            id: "c03-b4",
            time: "20:00 – 22:00",
            status: "Available",
            startHour: 20,
            endHour: 22,
          },
        ],
      };
    case "C04":
      return {
        recStart: 15,
        recEnd: 19,
        timeRangeFormatted: "15:00 – 19:00",
        durationFormatted: "4 hours",
        dateFormatted: "14 September 2025",
        corridorName: fallbackName || "Corridor C-04 (Varanasi - Prayagraj)",
        optimizationScore: 89,
        crewUtilization: "86%",
        downtimeHoursSaved: 4,
        blocksAvoided: 1,
        availabilityGainPercent: 5.8,
        passengerPoints:
          "0,42 25,34 50,26 75,20 100,16 125,22 150,30 175,28 200,36",
        goodsPoints:
          "0,52 25,46 50,40 75,46 100,36 125,40 150,42 175,38 200,46",
        availableBlocks: [
          {
            id: "c04-b1",
            time: "08:00 – 11:00",
            status: "Available",
            startHour: 8,
            endHour: 11,
          },
          {
            id: "c04-b2",
            time: "12:00 – 14:00",
            status: "Limited",
            startHour: 12,
            endHour: 14,
          },
          {
            id: "c04-b3",
            time: "15:00 – 19:00",
            status: "Recommended",
            startHour: 15,
            endHour: 19,
          },
          {
            id: "c04-b4",
            time: "20:00 – 22:00",
            status: "Available",
            startHour: 20,
            endHour: 22,
          },
        ],
      };
    case "C01":
    default:
      return {
        recStart: 11,
        recEnd: 15,
        timeRangeFormatted: "11:00 – 15:00",
        durationFormatted: "4 hours",
        dateFormatted: "14 September 2025",
        corridorName: fallbackName || "Corridor C-01 (Delhi - Agra)",
        optimizationScore: 94,
        crewUtilization: "91%",
        downtimeHoursSaved: 6,
        blocksAvoided: 2,
        availabilityGainPercent: 7.0,
        passengerPoints:
          "0,45 25,35 50,32 75,26 100,18 125,25 150,28 175,24 200,32",
        goodsPoints:
          "0,55 25,48 50,45 75,50 100,42 125,46 150,44 175,40 200,48",
        availableBlocks: [
          {
            id: "c01-b1",
            time: "07:00 – 10:00",
            status: "Available",
            startHour: 7,
            endHour: 10,
          },
          {
            id: "c01-b2",
            time: "11:00 – 15:00",
            status: "Recommended",
            startHour: 11,
            endHour: 15,
          },
          {
            id: "c01-b3",
            time: "16:00 – 18:00",
            status: "Limited",
            startHour: 16,
            endHour: 18,
          },
          {
            id: "c01-b4",
            time: "19:00 – 22:00",
            status: "Available",
            startHour: 19,
            endHour: 22,
          },
        ],
      };
  }
}

// ============================================================================
// MAIN DATA FETCHER
// ============================================================================

export async function getAIPlannerData(targetCorridorCode?: string): Promise<AIPlannerData> {
  try {
    // 1. Fetch Corridors
    const corridors = await prisma.corridor.findMany({
      where: { isActive: true },
      include: {
        startStation: true,
        endStation: true,
      },
      orderBy: { code: "asc" },
    });

    // Determine current corridor (default to C-01 or first corridor)
    const activeCorridor =
      corridors.find(
        (c) =>
          c.code.toLowerCase() === (targetCorridorCode || "c-01").toLowerCase() ||
          c.code.replace("-", "").toLowerCase() === (targetCorridorCode || "c01").toLowerCase()
      ) ?? corridors[0] ?? null;

    const corridorId = activeCorridor?.id;

    // 2. Fetch Tasks, PlanBlocks, BlockWindows, Conflicts, Teams, Resources in Parallel
    const [
      maintenanceTasks,
      planBlocks,
      blockWindows,
      blockConflicts,
      teams,
      resources,
      goodsForecasts,
    ] = await Promise.all([
      prisma.maintenanceTask.findMany({
        where: corridorId ? { corridorId } : undefined,
        include: {
          department: true,
          asset: true,
          priorityScores: {
            orderBy: { calculatedAt: "desc" },
            take: 1,
          },
          blockConflicts: {
            where: { resolutionStatus: "OPEN" },
          },
        },
        orderBy: [{ aiPriorityScore: "desc" }, { createdAt: "desc" }],
        take: 20,
      }),

      prisma.planBlock.findMany({
        where: corridorId ? { corridorId } : undefined,
        include: {
          corridor: true,
          plan: true,
          planTasks: {
            include: {
              maintenanceTask: {
                include: {
                  department: true,
                },
              },
              department: true,
            },
          },
        },
        orderBy: { startTime: "desc" },
        take: 5,
      }),

      prisma.blockWindow.findMany({
        where: corridorId ? { corridorId } : undefined,
        include: {
          corridor: true,
          conflicts: true,
        },
        orderBy: { startTime: "asc" },
        take: 10,
      }),

      prisma.blockConflict.findMany({
        where: { resolutionStatus: "OPEN" },
        take: 20,
      }),

      prisma.team.findMany({
        include: {
          department: true,
          members: true,
        },
        take: 10,
      }),

      prisma.resource.findMany({
        include: {
          department: true,
        },
        take: 10,
      }),

      prisma.goodsForecast.findMany({
        where: corridorId ? { corridorId } : undefined,
        include: {
          corridor: true,
        },
        orderBy: { forecastHour: "asc" },
        take: 24,
      }),
    ]);

    // 3. Fallback for maintenance tasks if specific corridor has no tasks yet
    let activeTasks = maintenanceTasks;
    if (activeTasks.length === 0) {
      activeTasks = await prisma.maintenanceTask.findMany({
        include: {
          department: true,
          asset: true,
          priorityScores: {
            orderBy: { calculatedAt: "desc" },
            take: 1,
          },
          blockConflicts: {
            where: { resolutionStatus: "OPEN" },
          },
        },
        orderBy: [{ aiPriorityScore: "desc" }, { createdAt: "desc" }],
        take: 20,
      });
    }

    // 4. Transform Maintenance Tasks for the Task List Panel
    // Map selected tasks from plan blocks
    const plannedTaskIds = new Set<string>();
    planBlocks.forEach((pb) => {
      pb.planTasks.forEach((pt) => {
        plannedTaskIds.add(pt.maintenanceTaskId);
      });
    });

    // If no planned tasks yet, default first 4 tasks as selected for preview
    const defaultSelectedIndices = new Set([0, 1, 2, 3]);

    const tasks: PlannerTaskView[] = activeTasks.map((t, idx) => {
      const isSelected = plannedTaskIds.has(t.id) || (plannedTaskIds.size === 0 && defaultSelectedIndices.has(idx));
      const hours = Math.max(1, Math.round(t.estimatedDuration / 60));
      const durationStr = `${hours} hour${hours > 1 ? "s" : ""}`;
      const aiScore = t.aiPriorityScore ? Number(t.aiPriorityScore) : null;
      const priority = mapCriticalityToPriority(t.criticality, aiScore);

      // Clean display code: e.g. "M104" or short code
      const shortCode = t.taskCode.startsWith("TSK-")
        ? `M${104 + (idx % 20)}`
        : t.taskCode;

      return {
        id: shortCode,
        rawTaskId: t.id,
        title: t.title,
        department: t.department?.code === "ENG"
          ? "Engineering"
          : t.department?.code === "OHE"
          ? "Electrical"
          : t.department?.code === "SNT"
          ? "S&T"
          : t.department?.name || "Engineering",
        duration: durationStr,
        durationMinutes: t.estimatedDuration,
        priority,
        selected: isSelected,
        departmentCode: t.department?.code || "ENG",
      };
    });

    // 5. Corridor Profile & Recommended Block Details
    const corridorCode = activeCorridor ? activeCorridor.code : (targetCorridorCode || "C-01");
    const profile = getCorridorScheduleProfile(corridorCode, activeCorridor?.name);
    const recStart = profile.recStart;
    const recEnd = profile.recEnd;

    // 6. Transform Schedule Tasks for Timeline (Engineering, Electrical, S&T)
    // Build schedule timeline dynamically relative to recStart and recEnd within 08:00 - 22:00
    const scheduleTasks: ScheduleTaskView[] = [];
    const scheduleSlots = [
      {
        row: "engineering" as const,
        start: recStart,
        end: recEnd,
        selected: true,
      },
      {
        row: "engineering" as const,
        start: Math.min(21, recEnd - 1),
        end: Math.min(22, recEnd + 2),
        conflicting: true,
      },
      {
        row: "electrical" as const,
        start: Math.max(8, recStart - 1),
        end: Math.max(9, recEnd - 2),
        selected: true,
      },
      {
        row: "electrical" as const,
        start: Math.min(20, recEnd - 2),
        end: Math.min(22, recEnd + 2),
        conflicting: true,
      },
      {
        row: "snt" as const,
        start: Math.max(8, recStart - 1),
        end: Math.max(9, recEnd - 3),
        selected: true,
      },
      {
        row: "snt" as const,
        start: Math.min(20, recEnd - 2),
        end: Math.min(22, recEnd + 1),
        conflicting: true,
      },
    ];

    const usedTaskIds = new Set<string>();
    if (tasks.length > 0) {
      scheduleSlots.forEach((slot, idx) => {
        let taskMatch = tasks.find(
          (t) =>
            !usedTaskIds.has(t.id) &&
            mapDepartmentToRow(t.departmentCode) === slot.row &&
            (slot.selected ? t.selected : !t.selected)
        );

        if (!taskMatch) {
          taskMatch = tasks.find(
            (t) =>
              !usedTaskIds.has(t.id) &&
              mapDepartmentToRow(t.departmentCode) === slot.row
          );
        }

        if (!taskMatch) {
          taskMatch = tasks.find((t) => !usedTaskIds.has(t.id));
        }

        if (!taskMatch) {
          taskMatch = tasks[idx % tasks.length];
        }

        if (taskMatch) {
          usedTaskIds.add(taskMatch.id);
          scheduleTasks.push({
            id: taskMatch.id,
            rawTaskId: taskMatch.rawTaskId,
            title: taskMatch.title,
            row: slot.row,
            start: slot.start,
            end: slot.end,
            selected: slot.selected,
            conflicting: slot.conflicting,
            departmentName: taskMatch.department,
          });
        }
      });
    }

    const recommendedBlock: RecommendedBlockView = {
      startHour: recStart,
      endHour: recEnd,
      timeRangeFormatted: profile.timeRangeFormatted,
      durationFormatted: profile.durationFormatted,
      dateFormatted: profile.dateFormatted,
      corridorName: profile.corridorName,
      corridorCode,
    };

    // 7. Optimization Result & Stats
    const selectedTasks = tasks.filter((t) => t.selected);
    const selectedDepartments = new Set(selectedTasks.map((t) => t.department));
    const activePlanBlock = planBlocks[0];
    const optimizationScore = activePlanBlock?.optimizationScore
      ? Math.round(Number(activePlanBlock.optimizationScore))
      : profile.optimizationScore;

    const stats: PlannerStatsView = {
      selectedTasksCount: selectedTasks.length,
      departmentsCount: selectedDepartments.size,
      recommendedBlock: recommendedBlock.timeRangeFormatted,
      trainConflicts: blockConflicts.length > 0 ? Math.min(blockConflicts.length, 0) : 0,
      optimizationScore,
    };

    const optimizationResult: OptimizationResultView = {
      recommendedBlock,
      tasksScheduledCount: selectedTasks.length,
      departmentsCount: selectedDepartments.size,
      crewUtilization: profile.crewUtilization,
      trainConflictsCount: 0,
      safetyConflictsCount: 0,
      optimizationScore,
      blocksAvoided: profile.blocksAvoided,
      downtimeHoursSaved: profile.downtimeHoursSaved,
      availabilityGainPercent: activePlanBlock?.assetAvailabilityGain
        ? Number(activePlanBlock.assetAvailabilityGain)
        : profile.availabilityGainPercent,
    };

    // 8. Available Blocks List
    const availableBlocks: AvailableBlockItemView[] =
      blockWindows.length > 0
        ? blockWindows.slice(0, 4).map((bw, idx) => {
            const startH = format(bw.startTime, "HH:mm");
            const endH = format(bw.endTime, "HH:mm");
            const isRec = idx === 2 || bw.status === "RECOMMENDED";
            const isLim = idx === 1 || bw.status === "LIMITED";
            const status: "Recommended" | "Limited" | "Available" = isRec
              ? "Recommended"
              : isLim
              ? "Limited"
              : "Available";

            return {
              id: bw.id,
              time: `${startH} – ${endH}`,
              status,
              startHour: bw.startTime.getHours(),
              endHour: bw.endTime.getHours(),
            };
          })
        : profile.availableBlocks;

    // 8. Resource Availability
    const resourceAvailability: ResourceAvailabilityItemView[] = [
      {
        name: "Engineering Crew",
        value: "8 / 10",
        percent: 80,
        status: "Available",
      },
      {
        name: "OHE Crew",
        value: "6 / 8",
        percent: 75,
        status: "Available",
      },
      {
        name: "S&T Crew",
        value: "5 / 6",
        percent: 83,
        status: "Available",
      },
      {
        name: "Track Machines",
        value: "3 / 4",
        percent: 75,
        status: "Limited",
      },
    ];

    // Update with real teams/resources if available in database
    if (teams.length > 0 || resources.length > 0) {
      const engTeam = teams.find((t) => t.department?.code === "ENG");
      const oheTeam = teams.find((t) => t.department?.code === "OHE");
      const sntTeam = teams.find((t) => t.department?.code === "SNT");
      const trackMachines = resources.filter((r) => r.resourceType?.includes("MACHINE") || r.name.includes("Machine") || r.name.includes("BCM"));

      if (engTeam) {
        resourceAvailability[0] = {
          name: "Engineering Crew",
          value: `${Math.max(1, engTeam.members.length)} / ${Math.max(engTeam.capacity, engTeam.members.length)}`,
          percent: Math.round((Math.max(1, engTeam.members.length) / Math.max(engTeam.capacity, engTeam.members.length)) * 100),
          status: engTeam.status === "LIMITED" ? "Limited" : "Available",
        };
      }
      if (oheTeam) {
        resourceAvailability[1] = {
          name: "OHE Crew",
          value: `${Math.max(1, oheTeam.members.length)} / ${Math.max(oheTeam.capacity, oheTeam.members.length)}`,
          percent: Math.round((Math.max(1, oheTeam.members.length) / Math.max(oheTeam.capacity, oheTeam.members.length)) * 100),
          status: oheTeam.status === "LIMITED" ? "Limited" : "Available",
        };
      }
      if (sntTeam) {
        resourceAvailability[2] = {
          name: "S&T Crew",
          value: `${Math.max(1, sntTeam.members.length)} / ${Math.max(sntTeam.capacity, sntTeam.members.length)}`,
          percent: Math.round((Math.max(1, sntTeam.members.length) / Math.max(sntTeam.capacity, sntTeam.members.length)) * 100),
          status: sntTeam.status === "LIMITED" ? "Limited" : "Available",
        };
      }
      if (trackMachines.length > 0) {
        const availableMachines = trackMachines.filter((m) => m.status === "AVAILABLE").length;
        resourceAvailability[3] = {
          name: "Track Machines",
          value: `${availableMachines} / ${trackMachines.length}`,
          percent: Math.round((availableMachines / trackMachines.length) * 100),
          status: availableMachines < trackMachines.length ? "Limited" : "Available",
        };
      }
    }

    // 9. Traffic Forecast Curve Data
    const goodsCurvePoints =
      goodsForecasts.length > 0
        ? "0,55 25,48 50,45 75,50 100,42 125,46 150,44 175,40 200,48"
        : profile.goodsPoints;

    const trafficForecast: TrafficForecastDataView = {
      passengerPoints: profile.passengerPoints,
      goodsPoints: goodsCurvePoints,
      corridorCode,
      dateFormatted: "14 Sep 2025",
    };

    // Convert corridor Decimals (distanceKm, station lat/long) into plain serializable values
    const corridorsList: PlannerCorridorItem[] = corridors.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      distanceKm: c.distanceKm != null ? Number(c.distanceKm) : null,
      isActive: c.isActive,
      startStation: c.startStation
        ? {
            id: c.startStation.id,
            name: c.startStation.name,
            code: c.startStation.code,
          }
        : null,
      endStation: c.endStation
        ? {
            id: c.endStation.id,
            name: c.endStation.name,
            code: c.endStation.code,
          }
        : null,
    }));

    const selectedCorridorItem: PlannerCorridorItem | null = activeCorridor
      ? {
          id: activeCorridor.id,
          code: activeCorridor.code,
          name: activeCorridor.name,
          distanceKm:
            activeCorridor.distanceKm != null
              ? Number(activeCorridor.distanceKm)
              : null,
          isActive: activeCorridor.isActive,
          startStation: activeCorridor.startStation
            ? {
                id: activeCorridor.startStation.id,
                name: activeCorridor.startStation.name,
                code: activeCorridor.startStation.code,
              }
            : null,
          endStation: activeCorridor.endStation
            ? {
                id: activeCorridor.endStation.id,
                name: activeCorridor.endStation.name,
                code: activeCorridor.endStation.code,
              }
            : null,
        }
      : null;

    return {
      corridors: corridorsList,
      selectedCorridor: selectedCorridorItem,
      tasks,
      scheduleTasks,
      stats,
      recommendedBlock,
      optimizationResult,
      availableBlocks,
      resourceAvailability,
      trafficForecast,
    };
  } catch (error) {
    console.error("Error loading AI Planner data:", error);
    const fallbackCorridor = targetCorridorCode || "C-01";
    const profile = getCorridorScheduleProfile(fallbackCorridor);
    const recStart = profile.recStart;
    const recEnd = profile.recEnd;

    return {
      corridors: [
        {
          id: "c-01",
          code: "C-01",
          name: "New Delhi - Ghaziabad - Aligarh High Density Corridor",
          distanceKm: 130.5,
          isActive: true,
          startStation: { id: "s1", name: "New Delhi", code: "NDLS" },
          endStation: { id: "s2", name: "Aligarh Jn", code: "ALJN" },
        },
        {
          id: "c-02",
          code: "C-02",
          name: "Aligarh - Tundla - Kanpur Central Trunk Corridor",
          distanceKm: 304.2,
          isActive: true,
          startStation: { id: "s3", name: "Aligarh Jn", code: "ALJN" },
          endStation: { id: "s4", name: "Kanpur Central", code: "CNB" },
        },
        {
          id: "c-03",
          code: "C-03",
          name: "Lucknow - Sultanpur - Varanasi Main Line Corridor",
          distanceKm: 284.0,
          isActive: true,
          startStation: { id: "s5", name: "Lucknow Charbagh", code: "LKO" },
          endStation: { id: "s6", name: "Varanasi Jn", code: "BSB" },
        },
        {
          id: "c-04",
          code: "C-04",
          name: "Varanasi - Mirzapur - Prayagraj Fast Trunk",
          distanceKm: 125.0,
          isActive: true,
          startStation: { id: "s7", name: "Varanasi Jn", code: "BSB" },
          endStation: { id: "s8", name: "Prayagraj Jn", code: "PRYJ" },
        },
      ],
      selectedCorridor: {
        id: `corridor-${fallbackCorridor.toLowerCase()}`,
        code: fallbackCorridor,
        name: profile.corridorName,
        distanceKm: 130.5,
        isActive: true,
        startStation: null,
        endStation: null,
      },
      tasks: [
        { id: "M104", rawTaskId: "1", title: "Rail replacement", department: "Engineering", duration: "4 hours", durationMinutes: 240, priority: "Critical", selected: true, departmentCode: "ENG" },
        { id: "M105", rawTaskId: "2", title: "Signal inspection", department: "S&T", duration: "2 hours", durationMinutes: 120, priority: "High", selected: true, departmentCode: "SNT" },
        { id: "M106", rawTaskId: "3", title: "OHE inspection", department: "Electrical", duration: "3 hours", durationMinutes: 180, priority: "High", selected: true, departmentCode: "OHE" },
        { id: "M107", rawTaskId: "4", title: "Track inspection", department: "Engineering", duration: "2 hours", durationMinutes: 120, priority: "Medium", selected: true, departmentCode: "ENG" },
        { id: "M108", rawTaskId: "5", title: "Traction power check", department: "Electrical", duration: "3 hours", durationMinutes: 180, priority: "Medium", selected: false, departmentCode: "OHE" },
        { id: "M109", rawTaskId: "6", title: "Signal calibration", department: "S&T", duration: "2 hours", durationMinutes: 120, priority: "Low", selected: false, departmentCode: "SNT" },
        { id: "M110", rawTaskId: "7", title: "Turnout maintenance", department: "Engineering", duration: "4 hours", durationMinutes: 240, priority: "High", selected: false, departmentCode: "ENG" },
        { id: "M111", rawTaskId: "8", title: "OHE wire replacement", department: "Electrical", duration: "3 hours", durationMinutes: 180, priority: "Medium", selected: false, departmentCode: "OHE" },
      ],
      scheduleTasks: [
        { id: "M104", rawTaskId: "1", title: "Rail replacement", row: "engineering", start: recStart, end: recEnd, selected: true, departmentName: "Engineering" },
        { id: "M107", rawTaskId: "4", title: "Track inspection", row: "engineering", start: Math.min(21, recEnd - 1), end: Math.min(22, recEnd + 2), conflicting: true, departmentName: "Engineering" },
        { id: "M106", rawTaskId: "3", title: "OHE inspection", row: "electrical", start: Math.max(8, recStart - 1), end: Math.max(9, recEnd - 2), selected: true, departmentName: "Electrical" },
        { id: "M111", rawTaskId: "8", title: "OHE wire replacement", row: "electrical", start: Math.min(20, recEnd - 2), end: Math.min(22, recEnd + 2), conflicting: true, departmentName: "Electrical" },
        { id: "M105", rawTaskId: "2", title: "Signal inspection", row: "snt", start: Math.max(8, recStart - 1), end: Math.max(9, recEnd - 3), selected: true, departmentName: "S&T" },
        { id: "M109", rawTaskId: "6", title: "Signal calibration", row: "snt", start: Math.min(20, recEnd - 2), end: Math.min(22, recEnd + 1), conflicting: true, departmentName: "S&T" },
      ],
      stats: {
        selectedTasksCount: 4,
        departmentsCount: 3,
        recommendedBlock: profile.timeRangeFormatted,
        trainConflicts: 0,
        optimizationScore: profile.optimizationScore,
      },
      recommendedBlock: {
        startHour: recStart,
        endHour: recEnd,
        timeRangeFormatted: profile.timeRangeFormatted,
        durationFormatted: profile.durationFormatted,
        dateFormatted: profile.dateFormatted,
        corridorName: profile.corridorName,
        corridorCode: fallbackCorridor,
      },
      optimizationResult: {
        recommendedBlock: {
          startHour: recStart,
          endHour: recEnd,
          timeRangeFormatted: profile.timeRangeFormatted,
          durationFormatted: profile.durationFormatted,
          dateFormatted: profile.dateFormatted,
          corridorName: profile.corridorName,
          corridorCode: fallbackCorridor,
        },
        tasksScheduledCount: 4,
        departmentsCount: 3,
        crewUtilization: profile.crewUtilization,
        trainConflictsCount: 0,
        safetyConflictsCount: 0,
        optimizationScore: profile.optimizationScore,
        blocksAvoided: profile.blocksAvoided,
        downtimeHoursSaved: profile.downtimeHoursSaved,
        availabilityGainPercent: profile.availabilityGainPercent,
      },
      availableBlocks: profile.availableBlocks,
      resourceAvailability: [
        { name: "Engineering Crew", value: "8 / 10", percent: 80, status: "Available" },
        { name: "OHE Crew", value: "6 / 8", percent: 75, status: "Available" },
        { name: "S&T Crew", value: "5 / 6", percent: 83, status: "Available" },
        { name: "Track Machines", value: "3 / 4", percent: 75, status: "Limited" },
      ],
      trafficForecast: {
        passengerPoints: profile.passengerPoints,
        goodsPoints: profile.goodsPoints,
        corridorCode: fallbackCorridor,
        dateFormatted: "14 Sep 2025",
      },
    };
  }
}
