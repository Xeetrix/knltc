"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/cms";

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "delivered", "cancelled"];

export default function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed to update order status");
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...data.order } : order)));
  };

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{order.customer_name} • {order.customer_phone}</p>
              <p className="text-xs text-muted-foreground">{order.id} • ৳{order.total_amount}</p>
            </div>
            <select className="rounded-md border px-2 py-1" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div className="mt-3 space-y-1 text-sm">
            <p><span className="font-medium">Address:</span> {order.customer_address}</p>
            {order.customer_note ? <p><span className="font-medium">Note:</span> {order.customer_note}</p> : null}
            <div className="pt-1">
              {order.order_items?.map((item) => (
                <p key={item.id} className="text-muted-foreground">{item.product_name} • {item.quantity} x ৳{item.price} = ৳{item.subtotal}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
