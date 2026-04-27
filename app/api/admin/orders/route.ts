import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { updateOrderStatus } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id, status } = await request.json();
    const order = await updateOrderStatus(id, status);
    return NextResponse.json({ order });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to update order status");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
