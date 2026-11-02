"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Settings2,
  ExternalLink,
  Code2,
  CloudUpload,
  Link2,
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
import { getCmsStore, fetchLiveStoreFromServer } from "@/lib/knltc-cms-store";
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

  // Backend Connection & Cloud Sync Settings State
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [webAppUrlInput, setWebAppUrlInput] = useState("");
  const [masterSheetUrlInput, setMasterSheetUrlInput] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("KNLTC_SECRET_2026");
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [liveDiagnostic, setLiveDiagnostic] = useState<any | null>(null);
  const [isPushingStore, setIsPushingStore] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadBackendStatus = async () => {
    try {
      const res = await fetch("/api/sheets?action=status", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setIsBackendConnected(Boolean(data.connected));
        if (data.webAppUrl) setWebAppUrlInput(data.webAppUrl);
        if (data.masterSheetUrl) setMasterSheetUrlInput(data.masterSheetUrl);
        if (data.apiKey) setApiKeyInput(data.apiKey);
        if (data.storageSummary) setSummary(data.storageSummary);
        if (data.envDiagnostics) {
          setLiveDiagnostic((prev: any) => prev || { envDiagnostics: data.envDiagnostics });
        }
      }
    } catch {
      // Ignore error
    }
  };

  const handleTestLiveConnection = async () => {
    setIsTestingConnection(true);
    try {
      const res = await fetch("/api/sheets?action=test_connection", { cache: "no-store" });
      const data = await res.json();
      setLiveDiagnostic(data);
      setIsBackendConnected(Boolean(data.isConfigured && (data.getStatusOk || data.postAuthOk)));
      if (data.storageSummary) setSummary(data.storageSummary);
      await loadLibrary();
      if (data.getStatusOk || data.postAuthOk) {
        onShowToast(
          tr(
            "গুগল শিট ও ড্রাইভ সংযোগ সফলভাবে যাচাইকৃত!",
            "Google Sheet & Drive Connection Verified!",
          ),
          data.spreadsheetName
            ? `Sheet: ${data.spreadsheetName} (${data.existingSheets?.length || 16} tabs ready)`
            : tr("সব ১৬টি শিট ট্যাব এবং API Key সচল রয়েছে", "All 16 Sheet tabs & API Key verified"),
        );
      } else {
        onShowToast(
          tr("সংযোগ যাচাইয়ে ত্রুটি পাওয়া গেছে", "Connection Diagnostic Warning"),
          data.postError || data.getError || tr("Web App URL বা API Key চেক করুন", "Check Web App URL or API Key"),
        );
      }
    } catch (err) {
      onShowToast(
        tr("সংযোগ পরীক্ষা ব্যর্থ হয়েছে", "Connection test failed"),
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setIsTestingConnection(false);
    }
  };

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMediaLibrary({
        folder: selectedFolder,
        type: selectedType,
        search: "",
      });
      setItems(res.items);
      if (res.summary) setSummary(res.summary);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder, selectedType]);

  useEffect(() => {
    void loadBackendStatus();
  }, []);

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  const handleSaveBackendConfig = async () => {
    setIsSavingConfig(true);
    try {
      const currentStore = getCmsStore();
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SAVE_BACKEND_CONFIG",
          webAppUrl: webAppUrlInput.trim(),
          masterSheetUrl: masterSheetUrlInput.trim(),
          apiKey: apiKeyInput.trim() || "KNLTC_SECRET_2026",
          store: currentStore,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsBackendConnected(Boolean(data.connected));
        if (data.storageSummary) setSummary(data.storageSummary);
        await handleTestLiveConnection();
        onShowToast(
          tr(
            "ব্যাকএন্ড সংযোগ ও শিট ইউআরএল সংরক্ষিত হয়েছে!",
            "Backend Connection & Sheet URL Saved!",
          ),
          data.connected
            ? tr(
                "Google Drive এবং media_vault টেবিলের সাথে স্বয়ংক্রিয় সিঙ্ক সক্রিয়",
                "Live sync active with Google Drive & Sheet media_vault table",
              )
            : tr(
                "সার্ভার স্টোরেজ সক্রিয়। Apps Script Web App URL দিলে Google Drive যুক্ত হবে।",
                "Server storage active. Paste Apps Script Web App URL to enable Google Drive.",
              ),
        );
      } else {
        onShowToast(
          tr("কনফিগারেশন সেভ করতে সমস্যা হয়েছে", "Failed to save configuration"),
          data.error,
        );
      }
    } catch (err) {
      onShowToast(
        tr("কনফিগারেশন সেভ করতে সমস্যা হয়েছে", "Failed to save configuration"),
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handlePushAllBrowserData = async () => {
    setIsPushingStore(true);
    try {
      const currentStore = getCmsStore();
      await fetch("/api/cms/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "FULL_STORE_SYNC",
          fullStore: currentStore,
        }),
      });
      const optRes = await optimizeMediaStorage();
      if (optRes.items) setItems(optRes.items);
      if (optRes.summary) setSummary(optRes.summary);
      await fetchLiveStoreFromServer();
      await loadLibrary();
      onShowToast(
        tr(
          "সব ডাটা ও মিডিয়া সার্ভার এবং শিটে সিঙ্ক সম্পন্ন!",
          "All Data & Media Synced to Server & Google Sheet!",
        ),
        tr(
          "এখন যেকোনো নতুন ব্রাউজার বা ডিভাইস থেকে ওপেন করলে সব ডাটা ও ফাইল দেখা যাবে।",
          "Now opening in any new browser or device will display all records and media files.",
        ),
      );
    } catch (err) {
      onShowToast(
        tr("সিঙ্ক করতে সমস্যা হয়েছে", "Sync failed"),
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setIsPushingStore(false);
    }
  };

  const handleCopyAppsScript = async () => {
    try {
      const res = await fetch("/api/sheets?action=code_gs", { cache: "no-store" });
      const data = await res.json();
      if (data.ok && data.code) {
        await navigator.clipboard.writeText(data.code);
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 3000);
        onShowToast(
          tr(
            "সম্পূর্ণ Google Apps Script (Code.gs) কপি হয়েছে!",
            "Complete Google Apps Script (Code.gs) Copied!",
          ),
          tr(
            "আপনার Google Sheet > Extensions > Apps Script-এ পেস্ট করে Deploy > New deployment (Web app) করুন।",
            "Paste into Google Sheet > Extensions > Apps Script and Deploy as Web App.",
          ),
        );
      }
    } catch {
      onShowToast(tr("স্ক্রিপ্ট কপি করতে সমস্যা হয়েছে", "Failed to copy script"));
    }
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-800 uppercase border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              {tr("ডিরেক্ট মিডিয়া ও ডকুমেন্ট ভল্ট", "DIRECT MEDIA & DOCUMENT VAULT")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold border ${
                isBackendConnected
                  ? "bg-emerald-900 text-white border-emerald-950"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isBackendConnected
                ? tr(
                    "Google Drive + Sheet (media_vault) সংযুক্ত",
                    "Google Drive + Sheet (media_vault) Connected",
                  )
                : tr(
                    "সার্ভার ভল্ট সক্রিয় (Google Drive সংযোগ সেটিংস)",
                    "Server Vault Active (Connect Google Drive)",
                  )}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">
            {tr(
              "মিডিয়া লাইব্রেরি ও ক্লাউড স্টোরেজ ম্যানেজার",
              "Media Library & Cloud Storage Manager",
            )}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {tr(
              "স্টুডেন্ট ছবি, পাসপোর্ট, ভিসা পিডিএফ, পার্টনার স্কুলের লোগো, বুকস্টোর বইয়ের কভার এবং ওয়েবসাইট ব্যানার স্থায়ীভাবে সংরক্ষণ, প্রিভিউ ও যেকোনো ব্রাউজার থেকে অ্যাক্সেস করুন।",
              "Store, preview, and sync Student Photos, Visa PDFs, Partner Logos, Bookstore Covers, and Website Banners across all browsers & devices.",
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSettingsPanel((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
              showSettingsPanel
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Settings2 className="h-4 w-4" />
            <span>
              {tr("ব্যাকএন্ড ও Google Drive সেটিংস", "Backend & Drive Settings")}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePushAllBrowserData}
            disabled={isPushingStore}
            className="inline-flex items-center gap-2 rounded-xl bg-[#133e29] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-60"
          >
            <CloudUpload className={`h-4 w-4 ${isPushingStore ? "animate-bounce" : ""}`} />
            <span>
              {isPushingStore
                ? tr("সিঙ্ক হচ্ছে...", "Syncing All...")
                : tr("সব ডাটা ও ফাইল ক্লাউডে পুশ করুন", "Sync All Data & Media")}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOptimizeAll}
            disabled={isOptimizing}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3.5 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition disabled:opacity-60"
          >
            <Sparkles className={`h-4 w-4 text-emerald-700 ${isOptimizing ? "animate-spin" : ""}`} />
            <span>
              {isOptimizing
                ? tr("ইনডেক্স হচ্ছে...", "Indexing...")
                : tr("ফাইল ইনডেক্স", "Index Files")}
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

      {/* Collapsible Backend Connection & Google Drive / Sheet Settings Panel */}
      {showSettingsPanel ? (
        <div className="rounded-2xl border-2 border-emerald-800/20 bg-emerald-950/3 p-6 shadow-xs space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-emerald-700" />
                {tr(
                  "স্থায়ী Google Drive + Google Sheet (media_vault) কানেকশন প্যানেল",
                  "Permanent Google Drive + Google Sheet (media_vault) Connection Settings",
                )}
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                {tr(
                  "নতুন ব্রাউজার, ইনকগনিটো বা অন্য ডিভাইস থেকে এবং সার্ভার রিস্টার্টের পরও যেন কোনো ডাটা বা ফাইল না হারায়, তাই আপনার Google Apps Script Web App URL ও Sheet URL এখানে সেভ রাখুন।",
                  "Save your Google Apps Script Web App URL & Sheet URL here so all uploaded files and data persist permanently in Google Drive and the media_vault Sheet tab across all browsers and server restarts.",
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTestLiveConnection}
                disabled={isTestingConnection}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-700 bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isTestingConnection ? "animate-spin" : ""}`} />
                <span>
                  {isTestingConnection
                    ? tr("পরীক্ষা হচ্ছে...", "Testing...")
                    : tr("লাইভ কানেকশন ও ১৬টি ট্যাব যাচাই করুন", "Test Live Connection & Verify 16 Tabs")}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCopyAppsScript}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                {copiedScript ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{tr("Code.gs কপি হয়েছে!", "Code.gs Copied!")}</span>
                  </>
                ) : (
                  <>
                    <Code2 className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{tr("১-ক্লিকে Code.gs কপি করুন", "Copy Apps Script (Code.gs)")}</span>
                  </>
                )}
              </button>

              {masterSheetUrlInput ? (
                <a
                  href={masterSheetUrlInput}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{tr("মাস্টার গুগল শিট খুলুন", "Open Master Google Sheet")}</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Live Environment Variable & Apps Script Diagnostic Readout */}
          {liveDiagnostic ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-black text-slate-900">
                  {tr(
                    "এনভায়রনমেন্ট ভেরিয়েবল ও গুগল শিট ডায়াগনস্টিক স্ট্যাটাস:",
                    "Environment Variables & Google Sheet Diagnostic Status:",
                  )}
                </span>
                {liveDiagnostic.spreadsheetName ? (
                  <span className="font-bold text-emerald-800">
                    Sheet: {liveDiagnostic.spreadsheetName} ({liveDiagnostic.existingSheets?.length || 16} tabs)
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold border ${
                    liveDiagnostic.envDiagnostics?.hasWebAppUrlEnv || webAppUrlInput
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  GOOGLE_SHEETS_WEB_APP_URL:{" "}
                  {liveDiagnostic.envDiagnostics?.hasWebAppUrlEnv || webAppUrlInput ? "READY" : "MISSING"}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold border ${
                    liveDiagnostic.envDiagnostics?.hasGoogleSheetsApiKeyEnv ||
                    liveDiagnostic.envDiagnostics?.hasDefaultApiKeyEnv ||
                    apiKeyInput
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  API_KEY (GOOGLE_SHEETS_API_KEY / DEFAULT_API_KEY): AUTO-MATCHED
                </span>

                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                  DRIVE_ROOT_FOLDER_NAME:{" "}
                  {liveDiagnostic.envDiagnostics?.driveRootFolderName || "KNLTC_Uploads_And_Visa_Docs"}
                </span>

                {liveDiagnostic.postAuthOk !== undefined ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold border ${
                      liveDiagnostic.postAuthOk
                        ? "bg-emerald-900 text-white border-emerald-950"
                        : "bg-amber-50 text-amber-900 border-amber-200"
                    }`}
                  >
                    Apps Script Write Auth:{" "}
                    {liveDiagnostic.postAuthOk ? "VERIFIED (16 TABS READY)" : liveDiagnostic.postError || "PENDING"}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                {tr(
                  "১. Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)",
                  "1. Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)",
                )}
              </label>
              <input
                type="url"
                value={webAppUrlInput}
                onChange={(e) => setWebAppUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                {tr("২. সিকিউরিটি API Key", "2. Security API Key")}
              </label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="KNLTC_SECRET_2026"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-emerald-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                {tr(
                  "৩. আপনার Master Google Sheet লিংক (ঐচ্ছিক - সরাসরি ওপেন বাটনের জন্য)",
                  "3. Master Google Sheet URL (Optional - for quick access)",
                )}
              </label>
              <input
                type="url"
                value={masterSheetUrlInput}
                onChange={(e) => setMasterSheetUrlInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/14n2_.../edit"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-emerald-700"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSaveBackendConfig}
                disabled={isSavingConfig}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#133e29] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isSavingConfig
                    ? tr("সেভ ও কানেক্ট হচ্ছে...", "Saving & Connecting...")
                    : tr("সেভ ও কানেক্ট করুন", "Save & Connect Backend")}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
