"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { readWishlist, toggleWishlist } from "@/lib/shop";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    featured_image: string | null;
  };
};

export default function WishlistButton({ product }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readWishlist().some((item) => item.productId === product.id));
  }, [product.id]);

  return (
    <button
      type="button"
      className={`rounded-md border px-2.5 py-2 text-sm ${active ? "border-red-300 text-red-600" : ""}`}
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
    </button>
  );
}
