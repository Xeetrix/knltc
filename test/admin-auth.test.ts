import { afterEach, describe, expect, it } from "vitest";
import { verifyAdminCredentials } from "@/lib/admin-auth";

const ORIGINAL_ENV = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

afterEach(() => {
  process.env.ADMIN_EMAIL = ORIGINAL_ENV.ADMIN_EMAIL;
  process.env.ADMIN_PASSWORD_HASH = ORIGINAL_ENV.ADMIN_PASSWORD_HASH;
  process.env.ADMIN_PASSWORD = ORIGINAL_ENV.ADMIN_PASSWORD;
});

describe("verifyAdminCredentials", () => {
  it("accepts the configured admin credentials", () => {
    process.env.ADMIN_EMAIL = "work.xeetrix@gmail.com";
    process.env.ADMIN_PASSWORD_HASH =
      "scrypt$5cd2e641508e7134deca8207a9c1ef42$41a1cb1fbce15cdfa726db4c8116a07915ea8f7296b7f8e36f900dd85bb506f6fdc62961eff5b52744b45ab38c5e84f58999b4ad662d4f1af0267539963e0eb3";
    delete process.env.ADMIN_PASSWORD;

    expect(verifyAdminCredentials("work.xeetrix@gmail.com", "KNLTC2026-1M")).toBe(true);
  });

  it("normalizes email input and configured email", () => {
    process.env.ADMIN_EMAIL = " Work.Xeetrix@Gmail.com ";
    process.env.ADMIN_PASSWORD_HASH =
      "scrypt$5cd2e641508e7134deca8207a9c1ef42$41a1cb1fbce15cdfa726db4c8116a07915ea8f7296b7f8e36f900dd85bb506f6fdc62961eff5b52744b45ab38c5e84f58999b4ad662d4f1af0267539963e0eb3";
    delete process.env.ADMIN_PASSWORD;

    expect(verifyAdminCredentials(" work.xeetrix@gmail.com ", "KNLTC2026-1M")).toBe(true);
  });
});
