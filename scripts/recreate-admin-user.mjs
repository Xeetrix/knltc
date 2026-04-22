#!/usr/bin/env node

const email = "work.xeetrix@gmail.com";
const password = "KNLTC2026-1M";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

async function adminRequest(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${txt}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function getUsersByEmail(targetEmail) {
  const data = await adminRequest(`/auth/v1/admin/users?email=${encodeURIComponent(targetEmail)}`);
  return Array.isArray(data?.users) ? data.users : [];
}

async function deleteUser(userId) {
  await adminRequest(`/auth/v1/admin/users/${userId}`, { method: "DELETE" });
}

async function createUser() {
  return adminRequest("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });
}

async function checkCustomAdminTable() {
  const candidates = ["admin_users", "admins", "profiles"];

  for (const table of candidates) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });

    if (res.ok) {
      return table;
    }
  }

  return null;
}

async function main() {
  const existing = await getUsersByEmail(email);
  for (const user of existing) {
    await deleteUser(user.id);
  }

  const created = await createUser();
  const customAdminTable = await checkCustomAdminTable();

  console.log(
    JSON.stringify(
      {
        deletedUsers: existing.map((user) => user.id),
        createdUserId: created?.id ?? null,
        createdEmail: created?.email ?? null,
        customAdminTable,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
