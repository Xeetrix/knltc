import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    let email = "";
    let password = "";
    try {
      const body = (await request.json()) as { email?: unknown; password?: unknown };
      email = typeof body.email === "string" ? body.email : "";
      password = typeof body.password === "string" ? body.password : "";
    } catch {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          debug: {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
            reachedSupabase: false,
            status: null,
            error: "invalid_json_request_body",
          },
        },
        { status: 401 },
      );
    }

    const { user, debug } = await verifyAdminCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          debug,
        },
        { status: 401 },
      );
    }

    try {
      await createAdminSession(user.email);
      return NextResponse.json({ ok: true });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          debug: {
            ...debug,
            error: error instanceof Error ? error.message : "session_creation_failed",
          },
        },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid credentials",
        debug: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
          reachedSupabase: false,
          status: null,
          error: error instanceof Error ? error.message : "unhandled_admin_login_error",
        },
      },
      { status: 401 },
    );
  }
}
