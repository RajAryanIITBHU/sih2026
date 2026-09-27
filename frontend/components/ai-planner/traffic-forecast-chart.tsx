"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TrafficForecastDataView } from "./types";

export interface TrafficForecastChartProps {
  data?: TrafficForecastDataView;
  corridorCode?: string;
  dateFormatted?: string;
}

export function TrafficForecastChart({
  data,
  corridorCode = "C-01",
  dateFormatted = "14 Sep 2025",
}: TrafficForecastChartProps) {
  const [selectedDate, setSelectedDate] = React.useState(dateFormatted);

  React.useEffect(() => {
    if (data?.dateFormatted) {
      setSelectedDate(data.dateFormatted);
    } else if (dateFormatted) {
      setSelectedDate(dateFormatted);
    }
  }, [data?.dateFormatted, dateFormatted]);

  const passengerPoints =
    data?.passengerPoints ||
    "0,45 25,35 50,32 75,26 100,18 125,25 150,28 175,24 200,32";
  const goodsPoints =
    data?.goodsPoints ||
    "0,55 25,48 50,45 75,50 100,42 125,46 150,44 175,40 200,48";
  const displayCorridor = data?.corridorCode || corridorCode;

  const dateOptions = [
    { label: dateFormatted, desc: "Possession Window" },
    { label: "15 Sep 2025", desc: "+1 Day" },
    { label: "16 Sep 2025", desc: "+2 Days" },
  ];

  return (
    <Card className="rounded-xl border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
        <CardTitle className="text-xs">
          Train Traffic Forecast ({displayCorridor})
        </CardTitle>

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
              Forecast Horizon
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

      <CardContent className="p-3 pt-1">
        <div className="mb-1 flex gap-3 text-[8px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-sky-500" />
            Passenger
          </span>

          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Goods
          </span>
        </div>

        <div className="relative h-[65px] overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[40, 20, 0].map((value) => (
              <div key={value} className="flex items-center gap-1">
                <span className="w-3 text-[7px] text-muted-foreground">
                  {value}
                </span>

                <div className="h-px flex-1 bg-muted" />
              </div>
            ))}
          </div>

          <svg
            viewBox="0 0 210 65"
            className="absolute inset-0 h-full w-full pl-4"
            preserveAspectRatio="none"
          >
            <polyline
              points={passengerPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-sky-500"
            />

            <polyline
              points={goodsPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-emerald-500"
            />
          </svg>
        </div>

        <div className="mt-1 flex justify-between pl-4 text-[7px] text-muted-foreground">
          <span>06:00</span>
          <span>10:00</span>
          <span>14:00</span>
          <span>18:00</span>
          <span>22:00</span>
        </div>
      </CardContent>
    </Card>
  );
}
