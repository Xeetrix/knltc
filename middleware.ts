import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

function verifyToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const [data, signature] = token.split(".");
  if (!data || !signature) return false;

  const expected = createHmac("sha256", secret).update(data).digest("hex");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);

  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;

  const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as { exp?: number };
  return Boolean(payload.exp && payload.exp > Math.floor(Date.now() / 1000));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  if (!isAdminRoute || isLogin) return NextResponse.next();

  const token = request.cookies.get("knltc_admin_session")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
