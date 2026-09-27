"use client"

import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { AudioLinesIcon, BlocksIcon, ChartNoAxesCombinedIcon, DatabaseIcon, FileTextIcon, FrameIcon, GalleryVerticalEndIcon, LayoutDashboardIcon, MapIcon, NetworkIcon, NotebookPen, PieChartIcon, Settings2Icon, TerminalIcon, TrainFrontIcon, WrenchIcon } from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "RailSync",
      logo: <TrainFrontIcon className="size-4" />,
      plan: "AI Block Planning",
    },
    {
      name: "Northern Railway",
      logo: <TrainFrontIcon className="size-4" />,
      plan: "HQ New Delhi",
    },
    {
      name: "Western Railway",
      logo: <TrainFrontIcon className="size-4" />,
      plan: "HQ Mumbai",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/overview",
      icon: <LayoutDashboardIcon />,
    },

    {
      title: "Maintenance",
      url: "#",
      icon: <WrenchIcon />,
      items: [
        {
          title: "All Tasks",
          url: "/maintenance/tasks",
        },
        {
          title: "Defects",
          url: "/maintenance/defects",
        },
        {
          title: "Work Orders",
          url: "/maintenance/work-orders",
        },
      ],
    },

    {
      title: "Block Planning",
      url: "#",
      icon: <BlocksIcon />,
      items: [
        {
          title: "AI Planner",
          url: "/block-planning/ai-planner",
        },
        {
          title: "Weekly Plan",
          url: "/block-planning/weekly",
        },
        {
          title: "Monthly Plan",
          url: "/block-planning/monthly",
        },
        {
          title: "Available Blocks",
          url: "/block-planning/available",
        },
      ],
    },

    {
      title: "Digital Twin",
      url: "/digital-twin",
      icon: <NetworkIcon />,
    },

    {
      title: "Operations",
      url: "#",
      icon: <TrainFrontIcon />,
      items: [
        {
          title: "Train Schedule",
          url: "/operations/schedule",
        },
        {
          title: "Goods Forecast",
          url: "/operations/goods-forecast",
        },
      ],
    },

    {
      title: "Data Sources",
      url: "/data-sources",
      icon: <DatabaseIcon />,
    },

    {
      title: "AI Insights",
      url: "/ai-insights",
      icon: <ChartNoAxesCombinedIcon />,
    },

    {
      title: "Plan",
      url: "/plan",
      icon: <NotebookPen />,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: <FileTextIcon />,
    },

    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <Button variant={"ghost"}>Collapse Sidebar</Button> */}
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
