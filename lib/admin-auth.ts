import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

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
  exp: number;
};

export type VerifyAdminCredentialsResult = {
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    branch: BranchCode;
  } | null;
  error: string | null;
};

// Preset Team Accounts for KNLTC Enterprise Roles
export const KNLT_ROLE_ACCOUNTS: Record<
  string,
  { role: UserRole; name: string; branch: BranchCode; defaultEmail: string }
> = {
  "admin@knltc.com": {
    role: "MAIN_ADMIN",
    name: "শেখ বাসেত (ব্যবস্থাপনা পরিচালক)",
    branch: "ALL",
    defaultEmail: "admin@knltc.com",
  },
  "baset@knltc.com": {
    role: "MAIN_ADMIN",
    name: "শেখ বাসেত (Super Admin)",
    branch: "ALL",
    defaultEmail: "baset@knltc.com",
  },
  "dhaka@knltc.com": {
    role: "BRANCH_ADMIN",
    name: "তানভীর আহমেদ (ঢাকা শাখা প্রধান)",
    branch: "DHK-HQ",
    defaultEmail: "dhaka@knltc.com",
  },
  "khulna@knltc.com": {
    role: "BRANCH_ADMIN",
    name: "মুসা ইব্রাহিম (খুলনা শাখা ব্যবস্থাপক)",
    branch: "KHULNA-01",
    defaultEmail: "khulna@knltc.com",
  },
  "counselor@knltc.com": {
    role: "TELE_COUNSELOR",
    name: "নাসরিন সুলতানা (টেলি-কাউন্সেলর)",
    branch: "DHK-HQ",
    defaultEmail: "counselor@knltc.com",
  },
  "tele@knltc.com": {
    role: "TELE_COUNSELOR",
    name: "নাসরিন সুলতানা (টেলি-কাউন্সেলর)",
    branch: "DHK-HQ",
    defaultEmail: "tele@knltc.com",
  },
  "sensei@knltc.com": {
    role: "TEACHER",
    name: "আমির হোসেন (সিনিয়র সেন্সি)",
    branch: "ALL",
    defaultEmail: "sensei@knltc.com",
  },
  "amir@knltc.com": {
    role: "TEACHER",
    name: "আমির হোসেন (সিনিয়র সেন্সি)",
    branch: "ALL",
    defaultEmail: "amir@knltc.com",
  },
  "b2b@knltc.com": {
    role: "B2B_AGENT",
    name: "নেক্সাস গ্লোবাল (ক্যাম্পাস অ্যাম্বাসেডর)",
    branch: "ALL",
    defaultEmail: "b2b@knltc.com",
  },
  "nexus@knltc.com": {
    role: "B2B_AGENT",
    name: "Nexus Group BD",
    branch: "ALL",
    defaultEmail: "nexus@knltc.com",
  },
  "investor@knltc.com": {
    role: "INVESTOR",
    name: "ইমরান হাসেম (১০ লক্ষ টাকার বিনিয়োগকারী)",
    branch: "ALL",
    defaultEmail: "investor@knltc.com",
  },
  "student@knltc.com": {
    role: "STUDENT",
    name: "রাকিবুল ইসলাম (ভিসা প্রার্থী)",
    branch: "DHK-HQ",
    defaultEmail: "student@knltc.com",
  },
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
  name: string = "শেখ বাসেত (ব্যবস্থাপনা পরিচালক)",
  branch: BranchCode = "ALL",
) {
  const payload: SessionPayload = {
    email,
    role,
    name,
    branch,
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

export async function verifyAdminCredentials(
  email: string,
  password: string,
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

  // Check if matches configured master admin
  const isMasterAdminEmail = equalsSafe(normalizedInputEmail, normalizedConfiguredEmail);
  const isConfiguredPassword = equalsSafe(normalizedInputPassword, configuredPassword);

  if (isMasterAdminEmail && isConfiguredPassword) {
    return {
      user: {
        id: `admin:${normalizedConfiguredEmail}`,
        email: normalizedConfiguredEmail,
        role: "MAIN_ADMIN",
        name: "শেখ বাসেত (ব্যবস্থাপনা পরিচালক)",
        branch: "ALL",
      },
      error: null,
    };
  }

  // Check if matches any of the registered team role accounts
  const roleAccount = KNLT_ROLE_ACCOUNTS[normalizedInputEmail];
  if (roleAccount) {
    // Allows password either configuredPassword or "admin123"
    const isPasswordValid =
      equalsSafe(normalizedInputPassword, configuredPassword) ||
      equalsSafe(normalizedInputPassword, "admin123");

    if (isPasswordValid) {
      return {
        user: {
          id: `user:${roleAccount.defaultEmail}`,
          email: roleAccount.defaultEmail,
          role: roleAccount.role,
          name: roleAccount.name,
          branch: roleAccount.branch,
        },
        error: null,
      };
    }
  }

  return {
    user: null,
    error: "invalid_credentials",
  };
}

export const adminCookieName = ADMIN_COOKIE;
