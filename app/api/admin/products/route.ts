import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { createProduct, editProduct, removeProduct } from "@/lib/cms";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const product = await createProduct(payload);
  return NextResponse.json({ product });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const { id, ...update } = payload;
  const product = await editProduct(id, update);
  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await removeProduct(id);
  return NextResponse.json({ ok: true });
}
