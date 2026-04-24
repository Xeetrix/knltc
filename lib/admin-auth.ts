import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "knltc_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  email: string;
  exp: number;
};

type VerifyAdminCredentialsResult = {
  user: { id: string; email: string } | null;
  error: string | null;
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

function normalizeCredential(value: string) {
  return value.trim();
}

function equalsSafe(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
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

export async function verifyAdminCredentials(email: string, password: string): Promise<VerifyAdminCredentialsResult> {
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredEmail || !configuredPassword) {
    return {
      user: null,
      error: "admin_credentials_not_configured",
    };
  }

  const normalizedInputEmail = normalizeCredential(email).toLowerCase();
  const normalizedConfiguredEmail = normalizeCredential(configuredEmail).toLowerCase();
  const normalizedInputPassword = normalizeCredential(password);

  if (!normalizedInputEmail || !normalizedInputPassword) {
    return {
      user: null,
      error: "missing_email_or_password",
    };
  }

  const emailMatched = equalsSafe(normalizedInputEmail, normalizedConfiguredEmail);
  const passwordMatched = equalsSafe(normalizedInputPassword, configuredPassword);

  if (!emailMatched || !passwordMatched) {
    return {
      user: null,
      error: "invalid_credentials",
    };
  }

  return {
    user: {
      id: `admin:${normalizedConfiguredEmail}`,
      email: normalizedConfiguredEmail,
    },
    error: null,
  };
}

export const adminCookieName = ADMIN_COOKIE;
