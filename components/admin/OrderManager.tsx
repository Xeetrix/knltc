"use client";

import { useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/lib/cms";

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "delivered", "cancelled"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);

  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedOrderId) ?? null, [orders, selectedOrderId]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setError(null);

    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to update order status");
      return;
    }

    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...data.order } : order)));
  };

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`cursor-pointer border-t transition-colors hover:bg-muted/40 ${selectedOrderId === order.id ? "bg-muted/60" : ""}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <td className="px-4 py-3 font-medium">{order.customer_name}</td>
                <td className="px-4 py-3">{order.customer_phone}</td>
                <td className="px-4 py-3">{formatCurrency(order.total_amount)}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    className="rounded-md border bg-background px-2 py-1"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>
                  No orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selectedOrder ? (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">Order details</p>
              <p className="text-xs text-muted-foreground">{selectedOrder.id}</p>
            </div>
            <p className="text-sm text-muted-foreground">Updated: {formatDate(selectedOrder.updated_at)}</p>
          </div>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <p>
              <span className="font-medium">Name:</span> {selectedOrder.customer_name}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {selectedOrder.customer_phone}
            </p>
            <p>
              <span className="font-medium">Email:</span> {selectedOrder.customer_email ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Total:</span> {formatCurrency(selectedOrder.total_amount)}
            </p>
            <p className="md:col-span-2">
              <span className="font-medium">Address:</span> {selectedOrder.customer_address}
            </p>
            {selectedOrder.customer_note ? (
              <p className="md:col-span-2">
                <span className="font-medium">Note:</span> {selectedOrder.customer_note}
              </p>
            ) : null}
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="font-medium">Items</p>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              {selectedOrder.order_items?.map((item) => (
                <p key={item.id}>
                  {item.product_name} • {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.subtotal)}
                </p>
              ))}
              {!selectedOrder.order_items?.length ? <p>No items found for this order.</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
