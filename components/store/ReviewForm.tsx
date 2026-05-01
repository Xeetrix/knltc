"use client";

import { Star } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { notify } from "@/lib/notify";

export default function ReviewForm({ productId }: { productId: string }) {
  const { language } = useLanguage();
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = {
    name: translate({ en: "Name", bn: "নাম", ja: "名前" }, language),
    comment: translate({ en: "Comment", bn: "মন্তব্য", ja: "コメント" }, language),
    submit: translate({ en: "Submit Review", bn: "রিভিউ সাবমিট করুন", ja: "レビューを送信" }, language),
    photo: translate({ en: "Optional Photo", bn: "ঐচ্ছিক ছবি", ja: "任意の写真" }, language),
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const body = new FormData();
    body.append("product_id", productId);
    body.append("customer_name", customerName);
    body.append("rating", String(rating));
    body.append("comment", comment);
    if (image) body.append("image", image);

    const res = await fetch("/api/reviews", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) {
      const err = data.error || "Failed";
      setError(err);
      notify("error", "Review submit failed", err);
      return;
    }
    setMessage(data.message || "Submitted");
    notify("success", "Review submitted", "Your review is pending admin approval.");
    setCustomerName(""); setRating(5); setComment(""); setImage(null);
  };

  return <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border bg-muted/30 p-4">
    {message ? <p className="text-sm text-green-700">{message}</p> : null}
    {error ? <p className="text-sm text-red-600">{error}</p> : null}
    <input required className="rounded-md border bg-background px-3 py-2" placeholder={t.name} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
    <div className="flex items-center gap-1">{[1,2,3,4,5].map((s)=><button key={s} type="button" onMouseEnter={()=>setHovered(s)} onMouseLeave={()=>setHovered(0)} onClick={()=>setRating(s)} className="p-1">
      <Star className={`h-6 w-6 ${(hovered||rating)>=s?"fill-amber-400 text-amber-500":"text-stone-300"}`} />
    </button>)}</div>
    <textarea required className="rounded-md border bg-background px-3 py-2" placeholder={t.comment} value={comment} onChange={(e) => setComment(e.target.value)} />
    <label className="text-sm">{t.photo}</label>
    <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0] ?? null)} />
    <button className="w-fit rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">{t.submit}</button>
  </form>;
}
