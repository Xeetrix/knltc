import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { createProduct, editProduct, removeProduct } from "@/lib/cms";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const product = await createProduct(payload);
    return NextResponse.json({ product });
  } catch (error) {
    console.error("[API][products][POST]", error);
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const { id, ...update } = payload;
    const product = await editProduct(id, update);
    return NextResponse.json({ product });
  } catch (error) {
    console.error("[API][products][PUT]", error);
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await removeProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[API][products][DELETE]", error);
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
