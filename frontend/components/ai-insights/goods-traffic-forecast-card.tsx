"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Lightbulb, TrainFront } from "lucide-react";
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

export interface GoodsTrafficForecastCardProps {
  corridorCode?: string;
}

export function GoodsTrafficForecastCard({
  corridorCode = "C-01",
}: GoodsTrafficForecastCardProps) {
  const [selectedHorizon, setSelectedHorizon] = React.useState("Next 7 days");

  // Sample normalized values (0 - 100)
  const data = [
    { day: "9 Sep", passenger: 28, goods: 16 },
    { day: "10 Sep", passenger: 45, goods: 24 },
    { day: "11 Sep", passenger: 52, goods: 32 },
    { day: "12 Sep", passenger: 68, goods: 40 },
    { day: "13 Sep", passenger: 85, goods: 48 },
    { day: "14 Sep", passenger: 24, goods: 14, isLowTraffic: true },
    { day: "15 Sep", passenger: 58, goods: 36 },
  ];

  return (
    <Card className="flex flex-col h-[530px] rounded-xl border shadow-none bg-card overflow-hidden">
      <CardHeader className="p-3.5 pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrainFront className="size-4 text-sky-600" />
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Traffic & Capacity Forecast ({corridorCode})
              </CardTitle>
              <p className="text-[10px] text-muted-foreground">
                Goods train forecast integrated from Control Office Application (COA)
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1 px-2.5">
                  <span>{selectedHorizon}</span>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40 text-xs">
              <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Forecast Window
              </DropdownMenuLabel>
              {["Next 7 days", "Next 14 days", "Monthly Forecast"].map((h) => (
                <DropdownMenuItem
                  key={h}
                  className="flex items-center justify-between text-xs cursor-pointer"
                  onClick={() => setSelectedHorizon(h)}
                >
                  <span>{h}</span>
                  {selectedHorizon === h && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between p-4 space-y-4">
        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="size-2.5 rounded-full bg-sky-500" />
              Passenger Trains
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              Freight / Goods Trains
            </span>
          </div>

          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-semibold text-[10px]">
            COA Live Timetable Feed
          </Badge>
        </div>

        {/* Chart Visualization */}
        <div className="relative h-[220px] rounded-xl border bg-muted/15 p-4 flex flex-col justify-end">
          {/* Background Grid Lines */}
          <div className="absolute inset-x-4 inset-y-4 flex flex-col justify-between pointer-events-none">
            {[80, 60, 40, 20, 0].map((val) => (
              <div key={val} className="flex items-center gap-2">
                <span className="w-5 text-[9px] font-mono text-muted-foreground">{val}</span>
                <div className="h-px flex-1 border-t border-dashed border-border/50" />
              </div>
            ))}
          </div>

          {/* Shaded Low Traffic Zone (14 Sep) */}
          <div
            className="absolute top-4 bottom-8 rounded-lg bg-emerald-500/15 border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-start pt-2 pointer-events-none"
            style={{ left: "68%", width: "16%" }}
          >
            <Badge className="bg-emerald-600 text-white text-[8px] py-0 px-1 font-bold">
              Low Traffic Gap
            </Badge>
          </div>

          {/* Bar Groups */}
          <div className="relative z-10 flex h-[160px] items-end justify-between pl-7 pr-2">
            {data.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 group">
                <div className="flex items-end gap-1.5 h-[130px]">
                  {/* Passenger Bar */}
                  <div
                    className="w-3 rounded-t-md bg-sky-500 transition-all duration-300 group-hover:bg-sky-400"
                    style={{ height: `${item.passenger}%` }}
                    title={`${item.passenger} Passenger Trains`}
                  />
                  {/* Goods Bar */}
                  <div
                    className="w-3 rounded-t-md bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-400"
                    style={{ height: `${item.goods}%` }}
                    title={`${item.goods} Goods Trains`}
                  />
                </div>

                <span className={`text-[11px] font-semibold ${item.isLowTraffic ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-muted-foreground"}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Callout */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              <Lightbulb className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                14 Sep features 62% lower goods train density
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Freight paths diverted via Western DFC bypass. Zero timetable disruption if maintenance is executed between 14:00 – 18:00.
              </p>
            </div>
          </div>

          <Link href="/block-planning/ai-planner">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full text-xs font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 gap-1.5"
            >
              <span>Schedule 14 Sep Possession Window in AI Planner</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
