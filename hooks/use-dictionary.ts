"use client";

import { useCallback, useEffect, useState } from "react";
import type { DictionaryEntry } from "@/lib/types";

const STORAGE_KEY = "tower-dictionary-entries";

const SEED_ENTRIES: DictionaryEntry[] = [
  { id: "seed-001", en: "hello", es: "hola", notes: "casual greeting", createdAt: "2026-02-07T10:00:00.000Z", updatedAt: "2026-02-07T10:00:00.000Z" },
  { id: "seed-002", en: "Pokie Pokie", es: "Navallà", notes: "Critica dura para alguien", createdAt: "2026-02-07T10:01:00.000Z", updatedAt: "2026-02-08T01:51:02.807Z" },
  { id: "seed-003", en: "Lemonade of the little paper", es: "Llimonà de paperet", notes: "Un boost per rotar", createdAt: "2026-02-07T10:02:00.000Z", updatedAt: "2026-02-08T01:50:31.856Z" },
  { id: "seed-004", en: "A catted", es: "Un tallad", notes: "un café con leche", createdAt: "2026-02-07T10:03:00.000Z", updatedAt: "2026-02-08T01:49:52.551Z" },
  { id: "seed-005", en: "Bull on fire", es: "Bou embolat", notes: "ELltoro embolao", createdAt: "2026-02-07T10:04:00.000Z", updatedAt: "2026-02-08T01:48:41.652Z" },
  { id: "5ba8cb2a-4936-498f-acfe-97954a9d6b87", en: "Sucking snails", es: "Xuplar caragols", notes: "Quan els xiquillos se magrejen", createdAt: "2026-02-07T13:17:15.872Z", updatedAt: "2026-02-08T01:51:33.276Z" },
  { id: "a45933ec-0814-47ff-ae72-28ca813519f1", en: "The candy cow", es: "La vaca confitera", notes: "Quan trauen la vaca i es tiren caramels", createdAt: "2026-02-08T01:45:17.956Z", updatedAt: "2026-02-08T01:45:17.956Z" },
  { id: "5677a7bf-f043-4c4e-b252-5cc33b75c06b", en: "The twins", es: "Los gemelos", notes: "Els bessons de les cames", createdAt: "2026-02-08T01:46:09.013Z", updatedAt: "2026-02-08T01:46:09.013Z" },
  { id: "2bb54187-394d-4dab-93e9-5086814352ee", en: "Fire to the barrac", es: "Foc a la barraca", notes: "Ironia per lligar", createdAt: "2026-02-08T01:46:39.397Z", updatedAt: "2026-02-08T01:46:39.397Z" },
  { id: "1cd82690-6d6a-42ce-8b7a-fe9ba47f4253", en: "Enchanted", es: "Encantat", notes: "Marc Rodriguez Pastor", createdAt: "2026-02-08T01:46:59.931Z", updatedAt: "2026-02-08T01:51:16.763Z" },
  { id: "ef7a96e9-4a90-4c3d-911d-599f2071dad6", en: "Too much for the pumpking", es: "Massa per la carabassa", notes: "Demasiado para esto", createdAt: "2026-02-08T01:47:38.509Z", updatedAt: "2026-02-08T01:47:38.509Z" },
];

function loadEntries(): DictionaryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // First load: seed data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTRIES));
  return SEED_ENTRIES;
}

function saveEntries(entries: DictionaryEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setLoaded(true);
  }, []);

  const addEntry = useCallback(
    (en: string, es: string, notes: string = "") => {
      const entry: DictionaryEntry = {
        id: crypto.randomUUID(),
        en: en.trim(),
        es: es.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEntries((prev) => {
        const next = [...prev, entry];
        saveEntries(next);
        return next;
      });
      return entry;
    },
    []
  );

  const updateEntry = useCallback(
    (id: string, en: string, es: string, notes: string = "") => {
      let updated: DictionaryEntry | null = null;
      setEntries((prev) => {
        const next = prev.map((e) => {
          if (e.id === id) {
            updated = {
              ...e,
              en: en.trim(),
              es: es.trim(),
              notes: notes.trim(),
              updatedAt: new Date().toISOString(),
            };
            return updated;
          }
          return e;
        });
        saveEntries(next);
        return next;
      });
      return updated;
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEntries(next);
      return next;
    });
  }, []);

  return { entries, loaded, addEntry, updateEntry, deleteEntry };
}
