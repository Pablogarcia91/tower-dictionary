import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";

// POST - approve suggestion (admin only): create entry + delete suggestion
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch the suggestion
  const { data: suggestion, error: fetchErr } = await supabase
    .from("suggestions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !suggestion) {
    return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
  }

  // Insert into dictionary_entries
  const { error: insertErr } = await supabase
    .from("dictionary_entries")
    .insert({
      en: suggestion.en,
      es: suggestion.es,
      notes: suggestion.notes,
    });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // Delete the suggestion
  await supabase.from("suggestions").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}

// DELETE - discard suggestion (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase
    .from("suggestions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
