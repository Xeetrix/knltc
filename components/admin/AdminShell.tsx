import Link from "next/link";
import { type AdminNotificationCounts, getAdminNotificationCounts } from "@/lib/cms";

const links: Array<{ href: string; label: string; badgeKey?: keyof AdminNotificationCounts }> = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products", badgeKey: "lowStockProducts" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders", badgeKey: "pendingOrders" },
  { href: "/admin/reviews", label: "Reviews", badgeKey: "pendingReviews" },
  { href: "/admin/crm", label: "CRM", badgeKey: "newLeads" },
  { href: "/admin/uploads", label: "Uploads" },
];

export default async function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  const counts = await getAdminNotificationCounts().catch(() => ({
    pendingOrders: 0,
    pendingReviews: 0,
    newLeads: 0,
    lowStockProducts: 0,
  }));

  return (
    <section className="section-padding">
      <div className="container-narrow grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-card p-4 h-fit">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <nav className="mt-4 space-y-2">
            {links.map((link) => {
              const count = link.badgeKey ? counts[link.badgeKey] : 0;
              return (
                <Link key={link.href} href={link.href} className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
                  <span className="truncate">{link.label}</span>
                  {count > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                      {count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
            <form action="/api/admin/logout" method="post" className="pt-2">
              <button className="w-full rounded-md bg-muted px-3 py-2 text-sm text-left">Logout</button>
            </form>
          </nav>
        </aside>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </section>
  );
}
