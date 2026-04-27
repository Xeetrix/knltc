"use client";

import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
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
    <section className="section-padding bg-slate-950 text-slate-100">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="mt-1 text-sm text-slate-400">Save your favorite products and move them into cart with one click.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
            <h2 className="text-xl font-semibold">No wishlist items yet</h2>
            <p className="mt-2 text-sm text-slate-400">Browse the store and tap the heart icon to save products.</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Go to Store
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.productId} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-lg shadow-black/20">
                <Link href={`/store/${item.slug}`} className="block aspect-[4/3] overflow-hidden bg-slate-800">
                  {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover transition hover:scale-105" /> : null}
                </Link>
                <div className="p-4">
                  <p className="line-clamp-2 text-lg font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-400">৳{item.price}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                      onClick={() => moveToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Move to cart
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-rose-400/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
                      onClick={() => remove(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
