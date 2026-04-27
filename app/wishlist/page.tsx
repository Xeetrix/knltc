"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addToCart, readWishlist, writeWishlist, type WishlistItem } from "@/lib/shop";

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

  const moveToCart = (item: WishlistItem) => {
    addToCart({ productId: item.productId, name: item.name, price: item.price, quantity: 1, image: item.image });
    remove(item.productId);
  };

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">Save items you love and move them to your cart anytime.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">No wishlist items yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse the store and tap the heart icon to save products.</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Go to Store
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.productId} className="rounded-xl border bg-card p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">৳{item.price}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted" href={`/store/${item.slug}`}>
                    View details
                  </Link>
                  <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground" onClick={() => moveToCart(item)}>
                    Move to cart
                  </button>
                  <button className="rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50" onClick={() => remove(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
