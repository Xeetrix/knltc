"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readCart, removeFromCart, updateCartQuantity, type CartItem } from "@/lib/shop";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("knltc-cart-updated", sync);
    return () => window.removeEventListener("knltc-cart-updated", sync);
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review products, update quantities, and proceed to checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">Looks like you have not added any products yet.</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="rounded-xl border bg-card p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">৳{item.price} each</p>
                      <p className="text-sm font-medium">Subtotal: ৳{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        className="w-20 rounded-md border px-2 py-1"
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.productId, Number(e.target.value))}
                      />
                      <button className="rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.productId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-xl border bg-card p-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <p className="mt-3 text-sm text-muted-foreground">Items: {items.length}</p>
              <p className="mt-1 text-2xl font-bold">৳{total}</p>
              <div className="mt-4 space-y-2">
                <Link href="/checkout" className="block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
                  Checkout
                </Link>
                <Link href="/store" className="block rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-muted">
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
