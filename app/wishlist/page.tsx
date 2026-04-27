"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readWishlist, writeWishlist, type WishlistItem } from "@/lib/shop";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readWishlist());
    sync();
    window.addEventListener("knltc-wishlist-updated", sync);
    return () => window.removeEventListener("knltc-wishlist-updated", sync);
  }, []);

  const remove = (productId: string) => {
    const next = items.filter((item) => item.productId !== productId);
    writeWishlist(next);
    setItems(next);
  };

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {items.length === 0 ? <p className="text-muted-foreground">No wishlist items yet.</p> : null}
          {items.map((item) => (
            <div key={item.productId} className="rounded-xl border bg-card p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">৳{item.price}</p>
              <div className="mt-3 flex gap-2">
                <Link className="rounded-md border px-3 py-1 text-sm" href={`/store/${item.slug}`}>View</Link>
                <button className="rounded-md border px-3 py-1 text-sm text-red-600" onClick={() => remove(item.productId)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
