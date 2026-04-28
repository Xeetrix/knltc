import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let email = "";
  let password = "";

  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body",
        code: "invalid_json_request_body",
      },
      { status: 400 },
    );
  }

  try {
    const { user, error } = await verifyAdminCredentials(email, password);
    if (!user) {
      const isConfigError = error === "admin_credentials_not_configured";

      return NextResponse.json(
        {
          error: isConfigError ? "Admin login is not configured" : "Invalid credentials",
          code: error ?? "invalid_credentials",
        },
        { status: isConfigError ? 503 : 401 },
      );
    }

    try {
      await createAdminSession(user.email);
    } catch {
      return NextResponse.json(
        {
          error: "Admin session is not configured",
          code: "admin_session_secret_missing",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to complete admin login",
        code: "admin_login_unavailable",
      },
      { status: 503 },
    );
  }
}
