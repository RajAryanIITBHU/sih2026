import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/src/generated/prisma/client";
import {
  endOfMonth,
  format,
  formatDistanceToNow,
  startOfMonth,
  subMonths,
} from "date-fns";

// ==========================================
// Prisma Relational Payload Types
// ==========================================

export type TaskWithRelations = Prisma.MaintenanceTaskGetPayload<{
  include: {
    department: true;
    asset: {
      include: {
        assetType: {
          include: {
            department: true;
          };
        };
      };
    };
  };
}>;

export type BlockWindowWithRelations = Prisma.BlockWindowGetPayload<{
  include: {
    corridor: true;
  };
}>;

export type PlanBlockWithRelations = Prisma.PlanBlockGetPayload<{
  include: {
    corridor: true;
    planTasks: {
      include: {
        maintenanceTask: true;
      };
    };
  };
}>;

export type AssetWithRelations = Prisma.AssetGetPayload<{
  include: {
    assetType: {
      include: {
        department: true;
      };
    };
    healthHistories: {
      take: 1;
      orderBy: { recordedAt: "desc" };
    };
  };
}>;

export type CorridorWithRelations = Prisma.CorridorGetPayload<{
  include: {
    startStation: true;
    endStation: true;
    timetableSlots: {
      include: {
        trainRun: {
          include: {
            train: true;
          };
        };
      };
      orderBy: { startTime: "asc" };
    };
    planBlocks: {
      orderBy: { startTime: "asc" };
    };
  };
}>;

export type AiRecommendationWithRelations =
  Prisma.AiRecommendationGetPayload<{
    include: {
      maintenanceTask: true;
      blockWindow: true;
    };
  }>;

export type AssetPredictionWithRelations =
  Prisma.AssetPredictionGetPayload<{
    include: {
      asset: true;
    };
  }>;

export type GoodsForecastWithRelations = Prisma.GoodsForecastGetPayload<{
  include: {
    corridor: true;
  };
}>;

export type BlockConflictWithRelations = Prisma.BlockConflictGetPayload<{
  include: {
    blockWindow: {
      include: {
        corridor: true;
      };
    };
    trainRun: {
      include: {
        train: true;
      };
    };
    maintenanceTask: {
      include: {
        corridor: true;
      };
    };
  };
}>;

export type TrainRunWithRelations = Prisma.TrainRunGetPayload<{
  include: {
    train: true;
  };
}>;

// ==========================================
// Dashboard View Data Interfaces
// ==========================================

export interface DashboardOverviewData {
  stats: {
    totalAssets: number;
    totalAssetsLabel: string;
    openTasks: number;
    criticalDefects: number;
    todayBlocks: number;
    atRiskAssets: number;
    assetAvailability: string;
  };
  prioritization: Array<{
    name: string;
    tms: number;
    smms: number;
    tdms: number;
    total: number;
  }>;
  blockUtilization: {
    allocatedMinutes: number;
    availableMinutes: number;
    percentage: number;
    slices: Array<{ name: string; value: number }>;
  };
  aiInsights: Array<{
    title: string;
    description: string;
    time: string;
    type: "danger" | "warning" | "success" | "info";
  }>;
  corridorActivity: Array<{
    id: string;
    code: string;
    name: string;
    route: string;
    distanceKm: number | null;
    trainCount: number;
    trains: string[];
    block?: {
      start: number;
      end: number;
      label: string;
    };
  }>;
  trainTraffic: {
    passengerCount: number;
    goodsCount: number;
    passengerRuns: number;
    delayedGoodsCount: number;
    hourlyData: Array<{
      time: string;
      passenger: number;
      goods: number;
    }>;
  };
  upcomingMaintenance: Array<{
    id: string;
    date: string;
    time: string;
    block: string;
    tasks: string;
    status: string;
  }>;
  assetHealth: Array<{
    name: string;
    value: number;
  }>;
  completionRate: Array<{
    month: string;
    value: number;
  }>;
}

// ==========================================
// Main Data Fetching Function
// ==========================================

