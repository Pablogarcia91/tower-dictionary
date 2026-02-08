"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDictionary } from "@/hooks/use-dictionary";
import { EditableTable } from "@/components/editable-table";
import { AddTranslationButton } from "@/components/add-translation-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  const { entries, loaded, addEntry, updateEntry, deleteEntry } =
    useDictionary();

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">
                Manage
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] font-mono px-1.5 py-0"
              >
                {entries.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <AddTranslationButton onAdd={addEntry} />
            </div>
          </div>
          <Separator />
        </div>

        {/* Editable table */}
        <EditableTable
          entries={entries}
          onUpdate={updateEntry}
          onDelete={deleteEntry}
        />
      </div>
    </div>
  );
}
