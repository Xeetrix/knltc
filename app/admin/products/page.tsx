export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import ProductManager from "@/components/admin/ProductManager";
import { getAllAdminProducts, getCategories } from "@/lib/cms";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllAdminProducts(), getCategories("product")]);

  return (
    <AdminShell title="Manage Products">
      <ProductManager initialProducts={products} categories={categories} />
    </AdminShell>
  );
}
