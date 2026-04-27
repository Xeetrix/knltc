import { NextResponse } from "next/server";
import { z } from "zod";
import { createProductReview } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

type CreateReviewPayload = {
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
};

const reviewSchema: z.ZodType<CreateReviewPayload> = z.object({
  product_id: z.string().trim().min(1, "Product ID is required"),
  customer_name: z.string().trim().min(2, "Customer name must be at least 2 characters"),
  rating: z.number().int().min(1).max(5),
  comment: z
    .preprocess((value) => {
      if (value == null) return null;
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length === 0 ? null : trimmed;
    }, z.string().min(3).nullable())
    .nullable(),
});

export async function POST(request: Request) {
  try {
    const payload = reviewSchema.parse(await request.json());
    const review = await createProductReview({
      product_id: payload.product_id,
      customer_name: payload.customer_name,
      rating: payload.rating,
      comment: payload.comment ?? "",
    });

    return NextResponse.json({ review, message: "Review submitted and pending approval." }, { status: 201 });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to submit review");
    return NextResponse.json({ error: errorResponse.error, issue: errorResponse.issue }, { status: errorResponse.status });
  }
}
