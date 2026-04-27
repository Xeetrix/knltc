"use client";

import { useState, type FormEvent } from "react";

export default function ReviewForm({ productId }: { productId: string }) {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, customer_name: customerName, rating, comment }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to submit review");
      return;
    }

    setMessage(data.message || "Review submitted");
    setCustomerName("");
    setRating(5);
    setComment("");
  };

  return (
    <form onSubmit={submit} className="mt-6 grid gap-2 rounded-xl border bg-muted/30 p-4">
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <input required className="rounded-md border bg-background px-3 py-2" placeholder="Your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      <select className="rounded-md border bg-background px-3 py-2" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((star) => <option key={star} value={star}>{star} star</option>)}
      </select>
      <textarea required className="rounded-md border bg-background px-3 py-2" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="w-fit rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Submit review</button>
    </form>
  );
}
