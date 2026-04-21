import AdminShell from "@/components/admin/AdminShell";
import { getAdminSummary } from "@/lib/cms";

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();

  return (
    <AdminShell title="Dashboard">
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
    </AdminShell>
  );
}
