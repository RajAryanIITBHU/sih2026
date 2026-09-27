import { AlertTriangle, Lightbulb, Radio, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardSectionHeader } from "./dashboard-section-header";

const defaultInsights = [
  {
    icon: AlertTriangle,
    title: "Track T-102 requires urgent maintenance",
    description: "Failure probability 87%.",
    time: "2 hours ago",
    type: "danger" as const,
  },
  {
    icon: Lightbulb,
    title: "Suggested block on 14 Sep",
    description: "for 3 high-priority tasks.",
    time: "5 hours ago",
    type: "warning" as const,
  },
  {
    icon: TrendingUp,
    title: "Goods train traffic expected to increase",
    description: "by 18% next week.",
    time: "1 day ago",
    type: "success" as const,
  },
  {
    icon: Radio,
    title: "Combining Signal + OHE work",
    description: "can save 6 hours of total downtime.",
    time: "1 day ago",
    type: "info" as const,
  },
];

export interface AIInsightItem {
  title: string;
  description: string;
  time: string;
  type: "danger" | "warning" | "success" | "info";
}

export interface AIInsightsProps {
  insights?: AIInsightItem[];
}

function getInsightIcon(type: string) {
  switch (type) {
    case "danger":
      return AlertTriangle;
    case "warning":
      return Lightbulb;
    case "success":
      return TrendingUp;
    case "info":
    default:
      return Radio;
  }
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cva } from "class-variance-authority";

const insightBadgeVariants = cva(
  "flex size-9 shrink-0 items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-105",
  {
    variants: {
      type: {
        danger: "bg-destructive/15 text-destructive",
        warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        info: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export function AIInsights({ insights }: AIInsightsProps) {
  const displayInsights = (
    insights && insights.length > 0
      ? insights.map((item) => ({
          ...item,
          icon: getInsightIcon(item.type),
        }))
      : defaultInsights
  ).slice(0, 4);

  return (
    <Card className="rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border">
      <CardHeader className="p-4 sm:p-5 pb-0!">
        <DashboardSectionHeader
          title="AI Insights"
          // description="Autonomous multi-agent findings & co-possession gains"
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold"
              render={<Link href="/ai-insights" />}
            >
              <span>Explore</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          }
        />
      </CardHeader>

      <CardContent className="">
        <div className="divide-y divide-border/60">
          {displayInsights.map((insight) => {
            const Icon = insight.icon;

            return (
              <div
                key={insight.title}
                className="group flex gap-3 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-muted/40"
              >
                <div className={insightBadgeVariants({ type: insight.type })}>
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {insight.title}
                  </p>

                  {/* <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {insight.description}
                  </p> */}

                  <p className="mt-1 text-[10px] font-medium text-muted-foreground/80">
                    {insight.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
