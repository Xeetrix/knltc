type QueryParams = Record<string, string | number | boolean | null | undefined>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getBaseUrl() {
  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  return supabaseUrl;
}

function buildQuery(params?: QueryParams) {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    search.set(key, String(value));
  });
  const output = search.toString();
  return output ? `?${output}` : "";
}

async function restRequest(path: string, init: RequestInit = {}, admin = false) {
  const key = admin ? serviceKey : anonKey;
  if (!key) throw new Error(admin ? "SUPABASE_SERVICE_ROLE_KEY is missing." : "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");

  const res = await fetch(`${getBaseUrl()}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Supabase request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function selectRows(table: string, params?: QueryParams, admin = false) {
  return restRequest(`${table}${buildQuery(params)}`, { method: "GET" }, admin);
}

export async function insertRow(table: string, payload: unknown, admin = true) {
  const data = await restRequest(table, { method: "POST", body: JSON.stringify(payload) }, admin);
  return Array.isArray(data) ? data[0] : data;
}

export async function updateRow(table: string, id: string, payload: unknown, admin = true) {
  const data = await restRequest(`${table}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(payload) }, admin);
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteRow(table: string, id: string, admin = true) {
  await restRequest(`${table}?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, admin);
}

export async function uploadToStorage(fileName: string, bytes: Uint8Array, contentType: string, bucket: string) {
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
  const body = new Blob([bytes], { type: contentType });

  const res = await fetch(`${getBaseUrl()}/storage/v1/object/${bucket}/${fileName}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Upload failed");
  }

  return `${getBaseUrl()}/storage/v1/object/public/${bucket}/${fileName}`;
}
