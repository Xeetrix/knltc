"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Category, Product } from "@/lib/cms";

type ProductInput = {
  id?: string;
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  full_description: string;
  price: string;
  sale_price: string;
  stock: string;
  featured_image: string;
  gallery: string;
  status: "draft" | "published";
  is_featured: boolean;
  sku: string;
};

const initialForm: ProductInput = {
  name: "",
  slug: "",
  category_id: "",
  short_description: "",
  full_description: "",
  price: "",
  sale_price: "",
  stock: "",
  featured_image: "",
  gallery: "",
  status: "draft",
  is_featured: false,
  sku: "",
};

export default function ProductManager({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductInput>(initialForm);

  const mode = useMemo(() => (form.id ? "Update" : "Create"), [form.id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock: Number(form.stock),
      gallery: form.gallery ? form.gallery.split(",").map((v) => v.trim()) : [],
    };

    const res = await fetch("/api/admin/products", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return;

    if (form.id) {
      setProducts((prev) => prev.map((item) => (item.id === data.product.id ? data.product : item)));
    } else {
      setProducts((prev) => [data.product, ...prev]);
    }
    setForm(initialForm);
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <select className="rounded-md border px-3 py-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input className="rounded-md border px-3 py-2" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Sale price" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <select className="rounded-md border px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Short description" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
        <textarea className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Full description" value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} />
        <input className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Featured image URL" value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} />
        <input className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Gallery URLs (comma separated)" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
        <div className="flex gap-2">
          <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">{mode} product</button>
          {form.id ? <button type="button" onClick={() => setForm(initialForm)} className="rounded-md border px-3 py-2">Cancel</button> : null}
        </div>
      </form>

      <div className="space-y-2">
        {products.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.slug} • {item.status}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setForm({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    category_id: item.category_id ?? "",
                    short_description: item.short_description,
                    full_description: item.full_description,
                    price: String(item.price),
                    sale_price: item.sale_price ? String(item.sale_price) : "",
                    stock: String(item.stock),
                    featured_image: item.featured_image ?? "",
                    gallery: item.gallery?.join(",") ?? "",
                    status: item.status,
                    is_featured: item.is_featured,
                    sku: item.sku ?? "",
                  })
                }
                className="rounded-md border px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button onClick={() => remove(item.id)} className="rounded-md border px-3 py-1 text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
