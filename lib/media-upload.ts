/**
 * Universal Media & Document Upload Helper for KNLTC ERP & Portal
 *
 * Provides:
 * 1. Automatic client-side canvas compression for images (logos, avatars, brochures, covers)
 * 2. 100% Free Upload to Google Drive (`KNLTC_Uploads_And_Visa_Docs`) or Cloudinary via `/api/sheets`
 * 3. Graceful offline/fallback: if remote upload is not configured yet, returns an ultra-compact
 *    compressed data URL so user edits, logos, and documents are 100% preserved.
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
  fileName?: string;
  source: "google-drive" | "cloudinary" | "supabase-storage" | "compressed-data-url";
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
  maxDimension: number = 800,
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

/**
 * Upload an image (logo, avatar, product photo, blog cover) to Google Drive / Cloudinary via `/api/sheets`.
 */
export async function uploadMediaImage(
  file: File,
  options?: UploadOptions,
): Promise<UploadResult> {
  const maxDim = options?.maxDimension || 800;
  const quality = options?.quality || 0.85;
  const folderName = options?.folderName || options?.bucket || "KNLTC_Images";

  let compressed: { dataUrl: string; blob: Blob } | null = null;
  try {
    if (file.type.startsWith("image/")) {
      compressed = await compressImageToDataUrl(file, maxDim, quality);
    }
  } catch (err) {
    console.warn("[MediaUpload] Compression fallback triggered:", err);
  }

  const base64Payload = compressed?.dataUrl || (await fileToBase64DataUrl(file));

  // Upload to Google Drive / Cloudinary via `/api/sheets`
  try {
    const res = await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPLOAD_FILE_TO_DRIVE",
        fileName: file.name,
        mimeType: compressed?.blob?.type || file.type || "image/jpeg",
        base64Data: base64Payload,
        folderName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return {
          url: data.url,
          downloadUrl: data.downloadUrl || data.url,
          fileName: file.name,
          source: data.provider === "cloudinary" ? "cloudinary" : "google-drive",
        };
      }
    }
  } catch (err) {
    console.warn("[MediaUpload] Google Drive / Cloudinary upload failed, using local compressed store:", err);
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
  options?: UploadOptions,
): Promise<UploadResult> {
  const trackingNo = options?.trackingNo || "knltc-doc";
  const docType = options?.docType || "visa_document";
  const folderName = options?.folderName || "KNLTC_Visa_And_Student_Docs";

  if (file.type.startsWith("image/")) {
    return uploadMediaImage(file, { ...options, folderName });
  }

  try {
    const base64Data = await fileToBase64DataUrl(file);
    const cleanFileName = `${trackingNo}_${docType}_${file.name}`;

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
        return {
          url: data.url,
          downloadUrl: data.downloadUrl || data.url,
          fileName: cleanFileName,
          source: "google-drive",
        };
      }
    }
  } catch (err) {
    console.warn("[DocUpload] Google Drive doc upload failed, using fallback:", err);
  }

  const fallbackUrl = await fileToBase64DataUrl(file);
  return {
    url: fallbackUrl,
    downloadUrl: fallbackUrl,
    fileName: file.name,
    source: "compressed-data-url",
  };
}
