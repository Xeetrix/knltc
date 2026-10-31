/**
 * Universal Media & Document Upload Helper for KNLTC ERP & Portal
 *
 * Provides:
 * 1. Automatic client-side canvas compression for images (logos, avatars, brochures, covers)
 * 2. Hybrid Upload to Google Drive (`KNLTC_Uploads_And_Visa_Docs`) + Persistent Server Storage via `/api/media`
 * 3. Returns short, permanent `/api/media/file/<id>/<filename>` URLs so Google Sheets cells
 *    never exceed the 50,000-character limit and browser `localStorage` never overflows!
 */

export interface UploadOptions {
  bucket?: string;
  folderName?: string;
  maxDimension?: number;
  quality?: number;
  trackingNo?: string;
  docType?: string;
}

export interface UploadResult {
  url: string;
  downloadUrl?: string;
  driveUrl?: string;
  fileId?: string;
  fileName?: string;
  source: "google-drive" | "cloudinary" | "persistent-disk" | "supabase-storage" | "compressed-data-url";
}

export interface MediaVaultClientItem {
  id: string;
  name: string;
  safeFileName: string;
  folderName: string;
  mimeType: string;
  size: number;
  url: string;
  downloadUrl: string;
  driveUrl?: string;
  driveFileId?: string;
  provider: "google-drive" | "cloudinary" | "persistent-disk";
  createdAt: string;
  updatedAt: string;
}

export interface StorageStatusSummary {
  ok: boolean;
  googleSheetsConnected: boolean;
  googleDriveConnected: boolean;
  cloudinaryConnected: boolean;
  persistentDiskActive: boolean;
  persistentDir: string;
  totalFiles: number;
  totalBytes: number;
  imageCount: number;
  pdfCount: number;
  driveSyncedCount: number;
  folderCounts: Record<string, number>;
  inlineBase64Count: number;
  maxCellLength: number;
  sheetsCellHealthOk: boolean;
}

function fileToBase64DataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image file in browser canvas to produce a lightweight WebP or JPEG.
 */
export async function compressImageToDataUrl(
  file: File,
  maxDimension: number = 960,
  quality: number = 0.85,
): Promise<{ dataUrl: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Canvas context not available"));
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mime, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ dataUrl, blob });
            } else {
              resolve({ dataUrl, blob: file });
            }
          },
          mime,
          quality,
        );
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}

function toDirectPublicUrl(rawUrl?: string): string {
  if (!rawUrl) return "";
  if (
    rawUrl.startsWith("/") &&
    typeof window !== "undefined" &&
    window.location?.origin
  ) {
    return `${window.location.origin}${rawUrl}`;
  }
  return rawUrl;
}

/**
 * Upload an image (logo, avatar, product photo, blog cover) to `/api/media` (Direct Object Storage).
 */
export async function uploadMediaImage(
  file: File,
  rawOptions?: UploadOptions | string,
): Promise<UploadResult> {
  const options: UploadOptions | undefined =
    typeof rawOptions === "string"
      ? { bucket: rawOptions, folderName: rawOptions }
      : rawOptions;
  const maxDim = options?.maxDimension || 960;
  const quality = options?.quality || 0.85;
  const folderName = options?.folderName || options?.bucket || "KNLTC_Images";

  let compressed: { dataUrl: string; blob: Blob } | null = null;
  try {
    if (file.type.startsWith("image/") && file.type !== "image/svg+xml" && file.type !== "image/gif") {
      compressed = await compressImageToDataUrl(file, maxDim, quality);
    }
  } catch (err) {
    console.warn("[MediaUpload] Compression fallback triggered:", err);
  }

  const base64Payload = compressed?.dataUrl || (await fileToBase64DataUrl(file));
  const mimeType = compressed?.blob?.type || file.type || "image/jpeg";

  // 1. Primary upload via `/api/media`
  try {
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPLOAD",
        fileName: file.name,
        mimeType,
        base64Data: base64Payload,
        folderName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        const directUrl = toDirectPublicUrl(data.url);
        const directDownload = toDirectPublicUrl(data.downloadUrl || data.url);
        return {
          url: directUrl,
          downloadUrl: directDownload,
          driveUrl: data.driveUrl,
          fileId: data.fileId,
          fileName: file.name,
          source: data.provider || "persistent-disk",
        };
      }
    }
  } catch (err) {
    console.warn("[MediaUpload] /api/media upload error, trying /api/sheets:", err);
  }

  // 2. Secondary fallback via `/api/sheets`
  try {
    const res = await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPLOAD_FILE_TO_DRIVE",
        fileName: file.name,
        mimeType,
        base64Data: base64Payload,
        folderName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        const directUrl = toDirectPublicUrl(data.url);
        const directDownload = toDirectPublicUrl(data.downloadUrl || data.url);
        return {
          url: directUrl,
          downloadUrl: directDownload,
          driveUrl: data.driveUrl,
          fileId: data.fileId,
          fileName: file.name,
          source: data.provider || "google-drive",
        };
      }
    }
  } catch (err) {
    console.warn("[MediaUpload] /api/sheets upload failed:", err);
  }

  return {
    url: base64Payload,
    downloadUrl: base64Payload,
    fileName: file.name,
    source: "compressed-data-url",
  };
}

