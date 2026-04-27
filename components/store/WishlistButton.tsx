"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { readWishlist, toggleWishlist } from "@/lib/shop";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    featured_image: string | null;
  };
  className?: string;
};

export default function WishlistButton({ product, className }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readWishlist().some((item) => item.productId === product.id));
  }, [product.id]);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-md border px-2.5 py-2 text-sm hover:bg-muted",
        active ? "border-red-300 text-red-600" : "",
        className,
      )}
      onClick={() => {
        const next = toggleWishlist({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.sale_price ?? product.price,
          image: product.featured_image,
        });
        setActive(next);
      }}
      aria-label="Add to wishlist"
    >
      <Heart className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
      <span>{active ? "Wishlisted" : "Wishlist"}</span>
    </button>
  );
}
