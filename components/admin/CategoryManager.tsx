"use client";

import { useState, type FormEvent } from "react";
import type { Category } from "@/lib/cms";

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"product" | "blog">("product");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, type }),
    });
    const data = await res.json();
    if (!res.ok) return;
    setCategories((prev) => [...prev, data.category]);
    setName("");
    setSlug("");
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-4">
        <input className="rounded-md border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-md border px-3 py-2" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <select className="rounded-md border px-3 py-2" value={type} onChange={(e) => setType(e.target.value as "product" | "blog")}>
          <option value="product">Product</option>
          <option value="blog">Blog</option>
        </select>
        <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Add category</button>
      </form>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
            <p>{cat.name} <span className="text-xs text-muted-foreground">({cat.type})</span></p>
            <button onClick={() => remove(cat.id)} className="rounded-md border px-3 py-1 text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
