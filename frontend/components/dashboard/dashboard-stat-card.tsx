"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statCardVariants = cva(
  "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-md hover:border-border",
  {
    variants: {
      variant: {
        default: "border-border/70 hover:border-border",
        primary: "border-primary/20 bg-gradient-to-br from-card to-primary/[0.03]",
        destructive: "border-destructive/20 bg-gradient-to-br from-card to-destructive/[0.03]",
        warning: "border-warning/20 bg-gradient-to-br from-card to-warning/[0.03]",
        success: "border-success/20 bg-gradient-to-br from-card to-success/[0.03]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface DashboardStatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string;
  change?: string;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  positive?: boolean;
  negative?: boolean;
  href?: string;
}

export function DashboardStatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconClassName = "",
  positive,
  negative,
  variant,
  href,
  className,
  ...props
}: DashboardStatCardProps) {
  const trendColor = positive
    ? "text-emerald-600 dark:text-emerald-400"
    : negative
      ? "text-rose-600 dark:text-rose-400"
      : "text-muted-foreground";

  const content = (
    <Card
      className={cn(
        statCardVariants({ variant }),
        href && "cursor-pointer hover:-translate-y-0.5 transition-transform p-0!",
        className
      )}
      {...props}
    >
      <CardContent className="p-4! sm:p-4!">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1 space-y-1">
            {/* Label — clear, legible uppercase tracking */}
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>

            {/* Value — prominent focal point */}
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              {value}
            </p>
          </div>

          {/* Icon Badge */}
          {icon && (
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl p-2 transition-transform duration-300 group-hover:scale-110",
                iconClassName || "bg-muted text-foreground"
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Trend row */}
        {change && (
          <div className="mt- flex items-center gap-1 pt-1 border-t border-border/50">
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-0.5 py-0.5 text-[11px] font-semibold leading-none",
                trendColor
              )}
            >
              <span>{change}</span>
              {positive && <ArrowUp className="size-3" />}
              {negative && <ArrowDown className="size-3" />}
              {!positive && !negative && <ArrowUp className="size-3 opacity-50" />}
            </div>

            {changeLabel && (
              <span className="truncate text-xs text-muted-foreground">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <div className="absolute -inset-full -z-10 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-700 group-hover:left-full" />
    </Card>
  );

  if (href) {
    return <Link href={href} className="block no-underline">{content}</Link>;
  }

  return content;
}
