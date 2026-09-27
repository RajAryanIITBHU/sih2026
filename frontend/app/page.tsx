import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/overview");
  return <main className="min-h-screen bg-background text-foreground" />;
}
