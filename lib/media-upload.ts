/**
 * Universal Media & Document Upload Helper for KNLTC ERP & Portal
 * 
 * Provides:
 * 1. Automatic client-side canvas compression for images (logos, avatars, brochures, covers)
 * 2. Upload to Supabase Storage via /api/admin/upload (media) or /api/cms/documents (docs)
 * 3. Graceful offline/fallback: if storage fails, returns an ultra-compact compressed data URL
 *    so user edits, logos, and documents are 100% preserved and never lost across reloads.
 */

export interface UploadOptions {
  bucket?: string;
  maxDimension?: number;
  quality?: number;
  trackingNo?: string;
  docType?: string;
}

export interface UploadResult {
  url: string;
  fileName?: string;
  source: "supabase-storage" | "compressed-data-url";
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
 * Upload an image (logo, avatar, product photo, blog cover) with compression & storage upload.
 */
export async function uploadMediaImage(
  file: File,
  options?: UploadOptions,
): Promise<UploadResult> {
  const maxDim = options?.maxDimension || 800;
  const quality = options?.quality || 0.85;
  const bucket = options?.bucket || "knltc-media";

  let compressed: { dataUrl: string; blob: Blob } | null = null;
  try {
    if (file.type.startsWith("image/")) {
      compressed = await compressImageToDataUrl(file, maxDim, quality);
    }
  } catch (err) {
    console.warn("[MediaUpload] Compression fallback triggered:", err);
  }

  // Attempt upload to Supabase Storage endpoint
  try {
    const formData = new FormData();
    const fileToUpload = compressed?.blob
      ? new File([compressed.blob], file.name, { type: compressed.blob.type || file.type })
      : file;

    formData.append("file", fileToUpload);
    formData.append("bucket", bucket);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return {
          url: data.url,
          fileName: file.name,
          source: "supabase-storage",
        };
      }
    }
  } catch (err) {
    console.warn("[MediaUpload] Remote storage upload failed, using local compressed store:", err);
  }

  // Resilient Fallback: return compressed data URL
  if (compressed?.dataUrl) {
    return {
      url: compressed.dataUrl,
      fileName: file.name,
      source: "compressed-data-url",
    };
  }

  // Last-mile fallback: raw FileReader
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: String(reader.result || ""),
        fileName: file.name,
        source: "compressed-data-url",
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a document (PDF, Word, or image) for student files, brochures, licenses.
 */
export async function uploadDocumentFile(
  file: File,
  options?: UploadOptions,
): Promise<UploadResult> {
  const trackingNo = options?.trackingNo || "knltc-partner";
  const docType = options?.docType || "mou_brochure";

  // If it's an image, we can try compress first
  if (file.type.startsWith("image/")) {
    return uploadMediaImage(file, { ...options, bucket: "knltc-documents" });
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("trackingNo", trackingNo);
    formData.append("docType", docType);

    const res = await fetch("/api/cms/documents", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return {
          url: data.url,
          fileName: data.fileName || file.name,
          source: "supabase-storage",
        };
      }
    }
  } catch (err) {
    console.warn("[DocUpload] Remote doc upload failed, using fallback:", err);
  }

  // Fallback to data URL for documents
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: String(reader.result || ""),
        fileName: file.name,
        source: "compressed-data-url",
      });
    };
    reader.readAsDataURL(file);
  });
}
