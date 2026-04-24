import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyAdminCredentials } from "@/lib/admin-auth";

const ORIGINAL_ENV = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  process.env.ADMIN_EMAIL = ORIGINAL_ENV.ADMIN_EMAIL;
  process.env.ADMIN_PASSWORD = ORIGINAL_ENV.ADMIN_PASSWORD;
});

describe("verifyAdminCredentials", () => {
  it("returns the admin user when env credentials match", async () => {
    process.env.ADMIN_EMAIL = "work.xeetrix@gmail.com";
    process.env.ADMIN_PASSWORD = "KNLTC2026-1M";

    await expect(verifyAdminCredentials("work.xeetrix@gmail.com", "KNLTC2026-1M")).resolves.toEqual({
      user: {
        id: "admin:work.xeetrix@gmail.com",
        email: "work.xeetrix@gmail.com",
      },
      error: null,
    });
  });

  it("returns invalid_credentials when credentials do not match", async () => {
    process.env.ADMIN_EMAIL = "work.xeetrix@gmail.com";
    process.env.ADMIN_PASSWORD = "KNLTC2026-1M";

    await expect(verifyAdminCredentials(" work.xeetrix@gmail.com ", "wrong")).resolves.toEqual({
      user: null,
      error: "invalid_credentials",
    });
  });

  it("returns a configuration error when admin env vars are missing", async () => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;

    await expect(verifyAdminCredentials("work.xeetrix@gmail.com", "KNLTC2026-1M")).resolves.toEqual({
      user: null,
      error: "admin_credentials_not_configured",
    });
  });
});
