"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { addToCart, readWishlist, writeWishlist, type WishlistItem } from "@/lib/shop";

export default function WishlistPage() {
  const { language } = useLanguage();
  const t = translate({
    en: { title: "Wishlist", subtitle: "Save favorites and move them to cart in one click.", emptyTitle: "No wishlist items yet", emptyText: "Browse the store and tap the heart icon to save products.", store: "Go to Store", move: "Move to cart", remove: "Remove" },
    bn: { title: "উইশলিস্ট", subtitle: "পছন্দের পণ্য সেভ করুন এবং এক ক্লিকে কার্টে নিন।", emptyTitle: "উইশলিস্টে এখনো কোনো আইটেম নেই", emptyText: "স্টোর ব্রাউজ করুন এবং পণ্য সেভ করতে হার্ট আইকনে চাপুন।", store: "স্টোরে যান", move: "কার্টে নিন", remove: "মুছুন" },
    ja: { title: "お気に入り", subtitle: "お気に入りを保存してワンクリックでカートへ移動できます。", emptyTitle: "お気に入りはまだありません", emptyText: "ストアを見て、ハートアイコンで商品を保存してください。", store: "ストアへ", move: "カートへ移動", remove: "削除" },
  }, language);
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
    <section className="section-padding bg-stone-50 text-slate-900">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{t.subtitle}</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm shadow-stone-200/70">
            <Heart className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-3 text-xl font-semibold">{t.emptyTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.emptyText}</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              {t.store}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.productId} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md shadow-stone-200/70">
                <Link href={`/store/${item.slug}`} className="block aspect-[4/3] overflow-hidden bg-stone-100">
                  {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover transition hover:scale-105" /> : null}
                </Link>
                <div className="p-4">
                  <p className="line-clamp-2 text-lg font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-600">৳{item.price}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      className="inline-flex items-center justify-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                      onClick={() => moveToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {t.move}
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-100"
                      onClick={() => remove(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t.remove}
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
