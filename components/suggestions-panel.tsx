"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  id: string;
  en: string;
  es: string;
  notes: string;
  created_at: string;
}

interface SuggestionsPanelProps {
  onApproved: () => void;
}

export function SuggestionsPanel({ onApproved }: SuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = useCallback(() => {
    fetch("/api/suggestions")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setSuggestions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  async function approve(id: string) {
    try {
      const res = await fetch(`/api/suggestions/${id}`, { method: "POST" });
      if (!res.ok) throw new Error();
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      onApproved();
      toast.success("Suggestion approved and added");
    } catch {
      toast.error("Failed to approve");
    }
  }

  async function discard(id: string) {
    try {
      const res = await fetch(`/api/suggestions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Suggestion discarded");
    } catch {
      toast.error("Failed to discard");
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Loading suggestions...
      </p>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Inbox className="h-8 w-8 mb-2 opacity-30" />
        <p className="text-sm">No pending suggestions</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {suggestions.map((s) => (
        <div
          key={s.id}
          className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="shrink-0 text-[10px] font-mono px-1.5 py-0"
              >
                EN
              </Badge>
              <span className="font-medium truncate">{s.en}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="shrink-0 text-[10px] font-mono px-1.5 py-0"
              >
                VA
              </Badge>
              <span className="text-muted-foreground truncate">{s.es}</span>
            </div>
            {s.notes && (
              <p className="mt-1.5 text-xs text-muted-foreground/70 italic">
                {s.notes}
              </p>
            )}
            <p className="mt-1 text-[10px] text-muted-foreground/50">
              {new Date(s.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-green-500 hover:text-green-400 cursor-pointer"
              onClick={() => approve(s.id)}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={() => discard(s.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
