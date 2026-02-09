import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";
import type { DictionaryEntry } from "@/lib/types";

interface DbRow {
  id: string;
  en: string;
  es: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

function toEntry(row: DbRow): DictionaryEntry {
  return {
    id: row.id,
    en: row.en,
    es: row.es,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET - list all entries (public)
export async function GET() {
  const { data, error } = await supabase
    .from("dictionary_entries")
    .select("*")
    .order("en", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(toEntry));
}

// POST - create entry (admin only)
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.en?.trim() || !body?.es?.trim()) {
    return NextResponse.json(
      { error: "en and es are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("dictionary_entries")
    .insert({
      en: body.en.trim(),
      es: body.es.trim(),
      notes: (body.notes ?? "").trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(toEntry(data), { status: 201 });
}
