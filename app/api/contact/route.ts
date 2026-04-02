import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  interest: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const result = contactSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Request received successfully." }, { status: 200 });
}
