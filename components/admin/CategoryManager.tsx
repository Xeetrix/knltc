"use client";

import { useEffect, useState, type FormEvent } from "react";
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

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

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
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs md:grid-cols-4">
        <input required className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium" placeholder="ক্যাটেগরির নাম (যেমন: JLPT N5 Books)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium" placeholder="Slug (যেমন: jlpt-n5-books)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <select className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-bold bg-white" value={type} onChange={(e) => setType(e.target.value as "product" | "blog")}>
          <option value="product">Product (বই ও স্টোর পণ্য)</option>
          <option value="blog">Blog (ব্লগ ও গাইডলাইন)</option>
        </select>
        <button className="rounded-xl bg-[#133e29] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition">নতুন ক্যাটেগরি যোগ করুন</button>
      </form>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3.5 shadow-2xs">
            <div>
              <p className="font-bold text-sm text-slate-900">{cat.name}</p>
              <span className={`inline-block mt-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${cat.type === "product" ? "bg-indigo-100 text-indigo-800" : "bg-amber-100 text-amber-800"}`}>
                {cat.type} • {cat.slug}
              </span>
            </div>
            <button onClick={() => setDeleteTarget(cat.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100">ডিলিট</button>
          </div>
        ))}
      </div>
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete category" message="This action cannot be undone." confirmLabel="Delete" onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && remove(deleteTarget)} loading={deleting} danger />
    </div>
  );
}
