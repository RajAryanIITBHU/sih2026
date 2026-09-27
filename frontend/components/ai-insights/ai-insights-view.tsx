"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { DashboardSectionHeader } from "@/components/dashboard/dashboard-section-header";
import { AIInsightsHeader } from "./ai-insights-header";
import { AIInsightsStats } from "./ai-insights-stats";
import { RecommendationsPanel } from "./recommendations-panel";
import { RiskDistributionCard } from "./risk-distribution-card";
import { GoodsTrafficForecastCard } from "./goods-traffic-forecast-card";
import { ExplainableAICard } from "./explainable-ai-card";
import { ScenarioSimulatorCard } from "./scenario-simulator-card";
import { AIInsightsTimeline } from "./ai-insights-timeline";
import { PotentialImpactCard } from "./potential-impact-card";
import {
  INITIAL_RECOMMENDATIONS,
  POTENTIAL_IMPACT_STATS,
  PRIORITY_FACTORS,
  RISK_DISTRIBUTION,
  TIMELINE_EVENTS,
  WHAT_IF_SCENARIOS,
} from "./mock-data";
import type { InsightCategory, InsightImpact } from "./types";

export function AIInsightsView() {
  const [activeCategory, setActiveCategory] = React.useState<InsightCategory>("all");
  const [selectedCorridor, setSelectedCorridor] = React.useState<string>("all");
  const [selectedHorizon, setSelectedHorizon] = React.useState<string>("Last 7 Days");
  const [selectedRiskFilter, setSelectedRiskFilter] = React.useState<InsightImpact | null>(null);

  // Recommendations state (supports applying actions)
  const [recommendations, setRecommendations] = React.useState(INITIAL_RECOMMENDATIONS);

  const handleApplyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r))
    );
  };

  const handleRefresh = () => {
    // Re-trigger calculation animation / state refresh
    setRecommendations([...INITIAL_RECOMMENDATIONS]);
  };

  return (
    <div className="space-y-4">
      {/* Page Header with Filters & Action Dock */}
      <AIInsightsHeader
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        selectedCorridor={selectedCorridor}
        onCorridorChange={setSelectedCorridor}
        selectedHorizon={selectedHorizon}
        onHorizonChange={setSelectedHorizon}
        onRefresh={handleRefresh}
      />

      <Separator className="opacity-60" />

      {/* KPI Stats Bar using DashboardStatCard */}
      <AIInsightsStats
        totalRecommendations={recommendations.length}
        criticalAlerts={recommendations.filter((r) => r.impact === "Critical").length}
        actionedCount={recommendations.filter((r) => r.applied).length}
        downtimeSaved="6.2 hrs"
        costSavings="₹12.4L"
      />

      {/* Section 1: Core Actionable Intelligence (Recommendations, Risk Breakdown, and Headways) */}
      <div className="space-y-2 pt-1">
        <DashboardSectionHeader
          title="Predictive Recommendations & Infrastructure Risk"
          description="Cross-department bundling proposals, fixed asset health degradation, and timetable capacity gaps."
          titleSize="sm"
          spacing="compact"
        />

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_0.95fr_0.95fr]">
          <RecommendationsPanel
            recommendations={recommendations}
            onApplyRecommendation={handleApplyRecommendation}
            selectedRiskFilter={selectedRiskFilter}
            onClearRiskFilter={() => setSelectedRiskFilter(null)}
          />

          <RiskDistributionCard
            distribution={RISK_DISTRIBUTION}
            selectedLevel={selectedRiskFilter}
            onSelectLevel={(lvl) =>
              setSelectedRiskFilter((prev) => (prev === lvl ? null : lvl))
            }
          />

          <GoodsTrafficForecastCard
            corridorCode={selectedCorridor === "all" ? "C-01" : selectedCorridor}
          />
        </div>
      </div>

      {/* Section 2: Explainable AI (XAI) Prioritization Logic */}
      <div className="space-y-2 pt-2">
        <DashboardSectionHeader
          title="Explainable Prioritization Formula & Algorithmic Attribution"
          description="Transparent mathematical weighting across defect failure probability, overdue urgency, traffic headway, and multi-gang readiness."
          titleSize="sm"
          spacing="compact"
        />

        <ExplainableAICard factors={PRIORITY_FACTORS} totalScore={88} priorityLevel="Critical Priority" />
      </div>

      {/* Section 3: Timeline, Validated System Impact, and What-if Scenario Simulator */}
      <div className="space-y-2 pt-2">
        <DashboardSectionHeader
          title="System Verification, Event Audit & What-If Simulation"
          description="Audit trail of multi-agent decisions, cumulative asset availability ROI, and interactive scenario forecasting."
          titleSize="sm"
          spacing="compact"
        />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <AIInsightsTimeline events={TIMELINE_EVENTS} />

          <PotentialImpactCard stats={POTENTIAL_IMPACT_STATS} />

          <ScenarioSimulatorCard scenarios={WHAT_IF_SCENARIOS} />
        </div>
      </div>
    </div>
  );
}
