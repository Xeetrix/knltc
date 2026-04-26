import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { createPost, editPost, removePost } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const post = await createPost(payload);
    return NextResponse.json({ post });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to create blog post");
    console.error("[API][blog][POST]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const { id, ...update } = payload;
    const post = await editPost(id, update);
    return NextResponse.json({ post });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to update blog post");
    console.error("[API][blog][PUT]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await removePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to delete blog post");
    console.error("[API][blog][DELETE]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
