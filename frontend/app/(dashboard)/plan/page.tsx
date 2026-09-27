import { PlanView } from "@/components/plan";

export const metadata = {
  title: "Plan Review & Approval | RailSync",
  description:
    "Review AI-generated multi-department corridor block schedules, verify COA train timetable constraints, and authorize publication to engineering divisions.",
};

export default function PlanReviewPage() {
  return (
    <main className="min-h-screen bg-muted/30 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1600px]">
        <PlanView />
      </div>
    </main>
  );
}
