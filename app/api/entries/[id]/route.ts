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

// PUT - update entry (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.en?.trim() || !body?.es?.trim()) {
    return NextResponse.json(
      { error: "en and es are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("dictionary_entries")
    .update({
      en: body.en.trim(),
      es: body.es.trim(),
      notes: (body.notes ?? "").trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(toEntry(data));
}

// DELETE - delete entry (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase
    .from("dictionary_entries")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
