"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AvailableBlockItemView } from "./types";

export interface AvailableBlocksProps {
  blocks?: AvailableBlockItemView[];
  dateFormatted?: string;
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
}: AvailableBlocksProps) {
  const displayBlocks = blocks.length > 0 ? blocks : defaultBlocks;

  return (
    <Card className="rounded-xl border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
        <CardTitle className="text-xs">
          Available Blocks ({dateFormatted})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 p-3 pt-1">
        {displayBlocks.map((block, index) => (
          <div
            key={block.id || `${block.time}-${index}`}
            className="flex items-center justify-between text-[8px]"
          >
            <span className="text-muted-foreground">{block.time}</span>

            <Badge
              variant="outline"
              className={
                block.status === "Recommended"
                  ? "border-transparent bg-emerald-500/10 text-emerald-600"
                  : block.status === "Limited"
                  ? "border-transparent bg-amber-500/10 text-amber-600"
                  : "border-transparent bg-emerald-500/5 text-emerald-600"
              }
            >
              {block.status}

              {block.status === "Recommended" && <X className="ml-1 size-2.5" />}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
