export const dynamic = "force-dynamic";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSummary } from "@/lib/cms";

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();

  return (
    <AdminShell title="Dashboard">
      {summary.setupWarning ? (
        <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-50 p-4 text-sm text-amber-900">
          {summary.setupWarning}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total products</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalProducts}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total blog posts</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalBlogPosts}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total drafts</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalDrafts}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total published</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalPublished}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/orders" className="rounded-lg border bg-card p-4 hover:border-emerald-300">
          <p className="text-sm text-muted-foreground">New Orders</p><p className="mt-2 text-2xl font-bold text-emerald-600">{summary.pendingOrders}</p>
        </Link>
        <Link href="/admin/reviews" className="rounded-lg border bg-card p-4 hover:border-emerald-300">
          <p className="text-sm text-muted-foreground">Pending Reviews</p><p className="mt-2 text-2xl font-bold text-emerald-600">{summary.pendingReviews}</p>
        </Link>
        <Link href="/admin/crm" className="rounded-lg border bg-card p-4 hover:border-emerald-300">
          <p className="text-sm text-muted-foreground">New CRM Leads</p><p className="mt-2 text-2xl font-bold text-emerald-600">{summary.newLeads}</p>
        </Link>
        <Link href="/admin/products" className="rounded-lg border bg-card p-4 hover:border-emerald-300">
          <p className="text-sm text-muted-foreground">Low Stock Products</p><p className="mt-2 text-2xl font-bold text-rose-600">{summary.lowStockProducts}</p>
        </Link>
      </div>
    </AdminShell>
  );
}
