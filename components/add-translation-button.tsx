"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AddTranslationButtonProps {
  onAdd: (en: string, es: string, notes?: string) => void;
}

export function AddTranslationButton({ onAdd }: AddTranslationButtonProps) {
  const [open, setOpen] = useState(false);
  const [en, setEn] = useState("");
  const [es, setEs] = useState("");
  const [notes, setNotes] = useState("");
  const enRef = useRef<HTMLInputElement>(null);

  function reset() {
    setEn("");
    setEs("");
    setNotes("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!en.trim() || !es.trim()) {
      toast.error("English and Spanish are required");
      return;
    }
    onAdd(en, es, notes);
    toast.success("Translation added");
    reset();
    setOpen(false);
  }

  return (
    <>
      <Button
        size="sm"
        className="h-8 gap-1.5 cursor-pointer"
        onClick={() => {
          setOpen(true);
          setTimeout(() => enRef.current?.focus(), 100);
        }}
      >
        <Plus className="h-3.5 w-3.5" />
        Add
      </Button>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Translation</DialogTitle>
            <DialogDescription>
              Add a new word or phrase to your dictionary.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-en" className="text-xs text-muted-foreground">
                English
              </Label>
              <Input
                ref={enRef}
                id="add-en"
                placeholder="hello"
                value={en}
                onChange={(e) => setEn(e.target.value)}
                className="h-9 bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-es" className="text-xs text-muted-foreground">
                Spanish
              </Label>
              <Input
                id="add-es"
                placeholder="hola"
                value={es}
                onChange={(e) => setEs(e.target.value)}
                className="h-9 bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="add-notes"
                className="text-xs text-muted-foreground"
              >
                Notes (optional)
              </Label>
              <Input
                id="add-notes"
                placeholder="context, usage, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 bg-background"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
