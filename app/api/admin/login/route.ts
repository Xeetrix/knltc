import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await verifyAdminCredentials(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession(user.email);
  return NextResponse.json({ ok: true });
}
