import {
  AvailableBlocks,
  InteractivePlanner,
  PlannerHeader,
  ResourceAvailability,
  TrafficForecastChart,
} from "@/components/ai-planner";
import { getAIPlannerData } from "@/lib/data/ai-planner";

export const dynamic = "force-dynamic";

interface AIBlockPlannerPageProps {
  searchParams?: Promise<{ corridor?: string }>;
}

export default async function AIBlockPlannerPage({
  searchParams,
}: AIBlockPlannerPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const corridorParam = resolvedSearchParams?.corridor;
  const data = await getAIPlannerData(corridorParam);

  return (
    <main className="min-h-screen bg-muted/30 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-3">
        {/* Page Header */}
        <PlannerHeader
          corridors={data.corridors}
          selectedCorridorCode={data.selectedCorridor?.code || "C-01"}
          selectedDate={data.recommendedBlock.dateFormatted}
        />

        {/* Interactive Main Planner: Dynamic Coordination Between Selected Tasks, Schedule Timeline & Metrics */}
        <InteractivePlanner
          initialTasks={data.tasks}
          initialScheduleTasks={data.scheduleTasks}
          initialStats={data.stats}
          initialOptimizationResult={data.optimizationResult}
          recommendedBlock={data.recommendedBlock}
          corridorCode={data.selectedCorridor?.code || "C-01"}
        />

        {/* Bottom Information */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.9fr_1.5fr]">
          <TrafficForecastChart
            data={data.trafficForecast}
            corridorCode={data.selectedCorridor?.code || "C-01"}
            dateFormatted={data.trafficForecast.dateFormatted}
          />

          <AvailableBlocks
            blocks={data.availableBlocks}
            dateFormatted={data.trafficForecast.dateFormatted}
          />

          <ResourceAvailability
            resources={data.resourceAvailability}
            dateFormatted={data.trafficForecast.dateFormatted}
          />
        </div>
      </div>
    </main>
  );
}
