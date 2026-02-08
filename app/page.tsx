"use client";

import { useDictionary } from "@/hooks/use-dictionary";
import { DictionaryApp } from "@/components/dictionary-app";

export default function Home() {
  const { entries, loaded } = useDictionary();

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DictionaryApp entries={entries} />
    </div>
  );
}
