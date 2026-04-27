"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { readCart } from "@/lib/shop";

type CartNavLinkProps = {
  className?: string;
};

export default function CartNavLink({ className }: CartNavLinkProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    sync();
    window.addEventListener("knltc-cart-updated", sync);
    return () => window.removeEventListener("knltc-cart-updated", sync);
  }, []);

  return (
    <Link
      href="/cart"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50",
        className,
      )}
      aria-label="Cart"
    >
      <ShoppingCart className="h-4 w-4" />
      {count > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">{count}</span> : null}
    </Link>
  );
}
