"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { BlogPost, Category } from "@/lib/cms";

type BlogInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: string;
  tags: string;
  author: string;
  publish_date: string;
  status: "draft" | "published";
};

const initialForm: BlogInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category_id: "",
  tags: "",
  author: "KNLTC",
  publish_date: "",
  status: "draft",
};

export default function BlogManager({ initialPosts, categories }: { initialPosts: BlogPost[]; categories: Category[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState<BlogInput>(initialForm);
  const mode = useMemo(() => (form.id ? "Update" : "Create"), [form.id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((v) => v.trim()) : [],
      publish_date: form.publish_date || null,
    };
    const res = await fetch("/api/admin/blog", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return;

    if (form.id) {
      setPosts((prev) => prev.map((item) => (item.id === data.post.id ? data.post : item)));
    } else {
      setPosts((prev) => [data.post, ...prev]);
    }
    setForm(initialForm);
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setPosts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <select className="rounded-md border px-3 py-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input className="rounded-md border px-3 py-2" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <input type="date" className="rounded-md border px-3 py-2" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} />
        <select className="rounded-md border px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Cover image URL" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} />
        <input className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={7} />
        <div className="flex gap-2">
          <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">{mode} post</button>
          {form.id ? <button type="button" onClick={() => setForm(initialForm)} className="rounded-md border px-3 py-2">Cancel</button> : null}
        </div>
      </form>
      <div className="space-y-2">
        {posts.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.slug} • {item.status}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setForm({
                    id: item.id,
                    title: item.title,
                    slug: item.slug,
                    excerpt: item.excerpt,
                    content: item.content,
                    cover_image: item.cover_image ?? "",
                    category_id: item.category_id ?? "",
                    tags: item.tags?.join(",") ?? "",
                    author: item.author,
                    publish_date: item.publish_date?.slice(0, 10) ?? "",
                    status: item.status,
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
