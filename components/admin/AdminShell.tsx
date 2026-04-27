import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/uploads", label: "Uploads" },
];

export default function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section-padding">
      <div className="container-narrow grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-card p-4 h-fit">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <nav className="mt-4 space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">
                {link.label}
              </Link>
            ))}
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
