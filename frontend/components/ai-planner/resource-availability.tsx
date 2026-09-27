"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
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
    <Card className="rounded-xl border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
        <CardTitle className="text-xs">Resource Availability</CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-6 gap-1 px-2 text-[8px]">
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

      <CardContent className="space-y-2 p-3 pt-1">
        {displayResources.map((resource, index) => (
          <div
            key={`${resource.name}-${index}`}
            className="grid grid-cols-[1fr_42px_80px_48px] items-center gap-2 text-[8px]"
          >
            <span className="truncate text-muted-foreground">
              {resource.name}
            </span>

            <span>{resource.value}</span>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={
                  resource.status === "Limited"
                    ? "h-full rounded-full bg-amber-500"
                    : "h-full rounded-full bg-emerald-500"
                }
                style={{
                  width: `${resource.percent}%`,
                }}
              />
            </div>

            <Badge
              variant="outline"
              className={
                resource.status === "Limited"
                  ? "border-transparent bg-amber-500/10 text-amber-600"
                  : "border-transparent bg-emerald-500/10 text-emerald-600"
              }
            >
              {resource.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
