import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";
import type { SystemUserAccount } from "@/lib/knltc-cms-store";

export async function POST(request: Request) {
  let email = "";
  let password = "";
  let clientAccounts: SystemUserAccount[] | undefined = undefined;

  try {
    const body = (await request.json()) as {
      email?: unknown;
      password?: unknown;
      clientAccounts?: unknown;
    };
    email = typeof body.email === "string" ? body.email : "";
    password = typeof body.password === "string" ? body.password : "";
    if (Array.isArray(body.clientAccounts)) {
      clientAccounts = body.clientAccounts as SystemUserAccount[];
    }
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
    const { user, error } = await verifyAdminCredentials(email, password, clientAccounts);
    if (!user) {
      const isConfigError = error === "admin_credentials_not_configured";

      return NextResponse.json(
        {
          error:
            isConfigError
              ? "Admin login is not configured"
              : error && error !== "invalid_credentials"
                ? error
                : "লগইন তথ্য সঠিক নয়। মেইন অ্যাডমিন থেকে প্রদত্ত ইমেইল/আইডি ও পাসওয়ার্ড ব্যবহার করুন।",
          code: error ?? "invalid_credentials",
        },
        { status: isConfigError ? 503 : 401 },
      );
    }

    try {
      await createAdminSession(
        user.email,
        user.role,
        user.name,
        user.branch,
        user.allowedTabs,
        user.linkedLeadId,
      );
    } catch {
      return NextResponse.json(
        {
          error: "Admin session is not configured",
          code: "admin_session_secret_missing",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        branch: user.branch,
        allowedTabs: user.allowedTabs,
        linkedLeadId: user.linkedLeadId,
      },
    });
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

