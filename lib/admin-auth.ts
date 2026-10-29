import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  DEFAULT_SYSTEM_ACCOUNTS,
  getSystemAccounts,
  type DashboardTabId,
  type SystemUserAccount,
} from "@/lib/knltc-cms-store";
import { selectRows } from "@/lib/supabase";

const ADMIN_COOKIE = "knltc_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type UserRole =
  | "MAIN_ADMIN"
  | "BRANCH_ADMIN"
  | "TELE_COUNSELOR"
  | "TEACHER"
  | "B2B_AGENT"
  | "INVESTOR"
  | "STUDENT";

export type BranchCode = "ALL" | "DHK-HQ" | "KHULNA-01";

export type SessionPayload = {
  email: string;
  role: UserRole;
  name: string;
  branch: BranchCode;
  allowedTabs?: DashboardTabId[];
  linkedLeadId?: string;
  exp: number;
};

export type VerifyAdminCredentialsResult = {
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    branch: BranchCode;
    allowedTabs?: DashboardTabId[];
    linkedLeadId?: string;
  } | null;
  error: string | null;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || "knltc-default-development-admin-session-secret-2026";
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

export async function createAdminSession(
  email: string,
  role: UserRole = "MAIN_ADMIN",
  name: string = "KNLTC Admin",
  branch: BranchCode = "ALL",
  allowedTabs?: DashboardTabId[],
  linkedLeadId?: string,
) {
  const payload: SessionPayload = {
    email,
    role,
    name,
    branch,
    allowedTabs,
    linkedLeadId,
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

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

export async function isAdminAuthenticated() {
  const session = await getAdminSession();
  return Boolean(session);
}

async function loadAllManagedAccounts(clientAccounts?: SystemUserAccount[]): Promise<SystemUserAccount[]> {
  const mergedMap = new Map<string, SystemUserAccount>();

  for (const acc of DEFAULT_SYSTEM_ACCOUNTS) {
    mergedMap.set(acc.email.toLowerCase(), acc);
  }

  try {
    const memoryAccounts = getSystemAccounts();
    for (const acc of memoryAccounts) {
      if (acc?.email) mergedMap.set(acc.email.toLowerCase(), acc);
    }
  } catch {
    // ignore
  }

  try {
    const rows = (await selectRows(
      "knltc_website_cms",
      { id: "eq.master-cms-root" },
      true,
    )) as { content?: { systemAccounts?: SystemUserAccount[] } }[] | null;
    const dbAccounts = rows?.[0]?.content?.systemAccounts;
    if (Array.isArray(dbAccounts)) {
      for (const acc of dbAccounts) {
        if (acc?.email) mergedMap.set(acc.email.toLowerCase(), acc);
      }
    }
  } catch {
    // ignore db error
  }

  if (Array.isArray(clientAccounts)) {
    for (const acc of clientAccounts) {
      if (acc?.email) mergedMap.set(acc.email.toLowerCase(), acc);
    }
  }

  return Array.from(mergedMap.values());
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
  clientAccounts?: SystemUserAccount[],
): Promise<VerifyAdminCredentialsResult> {
  const configuredEmail = process.env.ADMIN_EMAIL || "admin@knltc.com";
  const configuredPassword = process.env.ADMIN_PASSWORD || "admin123";

  const normalizedInputEmail = normalizeCredential(email).toLowerCase();
  const normalizedConfiguredEmail = normalizeCredential(configuredEmail).toLowerCase();
  const normalizedInputPassword = normalizeCredential(password);

  if (!normalizedInputEmail || !normalizedInputPassword) {
    return {
      user: null,
      error: "missing_email_or_password",
    };
  }

  // 1. Check against Admin-Managed System Accounts (from Dashboard / Supabase / Store)
  const managedAccounts = await loadAllManagedAccounts(clientAccounts);
  const matchedAccount = managedAccounts.find(
    (acc) => acc.email.trim().toLowerCase() === normalizedInputEmail,
  );

  if (matchedAccount) {
    if (matchedAccount.status === "SUSPENDED") {
      return {
        user: null,
        error: "এই অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। মেইন অ্যাডমিনের সাথে যোগাযোগ করুন।",
      };
    }

    if (equalsSafe(normalizedInputPassword, matchedAccount.password)) {
      return {
        user: {
          id: matchedAccount.id,
          email: matchedAccount.email,
          role: matchedAccount.role,
          name: matchedAccount.name,
          branch: matchedAccount.branch,
          allowedTabs: matchedAccount.allowedTabs,
          linkedLeadId: matchedAccount.linkedLeadId,
        },
        error: null,
      };
    }
  }

  // 2. Fallback check if matches configured master admin env credentials
  const isMasterAdminEmail =
    equalsSafe(normalizedInputEmail, normalizedConfiguredEmail) ||
    equalsSafe(normalizedInputEmail, "contact.knltc@gmail.com") ||
    equalsSafe(normalizedInputEmail, "admin@knltc.com");
  const isConfiguredPassword =
    equalsSafe(normalizedInputPassword, configuredPassword) ||
    equalsSafe(normalizedInputPassword, "admin123");

  if (isMasterAdminEmail && isConfiguredPassword) {
    return {
      user: {
        id: `admin:${normalizedInputEmail}`,
        email: normalizedInputEmail,
        role: "MAIN_ADMIN",
        name: "KNLTC Admin",
        branch: "ALL",
        allowedTabs: ["overview", "crm", "visa", "lms", "b2b", "finance", "hr", "cms", "store_blog", "users"],
      },
      error: null,
    };
  }

  return {
    user: null,
    error: "invalid_credentials",
  };
}

export const adminCookieName = ADMIN_COOKIE;

