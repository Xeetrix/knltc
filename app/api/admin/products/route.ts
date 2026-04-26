import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { createProduct, editProduct, removeProduct } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const product = await createProduct(payload);
    return NextResponse.json({ product });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to create product");
    console.error("[API][products][POST]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
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
    const errorResponse = toAdminErrorResponse(error, "Failed to update product");
    console.error("[API][products][PUT]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
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
    const errorResponse = toAdminErrorResponse(error, "Failed to delete product");
    console.error("[API][products][DELETE]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
