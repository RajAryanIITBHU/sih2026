"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Layers,
  MapPin,
  Route,
  Search,
  Sparkles,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AIRecommendation, InsightImpact } from "./types";

export interface RecommendationsPanelProps {
  recommendations: AIRecommendation[];
  onApplyRecommendation?: (id: string) => void;
  selectedRiskFilter?: InsightImpact | null;
  onClearRiskFilter?: () => void;
}

const impactStyles: Record<InsightImpact, { badge: string; icon: string }> = {
  Critical: {
    badge: "border-transparent bg-destructive/15 text-destructive font-bold",
    icon: "bg-destructive/15 text-destructive",
  },
  High: {
    badge: "border-transparent bg-orange-500/15 text-orange-600 font-semibold",
    icon: "bg-orange-500/15 text-orange-600",
  },
  Medium: {
    badge: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium",
    icon: "bg-amber-500/15 text-amber-600",
  },
  Low: {
    badge: "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400 font-medium",
    icon: "bg-sky-500/15 text-sky-600",
  },
};

export function RecommendationsPanel({
  recommendations,
  onApplyRecommendation,
  selectedRiskFilter,
  onClearRiskFilter,
}: RecommendationsPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [impactFilter, setImpactFilter] = React.useState<string>("all");
  const [explainingItem, setExplainingItem] = React.useState<AIRecommendation | null>(null);
  const [appliedItems, setAppliedItems] = React.useState<Record<string, boolean>>({});

  const handleApply = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppliedItems((prev) => ({ ...prev, [id]: true }));
    onApplyRecommendation?.(id);
  };

  const filteredRecommendations = React.useMemo(() => {
    return recommendations.filter((rec) => {
      if (selectedRiskFilter) {
        if (!rec.impact.toLowerCase().includes(selectedRiskFilter.toLowerCase())) {
          return false;
        }
      }
      if (impactFilter !== "all") {
        if (!rec.impact.toLowerCase().includes(impactFilter.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          rec.title.toLowerCase().includes(q) ||
          rec.description.toLowerCase().includes(q) ||
          rec.corridor.toLowerCase().includes(q) ||
          rec.department.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [recommendations, selectedRiskFilter, impactFilter, searchQuery]);

  return (
    <>
      <Card className="flex h-[530px] flex-col rounded-xl border shadow-none bg-card overflow-hidden">
        {/* Header */}
        <CardHeader className="shrink-0 p-3.5 pb-2.5 space-y-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-foreground">
                Priority AI Recommendations
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {filteredRecommendations.length} available
              </Badge>
            </div>

            {selectedRiskFilter && (
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  Filtered by {selectedRiskFilter} Risk
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  onClick={onClearRiskFilter}
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Search bar & quick filter */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search recommendations, assets, corridors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-8 text-xs"
            />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute right-1 top-1/2 size-6 -translate-y-1/2 rounded-md",
                      impactFilter !== "all" && "text-primary bg-primary/10"
                    )}
                    aria-label="Filter by impact"
                  >
                    <Filter className="size-3" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-48 text-xs">
                <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Impact Severity
                </DropdownMenuLabel>
                {["all", "Critical", "High", "Medium", "Low"].map((lvl) => (
                  <DropdownMenuItem
                    key={lvl}
                    className="flex items-center justify-between text-xs cursor-pointer"
                    onClick={() => setImpactFilter(lvl)}
                  >
                    <span>{lvl === "all" ? "All Severities" : lvl}</span>
                    {impactFilter === lvl && <Check className="size-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
                {impactFilter !== "all" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-xs text-destructive cursor-pointer font-medium"
                      onClick={() => setImpactFilter("all")}
                    >
                      Clear Filter
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* List Content */}
        <CardContent className="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-2">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((item) => {
              const isApplied = appliedItems[item.id] || item.applied;
              const styling = impactStyles[item.impact] || impactStyles.Medium;

              return (
                <div
                  key={item.id}
                  onClick={() => setExplainingItem(item)}
                  className={cn(
                    "group relative flex flex-col gap-2 rounded-xl border p-3 transition-all cursor-pointer hover:bg-muted/40 hover:border-border",
                    isApplied ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-border/60 bg-card"
                  )}
                >
                  {/* Top row: tags and time */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className={cn("text-[10px] py-0 px-2 h-5", styling.badge)}>
                        {item.impact}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] py-0 px-2 h-5">
                        {item.department}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-2.5" />
                        {item.corridor}
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h4 className="text-xs font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Window & confidence */}
                  {item.recommendedWindow && (
                    <div className="flex items-center gap-2 text-[11px] font-medium text-foreground/80 bg-muted/30 rounded-md px-2.5 py-1">
                      <Clock className="size-3 text-primary shrink-0" />
                      <span>Suggested Window: {item.recommendedWindow}</span>
                    </div>
                  )}

                  {/* Actions footer */}
                  <div className="mt-1 flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Sparkles className="size-3" />
                      <span>{item.confidence}% Model Confidence</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExplainingItem(item);
                        }}
                      >
                        Explain AI Logic
                      </Button>

                      <Button
                        size="sm"
                        variant={isApplied ? "outline" : "default"}
                        className={cn(
                          "h-7 text-xs font-semibold px-2.5",
                          isApplied && "border-emerald-500 text-emerald-600 bg-emerald-500/10"
                        )}
                        onClick={(e) => handleApply(item.id, e)}
                      >
                        {isApplied ? (
                          <>
                            <Check className="mr-1 size-3" />
                            Queued in Plan
                          </>
                        ) : (
                          <>
                            <span>{item.suggestedAction}</span>
                            <ArrowRight className="ml-1 size-3" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center space-y-2">
              <p className="text-xs text-muted-foreground">No recommendations match your active filters.</p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setSearchQuery("");
                  setImpactFilter("all");
                  onClearRiskFilter?.();
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explainable AI Modal Dialog */}
      <Dialog open={!!explainingItem} onOpenChange={(open) => !open && setExplainingItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-600" />
              <DialogTitle className="text-base font-bold">Why This AI Recommendation?</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Explainable AI (XAI) feature attribution breakdown generated from TMS, SMMS, and COA live data feeds.
            </DialogDescription>
          </DialogHeader>

          {explainingItem && (
            <div className="space-y-3.5 pt-2">
              <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
                <p className="text-xs font-bold text-foreground">{explainingItem.title}</p>
                <p className="text-xs text-muted-foreground">{explainingItem.description}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{explainingItem.corridor}</span>
                  <span>•</span>
                  <span>Confidence: {explainingItem.confidence}%</span>
                </div>
              </div>

              {/* Attribution factors */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Key Algorithmic Triggers
                </p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Track wear telemetry exceeded 85th percentile safety threshold.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Possession gap identified with zero scheduled passenger train conflicts.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Multi-department crew availability verified across Engineering, OHE, and S&T.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>CP-SAT mathematical optimization solver yielded score of 94/100.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setExplainingItem(null)}>
                  Close
                </Button>
                <Link href="/block-planning/ai-planner">
                  <Button size="sm" className="gap-1.5">
                    <span>Open in AI Block Planner</span>
                    <ExternalLink className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
