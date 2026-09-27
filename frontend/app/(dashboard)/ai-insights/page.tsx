"use client";

import * as React from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  Gauge,
  Lightbulb,
  MapPin,
  Network,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  TrainFront,
  TriangleAlert,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ==========================================================================
   TYPES
   ========================================================================== */

type Recommendation = {
  title: string;
  description: string;
  impact: "High Impact" | "Medium Impact" | "Critical" | "Low Impact";
  confidence: string;
  time: string;
  icon: React.ReactNode;
};

type TimelineItem = {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

/* ==========================================================================
   HEADER
   ========================================================================== */

function PageHeader() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>

        <p className="text-xs text-muted-foreground">
          Actionable intelligence for safer, smarter, and more efficient railway
          maintenance.
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Button size="sm" className="h-7 rounded-md px-3 text-[9px]">
            All Insights
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="h-7 rounded-md px-3 text-[9px]"
          >
            Risk Analysis
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="h-7 rounded-md px-3 text-[9px]"
          >
            Scheduling & Optimization
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="h-7 rounded-md px-3 text-[9px]"
          >
            Traffic & Forecast
          </Button>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-9 w-fit min-w-[165px] justify-between text-[9px]"
      >
        <span className="flex items-center gap-2">
          <CalendarDays className="size-3.5" />

          <span className="text-left">
            <span className="block font-semibold">Last 7 days</span>

            <span className="block text-[7px] text-muted-foreground">
              3 Sep – 9 Sep 2025
            </span>
          </span>
        </span>

        <ChevronDown className="size-3" />
      </Button>
    </div>
  );
}

/* ==========================================================================
   KPI CARDS
   ========================================================================== */

function KPISection() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        icon={<Brain />}
        iconClass="bg-primary/10 text-primary"
        value="24"
        label="AI Recommendations"
        change="33%"
        changeText="from last week"
        trend="up"
      />

      <KpiCard
        icon={<TriangleAlert />}
        iconClass="bg-destructive/10 text-destructive"
        value="8"
        label="Require Attention"
        change="60%"
        changeText="from last week"
        trend="up"
        destructive
      />

      <KpiCard
        icon={<CheckCircle2 />}
        iconClass="bg-emerald-500/10 text-emerald-600"
        value="16"
        label="Actioned"
        change="14%"
        changeText="from last week"
        trend="up"
      />

      <KpiCard
        icon={<BarChart3 />}
        iconClass="bg-emerald-500/10 text-emerald-600"
        value="7.8%"
        label="Potential Downtime Reduction"
        change="2.1%"
        changeText="from last week"
        trend="up"
      />
    </div>
  );
}

