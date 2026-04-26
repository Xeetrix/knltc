import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { uploadToStorage } from "@/lib/supabase";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${randomUUID()}.${ext}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "knltc-media";
    const arrayBuffer = await file.arrayBuffer();

    const url = await uploadToStorage(fileName, arrayBuffer, file.type, bucket);
    return NextResponse.json({ url });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Upload failed");
    console.error("[API][upload][POST]", errorResponse);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
