export interface DictionaryEntry {
  id: string;
  en: string;
  es: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dictionary {
  entries: DictionaryEntry[];
}
