"use client";

import { Volume2 } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";
import type { DictionaryEntry } from "@/lib/types";

interface TranslationRowProps {
  entry: DictionaryEntry;
  onClick?: () => void;
}

export function TranslationRow({ entry, onClick }: TranslationRowProps) {
  const { speak } = useTTS();

  return (
    <div
      className="group w-full rounded-lg border border-border bg-card px-4 py-3 sm:px-5 sm:py-4 transition-colors hover:border-ring cursor-pointer"
      onClick={onClick}
    >
      {/* English + TTS */}
      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg font-semibold text-foreground">
          {entry.en}
        </span>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            speak(entry.en, "en");
          }}
        >
          <Volume2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Valencià + TTS */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm sm:text-base text-muted-foreground">
          {entry.es}
        </span>
        <button
          className="text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            speak(entry.es, "ca");
          }}
        >
          <Volume2 className="h-3 w-3" />
        </button>
      </div>

      {/* Notes */}
      {entry.notes && (
        <p className="mt-2 text-xs text-muted-foreground/70 leading-relaxed">
          <span className="font-medium text-muted-foreground/90">Note:</span>{" "}
          {entry.notes}
        </p>
      )}
    </div>
  );
}
