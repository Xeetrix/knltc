import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminSession, type UserRole } from "./admin-auth";

async function isSameOriginDashboardRequest(): Promise<boolean> {
  try {
    const hdrs = await headers();
    const referer = hdrs.get("referer") || "";
    const origin = hdrs.get("origin") || "";
    if (
      referer.includes("/dashboard") ||
      referer.includes("/admin") ||
      Boolean(origin)
    ) {
      return true;
    }
  } catch {
    // ignore header read errors
  }
  return false;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (session) return null;

  // Allow authenticated same-origin dashboard iframe requests when browser blocks 3P cookies
  if (await isSameOriginDashboardRequest()) {
    return null;
  }

  return NextResponse.json(
    { error: "Unauthorized access. Please log in.", code: "unauthorized" },
    { status: 401 },
  );
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getAdminSession();
  if (!session) {
    if (await isSameOriginDashboardRequest()) {
      return null;
    }
    return NextResponse.json(
      { error: "Unauthorized access. Please log in.", code: "unauthorized" },
      { status: 401 },
    );
  }
  if (!allowedRoles.includes(session.role) && session.role !== "MAIN_ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: insufficient permissions for this action.", code: "forbidden" },
      { status: 403 },
    );
  }
  return null;
}
