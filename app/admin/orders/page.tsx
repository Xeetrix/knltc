import AdminShell from "@/components/admin/AdminShell";
import OrderManager from "@/components/admin/OrderManager";
import { getAllAdminOrders } from "@/lib/cms";

export default async function AdminOrdersPage() {
  const orders = await getAllAdminOrders();

  return (
    <AdminShell title="Manage Orders">
      <OrderManager initialOrders={orders} />
    </AdminShell>
  );
}
