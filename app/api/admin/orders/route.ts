import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-guard";
import { updateOrderStatus } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

const updateOrderSchema = z.object({
  id: z.string().trim().min(1, "Order id is required"),
  status: z.enum(["pending", "confirmed", "processing", "delivered", "cancelled"]),
});

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id, status } = updateOrderSchema.parse(await request.json());
    const order = await updateOrderStatus(id, status);
    return NextResponse.json({ order });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to update order status");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
