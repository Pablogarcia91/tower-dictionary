"use client";

import { useState, useRef } from "react";
import { MessageSquarePlus } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SuggestionButton() {
  const [open, setOpen] = useState(false);
  const [en, setEn] = useState("");
  const [es, setEs] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const enRef = useRef<HTMLInputElement>(null);

  function reset() {
    setEn("");
    setEs("");
    setNotes("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!en.trim() || !es.trim()) {
      toast.error("English and Valencià are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ en, es, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Suggestion sent! Thanks");
      reset();
      setOpen(false);
    } catch {
      toast.error("Failed to send suggestion");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => {
                setOpen(true);
                setTimeout(() => enRef.current?.focus(), 100);
              }}
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Suggest a translation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suggest a Translation</DialogTitle>
            <DialogDescription>
              Suggest a word or phrase to add to the dictionary.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sug-en" className="text-xs text-muted-foreground">
                English
              </Label>
              <Input
                ref={enRef}
                id="sug-en"
                placeholder="hello"
                value={en}
                onChange={(e) => setEn(e.target.value)}
                className="h-9 bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sug-es" className="text-xs text-muted-foreground">
                Valencià
              </Label>
              <Input
                id="sug-es"
                placeholder="hola"
                value={es}
                onChange={(e) => setEs(e.target.value)}
                className="h-9 bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sug-notes" className="text-xs text-muted-foreground">
                Notes (optional)
              </Label>
              <Input
                id="sug-notes"
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
                disabled={submitting}
              >
                <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
                {submitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
