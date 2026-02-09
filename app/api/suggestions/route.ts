import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";

// POST - submit suggestion (public)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.en?.trim() || !body?.es?.trim()) {
    return NextResponse.json(
      { error: "en and es are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("suggestions")
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

  return NextResponse.json(data, { status: 201 });
}

// GET - list suggestions (admin only)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
