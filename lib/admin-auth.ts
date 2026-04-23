import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "knltc_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is missing.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function encode(payload: SessionPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(data);
  return `${data}.${signature}`;
}

function decode(token: string): SessionPayload | null {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = sign(data);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export async function createAdminSession(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const token = encode(payload);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return Boolean(decode(token));
}

type AuthUser = {
  id: string;
  email: string;
};

type AdminAuthDebug = {
  supabaseUrl: string;
  reachedSupabase: boolean;
  status: number | null;
  error: string | null;
};

type VerifyAdminCredentialsResult = {
  user: AuthUser | null;
  debug: AdminAuthDebug;
};

function getSupabaseAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const errors: string[] = [];

  if (!url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is missing");
  } else {
    try {
      new URL(url);
    } catch {
      errors.push("NEXT_PUBLIC_SUPABASE_URL is malformed");
    }
  }

  if (!anonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
  }

  return {
    url: url ?? "",
    anonKey: anonKey ?? "",
    error: errors.length ? errors.join("; ") : null,
  };
}

async function safeReadJson(response: Response): Promise<{
  json: Record<string, unknown> | null;
  error: string | null;
}> {
  try {
    const text = await response.text();
    if (!text) {
      return { json: null, error: "empty_response_body" };
    }

    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      return { json: parsed, error: null };
    } catch {
      return { json: null, error: "non_json_response_body" };
    }
  } catch (error) {
    return {
      json: null,
      error: error instanceof Error ? error.message : "failed_to_read_response_body",
    };
  }
}

export async function verifyAdminCredentials(email: string, password: string): Promise<VerifyAdminCredentialsResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const { url, anonKey, error: configError } = getSupabaseAuthConfig();
  const debug: AdminAuthDebug = {
    supabaseUrl: url,
    reachedSupabase: false,
    status: null,
    error: null,
  };

  if (configError) {
    debug.error = configError;
    console.error("[admin-auth] Invalid Supabase configuration.", debug);
    return { user: null, debug };
  }

  if (!normalizedEmail || !password) {
    debug.error = "missing_email_or_password";
    console.error("[admin-auth] Missing email or password.", debug);
    return { user: null, debug };
  }

  console.log("[admin-auth] Supabase URL used for admin login:", debug.supabaseUrl);

  let res: Response;
  try {
    res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
      cache: "no-store",
    });
    debug.reachedSupabase = true;
    debug.status = res.status;
    console.log("[admin-auth] Supabase /auth/v1/token response status:", debug.status);
  } catch (error) {
    debug.error = error instanceof Error ? error.message : "fetch_failed";
    console.error("[admin-auth] Request did not reach Supabase.", debug);
    return { user: null, debug };
  }

  if (!res.ok) {
    const { json: errorPayload, error: jsonError } = await safeReadJson(res);
    debug.error =
      (typeof errorPayload?.error === "string" ? errorPayload.error : null) ??
      (typeof errorPayload?.error_description === "string" ? errorPayload.error_description : null) ??
      jsonError ??
      "unknown_supabase_auth_error";
    console.error("[admin-auth] Supabase auth error:", debug.error);
    return { user: null, debug };
  }

  const { json: data, error: successJsonError } = await safeReadJson(res);
  if (!data) {
    debug.error = successJsonError ?? "missing_response_body";
    console.error("[admin-auth] Could not parse successful Supabase auth response.", debug);
    return { user: null, debug };
  }

  const user = data.user as { id?: string; email?: string } | undefined;
  const authEmail = user?.email?.trim().toLowerCase();
  const authId = user?.id;
  if (!authId || !authEmail) {
    debug.error = "missing_user_data_in_supabase_response";
    console.error("[admin-auth] Supabase returned success without complete user payload.", debug);
    return { user: null, debug };
  }

  return { user: { id: authId, email: authEmail }, debug };
}

export const adminCookieName = ADMIN_COOKIE;