/**
 * Upload a document (PDF, Word, or image) for student visa files, passports, receipts, brochures.
 */
export async function uploadDocumentFile(
  file: File,
  rawOptions?: UploadOptions | string,
): Promise<UploadResult> {
  const options: UploadOptions | undefined =
    typeof rawOptions === "string"
      ? { bucket: rawOptions, folderName: rawOptions }
      : rawOptions;
  const trackingNo = options?.trackingNo || "knltc-doc";
  const docType = options?.docType || "document";
  const folderName = options?.folderName || options?.bucket || "KNLTC_Visa_And_Student_Docs";

  if (file.type.startsWith("image/")) {
    return uploadMediaImage(file, { ...options, folderName });
  }

  const cleanFileName = `${trackingNo}_${docType}_${file.name}`;

  // 1. Primary multipart upload via `/api/media` for binary PDFs/docs
  try {
    const formData = new FormData();
    const renamedFile = new File([file], cleanFileName, { type: file.type || "application/pdf" });
    formData.append("file", renamedFile);
    formData.append("folderName", folderName);

    const res = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        const directUrl = toDirectPublicUrl(data.url);
        const directDownload = toDirectPublicUrl(data.downloadUrl || data.url);
        return {
          url: directUrl,
          downloadUrl: directDownload,
          driveUrl: data.driveUrl,
          fileId: data.fileId,
          fileName: cleanFileName,
          source: data.provider || "persistent-disk",
        };
      }
    }
  } catch (err) {
    console.warn("[DocUpload] Multipart /api/media upload error, trying JSON fallback:", err);
  }

  // 2. Secondary JSON upload via `/api/sheets`
  try {
    const base64Data = await fileToBase64DataUrl(file);
    const res = await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPLOAD_FILE_TO_DRIVE",
        fileName: cleanFileName,
        mimeType: file.type || "application/pdf",
        base64Data,
        folderName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        const directUrl = toDirectPublicUrl(data.url);
        const directDownload = toDirectPublicUrl(data.downloadUrl || data.url);
        return {
          url: directUrl,
          downloadUrl: directDownload,
          driveUrl: data.driveUrl,
          fileId: data.fileId,
          fileName: cleanFileName,
          source: data.provider || "google-drive",
        };
      }
    }
  } catch (err) {
    console.warn("[DocUpload] Doc upload failed, using fallback:", err);
  }

  const fallbackUrl = await fileToBase64DataUrl(file);
  return {
    url: fallbackUrl,
    downloadUrl: fallbackUrl,
    fileName: file.name,
    source: "compressed-data-url",
  };
}

/**
 * Client helpers for the Dashboard Media Library & Storage Status Manager.
 */
export async function fetchMediaLibrary(params?: {
  folder?: string;
  type?: "ALL" | "IMAGE" | "PDF" | "OTHER";
  search?: string;
}): Promise<{ items: MediaVaultClientItem[]; summary: StorageStatusSummary | null }> {
  try {
    const qs = new URLSearchParams();
    if (params?.folder) qs.set("folder", params.folder);
    if (params?.type) qs.set("type", params.type);
    if (params?.search) qs.set("search", params.search);

    const res = await fetch(`/api/media?${qs.toString()}`, { cache: "no-store" });
    if (!res.ok) return { items: [], summary: null };
    const data = await res.json();
    return {
      items: Array.isArray(data.items) ? data.items : [],
      summary: data.summary || null,
    };
  } catch {
    return { items: [], summary: null };
  }
}

export async function deleteMediaVaultItem(id: string): Promise<{
  ok: boolean;
  items?: MediaVaultClientItem[];
  summary?: StorageStatusSummary;
}> {
  try {
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "DELETE", id }),
    });
    if (!res.ok) return { ok: false };
    return await res.json();
  } catch {
    return { ok: false };
  }
}

export async function optimizeMediaStorage(): Promise<{
  ok: boolean;
  optimizedCount: number;
  freedBytes: number;
  items?: MediaVaultClientItem[];
  summary?: StorageStatusSummary;
}> {
  try {
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "OPTIMIZE_ALL" }),
    });
    if (!res.ok) return { ok: false, optimizedCount: 0, freedBytes: 0 };
    return await res.json();
  } catch {
    return { ok: false, optimizedCount: 0, freedBytes: 0 };
  }
}
