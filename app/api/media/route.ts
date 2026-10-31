import { NextResponse } from "next/server";
import {
  deleteUploadedMedia,
  getStorageStatusSummary,
  getUploadedMediaList,
  optimizeAllTablesMedia,
  uploadFileToDriveOrCloudinary,
} from "@/lib/google-sheets-db";

export const dynamic = "force-dynamic";

/**
 * ============================================================================
 * CENTRALIZED MEDIA LIBRARY & STORAGE STATUS API (`/api/media`)
 * ============================================================================
 * GET:
 * - `/api/media?folder=ALL&type=ALL&search=...`
 *   Returns `{ ok: true, items, summary }`
 *
 * POST:
 * - Multipart FormData (`file`, `folderName`) -> Uploads binary file directly
 * - JSON `{ action: "UPLOAD", fileName, mimeType, base64Data, folderName }`
 * - JSON `{ action: "DELETE", id }`
 * - JSON `{ action: "OPTIMIZE_ALL" }` -> Converts any remaining inline base64 strings across all 15 tables
 * ============================================================================
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "ALL";
    const type = (searchParams.get("type") || "ALL") as "ALL" | "IMAGE" | "PDF" | "OTHER";
    const search = searchParams.get("search") || "";

    const items = getUploadedMediaList({ folder, type, search });
    const summary = getStorageStatusSummary();

    return NextResponse.json({
      ok: true,
      items,
      summary,
    });
  } catch (error) {
    console.error("[API][/api/media][GET]", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load media library" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Handle Multipart FormData upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const folderName = String(
        formData.get("folderName") || formData.get("bucket") || "KNLTC_Media_Vault",
      ).trim();

      if (!(file instanceof File)) {
        return NextResponse.json(
          { ok: false, error: "No file provided in FormData" },
          { status: 400 },
        );
      }

      const maxFileSize = 15 * 1024 * 1024; // 15 MB
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { ok: false, error: "File exceeds maximum allowed size of 15MB." },
          { status: 400 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadFileToDriveOrCloudinary({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        buffer,
        folderName,
      });

      return NextResponse.json({
        ok: true,
        ...uploaded,
        summary: getStorageStatusSummary(),
      });
    }

    // 2. Handle JSON body actions
    const body = await request.json();
    const action = String(body.action || "UPLOAD").toUpperCase();

    if (action === "OPTIMIZE_ALL") {
      const result = await optimizeAllTablesMedia();
      return NextResponse.json({
        ...result,
        items: getUploadedMediaList(),
      });
    }

    if (action === "DELETE") {
      const id = String(body.id || "");
      if (!id) {
        return NextResponse.json(
          { ok: false, error: "Missing media file ID" },
          { status: 400 },
        );
      }
      const deleted = deleteUploadedMedia(id);
      return NextResponse.json({
        ok: true,
        deleted,
        items: getUploadedMediaList(),
        summary: getStorageStatusSummary(),
      });
    }

    // Default: JSON base64 upload
    const { fileName, mimeType, base64Data, folderName } = body;
    if (!base64Data) {
      return NextResponse.json(
        { ok: false, error: "Missing base64Data for file upload" },
        { status: 400 },
      );
    }

    const uploaded = await uploadFileToDriveOrCloudinary({
      fileName: fileName || `knltc-upload-${Date.now()}`,
      mimeType: mimeType || "application/octet-stream",
      base64Data,
      folderName: folderName || "KNLTC_Media_Vault",
    });

    return NextResponse.json({
      ok: true,
      ...uploaded,
      summary: getStorageStatusSummary(),
    });
  } catch (error) {
    console.error("[API][/api/media][POST]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Media operation failed",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id parameter" }, { status: 400 });
    }
    const deleted = deleteUploadedMedia(id);
    return NextResponse.json({
      ok: true,
      deleted,
      summary: getStorageStatusSummary(),
    });
  } catch (error) {
    console.error("[API][/api/media][DELETE]", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete media file" },
      { status: 500 },
    );
  }
}
