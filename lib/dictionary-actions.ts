"use server";

import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import type { Dictionary, DictionaryEntry } from "./types";

const DATA_PATH = join(process.cwd(), "data", "dictionary.json");

async function readDictionary(): Promise<Dictionary> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { entries: [] };
  }
}

async function writeDictionary(data: Dictionary): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getEntries(): Promise<DictionaryEntry[]> {
  const dict = await readDictionary();
  return dict.entries.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function addEntry(
  en: string,
  es: string,
  notes: string = ""
): Promise<DictionaryEntry> {
  const dict = await readDictionary();
  const entry: DictionaryEntry = {
    id: crypto.randomUUID(),
    en: en.trim(),
    es: es.trim(),
    notes: notes.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dict.entries.push(entry);
  await writeDictionary(dict);
  revalidatePath("/");
  return entry;
}

export async function updateEntry(
  id: string,
  en: string,
  es: string,
  notes: string = ""
): Promise<DictionaryEntry | null> {
  const dict = await readDictionary();
  const index = dict.entries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  dict.entries[index] = {
    ...dict.entries[index],
    en: en.trim(),
    es: es.trim(),
    notes: notes.trim(),
    updatedAt: new Date().toISOString(),
  };
  await writeDictionary(dict);
  revalidatePath("/");
  return dict.entries[index];
}

export async function deleteEntry(id: string): Promise<boolean> {
  const dict = await readDictionary();
  const before = dict.entries.length;
  dict.entries = dict.entries.filter((e) => e.id !== id);
  if (dict.entries.length === before) return false;
  await writeDictionary(dict);
  revalidatePath("/");
  return true;
}
