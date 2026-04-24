import { NextResponse } from "next/server";

export async function requireAdmin() {
  // TODO: Re-enable admin authentication before production use
  // Temporary development bypass so admin API routes can be used without login.
  return null as NextResponse<unknown> | null;
}
