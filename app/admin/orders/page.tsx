export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import OrderManager from "@/components/admin/OrderManager";
import { getAllAdminOrders } from "@/lib/cms";

export default async function AdminOrdersPage() {
  const { orders, setupWarning } = await getAllAdminOrders();

  return (
    <AdminShell title="Manage Orders">
      {setupWarning ? (
        <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-50 p-4 text-sm text-amber-900">{setupWarning}</div>
      ) : null}
      <OrderManager initialOrders={orders} />
    </AdminShell>
  );
}
