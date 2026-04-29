import { NextResponse } from "next/server";
import { z } from "zod";
import { createProductReview } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";
import { uploadToStorage } from "@/lib/supabase";

type CreateReviewPayload = {
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  image_url?: string | null;
};

const reviewSchema = z.object({
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
    const formData = await request.formData();
    const image = formData.get("image");
    let imageUrl: string | null = null;
    if (image instanceof File && image.size > 0) {
      const ext = image.name.split(".").pop() || "jpg";
      const fileName = `review-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      imageUrl = await uploadToStorage(fileName, await image.arrayBuffer(), image.type || "image/jpeg", "review-images");
    }
    const parsed = reviewSchema.parse({
      product_id: formData.get("product_id"),
      customer_name: formData.get("customer_name"),
      rating: Number(formData.get("rating")),
      comment: formData.get("comment"),
    });
    const payload: CreateReviewPayload = {
      product_id: parsed.product_id,
      customer_name: parsed.customer_name,
      rating: parsed.rating,
      comment: parsed.comment ?? null,
      image_url: imageUrl,
    };
    const review = await createProductReview(payload);

    return NextResponse.json({ review, message: "Review submitted and pending approval." }, { status: 201 });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to submit review");
    return NextResponse.json({ error: errorResponse.error, issue: errorResponse.issue }, { status: errorResponse.status });
  }
}
