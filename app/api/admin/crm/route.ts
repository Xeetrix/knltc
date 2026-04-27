import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { createCrmLead, updateCrmLead } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const lead = await createCrmLead(payload);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to create lead");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id, status, notes } = await request.json();
    const lead = await updateCrmLead(id, { status, notes });
    return NextResponse.json({ lead });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to update lead");
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
