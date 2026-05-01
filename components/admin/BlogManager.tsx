"use client";

import { useMemo, useState, type FormEvent } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { notify } from "@/lib/notify";
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
const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200";

const initialForm: BlogInput = { title: "", slug: "", excerpt: "", content: "", cover_image: "", category_id: "", tags: "", author: "KNLTC", publish_date: "", status: "draft" };

export default function BlogManager({ initialPosts, categories }: { initialPosts: BlogPost[]; categories: Category[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState<BlogInput>(initialForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mode = useMemo(() => (form.id ? "Update" : "Create"), [form.id]);

  const submit = async (e: FormEvent) => { e.preventDefault(); setError(null); const payload = { ...form, tags: form.tags ? form.tags.split(",").map((v) => v.trim()) : [], publish_date: form.publish_date || null };
    const res = await fetch("/api/admin/blog", { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { const msg = data.error || "Failed to save blog post"; setError(msg); notify("error", "Blog save failed", msg); return; }
    setPosts((prev) => (form.id ? prev.map((item) => (item.id === data.post.id ? data.post : item)) : [data.post, ...prev]));
    setForm(initialForm); notify("success", form.id ? "Blog updated" : "Blog created");
  };

  const remove = async (id: string) => { setDeleting(true); const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    if (!res.ok) { const data = await res.json().catch(() => ({})); const msg = data.error || "Failed to delete blog post"; setError(msg); setDeleting(false); notify("error", "Blog delete failed", msg); return; }
    setPosts((prev) => prev.filter((item) => item.id !== id)); setDeleting(false); setDeleteTarget(null); notify("success", "Blog post deleted");
  };

  return <div className="space-y-6">
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Post details</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><label className="mb-1 block text-xs font-medium text-slate-600">Title</label><input className={inputClass} placeholder="Enter post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-medium text-slate-600">Slug</label><input className={inputClass} placeholder="my-awesome-post" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-medium text-slate-600">Category</label><select className={inputClass} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">Select category</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
          <div><label className="mb-1 block text-xs font-medium text-slate-600">Author</label><input className={inputClass} placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-medium text-slate-600">Tags</label><input className={inputClass} placeholder="visa, japan, language" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-medium text-slate-600">Publish date</label><input type="date" className={inputClass} value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-medium text-slate-600">Status</label><select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}><option value="draft">Draft</option><option value="published">Published</option></select></div>
          <div className="md:col-span-2"><label className="mb-1 block text-xs font-medium text-slate-600">Cover image URL</label><input className={inputClass} placeholder="https://..." value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="mb-1 block text-xs font-medium text-slate-600">Excerpt</label><input className={inputClass} placeholder="Short summary for listing pages" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Content</h3>
        <p className="text-xs text-slate-500">Use the toolbar to format text and insert images directly in the article body.</p>
        <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
      </section>
      <div className="flex gap-2"><button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{mode} post</button>{form.id ? <button type="button" onClick={() => setForm(initialForm)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Cancel</button> : null}</div>
    </form>

    <div className="space-y-2">{posts.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3"><div><p className="font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.slug} • {item.status}</p></div><div className="flex gap-2"><button onClick={() => setForm({ id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, cover_image: item.cover_image ?? "", category_id: item.category_id ?? "", tags: item.tags?.join(",") ?? "", author: item.author, publish_date: item.publish_date?.slice(0, 10) ?? "", status: item.status })} className="rounded-md border px-3 py-1 text-sm">Edit</button><button onClick={() => setDeleteTarget(item.id)} className="rounded-md border px-3 py-1 text-sm text-red-600">Delete</button></div></div>)}</div>
    <ConfirmDialog open={Boolean(deleteTarget)} title="Delete item" message="This action cannot be undone." confirmLabel="Delete" onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && remove(deleteTarget)} loading={deleting} danger />
  </div>;
}
