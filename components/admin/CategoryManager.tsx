"use client";

import { useState, type FormEvent } from "react";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { notify } from "@/lib/notify";
import type { Category } from "@/lib/cms";

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"product" | "blog">("product");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug, type }) });
    const data = await res.json();
    if (!res.ok) return notify("error", "Category create failed", data.error || "Please try again.");
    setCategories((prev) => [...prev, data.category]);
    setName("");
    setSlug("");
    notify("success", "Category created");
  };

  const remove = async (id: string) => {
    setDeleting(true);
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setDeleting(false);
      return notify("error", "Category delete failed");
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setDeleting(false);
    setDeleteTarget(null);
    notify("success", "Category deleted");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-4">
        <input className="rounded-md border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-md border px-3 py-2" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <select className="rounded-md border px-3 py-2" value={type} onChange={(e) => setType(e.target.value as "product" | "blog")}>
          <option value="product">Product</option><option value="blog">Blog</option>
        </select>
        <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Add category</button>
      </form>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
            <p>{cat.name} <span className="text-xs text-muted-foreground">({cat.type})</span></p>
            <button onClick={() => setDeleteTarget(cat.id)} className="rounded-md border px-3 py-1 text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete category" message="This action cannot be undone." confirmLabel="Delete" onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && remove(deleteTarget)} loading={deleting} danger />
    </div>
  );
}
