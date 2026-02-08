"use client";

import Link from "next/link";
import { Settings, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppHeaderProps {
  onOpenSearch: () => void;
  entryCount: number;
}

export function AppHeader({ onOpenSearch, entryCount }: AppHeaderProps) {
  return (
    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">
            Tower Dictionary
          </h1>
          <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-mono">
            EN ↔ ES
          </Badge>
          <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
            {entryCount}
          </Badge>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle />
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Manage translations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Centered search bar */}
      <button
        onClick={onOpenSearch}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground cursor-pointer"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          Cmd K
        </kbd>
      </button>

      <Separator />
    </div>
  );
}
