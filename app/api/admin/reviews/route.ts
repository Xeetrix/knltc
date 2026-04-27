import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { deleteReview, updateReviewStatus } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id, status } = await request.json();
    const review = await updateReviewStatus(id, status);
    return NextResponse.json({ review });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to update review status");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await deleteReview(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to delete review");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
