"use client";

import { useState } from "react";
import { addToCart } from "@/lib/shop";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    sale_price: number | null;
    featured_image: string | null;
  };
};

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);

  return (
    <button
      className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      onClick={() => {
        addToCart({
          productId: product.id,
          name: product.name,
          price: product.sale_price ?? product.price,
          quantity: 1,
          image: product.featured_image,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      type="button"
    >
      {added ? "Added" : "Add to Cart"}
    </button>
  );
}
