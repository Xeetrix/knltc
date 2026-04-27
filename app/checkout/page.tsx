"use client";

import { useMemo, useState } from "react";
import { clearCart, readCart } from "@/lib/shop";

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cart = useMemo(() => readCart(), []);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        customer_address: address,
        customer_note: note || null,
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
      <div className="container-narrow max-w-2xl">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Payment method: Cash on delivery / manual contact</p>
        <p className="mt-1 text-sm font-medium">Order total: ৳{total}</p>
        <form className="mt-6 grid gap-3 rounded-xl border bg-card p-5" onSubmit={submit}>
          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <input required className="rounded-md border px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input required className="rounded-md border px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea required className="rounded-md border px-3 py-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <textarea className="rounded-md border px-3 py-2" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button disabled={loading || cart.length === 0} className="rounded-md bg-primary px-3 py-2 text-primary-foreground disabled:opacity-60">
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
}
