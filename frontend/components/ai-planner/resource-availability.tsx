"use client";

import * as React from "react";
import { Check, ChevronDown, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ResourceAvailabilityItemView } from "./types";

export interface ResourceAvailabilityProps {
  resources?: ResourceAvailabilityItemView[];
  dateFormatted?: string;
}

const defaultResources: ResourceAvailabilityItemView[] = [
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

export function ResourceAvailability({
  resources = defaultResources,
  dateFormatted = "14 Sep 2025",
}: ResourceAvailabilityProps) {
  const [selectedDate, setSelectedDate] = React.useState(dateFormatted);

  React.useEffect(() => {
    setSelectedDate(dateFormatted);
  }, [dateFormatted]);

  const displayResources = resources.length > 0 ? resources : defaultResources;

  const dateOptions = [
    { label: dateFormatted, desc: "Current Plan" },
    { label: "15 Sep 2025", desc: "+1 Day" },
    { label: "16 Sep 2025", desc: "+2 Days" },
    { label: "17 Sep 2025", desc: "+3 Days" },
  ];

  return (
    <Card className="rounded-xl border shadow-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-1.5">
          <Users2 className="size-3.5 text-primary" />
          <CardTitle className="text-xs font-semibold">Resource Availability</CardTitle>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-6 gap-1 px-2 text-[9px]">
                <span>{selectedDate}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-36 text-xs">
            <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Select Date
            </DropdownMenuLabel>
            {dateOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.label}
                className="flex items-center justify-between text-xs cursor-pointer"
                onClick={() => setSelectedDate(opt.label)}
              >
                <span>{opt.label}</span>
                {selectedDate === opt.label && (
                  <Check className="size-3.5 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-2.5 p-3 pt-0">
        {displayResources.map((resource, index) => {
          const isLimited = resource.status === "Limited";

          return (
            <div
              key={`${resource.name}-${index}`}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-foreground">
                  {resource.name}
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-muted-foreground">
                    {resource.value}
                  </span>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[8px] font-medium border-transparent py-0 px-1.5 h-4",
                      isLimited
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    )}
                  >
                    {resource.status}
                  </Badge>
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    isLimited ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{
                    width: `${resource.percent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
