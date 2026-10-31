import { NextResponse } from "next/server";
import { uploadFileToDriveOrCloudinary } from "@/lib/google-sheets-db";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Unsupported image format. Please use JPG, PNG, WEBP, GIF, or SVG." },
        { status: 400 },
      );
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image is too large. Maximum allowed file size is 15MB." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await uploadFileToDriveOrCloudinary({
      fileName: file.name,
      mimeType: file.type || "image/jpeg",
      buffer,
      folderName: "KNLTC_Blog_Images",
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
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
