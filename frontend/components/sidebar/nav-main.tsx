"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export interface NavSubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: NavSubItem[];
}

function isPathActive(url: string, pathname: string): boolean {
  if (!url || url === "#") return false;
  if (url === "/overview") {
    return pathname === "/overview" || pathname === "/";
  }
  return pathname === url || pathname.startsWith(url + "/");
}

function NavCollapsibleItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isGroupActive = Boolean(
    (item.url !== "#" && isPathActive(item.url, pathname)) ||
    item.items?.some((subItem) => isPathActive(subItem.url, pathname))
  );

  const [isOpen, setIsOpen] = React.useState(isGroupActive);

  // Automatically expand group when navigating to one of its subroutes
  React.useEffect(() => {
    if (isGroupActive) {
      setIsOpen(true);
    }
  }, [isGroupActive]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isGroupActive}
            className="
              h-10
              rounded-lg
              px-3
              font-semibold
              transition-colors
              hover:bg-muted
              data-[state=open]:bg-muted/70
              data-[active=true]:text-primary
              data-[active=true]:font-medium
            "
          />
        }
      >
        {item.icon}

        <span>{item.title}</span>

        <ChevronRightIcon
          className="
            ml-auto
            size-4
            transition-transform
            duration-200
            group-data-open/collapsible:rotate-90
          "
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub className="ml-4 border-l border-border/60 pl-2">
          {item.items?.map((subItem) => {
            const isSubActive = isPathActive(subItem.url, pathname);
            return (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={isSubActive}
                  render={<Link href={subItem.url} />}
                  className="
                    h-7
                    rounded-md
                    font-medium
                    text-[12px]!
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                    data-[active=true]:bg-primary/10
                    data-[active=true]:text-primary
                    data-[active=true]:font-semibold
                    data-[active=true]:border-l-2
                    data-[active=true]:border-l-primary
                  "
                >
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function NavMain({
  items,
}: {
  items: NavItem[];
}) {
  const pathname = usePathname() || "";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Operations
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1 tracking-tight">
        {items.map((item) => {
          const hasSubItems = Boolean(item.items?.length);

          /*
           * Direct navigation item
           */
          if (!hasSubItems) {
            const isDirectActive = isPathActive(item.url, pathname);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isDirectActive}
                  render={<Link href={item.url} />}
                  className="
                    h-10
                    rounded-lg
                    px-3
                    font-semibold
                    transition-colors
                    hover:bg-muted
                    data-[active=true]:bg-primary/10
                    data-[active=true]:text-primary
                    data-[active=true]:font-medium
                    data-[active=true]:border-l-2
                    data-[active=true]:border-l-primary
                  "
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          /*
           * Collapsible navigation item
           */
          return (
            <NavCollapsibleItem
              key={item.title}
              item={item}
              pathname={pathname}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
