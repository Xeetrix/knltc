"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { addToCart } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    sale_price: number | null;
    featured_image: string | null;
  };
  disabled?: boolean;
  quantity?: number;
  className?: string;
};

export default function AddToCartButton({ product, disabled = false, quantity = 1, className }: Props) {
  const { language } = useLanguage();
  const [added, setAdded] = useState(false);
  const labels = {
    out: translate({ en: "Out of Stock", bn: "স্টক নেই", ja: "在庫なし" }, language),
    added: translate({ en: "Added", bn: "যোগ হয়েছে", ja: "追加済み" }, language),
    add: translate({ en: "Add to Cart", bn: "কার্টে যোগ করুন", ja: "カートに追加" }, language),
    unavailable: translate({ en: "This product is currently unavailable.", bn: "এই পণ্যটি এখন উপলভ্য নয়।", ja: "この商品は現在ご利用いただけません。" }, language),
    addedToCart: translate({ en: "added to cart.", bn: "কার্টে যোগ হয়েছে।", ja: "カートに追加されました。" }, language),
  };

  return (
    <button
      className={cn(
        "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      onClick={() => {
        if (disabled) { notify("warning", labels.out, labels.unavailable); return; }
        addToCart({
          productId: product.id,
          name: product.name,
          price: product.sale_price ?? product.price,
          quantity,
          image: product.featured_image,
        });
        setAdded(true);
        notify("success", labels.added, `${product.name} ${labels.addedToCart}`);
        setTimeout(() => setAdded(false), 1200);
      }}
      type="button"
      disabled={disabled}
    >
      {disabled ? labels.out : added ? labels.added : labels.add}
    </button>
  );
}
