import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "knltc_admin_session";
const ADMIN_LOGIN_PATH = "/admin/login";

function hexFromBytes(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function parseHex(hex: string) {
  if (hex.length % 2 !== 0) return null;

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < hex.length; index += 2) {
    const chunk = hex.slice(index, index + 2);
    const value = Number.parseInt(chunk, 16);

    if (Number.isNaN(value)) return null;
    bytes[index / 2] = value;
  }

  return bytes;
}

function decodeBase64Url(data: string) {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  try {
    const binary = atob(padded);
    return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
  } catch {
    return null;
  }
}

async function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const [data, signature] = token.split(".");
  if (!data || !signature) return false;

  try {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["sign"],
    );

    const expectedSignature = hexFromBytes(new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data))));
    const providedSignature = parseHex(signature);
    const expectedSignatureBytes = parseHex(expectedSignature);

    if (!providedSignature || !expectedSignatureBytes || providedSignature.length !== expectedSignatureBytes.length) {
      return false;
    }

    let mismatch = 0;
    for (let index = 0; index < providedSignature.length; index += 1) {
      mismatch |= providedSignature[index] ^ expectedSignatureBytes[index];
    }
    if (mismatch !== 0) {
      return false;
    }

    const payloadString = decodeBase64Url(data);
    if (!payloadString) return false;

    const payload = JSON.parse(payloadString) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ADMIN_LOGIN_PATH) {
    const loggedIn = await hasValidAdminSession(request);
    if (loggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  const loggedIn = await hasValidAdminSession(request);
  if (loggedIn) {
    return NextResponse.next();
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
