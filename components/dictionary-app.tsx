"use client";

import { useState, useCallback } from "react";
import { AppHeader } from "@/components/app-header";
import { TranslationList } from "@/components/translation-list";
import { CommandPalette } from "@/components/command-palette";
import type { DictionaryEntry } from "@/lib/types";

interface DictionaryAppProps {
  entries: DictionaryEntry[];
}

export function DictionaryApp({ entries }: DictionaryAppProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOpenSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);

  return (
    <>
      <CommandPalette
        entries={entries}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <AppHeader
          onOpenSearch={handleOpenSearch}
          entryCount={entries.length}
        />

        <TranslationList entries={entries} />
      </div>
    </>
  );
}
