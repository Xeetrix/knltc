import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { listStorageFiles } from "@/lib/supabase";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const items = await listStorageFiles("blog-images");
    return NextResponse.json({ items });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to list blog images");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
