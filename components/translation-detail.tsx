"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TTSButton } from "@/components/tts-button";
import type { DictionaryEntry } from "@/lib/types";

interface TranslationDetailProps {
  entry: DictionaryEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TranslationDetail({
  entry,
  open,
  onOpenChange,
}: TranslationDetailProps) {
  if (!entry) return null;

  const createdDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const updatedDate = new Date(entry.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Translation Detail</DialogTitle>
          <DialogDescription className="sr-only">
            Details for this translation entry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* English */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] font-mono px-1.5 py-0"
              >
                EN
              </Badge>
              <span className="text-xs text-muted-foreground">English</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">{entry.en}</p>
              <TTSButton text={entry.en} lang="en" size="default" />
            </div>
          </div>

          <Separator />

          {/* Spanish */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] font-mono px-1.5 py-0"
              >
                ES
              </Badge>
              <span className="text-xs text-muted-foreground">Spanish</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">{entry.es}</p>
              <TTSButton text={entry.es} lang="es" size="default" />
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Notes</span>
                <p className="text-sm text-foreground">{entry.notes}</p>
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator />
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span>Created {createdDate}</span>
            {entry.createdAt !== entry.updatedAt && (
              <span>Updated {updatedDate}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
