import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { uploadToStorage } from "@/lib/supabase";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let bucketName = process.env.SUPABASE_STORAGE_BUCKET || "knltc-media";

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxFileSize = 5 * 1024 * 1024;
    const acceptedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

    if (!acceptedMimeTypes.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image format. Please use JPG, JPEG, PNG, or WEBP." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: "Image is too large. Maximum allowed file size is 5MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${randomUUID()}.${ext}`;
    const requestBucket = formData.get("bucket");
    bucketName = typeof requestBucket === "string" && requestBucket.trim() ? requestBucket.trim() : bucketName;
    const arrayBuffer = await file.arrayBuffer();

    const url = await uploadToStorage(fileName, arrayBuffer, file.type, bucketName);
    return NextResponse.json({ url });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Upload failed");
    if (
      errorResponse.status === 400 &&
      errorResponse.error.toLowerCase().includes("bucket") &&
      errorResponse.error.toLowerCase().includes("not found")
    ) {
      errorResponse.error = `Supabase bucket "${bucketName}" does not exist. Please create it first.`;
    }
    console.error("[API][upload][POST]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
