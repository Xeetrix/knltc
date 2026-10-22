import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import {
  getAdminSummary,
  getAllAdminOrders,
  getAllAdminPosts,
  getAllAdminProducts,
  getAllCrmLeads,
  getCategories,
  getPendingAdminReviews,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const [summary, products, posts, categories, ordersResult, reviews, crmLeads] = await Promise.all([
      getAdminSummary(),
      getAllAdminProducts(),
      getAllAdminPosts(),
      getCategories(),
      getAllAdminOrders(),
      getPendingAdminReviews(),
      getAllCrmLeads(),
    ]);

    return NextResponse.json({
      ok: true,
      summary,
      products,
      posts,
      categories,
      orders: ordersResult.orders,
      ordersWarning: ordersResult.setupWarning,
      reviews,
      crmLeads,
    });
  } catch (error) {
    console.error("[API][admin/bundle][GET]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to load admin bundle" },
      { status: 500 }
    );
  }
}
