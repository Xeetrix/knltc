"use client";

import { useState } from "react";
import type { ProductReview, ReviewStatus } from "@/lib/cms";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ReviewManager({ initialReviews }: { initialReviews: ProductReview[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: ReviewStatus) => {
    setError(null);
    setUpdatingId(id);

    const res = await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Failed to update review");
      setUpdatingId(null);
      return;
    }

    setReviews((prev) => prev.filter((review) => review.id !== id));
    setUpdatingId(null);
  };

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {reviews.length === 0 ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">No pending reviews right now.</div>
      ) : null}

      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{review.customer_name} • {"★".repeat(review.rating)}</p>
              <p className="text-xs text-muted-foreground">Submitted {formatDate(review.created_at)}</p>
            </div>
            <p className="text-xs uppercase tracking-wide text-amber-600">Pending</p>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{review.comment || "No comment provided."}</p>
          {review.image_url ? <img src={review.image_url} alt="Review upload" className="mt-3 h-28 w-28 rounded-md object-cover" /> : null}

          <div className="mt-4 flex items-center gap-2">
            <button
              className="rounded-md border border-green-600 px-3 py-1 text-sm text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => updateStatus(review.id, "approved")}
              disabled={updatingId === review.id}
            >
              Approve
            </button>
            <button
              className="rounded-md border border-red-600 px-3 py-1 text-sm text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => updateStatus(review.id, "rejected")}
              disabled={updatingId === review.id}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
