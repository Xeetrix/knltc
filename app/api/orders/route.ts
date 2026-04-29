import { NextResponse } from "next/server";
import { z } from "zod";
import { createCrmLead, createOrder, createOrderItem } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

const orderSchema = z.object({
  customer_name: z.string().trim().min(2),
  customer_phone: z.string().trim().min(6),
  customer_email: z.string().email().optional().nullable(),
  customer_address: z.string().trim().min(5),
  customer_note: z.string().optional().nullable(),
  delivery_area: z.enum(["inside_dhaka", "outside_dhaka"]),
  delivery_charge: z.number().nonnegative(),
  grand_total: z.number().nonnegative(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const payload = orderSchema.parse(await request.json());
    const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await createOrder({
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email ?? null,
      customer_address: payload.customer_address,
      customer_note: payload.customer_note ?? null,
      total_amount: total,
      delivery_area: payload.delivery_area,
      delivery_charge: payload.delivery_charge,
      grand_total: payload.grand_total,
      status: "pending",
    });

    for (const item of payload.items) {
      await createOrderItem({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      });
    }

    await createCrmLead({
      name: payload.customer_name,
      phone: payload.customer_phone,
      email: payload.customer_email ?? null,
      source: "checkout",
      interest: "Store order",
      message: payload.customer_note ?? null,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to create order");
    return NextResponse.json({ error: errorResponse.error, issue: errorResponse.issue }, { status: errorResponse.status });
  }
}
