import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function base64UrlToUtf8(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }

  return mismatch === 0;
}

async function sign(data: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const [data, signature] = token.split(".");
  if (!data || !signature) return false;

  const expected = await sign(data, secret);
  if (!timingSafeEqual(signature, expected)) return false;

  const payload = JSON.parse(base64UrlToUtf8(data)) as { exp?: number };
  return Boolean(payload.exp && payload.exp > Math.floor(Date.now() / 1000));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  if (!isAdminRoute || isLogin) return NextResponse.next();

  const token = request.cookies.get("knltc_admin_session")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
