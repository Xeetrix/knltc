"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
    <section className="section-padding bg-slate-950 text-slate-100">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="mt-1 text-sm text-slate-400">Refine quantities and proceed with secure checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-500" />
            <h2 className="mt-3 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-slate-400">Looks like you have not added any products yet.</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="rounded-xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">৳{item.price} each</p>
                      <p className="text-sm font-medium text-slate-200">Subtotal: ৳{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-md border border-white/20 p-2 hover:bg-white/10" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                      <button className="rounded-md border border-white/20 p-2 hover:bg-white/10" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="rounded-md border border-rose-400/30 p-2 text-rose-300 hover:bg-rose-500/10" onClick={() => removeFromCart(item.productId)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <p className="mt-3 text-sm text-slate-400">Items: {items.length}</p>
              <p className="mt-1 text-3xl font-bold">৳{total}</p>
              <div className="mt-4 space-y-2">
                <Link href="/checkout" className="block rounded-md bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-400">
                  Checkout
                </Link>
                <Link href="/store" className="block rounded-md border border-white/20 px-4 py-2 text-center text-sm font-medium hover:bg-white/10">
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}

        {items.length > 0 ? (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 p-3 backdrop-blur md:hidden">
            <div className="container-narrow flex items-center justify-between gap-3">
              <p className="text-sm">Total: <span className="font-semibold">৳{total}</span></p>
              <Link href="/checkout" className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">Checkout</Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
