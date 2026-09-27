"use client"
import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, Map, TrainFront } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DashboardSectionHeader } from "./dashboard-section-header";

const hours = [
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

export interface CorridorActivityItem {
  id: string;
  code?: string;
  name?: string;
  route: string;
  distanceKm?: number | null;
  trainCount?: number;
  trains: string[];
  block?: {
    start: number;
    end: number;
    label?: string;
  };
}

export interface CorridorActivityProps {
  corridors?: CorridorActivityItem[];
}

const defaultCorridors: CorridorActivityItem[] = [
  {
    id: "C-01",
    code: "C-01",
    name: "Delhi – Agra",
    route: "New Delhi – Aligarh",
    trains: ["06:00", "08:00", "16:00", "20:00"],
    block: {
      start: 2,
      end: 5,
      label: "C-01: 11:00 – 15:00 (Track, OHE & S&T)",
    },
  },
  {
    id: "C-02",
    code: "C-02",
    name: "Agra – Gwalior",
    route: "Aligarh – Kanpur Central",
    trains: ["08:00", "10:00", "18:00", "22:00"],
    block: {
      start: 4,
      end: 6,
      label: "C-02: 14:00 – 18:00 (Track Tamping)",
    },
  },
  {
    id: "C-03",
    code: "C-03",
    name: "Lucknow – Varanasi",
    route: "Lucknow – Varanasi Cantt",
    trains: ["06:00", "08:00", "14:00", "18:00", "20:00"],
    block: {
      start: 1,
      end: 3,
      label: "C-03: 09:00 – 12:00 (Turnout Renewal)",
    },
  },
  {
    id: "C-04",
    code: "C-04",
    name: "Varanasi – Prayagraj",
    route: "Varanasi Cantt – Prayagraj",
    trains: ["08:00", "14:00", "16:00", "18:00", "22:00"],
    block: {
      start: 2,
      end: 4,
      label: "C-04: 10:00 – 13:00 (OHE Overhaul)",
    },
  },
];

export function CorridorActivity({ corridors }: CorridorActivityProps) {
  const [selectedCorridorFilter, setSelectedCorridorFilter] = React.useState("All Corridors");
  const baseCorridors = corridors && corridors.length > 0 ? corridors : defaultCorridors;

  const displayCorridors = React.useMemo(() => {
    if (selectedCorridorFilter === "All Corridors") return baseCorridors;
    return baseCorridors.filter(
      (c) => (c.code || c.id) === selectedCorridorFilter
    );
  }, [baseCorridors, selectedCorridorFilter]);

  return (
    <TooltipProvider delay={100}>
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs transition-all hover:border-border">
        <CardHeader className="p-4 sm:p-5 pb-0">
          <DashboardSectionHeader
            title="Today's Corridor Activity"
            description="Live train paths & synchronized possession windows across 06:00 – 22:00"
            action={
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                      >
                        <span>{selectedCorridorFilter}</span>
                        <ChevronDown className="size-3 text-muted-foreground" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      className="flex items-center justify-between text-xs"
                      onClick={() => setSelectedCorridorFilter("All Corridors")}
                    >
                      <span>All Corridors</span>
                      {selectedCorridorFilter === "All Corridors" && (
                        <Check className="size-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                    {baseCorridors.map((c) => {
                      const code = c.code || c.id;
                      return (
                        <DropdownMenuItem
                          key={code}
                          className="flex items-center justify-between text-xs"
                          onClick={() => setSelectedCorridorFilter(code)}
                        >
                          <span>{code}</span>
                          {selectedCorridorFilter === code && (
                            <Check className="size-3.5 text-primary" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                  render={<Link href="/digital-twin" />}
                >
                  <Map className="size-3.5 text-primary" />
                  <span>Digital Twin</span>
                </Button>
              </div>
            }
          />
        </CardHeader>

        <CardContent className="p-4 pt-1">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Timeline Header */}
              <div className="ml-[110px] grid grid-cols-9 border-b border-border/80 pb-2">
                {hours.map((hour) => (
                  <span
                    key={hour}
                    className="text-center text-[10px] font-semibold text-muted-foreground"
                  >
                    {hour}
                  </span>
                ))}
              </div>

              {/* Corridors Rows */}
              <div className="space-y-3 pt-3">
                {displayCorridors.map((corridor) => (
                  <div key={corridor.id} className="flex items-center gap-3">
                    {/* Corridor Info */}
                    <div className="w-[100px] shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-foreground">
                          {corridor.code || corridor.id}
                        </span>
                        <span className="text-[10px] font-medium text-primary">
                          ({corridor.trains.length} trains)
                        </span>
                      </div>

                      <p
                        className="truncate text-[10px] font-medium text-muted-foreground"
                        title={corridor.route}
                      >
                        {corridor.route}
                      </p>
                    </div>

                    {/* Timeline Track */}
                    <div className="relative grid flex-1 grid-cols-9 items-center">
                      {/* Horizontal railway line */}
                      <div className="absolute inset-x-0 top-1/2 h-[2px] bg-border" />

                      {/* Maintenance possession block */}
                      {corridor.block && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <div
                                className="absolute z-10 h-3 rounded-full bg-primary/85 shadow-xs cursor-pointer hover:bg-primary transition-colors ring-2 ring-primary/20"
                                style={{
                                  left: `${(corridor.block.start / 9) * 100}%`,
                                  width: `${Math.max(6, ((corridor.block.end - corridor.block.start) / 9) * 100)}%`,
                                }}
                              />
                            }
                          />
                          <TooltipContent side="top" className="text-xs font-semibold">
                            {corridor.block.label || `${corridor.code || corridor.id} Possession Block`}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* Scheduled trains */}
                      {hours.map((hour) => {
                        const hasTrain = corridor.trains.includes(hour);

                        return (
                          <div
                            key={hour}
                            className="relative z-20 flex h-8 items-center justify-center"
                          >
                            {hasTrain && (
                              <Tooltip>
                                <TooltipTrigger
                                  render={
                                    <div className="flex size-6 items-center justify-center rounded-full bg-card border border-border shadow-xs hover:border-primary transition-colors cursor-pointer">
                                      <TrainFront className="size-3.5 text-primary" />
                                    </div>
                                  }
                                />
                                <TooltipContent side="top" className="text-xs">
                                  Train slot scheduled at {hour} ({corridor.code || corridor.id})
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full border border-border bg-card">
                    <TrainFront className="size-2.5 text-primary" />
                  </div>
                  Scheduled Train Run
                </span>

                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-6 rounded-full bg-primary" />
                  Planned Maintenance Possession Block
                </span>

                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-0.5 w-6 bg-border" />
                  Clear Track Window
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
