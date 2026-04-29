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
      setError("Please provide your transaction ID for bKash or Nagad payment.");
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
      setError(data.error || "Failed to place order.");
      return;
    }

    clearCart();
    setMessage(`Order placed successfully. Order ID: ${data.order.id}`);
  };

  return (
    <section className="section-padding bg-stone-50 text-slate-900">
      <div className="container-narrow">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {cart.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm shadow-stone-200/70">
            <h2 className="text-xl font-semibold">No items to checkout</h2>
            <p className="mt-2 text-sm text-slate-600">Please add products to your cart first.</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              Go to Store
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

              <h2 className="text-lg font-semibold">Customer Information</h2>
              <input required className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input required className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea required className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <textarea className="rounded-md border border-stone-300 bg-white px-3 py-2" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />

              <h2 className="mt-2 text-lg font-semibold">Payment Method</h2>
              <h2 className="mt-2 text-lg font-semibold">{translate({ en: "Delivery Area", bn: "ডেলিভারি এলাকা", ja: "配送エリア" }, language)}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm">
                  <input type="radio" name="deliveryArea" checked={deliveryArea === "inside_dhaka"} onChange={() => setDeliveryArea("inside_dhaka")} />
                  {translate({ en: "Inside Dhaka", bn: "ঢাকার মধ্যে", ja: "ダッカ市内" }, language)}
                </label>
                <label className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm">
                  <input type="radio" name="deliveryArea" checked={deliveryArea === "outside_dhaka"} onChange={() => setDeliveryArea("outside_dhaka")} />
                  {translate({ en: "Outside Dhaka", bn: "ঢাকার বাইরে", ja: "ダッカ市外" }, language)}
                </label>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { value: "cod", label: "Cash on Delivery" },
                  { value: "bkash", label: "bKash manual" },
                  { value: "nagad", label: "Nagad manual" },
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
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              ) : null}

              <button disabled={loading || cart.length === 0} className="rounded-md bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </form>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/70 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">Order Summary</h2>
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
                <p className="text-sm text-slate-600">Product subtotal: ৳{total}</p>
                <p className="text-sm text-slate-600">{translate({ en: "Delivery Charge", bn: "ডেলিভারি চার্জ", ja: "配送料" }, language)}: ৳{deliveryCharge}</p>
                <p className="text-sm text-slate-600">{translate({ en: "Grand Total", bn: "সর্বমোট", ja: "合計" }, language)}</p>
                <p className="text-3xl font-bold">৳{grandTotal}</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
