"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
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

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProductManager({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mode = useMemo(() => (form.id ? "Update" : "Create"), [form.id]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearImageState = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateImage = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Unsupported image format. Please use JPG, JPEG, PNG, or WEBP.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Image is too large. Maximum allowed file size is 5MB.";
    }

    return null;
  };

  const handleImageSelection = (file: File | null) => {
    if (!file) return;
    const imageError = validateImage(file);
    if (imageError) {
      setError(imageError);
      return;
    }

    setError(null);
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadProductImage = async () => {
    if (!selectedImage) return form.featured_image || null;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("bucket", "product-images");

      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload product image");
      }

      return uploadData.url as string;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const imageUrl = await uploadProductImage();
      const payload = {
        ...form,
        featured_image: imageUrl,
        image_url: imageUrl,
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
      if (!res.ok) {
        console.error("[Admin][products][submit]", data);
        setError(data.error || "Failed to save product");
        return;
      }

      if (form.id) {
        setProducts((prev) => prev.map((item) => (item.id === data.product.id ? data.product : item)));
      } else {
        setProducts((prev) => [data.product, ...prev]);
      }
      setForm(initialForm);
      clearImageState();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to save product";
      setError(message);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[Admin][products][delete]", data);
      setError(data.error || "Failed to delete product");
      return;
    }
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    handleImageSelection(file);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2">
        {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
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

        <div
          className={`space-y-3 rounded-md border border-dashed p-4 md:col-span-2 ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"
          }`}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={onDrop}
        >
          <p className="text-sm font-medium">Product image</p>
          <p className="text-xs text-muted-foreground">Choose image or drag and drop (JPG, JPEG, PNG, WEBP. Max 5MB)</p>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={(event) => handleImageSelection(event.target.files?.[0] ?? null)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border px-3 py-2 text-sm">
              Choose image
            </button>
            {selectedImage || previewUrl ? (
              <button type="button" onClick={clearImageState} className="rounded-md border px-3 py-2 text-sm text-red-600">
                Remove image
              </button>
            ) : null}
          </div>

          {previewUrl || form.featured_image ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Preview</p>
              <img src={previewUrl ?? form.featured_image} alt="Selected product preview" className="h-40 rounded-md border object-cover" />
            </div>
          ) : null}

          {selectedImage ? <p className="text-xs text-muted-foreground">Selected: {selectedImage.name}</p> : null}
          {isUploadingImage ? <p className="text-sm text-muted-foreground">Uploading image...</p> : null}
        </div>

        <input className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Gallery URLs (comma separated)" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
        <div className="flex gap-2">
          <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground" disabled={isUploadingImage}>{isUploadingImage ? "Uploading..." : `${mode} product`}</button>
          {form.id ? <button type="button" onClick={() => { setForm(initialForm); clearImageState(); }} className="rounded-md border px-3 py-2">Cancel</button> : null}
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
                onClick={() => {
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
                  });
                  clearImageState();
                }}
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
