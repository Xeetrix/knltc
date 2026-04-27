import { NextResponse } from "next/server";
import { z } from "zod";
import { createCrmLead } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  interest: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = contactSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    await createCrmLead({
      name: result.data.name,
      phone: result.data.phone,
      email: null,
      source: "contact form",
      interest: result.data.interest || null,
      message: result.data.message || null,
    });

    return NextResponse.json({ success: true, message: "Request received successfully." }, { status: 200 });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to submit contact request");
    return NextResponse.json({ success: false, error: errorResponse.error, issue: errorResponse.issue }, { status: errorResponse.status });
  }
}
