"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/shop";

export default function CartNavLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    sync();
    window.addEventListener("knltc-cart-updated", sync);
    return () => window.removeEventListener("knltc-cart-updated", sync);
  }, []);

  return (
    <Link href="/cart" className="relative rounded-md border px-3 py-2 text-sm hover:bg-muted">
      <ShoppingCart className="h-4 w-4" />
      {count > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] text-white">{count}</span> : null}
    </Link>
  );
}
