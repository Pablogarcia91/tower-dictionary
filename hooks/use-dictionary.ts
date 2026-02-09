"use client";

import { useCallback, useEffect, useState } from "react";
import type { DictionaryEntry } from "@/lib/types";

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refetch = useCallback(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data: DictionaryEntry[]) => setEntries(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data: DictionaryEntry[]) => {
        setEntries(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const addEntry = useCallback(
    async (en: string, es: string, notes: string = "") => {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ en, es, notes }),
      });
      if (!res.ok) throw new Error("Failed to add");
      const entry: DictionaryEntry = await res.json();
      setEntries((prev) => [...prev, entry]);
      return entry;
    },
    []
  );

  const updateEntry = useCallback(
    async (id: string, en: string, es: string, notes: string = "") => {
      const res = await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ en, es, notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated: DictionaryEntry = await res.json();
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    },
    []
  );

  const deleteEntry = useCallback(async (id: string) => {
    const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, loaded, addEntry, updateEntry, deleteEntry, refetch };
}
