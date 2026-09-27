"use client";

import * as React from "react";
import { Check, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AvailableBlockItemView } from "./types";

export interface AvailableBlocksProps {
  blocks?: AvailableBlockItemView[];
  dateFormatted?: string;
  activeBlockTime?: string;
  onSelectBlock?: (block: AvailableBlockItemView) => void;
}

const defaultBlocks: AvailableBlockItemView[] = [
  { time: "06:00 – 09:00", status: "Available", startHour: 6, endHour: 9 },
  { time: "11:00 – 13:00", status: "Limited", startHour: 11, endHour: 13 },
  { time: "14:00 – 18:00", status: "Recommended", startHour: 14, endHour: 18 },
  { time: "19:00 – 22:00", status: "Available", startHour: 19, endHour: 22 },
];

export function AvailableBlocks({
  blocks = defaultBlocks,
  dateFormatted = "14 Sep 2025",
  activeBlockTime = "14:00 – 18:00",
  onSelectBlock,
}: AvailableBlocksProps) {
  const displayBlocks = blocks.length > 0 ? blocks : defaultBlocks;
  const [selectedTime, setSelectedTime] = React.useState<string>(activeBlockTime);

  React.useEffect(() => {
    setSelectedTime(activeBlockTime);
  }, [activeBlockTime]);

  const handleBlockClick = (block: AvailableBlockItemView) => {
    setSelectedTime(block.time);
    onSelectBlock?.(block);
  };

  return (
    <Card className="rounded-xl border shadow-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2">
        <div>
          <CardTitle className="text-xs font-semibold">
            Available Blocks
          </CardTitle>
          <p className="text-[9px] text-muted-foreground">{dateFormatted} · Possession Windows</p>
        </div>

        <Badge variant="outline" className="text-[8px] font-normal">
          {displayBlocks.length} Windows
        </Badge>
      </CardHeader>

      <CardContent className="space-y-1.5 p-3 pt-0">
        {displayBlocks.map((block, index) => {
          const isSelected = selectedTime === block.time;
          const isRecommended = block.status === "Recommended";

          return (
            <div
              key={block.id || `${block.time}-${index}`}
              onClick={() => handleBlockClick(block)}
              className={cn(
                "group flex cursor-pointer items-center justify-between rounded-lg border p-2 text-[10px] transition-all",
                isSelected
                  ? "border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/20 shadow-xs"
                  : "border-border/60 hover:border-border hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className={cn("size-3.5", isSelected ? "text-emerald-600" : "text-muted-foreground")} />
                <span className="font-semibold text-foreground">{block.time}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[8px] font-medium border-transparent",
                    isRecommended
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold"
                      : block.status === "Limited"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  )}
                >
                  {isRecommended && <Sparkles className="mr-1 size-2.5" />}
                  {block.status}
                </Badge>

                {isSelected && (
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
