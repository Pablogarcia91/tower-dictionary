"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranslationRow } from "@/components/translation-row";
import { TranslationDetail } from "@/components/translation-detail";
import type { DictionaryEntry } from "@/lib/types";

interface TranslationListProps {
  entries: DictionaryEntry[];
}

function groupByLetter(entries: DictionaryEntry[]) {
  const sorted = [...entries].sort((a, b) =>
    a.en.localeCompare(b.en, "en", { sensitivity: "base" })
  );

  const groups: { letter: string; entries: DictionaryEntry[] }[] = [];
  let currentLetter = "";

  for (const entry of sorted) {
    const firstChar = entry.en.charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";

    if (letter !== currentLetter) {
      currentLetter = letter;
      groups.push({ letter, entries: [] });
    }
    groups[groups.length - 1].entries.push(entry);
  }

  return groups;
}

export function TranslationList({ entries }: TranslationListProps) {
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const groups = useMemo(() => groupByLetter(entries), [entries]);

  function handleRowClick(entry: DictionaryEntry) {
    setSelectedEntry(entry);
    setDetailOpen(true);
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-sm">No translations yet</p>
        <p className="text-xs mt-1">
          Go to Settings to add your first translation
        </p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.letter}>
              {/* Letter header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2 mb-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {group.letter}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {group.entries.length}
                </span>
              </div>

              {/* Entries */}
              <div className="space-y-0.5">
                {group.entries.map((entry) => (
                  <TranslationRow
                    key={entry.id}
                    entry={entry}
                    onClick={() => handleRowClick(entry)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <TranslationDetail
        entry={selectedEntry}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
