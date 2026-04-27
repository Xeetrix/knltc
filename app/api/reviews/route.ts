import { NextResponse } from "next/server";
import { z } from "zod";
import { createProductReview } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

const reviewSchema = z.object({
  product_id: z.string(),
  customer_name: z.string().trim().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3),
});

export async function POST(request: Request) {
  try {
    const payload = reviewSchema.parse(await request.json());
    const review = await createProductReview(payload);
    return NextResponse.json({ review, message: "Review submitted and pending approval." }, { status: 201 });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to submit review");
    return NextResponse.json({ error: errorResponse.error, issue: errorResponse.issue }, { status: errorResponse.status });
  }
}
