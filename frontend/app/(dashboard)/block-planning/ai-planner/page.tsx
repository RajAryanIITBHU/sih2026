import {
  InteractivePlanner,
  PlannerHeader,
} from "@/components/ai-planner";
import { Separator } from "@/components/ui/separator";
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
    <main className="min-h-screen bg-muted/30 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4">
        {/* Operations Header with Corridor Selector, Date Context, View Toggle & Actions */}
        <PlannerHeader
          corridors={data.corridors}
          selectedCorridorCode={data.selectedCorridor?.code || "C-01"}
          selectedDate={data.recommendedBlock.dateFormatted}
        />

        <Separator className="opacity-60" />

        {/* Coordinated Interactive Multi-Agent AI Planner with Timeline, Telemetry & Resource Readiness */}
        <InteractivePlanner
          initialTasks={data.tasks}
          initialScheduleTasks={data.scheduleTasks}
          initialStats={data.stats}
          initialOptimizationResult={data.optimizationResult}
          recommendedBlock={data.recommendedBlock}
          corridorCode={data.selectedCorridor?.code || "C-01"}
          availableBlocks={data.availableBlocks}
          resourceAvailability={data.resourceAvailability}
          trafficForecast={data.trafficForecast}
        />
      </div>
    </main>
  );
}
