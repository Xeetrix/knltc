"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { readWishlist, toggleWishlist } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";

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
  const { language } = useLanguage();
  const t = translate({
    en: { add: "Add to wishlist", added: "Added to wishlist", removed: "Removed from wishlist", wishlisted: "Wishlisted", wishlist: "Wishlist" },
    bn: { add: "উইশলিস্টে যোগ করুন", added: "উইশলিস্টে যোগ হয়েছে", removed: "উইশলিস্ট থেকে সরানো হয়েছে", wishlisted: "উইশলিস্টেড", wishlist: "উইশলিস্ট" },
    ja: { add: "お気に入りに追加", added: "お気に入りに追加しました", removed: "お気に入りから削除しました", wishlisted: "追加済み", wishlist: "お気に入り" },
  }, language);
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
        notify("info", next ? t.added : t.removed, product.name);
      }}
      aria-label={t.add}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
      <span>{active ? t.wishlisted : t.wishlist}</span>
    </button>
  );
}
