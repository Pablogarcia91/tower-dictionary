import type { DictionaryEntry } from "./types";

function fuzzyMatch(
  query: string,
  target: string
): { match: boolean; score: number } {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  let qi = 0;
  let score = 0;
  let consecutive = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1 + consecutive;
      if (ti === qi) score += 2; // prefix match bonus
      consecutive++;
      qi++;
    } else {
      consecutive = 0;
    }
  }

  return { match: qi === q.length, score };
}

export function fuzzySearch(
  query: string,
  entries: DictionaryEntry[]
): DictionaryEntry[] {
  if (!query.trim()) return entries;

  return entries
    .map((entry) => {
      const enResult = fuzzyMatch(query, entry.en);
      const esResult = fuzzyMatch(query, entry.es);
      const notesResult = fuzzyMatch(query, entry.notes);
      const bestScore = Math.max(
        enResult.score,
        esResult.score,
        notesResult.score
      );
      const matched = enResult.match || esResult.match || notesResult.match;
      return { entry, score: bestScore, matched };
    })
    .filter((r) => r.matched)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.entry);
}
