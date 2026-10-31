"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  Search,
  FolderOpen,
  Eye,
  ShieldCheck,
  Layers,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import {
  uploadMediaImage,
  uploadDocumentFile,
  fetchMediaLibrary,
  deleteMediaVaultItem,
  optimizeMediaStorage,
  type MediaVaultClientItem,
  type StorageStatusSummary,
} from "@/lib/media-upload";
import DocumentPreviewModal from "@/components/admin/DocumentPreviewModal";

interface MediaStorageManagerProps {
  language: "bn" | "en" | "ja";
  onShowToast: (title: string, subtitle?: string) => void;
}

const FOLDER_OPTIONS = [
  {
    value: "KNLTC_Visa_And_Student_Docs",
    labelEn: "Student & Visa Documents",
    labelBn: "স্টুডেন্ট ও ভিসা ডকুমেন্টস",
  },
  {
    value: "KNLTC_Schools_And_B2B",
    labelEn: "Partner Schools & B2B Logos/MOUs",
    labelBn: "পার্টনার স্কুল ও B2B লোগো/চুক্তিপত্র",
  },
  {
    value: "KNLTC_Bookstore_Products",
    labelEn: "Bookstore & Course Materials",
    labelBn: "বুকস্টোর ও বইয়ের কভার",
  },
  {
    value: "KNLTC_Blog_Images",
    labelEn: "Blog & Guideline Media",
    labelBn: "ব্লগ ও গাইডলাইন ছবি",
  },
  {
    value: "KNLTC_Website_CMS",
    labelEn: "Website CMS & Banners",
    labelBn: "ওয়েবসাইট CMS ও ব্যানার",
  },
];

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default function MediaStorageManager({
  language,
  onShowToast,
}: MediaStorageManagerProps) {
  const tr = (bn: string, en: string, ja?: string) => {
    if (language === "ja") return ja || en;
    if (language === "en") return en;
    return bn;
  };

  const [items, setItems] = useState<MediaVaultClientItem[]>([]);
  const [summary, setSummary] = useState<StorageStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string>(
    "KNLTC_Visa_And_Student_Docs",
  );
  const [selectedType, setSelectedType] = useState<"ALL" | "IMAGE" | "PDF">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaVaultClientItem | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const res = await fetchMediaLibrary({
        folder: selectedFolder,
        type: selectedType,
        search: searchQuery,
      });
      setItems(res.items);
      if (res.summary) setSummary(res.summary);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLibrary();
  }, [selectedFolder, selectedType]);

  const handleFilesUpload = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      for (const file of files) {
        if (file.type.startsWith("image/")) {
          const res = await uploadMediaImage(file, {
            folderName: uploadTargetFolder,
            maxDimension: 1200,
          });
          if (res.url) successCount++;
        } else {
          const res = await uploadDocumentFile(file, {
            folderName: uploadTargetFolder,
            trackingNo: "KNLTC",
            docType: "vault",
          });
          if (res.url) successCount++;
        }
      }

      await loadLibrary();
      onShowToast(
        tr(
          `${successCount}টি ফাইল সফলভাবে আপলোড ও সংরক্ষিত হয়েছে!`,
          `${successCount} file(s) uploaded & saved!`,
        ),
        tr(
          "সরাসরি প্রিভিউ ও ডিরেক্ট মিডিয়া লিংক প্রস্তুত",
          "Direct media link is ready for instant preview & use",
        ),
      );
    } catch (err) {
      onShowToast(
        tr("ফাইল আপলোডে ত্রুটি হয়েছে", "Upload failed"),
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toPublicUrl = (rawUrl: string) =>
    rawUrl.startsWith("/") && typeof window !== "undefined"
      ? `${window.location.origin}${rawUrl}`
      : rawUrl;

  const handleCopyUrl = async (item: MediaVaultClientItem) => {
    try {
      const fullUrl = toPublicUrl(item.url);
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
      onShowToast(
        tr("ডিরেক্ট মিডিয়া লিংক কপি করা হয়েছে!", "Direct media link copied!"),
        fullUrl,
      );
    } catch {
      // Ignore clipboard error
    }
  };

  const handleDelete = async (item: MediaVaultClientItem) => {
    const res = await deleteMediaVaultItem(item.id);
    if (res.ok) {
      if (res.items) setItems(res.items);
      else setItems((prev) => prev.filter((x) => x.id !== item.id));
      if (res.summary) setSummary(res.summary);
      if (previewItem?.id === item.id) setPreviewItem(null);
      onShowToast(
        tr("ফাইলটি মুছে ফেলা হয়েছে", "File removed from Media Library"),
        item.name,
      );
    }
  };

  const handleOptimizeAll = async () => {
    setIsOptimizing(true);
    try {
      const res = await optimizeMediaStorage();
      if (res.ok) {
        if (res.items) setItems(res.items);
        if (res.summary) setSummary(res.summary);
        onShowToast(
          tr(
            `মিডিয়া লাইব্রেরি সিঙ্ক সম্পন্ন! (${res.optimizedCount}টি নতুন ফাইল যুক্ত হয়েছে)`,
            `Media Library Synced! (${res.optimizedCount} embedded files indexed)`,
          ),
          tr(
            "সকল প্রোফাইল ছবি ও ডকুমেন্টের ডিরেক্ট লিংক আপডেট করা হয়েছে",
            "All profile photos, logos, and documents now use direct URLs",
          ),
        );
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.folderName.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-800 uppercase border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              {tr("ডিরেক্ট মিডিয়া ও ডকুমেন্ট ভল্ট", "DIRECT MEDIA & DOCUMENT VAULT")}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">
            {tr(
              "মিডিয়া লাইব্রেরি ও ফাইল ম্যানেজার",
              "Media Library & File Browser",
            )}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {tr(
              "স্টুডেন্ট ছবি, পাসপোর্ট, ভিসা পিডিএফ, পার্টনার স্কুলের লোগো, বুকস্টোর বইয়ের কভার এবং ওয়েবসাইট ব্যানার এক জায়গা থেকে আপলোড, প্রিভিউ ও ডিরেক্ট লিংক কপি করুন।",
              "Upload, preview, and copy direct links for Student Photos, Visa PDFs, Partner Logos, Bookstore Covers, and Website Banners.",
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOptimizeAll}
            disabled={isOptimizing}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition disabled:opacity-60"
          >
            <Sparkles className={`h-4 w-4 text-emerald-700 ${isOptimizing ? "animate-spin" : ""}`} />
            <span>
              {isOptimizing
                ? tr("সিঙ্ক হচ্ছে...", "Indexing Files...")
                : tr("সকল ফাইল ইনডেক্স ও সিঙ্ক", "Sync All Profile Media")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => void loadLibrary()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{tr("রিফ্রেশ", "Refresh")}</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Summary Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {tr("মোট সংরক্ষিত ফাইল", "Total Stored Files")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> ONLINE
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {summary?.totalFiles ?? items.length}{" "}
            <span className="text-xs font-semibold text-slate-500">
              {tr("টি ফাইল", "files")}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {tr("মোট ব্যবহৃত স্টোরেজ:", "Total Size:")}{" "}
            <strong className="text-slate-700">{formatBytes(summary?.totalBytes || 0)}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {tr("ছবি ও লোগো (Images)", "Photos, Avatars & Logos")}
            </span>
            <ImageIcon className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {summary?.imageCount ?? items.filter((i) => i.mimeType.startsWith("image/")).length}{" "}
            <span className="text-xs font-semibold text-slate-500">
              {tr("টি ছবি", "images")}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {tr("সরাসরি প্রোফাইল ও ওয়েবসাইটে প্রদর্শিত", "Direct rendering across profiles & portal")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {tr("পিডিএফ ও ডকুমেন্টস", "PDFs & Official Documents")}
            </span>
            <FileText className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {summary?.pdfCount ?? items.filter((i) => i.mimeType.includes("pdf")).length}{" "}
            <span className="text-xs font-semibold text-slate-500">
              {tr("টি ডকুমেন্ট", "documents")}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {tr("ইন-অ্যাপ পিডিএফ প্রিভিউ ও ডাউনলোড রেডি", "Instant in-app PDF viewer & download")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {tr("স্টোরেজ বাকেট / ফোল্ডার", "Media Buckets")}
            </span>
            <Layers className="h-4 w-4 text-emerald-700" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {FOLDER_OPTIONS.length}{" "}
            <span className="text-xs font-semibold text-slate-500">
              {tr("টি বাকেট", "buckets")}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {tr("শিটে স্বয়ংক্রিয়ভাবে লিংক সংরক্ষিত", "Auto-synced to corresponding Sheet columns")}
          </p>
        </div>
      </div>

      {/* Multi-File Drag & Drop Uploader */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            void handleFilesUpload(e.dataTransfer.files);
          }
        }}
        className={`rounded-2xl border-2 border-dashed p-6 transition ${
          isDragActive
            ? "border-emerald-600 bg-emerald-50/70"
            : "border-slate-300 bg-white hover:border-emerald-500/60"
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900 text-white shadow-xs">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {tr(
                  "নতুন ছবি বা পিডিএফ ডকুমেন্ট আপলোড করুন (ড্র্যাগ অ্যান্ড ড্রপ)",
                  "Upload New Images or PDF Documents (Drag & Drop Supported)",
                )}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {tr(
                  "সমর্থিত ফরম্যাট: JPG, PNG, WEBP, GIF, SVG এবং PDF। আপলোডের সাথে সাথেই সরাসরি ব্যবহারযোগ্য লিংক তৈরি হবে।",
                  "Supports JPG, PNG, WEBP, GIF, SVG, and PDF. Generates direct media URLs immediately.",
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={uploadTargetFolder}
              onChange={(e) => setUploadTargetFolder(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
            >
              {FOLDER_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {language === "bn" ? f.labelBn : f.labelEn}
                </option>
              ))}
            </select>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  void handleFilesUpload(e.target.files);
                }
              }}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#133e29] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              <span>
                {isUploading
                  ? tr("আপলোড হচ্ছে...", "Uploading Files...")
                  : tr("ফাইল নির্বাচন ও আপলোড", "Select & Upload Files")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFolder("ALL")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              selectedFolder === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tr("সব বাকেট", "All Buckets")} ({summary?.totalFiles ?? items.length})
          </button>
          {FOLDER_OPTIONS.map((f) => {
            const count = summary?.folderCounts?.[f.value] || 0;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setSelectedFolder(f.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  selectedFolder === f.value
                    ? "bg-[#133e29] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {language === "bn" ? f.labelBn : f.labelEn}
                {count > 0 ? ` (${count})` : ""}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {(["ALL", "IMAGE", "PDF"] as const).map((tKey) => (
              <button
                key={tKey}
                type="button"
                onClick={() => setSelectedType(tKey)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  selectedType === tKey
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tKey === "ALL"
                  ? tr("সব", "All")
                  : tKey === "IMAGE"
                    ? tr("ছবি", "Images")
                    : "PDF"}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr("ফাইলের নাম খুঁজুন...", "Search file name...")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("GRID")}
              className={`rounded-lg p-1.5 ${
                viewMode === "GRID" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className={`rounded-lg p-1.5 ${
                viewMode === "LIST" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
              }`}
              title="List View"
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Files Grid / List */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-16 px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FolderOpen className="h-7 w-7" />
          </div>
          <h3 className="mt-3 text-sm font-extrabold text-slate-800">
            {tr("এই বাকেটে এখনো কোনো ফাইল নেই", "No media files found in this bucket")}
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            {tr(
              "উপরের আপলোড বক্সে ক্লিক করে ছবি বা পিডিএফ আপলোড করুন, অথবা স্টুডেন্ট প্রোফাইল ও বুকস্টোর থেকে আপলোডকৃত ফাইলগুলো এখানে দেখতে পাবেন।",
              "Upload images or PDF documents using the uploader above, or click 'Sync All Profile Media' to index existing files.",
            )}
          </p>
        </div>
      ) : viewMode === "GRID" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => {
            const isImage = item.mimeType.startsWith("image/");
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-emerald-400 transition"
              >
                <div
                  onClick={() => setPreviewItem(item)}
                  className="relative h-44 w-full bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                        <FileText className="h-7 w-7" />
                      </div>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        {item.mimeType.includes("pdf") ? "PDF DOCUMENT" : item.mimeType}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                    <span className="rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white">
                      {formatBytes(item.size)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem(item);
                    }}
                    className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-800 shadow-xs hover:bg-white transition"
                    title={tr("প্রিভিউ দেখুন", "Preview File")}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <div>
                    <p className="truncate text-xs font-extrabold text-slate-900" title={item.name}>
                      {item.name}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                      {item.folderName} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>{tr("দেখুন", "View")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleCopyUrl(item)}
                      className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>{tr("কপিড", "Copied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{tr("লিংক", "Copy URL")}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={item.downloadUrl || item.url}
                      download={item.name}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      title={tr("ডাউনলোড", "Download")}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => void handleDelete(item)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                      title={tr("ডিলিট", "Delete")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">{tr("ফাইল", "File")}</th>
                  <th className="px-4 py-3">{tr("বাকেট", "Bucket")}</th>
                  <th className="px-4 py-3">{tr("সাইজ ও টাইপ", "Size & Type")}</th>
                  <th className="px-4 py-3">{tr("ডিরেক্ট লিংক", "Direct Media Link")}</th>
                  <th className="px-4 py-3 text-right">{tr("অ্যাকশন", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isImage = item.mimeType.startsWith("image/");
                  const isCopied = copiedId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {isImage ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              onClick={() => setPreviewItem(item)}
                              className="h-10 w-10 rounded-lg border object-cover shrink-0 cursor-pointer"
                            />
                          ) : (
                            <div
                              onClick={() => setPreviewItem(item)}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200 shrink-0 cursor-pointer"
                            >
                              <FileText className="h-5 w-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900 max-w-[220px]">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{item.folderName}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="font-bold text-slate-800">{formatBytes(item.size)}</span>
                        <span className="ml-1.5 text-[10px] text-slate-400">({item.mimeType})</span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-slate-100 px-2 py-1 text-[10px] text-emerald-800">
                          {toPublicUrl(item.url)}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                          >
                            {tr("ফাইল দেখুন", "View File")}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleCopyUrl(item)}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                            }`}
                          >
                            {isCopied ? tr("কপিড!", "Copied!") : tr("লিংক কপি", "Copy Link")}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(item)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Universal In-App Preview Modal */}
      {previewItem ? (
        <DocumentPreviewModal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={previewItem.name}
          subtitle={`${previewItem.folderName} • ${formatBytes(previewItem.size)}`}
          fileUrl={previewItem.url}
          fileName={previewItem.name}
          mimeType={previewItem.mimeType}
        />
      ) : null}
    </div>
  );
}
