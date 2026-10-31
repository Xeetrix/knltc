import { NextResponse } from "next/server";
import { uploadFileToDriveOrCloudinary } from "@/lib/google-sheets-db";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  let folderName = process.env.SUPABASE_STORAGE_BUCKET || "KNLTC_Admin_Media";

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxFileSize = 15 * 1024 * 1024; // 15 MB
    const acceptedMimeTypes = new Set([
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "application/pdf",
    ]);

    if (file.type && !acceptedMimeTypes.has(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Unsupported format. Please use JPG, PNG, WEBP, GIF, SVG, or PDF." },
        { status: 400 },
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "File is too large. Maximum allowed file size is 15MB." },
        { status: 400 },
      );
    }

    const requestBucket = formData.get("bucket") || formData.get("folderName");
    if (typeof requestBucket === "string" && requestBucket.trim()) {
      folderName = requestBucket.trim();
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await uploadFileToDriveOrCloudinary({
      fileName: file.name,
      mimeType: file.type || "image/jpeg",
      buffer,
      folderName,
    });

    return NextResponse.json({
      ok: true,
      url: uploaded.url,
      downloadUrl: uploaded.downloadUrl,
      driveUrl: uploaded.driveUrl,
      fileId: uploaded.fileId,
      provider: uploaded.provider,
    });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Upload failed");
    console.error("[API][upload][POST]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
