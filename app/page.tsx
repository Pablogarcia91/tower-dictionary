import { getEntries } from "@/lib/dictionary-actions";
import { DictionaryApp } from "@/components/dictionary-app";

export default async function Home() {
  const entries = await getEntries();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DictionaryApp entries={entries} />
    </div>
  );
}