function KpiCard({
  icon,
  iconClass,
  value,
  label,
  change,
  changeText,
  trend,
  destructive = false,
}: {
  icon: React.ReactNode;
  iconClass: string;
  value: string;
  label: string;
  change: string;
  changeText: string;
  trend: "up" | "down";
  destructive?: boolean;
}) {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardContent className="flex items-center gap-3 p-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-md ${iconClass}`}
        >
          {React.cloneElement(
            icon as React.ReactElement<{
              className?: string;
            }>,
            {
              className: "size-4",
            },
          )}
        </div>

        <div className="min-w-0">
          <p className="text-lg font-bold leading-none">{value}</p>

          <p className="mt-1 truncate text-[8px] text-muted-foreground">
            {label}
          </p>

          <p
            className={`mt-1 flex items-center gap-0.5 text-[7px] ${
              destructive ? "text-destructive" : "text-emerald-600"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="size-2.5" />
            ) : (
              <ArrowDownRight className="size-2.5" />
            )}

            <span className="font-semibold">{change}</span>

            <span className="text-muted-foreground">{changeText}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================================================================
   AI RECOMMENDATIONS
   ========================================================================== */

const recommendations: Recommendation[] = [
  {
    title: "Combine 3 maintenance activities in C-01",
    description: "Rail, OHE and Signal work can combine into one block.",
    impact: "High Impact",
    confidence: "94% confidence",
    time: "2 hours ago",
    icon: <Network />,
  },
  {
    title: "Schedule OHE inspection in low-traffic window",
    description: "C-03 has a 6-hour low-traffic window on 14 Sep.",
    impact: "Medium Impact",
    confidence: "87% confidence",
    time: "5 hours ago",
    icon: <Clock3 />,
  },
  {
    title: "Track T-102 requires urgent maintenance",
    description: "Failure risk increased from 72% to 87%.",
    impact: "Critical",
    confidence: "91% confidence",
    time: "6 hours ago",
    icon: <TriangleAlert />,
  },
  {
    title: "Reschedule 2 tasks to avoid train conflicts",
    description: "Current plan has 3 potential conflicts on 15 Sep.",
    impact: "Medium Impact",
    confidence: "83% confidence",
    time: "1 day ago",
    icon: <Route />,
  },
  {
    title: "Optimize crew allocation for C-02",
    description: "Reallocate crew to reduce idle time by 28%.",
    impact: "Low Impact",
    confidence: "76% confidence",
    time: "1 day ago",
    icon: <Database />,
  },
];

function RecommendationsCard() {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2">
        <CardTitle className="text-xs">Top AI Recommendations</CardTitle>

        <Button variant="outline" size="sm" className="h-6 px-2 text-[7px]">
          View all
        </Button>
      </CardHeader>

      <CardContent className="space-y-1 p-3 pt-0">
        {recommendations.map((item, index) => (
          <RecommendationItem key={index} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}

function RecommendationItem({ item }: { item: Recommendation }) {
  const impactClass = {
    "High Impact": "bg-destructive/10 text-destructive",
    "Medium Impact": "bg-amber-500/10 text-amber-600",
    Critical: "bg-destructive/10 text-destructive",
    "Low Impact": "bg-sky-500/10 text-sky-600",
  }[item.impact];

  return (
    <div className="group rounded-md border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/40">
      <div className="flex gap-2">
        <div
          className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
            item.impact === "Critical"
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          }`}
        >
          {React.cloneElement(
            item.icon as React.ReactElement<{
              className?: string;
            }>,
            {
              className: "size-3.5",
            },
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[9px] font-semibold leading-tight">
              {item.title}
            </p>

            <ArrowRight className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
          </div>

          <p className="mt-1 text-[7px] leading-tight text-muted-foreground">
            {item.description}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={`h-4 border-transparent px-1.5 text-[6px] ${impactClass}`}
            >
              {item.impact}
            </Badge>

            <Badge
              variant="outline"
              className="h-4 border-emerald-500/20 bg-emerald-500/5 px-1.5 text-[6px] text-emerald-600"
            >
              {item.confidence}
            </Badge>

            <span className="ml-auto text-[6px] text-muted-foreground">
              {item.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   RISK DISTRIBUTION
   ========================================================================== */

function RiskDistributionCard() {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs">Maintenance Risk Distribution</CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="flex items-center gap-4">
          <div
            className="relative flex size-[105px] shrink-0 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(hsl(var(--primary)) 0deg 162deg, hsl(38 92% 50%) 162deg 227deg, hsl(14 80% 55%) 227deg 245deg, hsl(145 55% 48%) 245deg 360deg)",
            }}
          >
            <div className="flex size-[68px] flex-col items-center justify-center rounded-full bg-card">
              <span className="text-sm font-bold">1,248</span>

              <span className="text-[7px] text-muted-foreground">
                Total Assets
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <RiskRow
              color="bg-destructive"
              label="Critical"
              value="5%"
              count="(62)"
            />

            <RiskRow
              color="bg-orange-500"
              label="High"
              value="18%"
              count="(224)"
            />

            <RiskRow
              color="bg-amber-400"
              label="Medium"
              value="32%"
              count="(399)"
            />

            <RiskRow
              color="bg-emerald-500"
              label="Low"
              value="45%"
              count="(563)"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-md bg-destructive/10 p-2">
          <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
            <TriangleAlert className="size-2.5" />
          </div>

          <div className="flex-1">
            <p className="text-[8px] font-semibold text-destructive">
              62 assets are in critical condition.
            </p>

            <p className="text-[7px] text-muted-foreground">
              4 more than last week.
            </p>
          </div>

          <ArrowRight className="size-3 text-destructive" />
        </div>
      </CardContent>
    </Card>
  );
}

function RiskRow({
  color,
  label,
  value,
  count,
}: {
  color: string;
  label: string;
  value: string;
  count: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[8px]">
      <span className={`size-2 rounded-sm ${color}`} />

      <span className="w-14 text-muted-foreground">{label}</span>

      <span className="ml-auto font-medium">{value}</span>

      <span className="w-7 text-right text-muted-foreground">{count}</span>
    </div>
  );
}

/* ==========================================================================
   GOODS TRAIN FORECAST
   ========================================================================== */

function GoodsTrainForecast() {
  const passenger = [18, 26, 31, 42, 59, 43, 30, 25];

  const goods = [8, 14, 16, 21, 28, 23, 20, 18];

  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
        <div>
          <CardTitle className="text-xs">Goods Train Forecast (C-01)</CardTitle>

          <div className="mt-1 flex gap-3 text-[7px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-sky-500" />
              Passenger Trains
            </span>

            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Goods Trains
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="h-6 text-[7px]">
          Next 7 days
          <ChevronDown className="ml-1 size-2.5" />
        </Button>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="relative h-[108px]">
          {/* Grid */}

          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 20, 40, 60, 80].map((value) => (
              <div key={value} className="flex items-center gap-1">
                <span className="w-5 text-[6px] text-muted-foreground">
                  {value}
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>
            ))}
          </div>

          {/* Low traffic window */}

          <div className="absolute bottom-4 left-[64%] top-0 w-[14%] rounded-sm bg-emerald-500/10">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6px] font-medium text-emerald-600">
              Low traffic
              <br />
              window
            </span>
          </div>

          {/* Bars */}

          <div className="absolute bottom-4 left-7 right-0 top-4 flex items-end justify-between gap-1">
            {passenger.map((passengerValue, index) => {
              const goodsValue = goods[index];

              return (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end justify-center gap-[2px]"
                >
                  <div
                    className="w-[7px] rounded-t-sm bg-sky-500/70"
                    style={{
                      height: `${passengerValue}%`,
                    }}
                  />

                  <div
                    className="w-[7px] rounded-t-sm bg-emerald-500/70"
                    style={{
                      height: `${goodsValue}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis */}

          <div className="absolute bottom-0 left-7 right-0 flex justify-between">
            {[
              "9 Sep",
              "10 Sep",
              "11 Sep",
              "12 Sep",
              "13 Sep",
              "14 Sep",
              "15 Sep",
            ].map((day) => (
              <span key={day} className="text-[6px] text-muted-foreground">
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-start gap-2 rounded-md bg-emerald-500/10 p-2">
          <Lightbulb className="mt-0.5 size-3 text-emerald-600" />

          <p className="text-[7px] leading-tight text-muted-foreground">
            <span className="font-semibold text-emerald-600">
              14 Sep has 62% lower goods train traffic
            </span>{" "}
            compared to weekly average. Ideal for maintenance.
          </p>

          <ArrowRight className="ml-auto size-3 shrink-0 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================================================================
   AI PRIORITY SCORING
   ========================================================================== */

function PriorityScoring() {
  const factors = [
    ["Failure Risk", 93, "28/30"],
    ["Criticality", 88, "14/20"],
    ["Urgency", 75, "14/15"],
    ["Asset Impact", 75, "15/20"],
    ["Traffic Impact", 70, "7/10"],
    ["Historical Failures", 80, "8/10"],
  ];

  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs">AI Priority Scoring</CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="grid grid-cols-[1fr_85px] gap-3">
          <div className="space-y-2">
            {factors.map(([label, value, score], index) => (
              <div key={label}>
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-[7px] text-muted-foreground">
                    {label}
                  </span>

                  <span className="text-[7px] font-medium">{score}</span>
                </div>

                <Progress
                  value={Number(value)}
                  className={`h-1.5 ${
                    index < 2
                      ? "[&>div]:bg-destructive"
                      : index < 4
                        ? "[&>div]:bg-amber-500"
                        : "[&>div]:bg-emerald-500"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="rounded-md border bg-muted/20 p-2">
            <p className="text-[7px] text-muted-foreground">Total Score</p>

            <p className="mt-1 text-lg font-bold">
              88<span className="text-xs"> / 100</span>
            </p>

            <p className="mt-1 text-[7px] text-muted-foreground">
              Priority Level
            </p>

            <Badge className="mt-1 h-5 bg-destructive/10 text-[7px] text-destructive hover:bg-destructive/10">
              High
            </Badge>

            <p className="mt-2 text-[6px] text-muted-foreground">
              Top 12% of all assets
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================================================================
   WHY THIS RECOMMENDATION
   ========================================================================== */

function WhyRecommendation() {
  const items = [
    "Critical track defect detected",
    "Maintenance overdue by 2 days",
    "Low passenger traffic in this window",
    "Low goods-train forecast",
    "Engineering, OHE and S&T crews available",
    "No timetable conflicts",
    "Activities are geographically compatible",
  ];

  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs">Why This Recommendation?</CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="space-y-1.5">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-600" />

              <span className="text-[8px] leading-tight">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================================================================
   TIMELINE
   ========================================================================== */

const timeline: TimelineItem[] = [
  {
    time: "2 hours ago",
    title: "New recommendation generated",
    description: "Combine 3 maintenance activities in C-01",
    icon: <Sparkles />,
  },
  {
    time: "5 hours ago",
    title: "Risk score updated",
    description: "T-102 failure risk increased to 87%",
    icon: <TriangleAlert />,
  },
  {
    time: "1 day ago",
    title: "Forecast updated",
    description: "Goods train traffic revised for next week",
    icon: <BarChart3 />,
  },
  {
    time: "2 days ago",
    title: "Model retrained",
    description: "Incorporated latest maintenance data",
    icon: <Brain />,
  },
];

function InsightTimeline() {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs">AI Insight Timeline</CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="relative">
          <div className="absolute bottom-2 left-[4px] top-2 w-px bg-border" />

          <div className="space-y-3">
            {timeline.map((item, index) => (
              <div key={index} className="relative flex gap-3">
                <div
                  className={`relative z-10 flex size-2 shrink-0 items-center justify-center rounded-full ${
                    index === 0 ? "bg-emerald-500" : "bg-muted-foreground/40"
                  }`}
                />

                <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                  <div>
                    <p className="text-[8px] font-medium">{item.title}</p>

                    <p className="mt-0.5 text-[7px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-[6px] text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================================================================
   POTENTIAL IMPACT
   ========================================================================== */

function PotentialImpact() {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs">Potential Impact</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-2 p-3 pt-1">
        <ImpactMetric
          icon={<Clock3 />}
          value="6 hours"
          label="Estimated downtime saved"
          change="+28%"
          iconClass="bg-sky-500/10 text-sky-600"
        />

        <ImpactMetric
          icon={<TrainFront />}
          value="3"
          label="Blocks can be avoided"
          change="+50%"
          iconClass="bg-emerald-500/10 text-emerald-600"
        />

        <ImpactMetric
          icon={<ShieldCheck />}
          value="+7.8%"
          label="Asset availability"
          change="+2.1%"
          iconClass="bg-emerald-500/10 text-emerald-600"
        />

        <ImpactMetric
          icon={<span className="text-sm">₹</span>}
          value="~₹12.4L"
          label="Estimated cost savings"
          change="+18%"
          iconClass="bg-amber-500/10 text-amber-600"
        />
      </CardContent>
    </Card>
  );
}

function ImpactMetric({
  icon,
  value,
  label,
  change,
  iconClass,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-md border p-2">
      <div className="flex items-center gap-2">
        <div
          className={`flex size-7 items-center justify-center rounded-md ${iconClass}`}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{
                  className?: string;
                }>,
                {
                  className: "size-3.5",
                },
              )
            : icon}
        </div>

        <div>
          <p className="text-[11px] font-bold">{value}</p>

          <p className="text-[6px] text-muted-foreground">{label}</p>
        </div>
      </div>

      <p className="mt-1 text-[7px] font-semibold text-emerald-600">
        ↑ {change}
      </p>
    </div>
  );
}

/* ==========================================================================
   SCENARIO ANALYSIS
   ========================================================================== */

function ScenarioAnalysis() {
  return (
    <Card className="rounded-lg border shadow-none">
      <CardContent className="flex h-full flex-col justify-between p-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
              <Sparkles className="size-4" />
            </div>

            <div>
              <p className="text-xs font-semibold">
                Let AI analyze more scenarios
              </p>

              <p className="mt-0.5 text-[7px] text-muted-foreground">
                Try different dates, corridors, or resource configurations to
                get optimized plans.
              </p>
            </div>
          </div>
        </div>

        <Button className="mt-4 h-8 w-full text-[8px]">
          Run What-if Analysis
          <ArrowRight className="ml-1 size-3" />
        </Button>

        <div className="mt-3 flex items-center justify-between text-[6px] text-muted-foreground">
          <span>Last updated: 9 Sep 2025, 14:32</span>

          <Button variant="ghost" size="sm" className="h-5 px-1 text-[6px]">
            <RefreshCw className="mr-1 size-2.5" />
            Sync now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================================================================
   PAGE
   ========================================================================== */

export default function AIInsightsPage() {
  return (
    <main className="min-h-screen bg-muted/20 p-3 md:p-4">
      <div className="mx-auto max-w-[1600px] space-y-3">
        <PageHeader />

        <KPISection />

        {/* ================================================================
            TOP SECTION
            ================================================================ */}

        <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1.05fr_0.9fr_0.95fr]">
          <RecommendationsCard />

          <RiskDistributionCard />

          <GoodsTrainForecast />
        </div>

        {/* ================================================================
            AI ANALYSIS
            ================================================================ */}

        <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1fr_0.95fr]">
          <PriorityScoring />

          <WhyRecommendation />
        </div>

        {/* ================================================================
            BOTTOM
            ================================================================ */}

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          <InsightTimeline />

          <PotentialImpact />

          <ScenarioAnalysis />
        </div>
      </div>
    </main>
  );
}
