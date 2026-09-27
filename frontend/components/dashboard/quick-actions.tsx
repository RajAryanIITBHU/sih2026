"use client";

import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CalendarDays,
  Network,
  Plus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DashboardSectionHeader } from "./dashboard-section-header";

export const quickActionVariants = cva(
  "group relative flex items-center transition-all",
  {
    variants: {
      variant: {
        card: "h-[86px] flex-col justify-center gap-2 rounded-xl border border-border/80 bg-card p-2.5 text-center shadow-2xs hover:border-primary/50 hover:bg-accent/50 hover:shadow-xs",
        dock: "h-9 w-9 rounded-lg border border-border/80 bg-card p-0 shadow-2xs hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
        inline:
          "h-8 gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "",
        sm: "h-[74px] p-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "card",
      size: "default",
    },
  }
);

interface ActionItem {
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  href: string;
  description: string;
}

const defaultActions: ActionItem[] = [
  {
    label: "Create Maintenance Task",
    shortLabel: "New Task",
    icon: Plus,
    href: "/maintenance/tasks",
    description: "Log an urgent or scheduled maintenance work order",
  },
  {
    label: "Plan Block Window",
    shortLabel: "Plan Block",
    icon: CalendarDays,
    href: "/block-planning/ai-planner",
    description: "Request possession slot or AI corridor optimization",
  },
  {
    label: "Inspect Digital Twin",
    shortLabel: "Digital Twin",
    icon: Network,
    href: "/digital-twin",
    description: "View corridor topology, assets, and live train runs",
  },
  {
    label: "Run AI Recommendations",
    shortLabel: "AI Insights",
    icon: Sparkles,
    href: "/ai-insights",
    description: "Review automated block clustering and conflict resolution",
  },
];

export interface QuickActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof quickActionVariants> {
  title?: string;
  description?: string;
  actions?: ActionItem[];
  showCardWrapper?: boolean;
}

export function QuickActions({
  className,
  variant = "card",
  size = "default",
  title = "Quick Actions",
  description = "Frequent operational workflows",
  actions = defaultActions,
  showCardWrapper = true,
  ...props
}: QuickActionsProps) {
  const content = (
    <TooltipProvider delay={150}>
      <div
        className={cn(
          variant === "card" && "grid grid-cols-2 gap-2 sm:grid-cols-4",
          variant === "dock" && "flex items-center gap-1.5",
          variant === "inline" && "flex flex-wrap items-center gap-2",
          className
        )}
        {...props}
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Tooltip key={action.label}>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(quickActionVariants({ variant, size }))}
                    render={<Link href={action.href} />}
                  />
                }
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-lg transition-colors",
                    variant === "card"
                      ? "size-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      : "size-full text-foreground"
                  )}
                >
                  <Icon className={cn(variant === "card" ? "size-4" : "size-4")} />
                </span>

                {variant !== "dock" && (
                  <span className="line-clamp-2 text-xs font-semibold leading-tight text-foreground group-hover:text-primary">
                    {action.shortLabel || action.label}
                  </span>
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs max-w-[200px]">
                <p className="font-semibold">{action.label}</p>
                <p className="text-[10px] text-muted-foreground">{action.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );

  if (!showCardWrapper || variant === "dock" || variant === "inline") {
    return content;
  }

  return (
    <Card className="rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border">
      <CardHeader className="p-4 sm:p-5 pb-0">
        <DashboardSectionHeader title={title} description={description} />
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-3">{content}</CardContent>
    </Card>
  );
}

