import { NextResponse } from "next/server";
import { z } from "zod";
import { createCrmLead } from "@/lib/cms";
import { toAdminErrorResponse } from "@/lib/admin-api-error";

const sswLeadSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  visa_interest: z.enum(["Agriculture", "Caregiver"]),
  japanese_level: z.enum(["N5", "N4", "N3+", "Not started"]),
  skill_certificate: z.enum(["Yes", "No", "Preparing"]),
  message: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = sswLeadSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const details = [
      `Visa interest: ${result.data.visa_interest}`,
      `Japanese level: ${result.data.japanese_level}`,
      `Skill certificate: ${result.data.skill_certificate}`,
      result.data.message ? `Message: ${result.data.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await createCrmLead({
      name: result.data.name,
      phone: result.data.phone,
      email: null,
      source: "SSW Visa Landing Page",
      interest: result.data.visa_interest,
      message: details,
      status: "new",
    });

    return NextResponse.json({ success: true, message: "Lead submitted successfully." }, { status: 200 });
  } catch (error) {
    const errorResponse = toAdminErrorResponse(error, "Failed to submit SSW visa lead");
    return NextResponse.json({ success: false, error: errorResponse.error, issue: errorResponse.issue }, { status: errorResponse.status });
  }
}
