import { AppSidebar } from "@/components/sidebar/app-sidebar";
import SidebarHeaderData from "@/components/sidebar/header";
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarHeaderData/>
       {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
