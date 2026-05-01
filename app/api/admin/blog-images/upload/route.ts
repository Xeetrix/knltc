import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { toAdminErrorResponse } from "@/lib/admin-api-error";
import { uploadToStorage } from "@/lib/supabase";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const accepted = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
    if (!accepted.has(file.type)) return NextResponse.json({ error: "Unsupported image format. Please use JPG, JPEG, PNG, or WEBP." }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image is too large. Maximum allowed file size is 5MB." }, { status: 400 });

    const ext = file.name.split(".").pop() || "jpg";
    const url = await uploadToStorage(`${randomUUID()}.${ext}`, await file.arrayBuffer(), file.type, "blog-images");
    return NextResponse.json({ url });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Upload failed");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
