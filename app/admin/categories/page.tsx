export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import CategoryManager from "@/components/admin/CategoryManager";
import { getCategories } from "@/lib/cms";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminShell title="Manage Categories">
      <CategoryManager initialCategories={categories} />
    </AdminShell>
  );
}
