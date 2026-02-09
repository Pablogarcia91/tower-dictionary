"use client";

import { useMemo, useState } from "react";
import { Trash2, Check, X, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTTS } from "@/hooks/use-tts";
import type { DictionaryEntry } from "@/lib/types";

interface EditableTableProps {
  entries: DictionaryEntry[];
  onUpdate: (id: string, en: string, es: string, notes?: string) => Promise<DictionaryEntry | null>;
  onDelete: (id: string) => Promise<void>;
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

export function EditableTable({ entries, onUpdate, onDelete }: EditableTableProps) {
  const [editing, setEditing] = useState<EditingState | null>(null);
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

  async function saveEdit() {
    if (!editing) return;
    if (!editing.en.trim() || !editing.es.trim()) {
      toast.error("English and Valencià are required");
      return;
    }
    try {
      const result = await onUpdate(editing.id, editing.en, editing.es, editing.notes);
      if (result) {
        toast.success("Translation updated");
        setEditing(null);
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    try {
      await onDelete(id);
      toast.success("Translation deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  }

  // Shared editing form (used in both mobile and desktop)
  function renderEditingForm() {
    if (!editing) return null;
    return (
      <div className="space-y-3 rounded-lg border border-border bg-card p-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">English</Label>
          <Input
            value={editing.en}
            onChange={(e) => setEditing({ ...editing, en: e.target.value })}
            onKeyDown={handleEditKeyDown}
            className="h-8 bg-background"
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Valencià</Label>
          <Input
            value={editing.es}
            onChange={(e) => setEditing({ ...editing, es: e.target.value })}
            onKeyDown={handleEditKeyDown}
            className="h-8 bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Notes</Label>
          <Input
            value={editing.notes}
            onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
            onKeyDown={handleEditKeyDown}
            className="h-8 bg-background"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 cursor-pointer"
            onClick={cancelEdit}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 cursor-pointer"
            onClick={saveEdit}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
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

          {/* Mobile: card list */}
          <div className="sm:hidden space-y-1">
            {group.entries.map((entry) =>
              editing?.id === entry.id ? (
                <div key={entry.id}>{renderEditingForm()}</div>
              ) : (
                <div
                  key={entry.id}
                  className="group flex flex-col gap-1.5 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card cursor-pointer"
                  onClick={() => startEdit(entry)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className="shrink-0 text-[10px] font-mono px-1.5 py-0"
                      >
                        EN
                      </Badge>
                      <span className="truncate font-medium">{entry.en}</span>
                      <button
                        className="text-muted-foreground cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(entry.en, "en");
                        }}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] font-mono px-1.5 py-0"
                    >
                      VA
                    </Badge>
                    <span className="truncate font-medium">{entry.es}</span>
                    <button
                      className="text-muted-foreground cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(entry.es, "ca");
                      }}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {entry.notes && (
                    <span className="text-xs text-muted-foreground truncate pl-7">
                      {entry.notes}
                    </span>
                  )}
                </div>
              )
            )}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30%]">English</TableHead>
                  <TableHead className="w-[30%]">Valencià</TableHead>
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
                              speak(entry.es, "ca");
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
        </div>
      ))}
    </div>
  );
}
