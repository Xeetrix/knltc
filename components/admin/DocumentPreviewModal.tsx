"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
}

export function isPdfFile(url?: string, fileName?: string, mimeType?: string): boolean {
  if (mimeType && mimeType.toLowerCase().includes("pdf")) return true;
  const target = `${fileName || ""} ${url || ""}`.toLowerCase();
  return target.includes(".pdf") || target.startsWith("data:application/pdf");
}

export function isImageFile(url?: string, fileName?: string, mimeType?: string): boolean {
  if (mimeType && mimeType.toLowerCase().startsWith("image/")) return true;
  if (isPdfFile(url, fileName, mimeType)) return false;
  const target = `${fileName || ""} ${url || ""}`.toLowerCase();
  return (
    target.startsWith("data:image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg|bmp)(\?|$)/i.test(target) ||
    Boolean(url && url.includes("/api/media/file/") && !target.includes(".doc"))
  );
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  title,
  subtitle,
  fileUrl,
  fileName,
  mimeType,
}: DocumentPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);

  if (!isOpen || !fileUrl) return null;

  const isPdf = isPdfFile(fileUrl, fileName, mimeType);
  const isImage = !isPdf && isImageFile(fileUrl, fileName, mimeType);

  const resolvedPublicUrl =
    fileUrl.startsWith("/") && typeof window !== "undefined"
      ? `${window.location.origin}${fileUrl}`
      : fileUrl;

  const downloadHref = fileUrl.includes("/api/media/file/")
    ? `${fileUrl}${fileUrl.includes("?") ? "&" : "?"}download=1`
    : fileUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resolvedPublicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 p-3 sm:p-5 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all ${
          fullScreen
            ? "h-[96vh] w-[98vw]"
            : "h-[86vh] w-full max-w-4xl"
        }`}
      >
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
              {isPdf ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-white">{title || fileName || "Document Preview"}</h3>
              <p className="truncate text-[11px] text-slate-300">
                {subtitle || fileName || resolvedPublicUrl}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {isImage && (
              <div className="hidden sm:flex items-center gap-1 rounded-xl bg-white/10 px-2 py-1 mr-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
                  className="rounded p-1 text-slate-200 hover:bg-white/10 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-1.5 text-[11px] font-bold text-slate-200">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                  className="rounded p-1 text-slate-200 hover:bg-white/10 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={downloadHref}
              download={fileName || title || "knltc-document"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl bg-white/10 p-1.5 text-slate-200 hover:bg-white/20 hover:text-white transition"
              title="Open Direct File"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setFullScreen((f) => !f)}
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-white/10 p-1.5 text-slate-200 hover:bg-white/20 hover:text-white transition"
              title={fullScreen ? "Restore Size" : "Maximize"}
            >
              {fullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-rose-500/20 p-1.5 text-rose-200 hover:bg-rose-600 hover:text-white transition"
              title="Close Preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Viewer Body */}
        <div className="relative flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-4">
          {isPdf ? (
            <iframe
              src={fileUrl}
              title={title || fileName || "PDF Document"}
              className="h-full w-full rounded-xl border border-slate-300 bg-white shadow-inner"
            />
          ) : isImage ? (
            <div className="flex min-h-full min-w-full items-center justify-center overflow-auto p-2">
              <img
                src={fileUrl}
                alt={title || fileName || "Preview"}
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                className="max-h-[72vh] max-w-full rounded-xl object-contain shadow-lg transition-transform duration-150 bg-white"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm max-w-md">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <FileText className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">{title || fileName || "Document File"}</h4>
              <p className="mt-1 text-xs text-slate-500 break-all">{resolvedPublicUrl}</p>
              <div className="mt-5 flex items-center gap-2.5">
                <a
                  href={downloadHref}
                  download={fileName || "document"}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  Download File
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy Direct URL"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Direct Link bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
              Direct Media Link
            </span>
            <input
              type="text"
              readOnly
              value={resolvedPublicUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full min-w-0 truncate rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-600 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
