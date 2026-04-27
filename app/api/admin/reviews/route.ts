import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-guard";
import { getPendingAdminReviews, updateReviewStatus } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

const updateReviewSchema = z.object({
  id: z.string().trim().min(1, "Review id is required"),
  status: z.enum(["approved", "rejected"]),
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const reviews = await getPendingAdminReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to load pending reviews");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id, status } = updateReviewSchema.parse(await request.json());
    const review = await updateReviewStatus(id, status);
    return NextResponse.json({ review });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to update review status");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
