"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { clearCart, readCart, type CartItem } from "@/lib/shop";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

type PaymentMethod = "cod" | "bkash" | "nagad";

export default function CheckoutPage() {
  const { language } = useLanguage();
  const t = translate({
    en: { title: "Checkout", emptyTitle: "No items to checkout", emptyText: "Please add products to your cart first.", store: "Go to Store", customer: "Customer Information", name: "Name", phone: "Phone", email: "Email (optional)", address: "Address", note: "Note (optional)", payment: "Payment Method", cod: "Cash on Delivery", bkash: "bKash manual", nagad: "Nagad manual", delivery: "Delivery Area", inside: "Inside Dhaka", outside: "Outside Dhaka", transaction: "Transaction ID", placing: "Placing order...", place: "Place Order", summary: "Order Summary", subtotal: "Product subtotal", charge: "Delivery Charge", grand: "Grand Total", missingTransaction: "Please provide your transaction ID for bKash or Nagad payment.", failed: "Failed to place order.", success: "Order placed successfully. Order ID:" },
    bn: { title: "চেকআউট", emptyTitle: "চেকআউট করার মতো কোনো আইটেম নেই", emptyText: "অনুগ্রহ করে আগে কার্টে পণ্য যোগ করুন।", store: "স্টোরে যান", customer: "গ্রাহকের তথ্য", name: "নাম", phone: "ফোন", email: "ইমেইল (ঐচ্ছিক)", address: "ঠিকানা", note: "নোট (ঐচ্ছিক)", payment: "পেমেন্ট পদ্ধতি", cod: "ক্যাশ অন ডেলিভারি", bkash: "ম্যানুয়াল bKash", nagad: "ম্যানুয়াল Nagad", delivery: "ডেলিভারি এলাকা", inside: "ঢাকার মধ্যে", outside: "ঢাকার বাইরে", transaction: "ট্রানজেকশন আইডি", placing: "অর্ডার করা হচ্ছে...", place: "অর্ডার করুন", summary: "অর্ডার সারাংশ", subtotal: "পণ্যের সাবটোটাল", charge: "ডেলিভারি চার্জ", grand: "সর্বমোট", missingTransaction: "bKash বা Nagad পেমেন্টের জন্য ট্রানজেকশন আইডি দিন।", failed: "অর্ডার করা যায়নি।", success: "অর্ডার সফল হয়েছে। অর্ডার আইডি:" },
    ja: { title: "チェックアウト", emptyTitle: "チェックアウトする商品がありません", emptyText: "まず商品をカートに追加してください。", store: "ストアへ", customer: "お客様情報", name: "名前", phone: "電話番号", email: "メール（任意）", address: "住所", note: "メモ（任意）", payment: "支払い方法", cod: "代金引換", bkash: "手動bKash", nagad: "手動Nagad", delivery: "配送エリア", inside: "ダッカ市内", outside: "ダッカ市外", transaction: "取引ID", placing: "注文を送信中...", place: "注文する", summary: "注文概要", subtotal: "商品小計", charge: "配送料", grand: "合計", missingTransaction: "bKashまたはNagad支払いの取引IDを入力してください。", failed: "注文に失敗しました。", success: "注文が完了しました。注文ID:" },
  }, language);
  const [deliveryArea, setDeliveryArea] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener("knltc-cart-updated", sync);
    return () => window.removeEventListener("knltc-cart-updated", sync);
  }, []);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const totalQuantity = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const deliveryCharge = useMemo(() => {
    if (totalQuantity <= 1) return deliveryArea === "inside_dhaka" ? 60 : 100;
    return deliveryArea === "inside_dhaka" ? 80 : 120;
  }, [deliveryArea, totalQuantity]);
  const grandTotal = total + deliveryCharge;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !transactionId.trim()) {
      setLoading(false);
      setError(t.missingTransaction);
      return;
    }

    const paymentNote =
      paymentMethod === "cod"
        ? "Payment: Cash on Delivery"
        : `Payment: ${paymentMethod === "bkash" ? "Manual bKash" : "Manual Nagad"}, Transaction ID: ${transactionId.trim()}`;

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        customer_address: address,
        customer_note: [note.trim(), paymentNote].filter(Boolean).join("\n"),
        items: cart,
        delivery_area: deliveryArea,
        delivery_charge: deliveryCharge,
        grand_total: grandTotal,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || t.failed);
      return;
    }

    clearCart();
    setMessage(`${t.success} ${data.order.id}`);
  };

  return (
    <section className="section-padding bg-stone-50 text-slate-900">
      <div className="container-narrow">
        <h1 className="text-3xl font-bold">{t.title}</h1>

        {cart.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm shadow-stone-200/70">
            <h2 className="text-xl font-semibold">{t.emptyTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.emptyText}</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              {t.store}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
            <form className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/70" onSubmit={submit}>
              {message ? (
                <p className="inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </p>
              ) : null}
              {error ? (
                <p className="inline-flex items-center gap-2 rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </p>
              ) : null}

              <h2 className="text-lg font-semibold">{t.customer}</h2>
              <input required className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
              <input required className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea required className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder={t.address} value={address} onChange={(e) => setAddress(e.target.value)} />
              <textarea className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder={t.note} value={note} onChange={(e) => setNote(e.target.value)} />

              <h2 className="mt-2 text-lg font-semibold">{t.payment}</h2>
              <h2 className="mt-2 text-lg font-semibold">{t.delivery}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm">
                  <input type="radio" name="deliveryArea" checked={deliveryArea === "inside_dhaka"} onChange={() => setDeliveryArea("inside_dhaka")} />
                  {t.inside}
                </label>
                <label className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm">
                  <input type="radio" name="deliveryArea" checked={deliveryArea === "outside_dhaka"} onChange={() => setDeliveryArea("outside_dhaka")} />
                  {t.outside}
                </label>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { value: "cod", label: t.cod },
                  { value: "bkash", label: t.bkash },
                  { value: "nagad", label: t.nagad },
                ].map((item) => (
                  <label key={item.value} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={item.value}
                      checked={paymentMethod === item.value}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>

              {paymentMethod !== "cod" ? (
                <input
                  required
                  className="rounded-md border border-stone-300 bg-white px-3 py-2"
                  placeholder={t.transaction}
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              ) : null}

              <button disabled={loading || cart.length === 0} className="rounded-md bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                {loading ? t.placing : t.place}
              </button>
            </form>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/70 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">{t.summary}</h2>
              <div className="mt-3 space-y-2 text-sm">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-start justify-between gap-2">
                    <p>
                      {item.name} <span className="text-slate-500">x{item.quantity}</span>
                    </p>
                    <p className="font-medium">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-stone-200 pt-3">
                <p className="text-sm text-slate-600">{t.subtotal}: ৳{total}</p>
                <p className="text-sm text-slate-600">{t.charge}: ৳{deliveryCharge}</p>
                <p className="text-sm text-slate-600">{t.grand}</p>
                <p className="text-3xl font-bold">৳{grandTotal}</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
