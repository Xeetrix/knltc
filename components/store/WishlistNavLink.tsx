"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { readWishlist } from "@/lib/shop";

export default function WishlistNavLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readWishlist().length);
    sync();
    window.addEventListener("knltc-wishlist-updated", sync);
    return () => window.removeEventListener("knltc-wishlist-updated", sync);
  }, []);

  return (
    <Link
      href="/wishlist"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-700 transition hover:bg-stone-100"
      aria-label="Wishlist"
    >
      <Heart className="h-4 w-4" />
      {count > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">{count}</span> : null}
    </Link>
  );
}
