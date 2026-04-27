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
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <div className="mt-6 space-y-3">
          {items.length === 0 ? <p className="text-muted-foreground">Your cart is empty.</p> : null}
          {items.map((item) => (
            <div key={item.productId} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">৳{item.price} x {item.quantity} = ৳{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    className="w-20 rounded-md border px-2 py-1"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item.productId, Number(e.target.value))}
                  />
                  <button className="rounded-md border px-2 py-1 text-sm text-red-600" onClick={() => removeFromCart(item.productId)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border bg-card p-4">
          <p className="text-lg font-semibold">Total: ৳{total}</p>
          <Link href="/checkout" className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Proceed to Checkout</Link>
        </div>
      </div>
    </section>
  );
}
