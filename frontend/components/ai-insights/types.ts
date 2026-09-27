export type InsightImpact = "Critical" | "High" | "Medium" | "Low";

export type InsightCategory =
  | "all"
  | "risk"
  | "optimization"
  | "traffic"
  | "assets";

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: InsightImpact;
  confidence: number;
  time: string;
  department: string;
  departmentCode: "engineering" | "electrical" | "snt" | "traffic";
  corridor: string;
  suggestedAction: string;
  recommendedWindow?: string;
  applied?: boolean;
}

export interface RiskDistributionItem {
  level: InsightImpact;
  count: number;
  percentage: number;
  color: string;
}

export interface PriorityScoreFactor {
  label: string;
  score: string;
  percentage: number;
  weight: string;
}

export interface TimelineEventItem {
  id: string;
  time: string;
  title: string;
  description: string;
  agent: string;
  type: "critical" | "warning" | "success" | "info";
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  downtimeSaved: string;
  availabilityDelta: string;
  trainConflicts: number;
  score: number;
  corridor: string;
}

export interface PotentialImpactStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  iconName: "clock" | "train" | "shield" | "currency";
}
