import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { createPost, editPost, removePost } from "@/lib/cms";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const post = await createPost(payload);
    return NextResponse.json({ post });
  } catch (error) {
    console.error("[API][blog][POST]", error);
    const message = error instanceof Error ? error.message : "Failed to create blog post";
    return NextResponse.json({ error: message }, { status: 500 });
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
    console.error("[API][blog][PUT]", error);
    const message = error instanceof Error ? error.message : "Failed to update blog post";
    return NextResponse.json({ error: message }, { status: 500 });
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
    console.error("[API][blog][DELETE]", error);
    const message = error instanceof Error ? error.message : "Failed to delete blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
