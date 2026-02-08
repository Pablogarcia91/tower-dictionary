"use client";

import { useState, useCallback } from "react";
import { Volume2 } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useTTS } from "@/hooks/use-tts";
import { fuzzySearch } from "@/lib/fuzzy-search";
import type { DictionaryEntry } from "@/lib/types";

interface CommandPaletteProps {
  entries: DictionaryEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({
  entries,
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const { speak } = useTTS();

  useKeyboardShortcut(
    "k",
    useCallback(() => onOpenChange(!open), [open, onOpenChange])
  );

  const filtered = fuzzySearch(query, entries);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) setQuery("");
      }}
      title="Search Translations"
      description="Search your personal dictionary"
      showCloseButton={false}
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Search translations..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="text-muted-foreground py-4">
            <p>No translations found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        </CommandEmpty>
        <CommandGroup heading={`${filtered.length} translation${filtered.length !== 1 ? "s" : ""}`}>
          {filtered.map((entry) => (
            <CommandItem
              key={entry.id}
              value={entry.id}
              onSelect={() => {
                speak(entry.en, "en");
                setTimeout(() => speak(entry.es, "es"), 1500);
              }}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] font-mono px-1.5 py-0"
                >
                  EN
                </Badge>
                <span className="truncate">{entry.en}</span>
              </div>

              <span className="text-muted-foreground text-xs shrink-0">
                ↔
              </span>

              <div className="flex flex-1 items-center gap-2 min-w-0">
                <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] font-mono px-1.5 py-0"
                >
                  ES
                </Badge>
                <span className="truncate">{entry.es}</span>
              </div>

              <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      {/* Footer hints */}
      <div className="border-t border-border px-3 py-2 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            Enter
          </kbd>{" "}
          pronounce
        </span>
        <span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            Esc
          </kbd>{" "}
          close
        </span>
      </div>
    </CommandDialog>
  );
}
