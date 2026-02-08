"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEntry, updateEntry } from "@/lib/dictionary-actions";
import type { DictionaryEntry } from "@/lib/types";

interface TranslationFormProps {
  editingEntry?: DictionaryEntry | null;
  onCancelEdit?: () => void;
}

export function TranslationForm({
  editingEntry,
  onCancelEdit,
}: TranslationFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [en, setEn] = useState(editingEntry?.en ?? "");
  const [es, setEs] = useState(editingEntry?.es ?? "");
  const [notes, setNotes] = useState(editingEntry?.notes ?? "");

  // Reset form when editingEntry changes
  const prevIdRef = useRef(editingEntry?.id);
  if (editingEntry?.id !== prevIdRef.current) {
    prevIdRef.current = editingEntry?.id;
    setEn(editingEntry?.en ?? "");
    setEs(editingEntry?.es ?? "");
    setNotes(editingEntry?.notes ?? "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!en.trim() || !es.trim()) {
      toast.error("English and Spanish fields are required");
      return;
    }

    startTransition(async () => {
      if (editingEntry) {
        const result = await updateEntry(editingEntry.id, en, es, notes);
        if (result) {
          toast.success("Translation updated");
          onCancelEdit?.();
        } else {
          toast.error("Failed to update translation");
        }
      } else {
        await addEntry(en, es, notes);
        toast.success("Translation added");
        setEn("");
        setEs("");
        setNotes("");
      }
    });
  }

  const isEditing = !!editingEntry;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {isEditing ? "Edit Translation" : "Add Translation"}
        </h3>
        {isEditing && onCancelEdit && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer"
            onClick={onCancelEdit}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="en" className="text-xs text-muted-foreground">
            English
          </Label>
          <Input
            id="en"
            placeholder="hello"
            value={en}
            onChange={(e) => setEn(e.target.value)}
            className="h-9 bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="es" className="text-xs text-muted-foreground">
            Spanish
          </Label>
          <Input
            id="es"
            placeholder="hola"
            value={es}
            onChange={(e) => setEs(e.target.value)}
            className="h-9 bg-background"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-xs text-muted-foreground">
          Notes (optional)
        </Label>
        <Input
          id="notes"
          placeholder="context, usage, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-9 bg-background"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-9 cursor-pointer"
        size="sm"
      >
        {isEditing ? (
          <>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Translation
          </>
        )}
      </Button>
    </form>
  );
}