export async function getOverviewDashboardData(): Promise<DashboardOverviewData> {
  try {
    // 1. Parallel database queries utilizing strong Prisma relations
    const [
      totalAssetsCount,
      openTasksCount,
      criticalDefectsCount,
      todayBlocksCount,
      atRiskAssetsCount,
      assets,
      tasks,
      blockWindows,
      planBlocks,
      corridors,
      aiRecommendations,
      predictions,
      goodsForecasts,
      blockConflicts,
      trains,
      trainRuns,
      timetableSlots,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.maintenanceTask.count({
        where: {
          status: { in: ["PENDING", "IN_PROGRESS", "OPEN", "SCHEDULED"] },
        },
      }),
      prisma.defect.count({
        where: {
          severity: "CRITICAL",
          status: { notIn: ["RESOLVED", "CLOSED"] },
        },
      }),
      prisma.planBlock.count(),
      prisma.asset.count({
        where: {
          OR: [
            { criticalityScore: { gte: 80 } },
            {
              healthHistories: {
                some: {
                  healthScore: { lte: 70 },
                },
              },
            },
          ],
        },
      }),
      prisma.asset.findMany({
        include: {
          assetType: {
            include: {
              department: true,
            },
          },
          healthHistories: {
            take: 1,
            orderBy: { recordedAt: "desc" },
          },
        },
      }) as Promise<AssetWithRelations[]>,
      prisma.maintenanceTask.findMany({
        include: {
          department: true,
          asset: {
            include: {
              assetType: {
                include: {
                  department: true,
                },
              },
            },
          },
        },
      }) as Promise<TaskWithRelations[]>,
      prisma.blockWindow.findMany({
        include: {
          corridor: true,
        },
        orderBy: { startTime: "asc" },
      }) as Promise<BlockWindowWithRelations[]>,
      prisma.planBlock.findMany({
        include: {
          corridor: true,
          planTasks: {
            include: {
              maintenanceTask: true,
            },
          },
        },
        orderBy: { startTime: "asc" },
      }) as Promise<PlanBlockWithRelations[]>,
      prisma.corridor.findMany({
        include: {
          startStation: true,
          endStation: true,
          timetableSlots: {
            include: {
              trainRun: {
                include: {
                  train: true,
                },
              },
            },
            orderBy: { startTime: "asc" },
          },
          planBlocks: {
            orderBy: { startTime: "asc" },
          },
        },
      }) as Promise<CorridorWithRelations[]>,
      prisma.aiRecommendation.findMany({
        include: {
          maintenanceTask: true,
          blockWindow: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }) as Promise<AiRecommendationWithRelations[]>,
      prisma.assetPrediction.findMany({
        include: {
          asset: true,
        },
        orderBy: { predictionTime: "desc" },
        take: 5,
      }) as Promise<AssetPredictionWithRelations[]>,
      prisma.goodsForecast.findMany({
        include: {
          corridor: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }) as Promise<GoodsForecastWithRelations[]>,
      prisma.blockConflict.findMany({
        include: {
          blockWindow: {
            include: {
              corridor: true,
            },
          },
          trainRun: {
            include: {
              train: true,
            },
          },
          maintenanceTask: {
            include: {
              corridor: true,
            },
          },
        },
        orderBy: { detectedAt: "desc" },
        take: 5,
      }) as Promise<BlockConflictWithRelations[]>,
      prisma.train.findMany(),
      prisma.trainRun.findMany({
        include: {
          train: true,
        },
      }) as Promise<TrainRunWithRelations[]>,
      prisma.timetableSlot.findMany({
        include: {
          trainRun: {
            include: {
              train: true,
            },
          },
        },
      }),
    ]);

    // 2. Derive Asset Availability directly from database health scores
    let totalHealthScore = 0;
    for (const asset of assets) {
      const latestHistory = asset.healthHistories[0];
      if (latestHistory?.healthScore != null) {
        totalHealthScore += Number(latestHistory.healthScore);
      } else if (asset.criticalityScore != null) {
        totalHealthScore += Math.max(0, 100 - Number(asset.criticalityScore));
      } else {
        totalHealthScore += 100;
      }
    }
    const avgAvailability =
      assets.length > 0 ? (totalHealthScore / assets.length).toFixed(1) : "100.0";

    // 3. Maintenance Task Prioritization by Source System (TMS, SMMS, TDMS)
    const priorityBuckets: Record<
      "Critical" | "High" | "Medium" | "Low",
      { tms: number; smms: number; tdms: number }
    > = {
      Critical: { tms: 0, smms: 0, tdms: 0 },
      High: { tms: 0, smms: 0, tdms: 0 },
      Medium: { tms: 0, smms: 0, tdms: 0 },
      Low: { tms: 0, smms: 0, tdms: 0 },
    };

    for (const task of tasks) {
      const crit = (task.criticality ?? task.urgency ?? "").toUpperCase();
      let priorityKey: "Critical" | "High" | "Medium" | "Low" = "Medium";
      if (crit === "CRITICAL") priorityKey = "Critical";
      else if (crit === "HIGH") priorityKey = "High";
      else if (crit === "LOW") priorityKey = "Low";

      const deptCode = (
        task.department?.code ??
        task.asset?.assetType?.department?.code ??
        ""
      ).toUpperCase();
      const taskType = (task.taskType ?? "").toUpperCase();

      if (
        deptCode === "ENG" ||
        taskType.includes("TRACK") ||
        taskType.includes("CIVIL")
      ) {
        priorityBuckets[priorityKey].tms += 1;
      } else if (
        deptCode === "SNT" ||
        taskType.includes("SIGNAL") ||
        taskType.includes("TELECOM")
      ) {
        priorityBuckets[priorityKey].smms += 1;
      } else if (
        deptCode === "OHE" ||
        taskType.includes("ELECTRICAL") ||
        taskType.includes("TRACTION")
      ) {
        priorityBuckets[priorityKey].tdms += 1;
      } else {
        priorityBuckets[priorityKey].tms += 1;
      }
    }

    const prioritization = (
      ["Critical", "High", "Medium", "Low"] as const
    ).map((name) => {
      const bucket = priorityBuckets[name];
      return {
        name,
        tms: bucket.tms,
        smms: bucket.smms,
        tdms: bucket.tdms,
        total: bucket.tms + bucket.smms + bucket.tdms,
      };
    });

    // 4. Block Utilization derived from real BlockWindows and PlanBlocks
    let totalWindowMinutes = 0;
    for (const bw of blockWindows) {
      if (bw.capacityMinutes && bw.capacityMinutes > 0) {
        totalWindowMinutes += bw.capacityMinutes;
      } else {
        const diff = Math.round(
          (new Date(bw.endTime).getTime() - new Date(bw.startTime).getTime()) /
            60000
        );
        totalWindowMinutes += Math.max(0, diff);
      }
    }

    let allocatedMinutes = 0;
    for (const pb of planBlocks) {
      const diff = Math.round(
        (new Date(pb.endTime).getTime() - new Date(pb.startTime).getTime()) /
          60000
      );
      allocatedMinutes += Math.max(0, diff);
    }

    const availableMinutes = Math.max(0, totalWindowMinutes - allocatedMinutes);
    const totalPossessionMinutes = allocatedMinutes + availableMinutes;
    const utilizationPct =
      totalPossessionMinutes > 0
        ? Math.min(
            100,
            Math.round((allocatedMinutes / totalPossessionMinutes) * 100)
          )
        : 0;

    const blockUtilization = {
      allocatedMinutes,
      availableMinutes,
      percentage: utilizationPct,
      slices: [
        { name: "Allocated", value: allocatedMinutes },
        { name: "Available", value: availableMinutes },
      ],
    };

    // 5. AI Insights directly from predictions, recommendations, forecasts, conflicts
    // 5. AI Insights directly from predictions, recommendations, forecasts, conflicts (Capped at most 4)
    const rawInsights: Array<{
      title: string;
      description: string;
      time: string;
      rawDate: Date;
      type: "danger" | "warning" | "success" | "info";
    }> = [];

    // Danger: Asset Predictive Failure Alerts
    for (const pred of predictions) {
      const failProb =
        pred.failureProbability != null
          ? `${Math.round(Number(pred.failureProbability) * 100)}%`
          : "Elevated";
      const rulStr =
        pred.rulValue != null
          ? ` Remaining useful life: ${Number(pred.rulValue)} days.`
          : "";
      rawInsights.push({
        title: `${pred.asset.name ?? pred.asset.assetCode} requires preventive attention`,
        description: `Predicted failure probability ${failProb}.${rulStr}`,
        time: formatDistanceToNow(new Date(pred.predictionTime), {
          addSuffix: true,
        }),
        rawDate: new Date(pred.predictionTime),
        type: "danger",
      });
    }

    // Warning: AI Block Optimization & Co-Possession Recommendations
    for (const rec of aiRecommendations) {
      const gainStr =
        rec.expectedAvailabilityGain != null
          ? `Availability gain: +${Number(rec.expectedAvailabilityGain)}%. `
          : "";
      const delayStr =
        rec.expectedDelay != null ? `Delay impact: ~${rec.expectedDelay}m. ` : "";
      rawInsights.push({
        title: rec.recommendationText ?? "Corridor Maintenance Optimization",
        description: `${gainStr}${delayStr}Status: ${rec.status}.`,
        time: formatDistanceToNow(new Date(rec.createdAt), {
          addSuffix: true,
        }),
        rawDate: new Date(rec.createdAt),
        type: "warning",
      });
    }

    // Success: Freight Traffic Forecasts & Optimal Shadow Windows
    for (const gf of goodsForecasts) {
      const volStr =
        gf.expectedVolume != null
          ? ` (~${Number(gf.expectedVolume).toLocaleString()} T)`
          : "";
      rawInsights.push({
        title: `Freight traffic forecast for ${gf.corridor?.code || "Corridor"}`,
        description: `Expected ${gf.expectedTrainCount ?? 0} freight rakes${volStr}. Optimal low-traffic slot identified.`,
        time: formatDistanceToNow(new Date(gf.createdAt), {
          addSuffix: true,
        }),
        rawDate: new Date(gf.createdAt),
        type: "success",
      });
    }

    // Info: Block Conflicts & Multi-Agent Resolution Advisories
    for (const bc of blockConflicts) {
      const corridorCode =
        bc.blockWindow?.corridor?.code ??
        bc.maintenanceTask?.corridor?.code ??
        "Corridor";
      rawInsights.push({
        title: `Block conflict on ${corridorCode}: ${bc.conflictType}`,
        description: `Estimated train delay: ${bc.estimatedDelay ?? 0}m. Multi-agent coordination recommended.`,
        time: formatDistanceToNow(new Date(bc.detectedAt), {
          addSuffix: true,
        }),
        rawDate: new Date(bc.detectedAt),
        type: "info",
      });
    }

    // Prioritize diverse category representation (1 of each type: danger, warning, success, info), capped at at most 4 items
    const categoryTypes: Array<"danger" | "warning" | "success" | "info"> = [
      "danger",
      "warning",
      "success",
      "info",
    ];
    const aiInsights: Array<{
      title: string;
      description: string;
      time: string;
      type: "danger" | "warning" | "success" | "info";
    }> = [];

    for (const cType of categoryTypes) {
      const match = rawInsights.find((item) => item.type === cType);
      if (match) {
        aiInsights.push({
          title: match.title,
          description: match.description,
          time: match.time,
          type: match.type,
        });
      }
    }

    // If fewer than 4 distinct categories found, fill up to 4 with the most recent insights
    if (aiInsights.length < 4) {
      const existingTitles = new Set(aiInsights.map((i) => i.title));
      const remaining = rawInsights
        .filter((i) => !existingTitles.has(i.title))
        .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

      for (const item of remaining) {
        if (aiInsights.length >= 4) break;
        aiInsights.push({
          title: item.title,
          description: item.description,
          time: item.time,
          type: item.type,
        });
      }
    }

    // 6. Corridor Activity Timeline derived from Corridors, TimetableSlots & PlanBlocks
    const corridorActivity = corridors.map((c) => {
      const startStation = c.startStation?.name ?? "Origin";
      const endStation = c.endStation?.name ?? "Destination";

      const trainSlots = c.timetableSlots.map((s) => {
        const d = new Date(s.startTime);
        const hh = String(d.getUTCHours() || d.getHours()).padStart(2, "0");
        return `${hh}:00`;
      });
      const uniqueTrains = Array.from(new Set(trainSlots));

      let blockInfo: { start: number; end: number; label: string } | undefined =
        undefined;
      if (c.planBlocks.length > 0) {
        const pb = c.planBlocks[0];
        const sHour = new Date(pb.startTime).getHours();
        const eHour = new Date(pb.endTime).getHours();
        const sIdx = Math.max(0, Math.min(8, Math.floor((sHour - 6) / 2)));
        const eIdx = Math.max(sIdx + 1, Math.min(9, Math.ceil((eHour - 6) / 2)));
        blockInfo = {
          start: sIdx,
          end: eIdx,
          label: `${format(pb.startTime, "HH:mm")} – ${format(pb.endTime, "HH:mm")}`,
        };
      }

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        route: `${startStation} – ${endStation}`,
        distanceKm: c.distanceKm ? Number(c.distanceKm) : null,
        trainCount: c.timetableSlots.length,
        trains: uniqueTrains,
        block: blockInfo,
      };
    });

    // 7. Train Traffic (Passenger vs Goods)
    const passengerTrains = trains.filter(
      (t) =>
        t.trainType === "EXPRESS" ||
        t.trainType === "PASSENGER" ||
        t.trainType === "SUPERFAST"
    );
    const freightTrains = trains.filter(
      (t) => t.trainType === "FREIGHT" || t.trainType === "GOODS"
    );

    const passengerRuns = trainRuns.filter(
      (r) =>
        r.train.trainType === "EXPRESS" ||
        r.train.trainType === "PASSENGER" ||
        r.train.trainType === "SUPERFAST"
    );
    const delayedGoodsCount = trainRuns.filter(
      (r) =>
        (r.train.trainType === "FREIGHT" || r.train.trainType === "GOODS") &&
        r.actualDelayMinutes > 0
    ).length;

    const timelineHours = [
      "06:00",
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
      "22:00",
    ];

    const hourlyData = timelineHours.map((slotStr) => {
      const startH = parseInt(slotStr.slice(0, 2), 10);
      const endH = startH + 2;

      const passengerInSlot = timetableSlots.filter((slot) => {
        const h = new Date(slot.startTime).getHours();
        return (
          h >= startH &&
          h < endH &&
          (slot.trainRun?.train?.trainType === "PASSENGER" ||
            slot.trainRun?.train?.trainType === "EXPRESS" ||
            slot.trainRun?.train?.trainType === "SUPERFAST" ||
            !slot.trainRun)
        );
      }).length;

      const goodsInSlot =
        timetableSlots.filter((slot) => {
          const h = new Date(slot.startTime).getHours();
          return (
            h >= startH &&
            h < endH &&
            (slot.trainRun?.train?.trainType === "FREIGHT" ||
              slot.trainRun?.train?.trainType === "GOODS")
          );
        }).length +
        goodsForecasts.filter(
          (gf) =>
            gf.forecastHour != null &&
            gf.forecastHour >= startH &&
            gf.forecastHour < endH
        ).length;

      return {
        time: slotStr,
        passenger: passengerInSlot,
        goods: goodsInSlot,
      };
    });

    const trainTraffic = {
      passengerCount: passengerTrains.length,
      goodsCount: freightTrains.length + goodsForecasts.length,
      passengerRuns: passengerRuns.length,
      delayedGoodsCount,
      hourlyData,
    };

    // 8. Upcoming Maintenance Blocks from PlanBlocks
    const upcomingMaintenance = planBlocks.map((pb) => {
      const dateStr = format(pb.startTime, "dd MMM");
      const timeStr = `${format(pb.startTime, "HH:mm")} – ${format(pb.endTime, "HH:mm")}`;
      const taskCount = pb.planTasks.length;
      let statusStr = "Planned";
      if (pb.status === "CONFIRMED") statusStr = "Confirmed";
      else if (pb.status === "AI_SUGGESTED") statusStr = "AI Suggested";
      else if (pb.status === "TENTATIVE") statusStr = "Tentative";

      return {
        id: pb.id,
        date: dateStr,
        time: timeStr,
        block: pb.corridor?.code ?? "CORRIDOR",
        tasks: `${taskCount} task${taskCount === 1 ? "" : "s"}`,
        status: statusStr,
      };
    });

    // 9. Asset Health Overview by Category derived from database assets
    const categoryScores: Record<
      "Track" | "Signal" | "OHE" | "Rolling Stock",
      number[]
    > = {
      Track: [],
      Signal: [],
      OHE: [],
      "Rolling Stock": [],
    };

    for (const asset of assets) {
      const deptCode = (
        asset.assetType?.department?.code ?? ""
      ).toUpperCase();
      const typeName = (asset.assetType?.name ?? "").toUpperCase();
      const assetName = (asset.name ?? "").toUpperCase();

      let category: "Track" | "Signal" | "OHE" | "Rolling Stock" = "Track";
      if (
        deptCode === "ENG" ||
        typeName.includes("TRACK") ||
        typeName.includes("RAIL") ||
        assetName.includes("TURNOUT")
      ) {
        category = "Track";
      } else if (
        deptCode === "SNT" ||
        typeName.includes("SIGNAL") ||
        typeName.includes("POINT") ||
        assetName.includes("INTERLOCKING")
      ) {
        category = "Signal";
      } else if (
        deptCode === "OHE" ||
        typeName.includes("OHE") ||
        typeName.includes("CATENARY") ||
        assetName.includes("TRACTION")
      ) {
        category = "OHE";
      } else if (
        typeName.includes("ROLLING") ||
        typeName.includes("LOCO") ||
        typeName.includes("WAGON") ||
        deptCode === "TRAFFIC"
      ) {
        category = "Rolling Stock";
      }

      const score =
        asset.healthHistories[0]?.healthScore != null
          ? Number(asset.healthHistories[0].healthScore)
          : asset.criticalityScore != null
          ? Math.max(0, 100 - Number(asset.criticalityScore))
          : 100;

      categoryScores[category].push(score);
    }

    const assetHealth = (
      ["Track", "Signal", "OHE", "Rolling Stock"] as const
    ).map((name) => {
      const scores = categoryScores[name];
      const avg =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;
      return {
        name,
        value: avg,
      };
    });

    // 10. Maintenance Completion Rate (Last 6 Months)
    const now = new Date();
    const completionRate = [];

    for (let i = 5; i >= 0; i--) {
      const targetMonth = subMonths(now, i);
      const start = startOfMonth(targetMonth);
      const end = endOfMonth(targetMonth);
      const monthLabel = format(targetMonth, "MMM");

      const tasksInMonth = tasks.filter(
        (t) => t.createdAt >= start && t.createdAt <= end
      );
      const completedInMonth = tasksInMonth.filter(
        (t) => t.status === "COMPLETED" || t.status === "CLOSED"
      );

      const pct =
        tasksInMonth.length > 0
          ? Math.round((completedInMonth.length / tasksInMonth.length) * 100)
          : 0;

      completionRate.push({
        month: monthLabel,
        value: pct,
      });
    }

    return {
      stats: {
        totalAssets: totalAssetsCount,
        totalAssetsLabel: totalAssetsCount.toLocaleString(),
        openTasks: openTasksCount,
        criticalDefects: criticalDefectsCount,
        todayBlocks: todayBlocksCount,
        atRiskAssets: atRiskAssetsCount,
        assetAvailability: `${avgAvailability}%`,
      },
      prioritization,
      blockUtilization,
      aiInsights,
      corridorActivity,
      trainTraffic,
      upcomingMaintenance,
      assetHealth,
      completionRate,
    };
  } catch (error) {
    console.error("Error fetching overview dashboard data:", error);
    return {
      stats: {
        totalAssets: 0,
        totalAssetsLabel: "0",
        openTasks: 0,
        criticalDefects: 0,
        todayBlocks: 0,
        atRiskAssets: 0,
        assetAvailability: "0.0%",
      },
      prioritization: [
        { name: "Critical", tms: 0, smms: 0, tdms: 0, total: 0 },
        { name: "High", tms: 0, smms: 0, tdms: 0, total: 0 },
        { name: "Medium", tms: 0, smms: 0, tdms: 0, total: 0 },
        { name: "Low", tms: 0, smms: 0, tdms: 0, total: 0 },
      ],
      blockUtilization: {
        allocatedMinutes: 0,
        availableMinutes: 0,
        percentage: 0,
        slices: [
          { name: "Allocated", value: 0 },
          { name: "Available", value: 0 },
        ],
      },
      aiInsights: [],
      corridorActivity: [],
      trainTraffic: {
        passengerCount: 0,
        goodsCount: 0,
        passengerRuns: 0,
        delayedGoodsCount: 0,
        hourlyData: [],
      },
      upcomingMaintenance: [],
      assetHealth: [
        { name: "Track", value: 0 },
        { name: "Signal", value: 0 },
        { name: "OHE", value: 0 },
        { name: "Rolling Stock", value: 0 },
      ],
      completionRate: [],
    };
  }
}
