import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionHeaderVariants = cva("flex items-start justify-between gap-3", {
  variants: {
    spacing: {
      default: "mb-3.5",
      compact: "mb-2",
      loose: "mb-5",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

const sectionTitleVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg font-bold",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface DashboardSectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionHeaderVariants> {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  titleSize?: VariantProps<typeof sectionTitleVariants>["size"];
}

export function DashboardSectionHeader({
  title,
  description,
  badge,
  action,
  spacing,
  titleSize = "default",
  className,
  ...props
}: DashboardSectionHeaderProps) {
  return (
    <div className={cn(sectionHeaderVariants({ spacing }), className)} {...props}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className={cn(sectionTitleVariants({ size: titleSize }))}>{title}</h2>
          {badge}
        </div>

        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
