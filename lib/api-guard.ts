import { NextResponse } from "next/server";
import { getAdminSession, type UserRole } from "./admin-auth";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in.", code: "unauthorized" },
      { status: 401 }
    );
  }
  return null;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in.", code: "unauthorized" },
      { status: 401 }
    );
  }
  if (!allowedRoles.includes(session.role) && session.role !== "MAIN_ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: insufficient permissions for this action.", code: "forbidden" },
      { status: 403 }
    );
  }
  return null;
}

