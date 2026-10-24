"use client";

import { useState, type ChangeEvent } from "react";
import { Upload, Check, Copy, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadMediaImage, uploadDocumentFile } from "@/lib/media-upload";

interface UploadedItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "document";
  size?: number;
  uploadedAt: string;
}

export default function UploadManager() {
  const [items, setItems] = useState<UploadedItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"image" | "document">("image");

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);

    try {
      let finalUrl = "";
      if (uploadMode === "image" || file.type.startsWith("image/")) {
        const res = await uploadMediaImage(file, { bucket: "knltc-media", maxDimension: 1200 });
        finalUrl = res.url;
      } else {
        const res = await uploadDocumentFile(file, { bucket: "knltc-documents" });
        finalUrl = res.url;
      }

      const newItem: UploadedItem = {
        id: `upload-${Date.now()}`,
        url: finalUrl,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
        size: file.size,
        uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setItems((prev) => [newItem, ...prev]);
    } catch (err: any) {
      console.error("[UploadManager] Upload failed:", err);
      setError(err?.message || "File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Cloud Media & Document Asset Vault (Supabase Storage)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload logos, student credentials, brochures, and blog cover photos. Assets are auto-compressed and stored in cloud buckets.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setUploadMode("image")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                uploadMode === "image"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5 text-[#b91c1c]" />
              <span>Images & Logos</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("document")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                uploadMode === "document"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>PDFs & Documents</span>
            </button>
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div className="mt-5">
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center cursor-pointer hover:border-[#b91c1c]/50 hover:bg-red-50/30 transition">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#b91c1c]" />
                <p className="text-xs font-semibold text-slate-700">
                  Optimizing & uploading to Supabase Storage...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-2xs border border-slate-200 text-[#b91c1c]">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select or drag and drop {uploadMode === "image" ? "image (PNG, JPG, WebP)" : "document (PDF, DOCX)"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {uploadMode === "image"
                    ? "Max 5MB. Automatic canvas compression applied."
                    : "Max 15MB. Stored in knltc-documents bucket."}
                </p>
              </div>
            )}
            <input
              type="file"
              disabled={isUploading}
              accept={uploadMode === "image" ? "image/jpeg,image/png,image/webp" : "application/pdf,.doc,.docx,image/*"}
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Uploaded Items List */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Recently Uploaded Assets ({items.length})
          </h4>
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                      {item.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.url)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
