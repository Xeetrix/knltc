"use client";

import { useState } from "react";
import type { ProductReview, ReviewStatus } from "@/lib/cms";

const statuses: ReviewStatus[] = ["pending", "approved", "rejected"];

export default function ReviewManager({ initialReviews }: { initialReviews: ProductReview[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: ReviewStatus) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed to update review");
    setReviews((prev) => prev.map((review) => (review.id === id ? data.review : review)));
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "Failed to delete review");
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border bg-card p-4">
          <p className="font-semibold">{review.customer_name} • {"★".repeat(review.rating)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
          <div className="mt-3 flex items-center gap-2">
            <select className="rounded-md border px-2 py-1 text-sm" value={review.status} onChange={(e) => updateStatus(review.id, e.target.value as ReviewStatus)}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button className="rounded-md border px-3 py-1 text-sm text-red-600" onClick={() => remove(review.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
