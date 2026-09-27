"use client";

import React, { useEffect, useState } from "react";
import { BellIcon, MoonIcon, PlusIcon, SearchIcon, Settings2Icon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CreateRequestDialog } from "./create-request-dialog";

const SidebarHeaderData = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 10);
  }, []);

  return (
    <header
      className="
        sticky
        top-0
        left-0
        flex
        h-16
        w-full
        shrink-0
        items-center
        justify-between
        gap-4
        border-b
        border-border
        bg-background
        px-4
        md:px-6
        z-10
      "
    >
      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger className="shrink-0 text-muted-foreground hover:text-foreground" />

        {/* Search */}
        <div className="relative w-full max-w-[340px]">
          <SearchIcon
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            placeholder="Search trains, assets, tasks, or blocks..."
            className="
              h-10
              w-full
              rounded-lg
              shadow-xs!
              border
              border-border!
              outline-none!
              bg-card
              pl-9
              text-xs
              text-foreground
              placeholder:text-muted-foreground
              focus-visible:border-ring
              focus-visible:ring-ring/20
            "
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="
            relative
            size-9
            rounded-lg
            text-muted-foreground
            hover:bg-accent
            hover:text-foreground
          "
        >
          <BellIcon className="size-[17px]" />

          <span
            className="
              absolute
              right-1.5
              top-1
              flex
              size-3.5
              items-center
              justify-center
              rounded-full
              bg-destructive
              text-[8px]
              font-semibold
              text-destructive-foreground
            "
          >
            3
          </span>
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="
            size-9
            rounded-lg
            text-muted-foreground
            hover:bg-accent
            hover:text-foreground
          "
        >
          <Settings2Icon className="size-[17px]" />
        </Button>

        {/* Dark Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="
            relative
            size-9
            rounded-lg
            text-muted-foreground
            hover:bg-accent
            hover:text-foreground
          "
          title={
            mounted
              ? resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
              : "Toggle theme"
          }
          aria-label="Toggle theme"
        >
          <SunIcon className="size-[17px] rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-[17px] rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User */}
        <Button
          variant="outline"
          className="
            hidden
            h-10
            items-center
            gap-2.5
            rounded-lg
            border-border
            bg-card
            px-2.5
            hover:bg-accent
            sm:flex
          "
        >
          <Avatar className="size-7">
            <AvatarImage src="/avatar.png" alt="Raj Aryan" />
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              RA
            </AvatarFallback>
          </Avatar>

          <div className="hidden leading-tight lg:block text-left">
            <p className="text-xs font-semibold text-foreground">Raj Aryan</p>
            <p className="text-[9px] text-muted-foreground">
              raj.aryan@railmaint.in
            </p>
          </div>
        </Button>

        {/* Add New */}
        <Button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          variant="outline"
          className="
            h-9
            gap-1.5
            rounded-lg
            border
            border-primary/40
            bg-primary/10
            px-3
            text-xs
            font-semibold
            text-primary
            shadow-xs
            hover:bg-primary/20
            hover:text-primary
          "
        >
          <PlusIcon className="size-3.5" />
          <span className="hidden sm:inline">Add new</span>
        </Button>

        {/* Add New Modal Dialog */}
        <CreateRequestDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </div>
    </header>
  );
};

export default SidebarHeaderData;
