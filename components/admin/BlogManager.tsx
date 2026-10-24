"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { notify } from "@/lib/notify";
import type { BlogPost, Category } from "@/lib/cms";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { uploadMediaImage } from "@/lib/media-upload";
import { Upload, Loader2 } from "lucide-react";

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
const inputClass = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm shadow-2xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const initialForm: BlogInput = { title: "", slug: "", excerpt: "", content: "", cover_image: "", category_id: "", tags: "", author: "KNLTC", publish_date: "", status: "draft" };

export default function BlogManager({ initialPosts, categories }: { initialPosts: BlogPost[]; categories: Category[] }) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState<BlogInput>(initialForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const mode = useMemo(() => (form.id ? "Update" : "Create"), [form.id]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

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
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <section className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900">
          {translate({ en: "Blog Post & Guideline Details", bn: "ব্লগ পোস্ট ও গাইডলাইন বিস্তারিত", ja: "ブログ投稿・ガイドライン詳細" }, language)}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><label className="mb-1 block text-xs font-bold text-slate-600">{translate({ en: "Title", bn: "Title (শিরোনাম)", ja: "タイトル" }, language)}</label><input className={inputClass} placeholder="Enter post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-600">Slug (URL)</label><input className={inputClass} placeholder="my-awesome-post" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-600">Category</label><select className={inputClass} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">Select category</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-600">Author</label><input className={inputClass} placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-600">Tags</label><input className={inputClass} placeholder="visa, japan, language" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-600">Publish date</label><input type="date" className={inputClass} value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-600">Status</label><select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}><option value="draft">Draft</option><option value="published">Published</option></select></div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-bold text-slate-600">Cover image</label>
            <div className="flex gap-2">
              <input className={inputClass} placeholder="https://..." value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} />
              <label className={`shrink-0 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition ${uploadingCover ? "opacity-50 pointer-events-none" : ""}`}>
                {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#133e29]" /> : <Upload className="h-3.5 w-3.5 text-[#133e29]" />}
                <span>{uploadingCover ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingCover}
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setUploadingCover(true);
                    try {
                      const res = await uploadMediaImage(f, { bucket: "knltc-media", maxDimension: 1200 });
                      setForm((prev) => ({ ...prev, cover_image: res.url }));
                      notify("success", "Cover image uploaded");
                    } catch (err: any) {
                      notify("error", "Cover image upload failed", err?.message);
                    } finally {
                      setUploadingCover(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <div className="md:col-span-2"><label className="mb-1 block text-xs font-bold text-slate-600">{translate({ en: "Excerpt (Short Summary)", bn: "Excerpt (সংক্ষিপ্ত সারাংশ)", ja: "抜粋（短い要約）" }, language)}</label><input className={inputClass} placeholder="Short summary for listing pages" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-sm font-extrabold text-slate-900">
          {translate({ en: "Article Body (Rich Text Content)", bn: "আর্টিকেল বডি (Rich Text Content)", ja: "記事本文 (Rich Text Content)" }, language)}
        </h3>
        <p className="text-xs text-slate-500">
          {translate({ en: "Use the toolbar to format text and add images.", bn: "টুলবার ব্যবহার করে টেক্সট ফরম্যাটিং ও ছবি যুক্ত করুন।", ja: "ツールバーを使用してテキストの書式設定や画像の追加を行います。" }, language)}
        </p>
        <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
      </section>
      <div className="flex gap-2">
        <button className="rounded-xl bg-[#133e29] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs">
          {mode === "Update"
            ? translate({ en: "Update Blog Post", bn: "ব্লগ পোস্ট আপডেট করুন", ja: "ブログ投稿を更新" }, language)
            : translate({ en: "Publish Blog Post", bn: "ব্লগ পোস্ট প্রকাশ করুন", ja: "ブログ投稿を公開" }, language)}
        </button>
        {form.id ? (
          <button type="button" onClick={() => setForm(initialForm)} className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-slate-700">
            {translate({ en: "Cancel", bn: "বাতিল", ja: "キャンセル" }, language)}
          </button>
        ) : null}
      </div>
    </form>

    <div className="grid gap-3 sm:grid-cols-2">
      {posts.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs">
          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-900 truncate">{item.title}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="truncate">{item.slug}</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${item.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {item.status}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => setForm({ id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, cover_image: item.cover_image ?? "", category_id: item.category_id ?? "", tags: item.tags?.join(",") ?? "", author: item.author, publish_date: item.publish_date?.slice(0, 10) ?? "", status: item.status })} className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100">
              {translate({ en: "Edit", bn: "এডিট", ja: "編集" }, language)}
            </button>
            <button onClick={() => setDeleteTarget(item.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100">
              {translate({ en: "Delete", bn: "ডিলিট", ja: "削除" }, language)}
            </button>
          </div>
        </div>
      ))}
    </div>
    <ConfirmDialog open={Boolean(deleteTarget)} title="Delete item" message="This action cannot be undone." confirmLabel="Delete" onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && remove(deleteTarget)} loading={deleting} danger />
  </div>;
}
