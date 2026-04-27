"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, readCart, type CartItem } from "@/lib/shop";

type PaymentMethod = "cod" | "bkash" | "nagad";

export default function CheckoutPage() {
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
    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {cart.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">No items to checkout</h2>
            <p className="mt-2 text-sm text-muted-foreground">Please add products to your cart first.</p>
            <Link href="/store" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Go to Store
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
            <form className="grid gap-3 rounded-2xl border bg-card p-5" onSubmit={submit}>
              {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
              {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

              <h2 className="text-lg font-semibold">Customer Information</h2>
              <input required className="rounded-md border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input required className="rounded-md border px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className="rounded-md border px-3 py-2" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea required className="rounded-md border px-3 py-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <textarea className="rounded-md border px-3 py-2" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />

              <h2 className="mt-2 text-lg font-semibold">Payment Method</h2>
              <select className="rounded-md border px-3 py-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
                <option value="cod">Cash on Delivery</option>
                <option value="bkash">Manual bKash</option>
                <option value="nagad">Manual Nagad</option>
              </select>

              {paymentMethod !== "cod" ? (
                <input
                  required
                  className="rounded-md border px-3 py-2"
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              ) : null}

              <button disabled={loading || cart.length === 0} className="rounded-md bg-primary px-3 py-2 text-primary-foreground disabled:opacity-60">
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </form>

            <aside className="h-fit rounded-2xl border bg-card p-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="mt-3 space-y-2 text-sm">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-start justify-between gap-2">
                    <p>
                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </p>
                    <p className="font-medium">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t pt-3">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">৳{total}</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
