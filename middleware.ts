import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // TODO: Re-enable admin authentication before production use
  // Temporary development bypass so admin routes are accessible without login.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
