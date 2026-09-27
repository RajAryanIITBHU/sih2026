import { AIInsightsView } from "@/components/ai-insights";

export const metadata = {
  title: "AI Maintenance Insights | RailSync",
  description:
    "Actionable intelligence, predictive risk modeling, and automated block possession recommendations for Indian Railways fixed infrastructure.",
};

export default function AIInsightsPage() {
  return (
    <main className="min-h-screen bg-muted/30 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1600px]">
        <AIInsightsView />
      </div>
    </main>
  );
}
