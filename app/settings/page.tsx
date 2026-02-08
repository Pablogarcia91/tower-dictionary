import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getEntries } from "@/lib/dictionary-actions";
import { EditableTable } from "@/components/editable-table";
import { AddTranslationButton } from "@/components/add-translation-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsPage() {
  const entries = await getEntries();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold tracking-tight">
                Manage Translations
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] font-mono px-1.5 py-0"
              >
                {entries.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <AddTranslationButton />
            </div>
          </div>
          <Separator />
        </div>

        {/* Editable table */}
        <EditableTable entries={entries} />
      </div>
    </div>
  );
}
