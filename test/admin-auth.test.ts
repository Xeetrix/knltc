import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyAdminCredentials } from "@/lib/admin-auth";

const ORIGINAL_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = ORIGINAL_ENV.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ORIGINAL_ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});

describe("verifyAdminCredentials", () => {
  it("uses Supabase Auth password flow and returns the authenticated user", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { id: "auth-id", email: "work.xeetrix@gmail.com" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyAdminCredentials("work.xeetrix@gmail.com", "KNLTC2026-1M")).resolves.toEqual({
      user: {
        id: "auth-id",
        email: "work.xeetrix@gmail.com",
      },
      debug: {
        supabaseUrl: "https://example.supabase.co",
        reachedSupabase: true,
        status: 200,
        error: null,
      },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns null when Supabase rejects credentials", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "invalid_grant" }),
      }),
    );

    await expect(verifyAdminCredentials(" work.xeetrix@gmail.com ", "wrong")).resolves.toEqual({
      user: null,
      debug: {
        supabaseUrl: "https://example.supabase.co",
        reachedSupabase: true,
        status: 400,
        error: "invalid_grant",
      },
    });
  });
});
