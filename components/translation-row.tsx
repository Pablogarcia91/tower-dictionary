"use client";

import { Badge } from "@/components/ui/badge";
import { TTSButton } from "@/components/tts-button";
import type { DictionaryEntry } from "@/lib/types";

interface TranslationRowProps {
  entry: DictionaryEntry;
  onClick?: () => void;
}

export function TranslationRow({ entry, onClick }: TranslationRowProps) {
  return (
    <div
      className="group grid grid-cols-[1fr_auto_1fr_1fr] items-center gap-3 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card cursor-pointer"
      onClick={onClick}
    >
      {/* English */}
      <div className="flex items-center gap-2 min-w-0">
        <Badge
          variant="outline"
          className="shrink-0 text-[10px] font-mono px-1.5 py-0"
        >
          EN
        </Badge>
        <span className="truncate font-medium">{entry.en}</span>
        <TTSButton text={entry.en} lang="en" />
      </div>

      {/* Arrow */}
      <span className="text-muted-foreground text-xs">↔</span>

      {/* Spanish */}
      <div className="flex items-center gap-2 min-w-0">
        <Badge
          variant="outline"
          className="shrink-0 text-[10px] font-mono px-1.5 py-0"
        >
          ES
        </Badge>
        <span className="truncate font-medium">{entry.es}</span>
        <TTSButton text={entry.es} lang="es" />
      </div>

      {/* Notes */}
      <div className="flex items-center gap-2 min-w-0">
        {entry.notes && (
          <span className="hidden sm:block text-xs text-muted-foreground truncate">
            {entry.notes}
          </span>
        )}
      </div>
    </div>
  );
}
