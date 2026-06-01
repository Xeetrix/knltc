"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { readCart, removeFromCart, updateCartQuantity, type CartItem } from "@/lib/shop";

export default function CartPage() {
  const { language } = useLanguage();
  const t = translate({
    en: { title: "Your Cart", subtitle: "Refine quantities and proceed with secure checkout.", emptyTitle: "Your cart is empty", emptyText: "Looks like you have not added any products yet.", continue: "Continue shopping", each: "each", subtotal: "Subtotal", summary: "Order Summary", items: "Items", checkout: "Checkout", total: "Total" },
    bn: { title: "আপনার কার্ট", subtitle: "পরিমাণ ঠিক করে নিরাপদ চেকআউটে এগিয়ে যান।", emptyTitle: "আপনার কার্ট খালি", emptyText: "আপনি এখনো কোনো পণ্য যোগ করেননি।", continue: "শপিং চালিয়ে যান", each: "প্রতি পিস", subtotal: "সাবটোটাল", summary: "অর্ডার সারাংশ", items: "আইটেম", checkout: "চেকআউট", total: "মোট" },
    ja: { title: "カート", subtitle: "数量を確認して安全にチェックアウトへ進みましょう。", emptyTitle: "カートは空です", emptyText: "まだ商品が追加されていません。", continue: "買い物を続ける", each: "各", subtotal: "小計", summary: "注文概要", items: "商品数", checkout: "チェックアウト", total: "合計" },
  }, language);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("knltc-cart-updated", sync);
    return () => window.removeEventListener("knltc-cart-updated", sync);
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <section className="section-padding bg-stone-50 text-slate-900">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{t.subtitle}</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm shadow-stone-200/70">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-3 text-xl font-semibold">{t.emptyTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.emptyText}</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              {t.continue}
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">৳{item.price} {t.each}</p>
                      <p className="text-sm font-medium text-slate-700">{t.subtotal}: ৳{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-md border border-stone-300 bg-white p-2 text-slate-700 hover:bg-stone-100" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                      <button className="rounded-md border border-stone-300 bg-white p-2 text-slate-700 hover:bg-stone-100" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="rounded-md border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100" onClick={() => removeFromCart(item.productId)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/70 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">{t.summary}</h2>
              <p className="mt-3 text-sm text-slate-600">{t.items}: {items.length}</p>
              <p className="mt-1 text-3xl font-bold">৳{total}</p>
              <div className="mt-4 space-y-2">
                <Link href="/checkout" className="block rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-500">
                  {t.checkout}
                </Link>
                <Link href="/store" className="block rounded-md border border-emerald-200 bg-white px-4 py-2 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-50">
                  {t.continue}
                </Link>
              </div>
            </aside>
          </div>
        )}

        {items.length > 0 ? (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 p-3 backdrop-blur md:hidden">
            <div className="container-narrow flex items-center justify-between gap-3">
              <p className="text-sm">{t.total}: <span className="font-semibold">৳{total}</span></p>
              <Link href="/checkout" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{t.checkout}</Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
