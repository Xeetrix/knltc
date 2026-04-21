import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { createCategory, removeCategory } from "@/lib/cms";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const category = await createCategory(payload);
  return NextResponse.json({ category });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await removeCategory(id);
  return NextResponse.json({ ok: true });
}
