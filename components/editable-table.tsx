"use client";

import { useMemo, useState, useTransition } from "react";
import { Trash2, Check, X, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTTS } from "@/hooks/use-tts";
import { updateEntry, deleteEntry } from "@/lib/dictionary-actions";
import type { DictionaryEntry } from "@/lib/types";

interface EditableTableProps {
  entries: DictionaryEntry[];
}

interface EditingState {
  id: string;
  en: string;
  es: string;
  notes: string;
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

export function EditableTable({ entries }: EditableTableProps) {
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [isPending, startTransition] = useTransition();
  const { speak } = useTTS();

  const groups = useMemo(() => groupByLetter(entries), [entries]);

  function startEdit(entry: DictionaryEntry) {
    setEditing({
      id: entry.id,
      en: entry.en,
      es: entry.es,
      notes: entry.notes,
    });
  }

  function cancelEdit() {
    setEditing(null);
  }

  function saveEdit() {
    if (!editing) return;
    if (!editing.en.trim() || !editing.es.trim()) {
      toast.error("English and Spanish are required");
      return;
    }
    startTransition(async () => {
      const result = await updateEntry(
        editing.id,
        editing.en,
        editing.es,
        editing.notes
      );
      if (result) {
        toast.success("Translation updated");
        setEditing(null);
      } else {
        toast.error("Failed to update");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const success = await deleteEntry(id);
      if (success) {
        toast.success("Translation deleted");
      } else {
        toast.error("Failed to delete");
      }
    });
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.letter}>
          {/* Letter header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2 mb-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {group.letter}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              {group.entries.length}
            </span>
          </div>

          {/* Table for this letter group */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%]">English</TableHead>
                <TableHead className="w-[30%]">Spanish</TableHead>
                <TableHead className="w-[25%]">Notes</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.entries.map((entry) =>
                editing?.id === entry.id ? (
                  <TableRow key={entry.id} className="bg-card">
                    <TableCell>
                      <Input
                        value={editing.en}
                        onChange={(e) =>
                          setEditing({ ...editing, en: e.target.value })
                        }
                        onKeyDown={handleEditKeyDown}
                        className="h-8 bg-background"
                        autoFocus
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editing.es}
                        onChange={(e) =>
                          setEditing({ ...editing, es: e.target.value })
                        }
                        onKeyDown={handleEditKeyDown}
                        className="h-8 bg-background"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editing.notes}
                        onChange={(e) =>
                          setEditing({ ...editing, notes: e.target.value })
                        }
                        onKeyDown={handleEditKeyDown}
                        className="h-8 bg-background"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-500 hover:text-green-400 cursor-pointer"
                          onClick={saveEdit}
                          disabled={isPending}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={cancelEdit}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow
                    key={entry.id}
                    className="group cursor-pointer"
                    onClick={() => startEdit(entry)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{entry.en}</span>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(entry.en, "en");
                          }}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{entry.es}</span>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(entry.es, "es");
                          }}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {entry.notes || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
