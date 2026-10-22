import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { uploadToStorage } from "@/lib/supabase";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const bucketName = "knltc-documents";

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const applicantTrackingNo = formData.get("trackingNo") || "general";
    const documentType = formData.get("docType") || "document";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxFileSize = 15 * 1024 * 1024; // 15MB for PDF/Documents
    const acceptedMimeTypes = new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);

    if (!acceptedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported document format. Please upload PDF, Word document, or image (JPG/PNG)." },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "File size exceeds 15MB limit. Please compress and re-upload." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "pdf";
    const fileName = `${applicantTrackingNo}_${documentType}_${randomUUID().slice(0, 8)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const url = await uploadToStorage(fileName, arrayBuffer, file.type, bucketName);
    return NextResponse.json({ ok: true, url, fileName });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Document upload failed");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
