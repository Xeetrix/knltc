type QueryParams = Record<string, string | number | boolean | null | undefined>;

type SupabaseOperation = "select" | "insert" | "update" | "delete" | "upload" | "list";

type SupabaseErrorResponse = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  error?: string;
};

export class SupabaseOperationError extends Error {
  status: number;
  operation: SupabaseOperation;
  resourceType: "table" | "bucket";
  resourceName: string;
  payloadFields: string[];
  code?: string;
  details?: string;
  hint?: string;
  rawResponse?: string;

  constructor(args: {
    status: number;
    operation: SupabaseOperation;
    resourceType: "table" | "bucket";
    resourceName: string;
    payloadFields?: string[];
    message: string;
    code?: string;
    details?: string;
    hint?: string;
    rawResponse?: string;
  }) {
    super(args.message);
    this.name = "SupabaseOperationError";
    this.status = args.status;
    this.operation = args.operation;
    this.resourceType = args.resourceType;
    this.resourceName = args.resourceName;
    this.payloadFields = args.payloadFields ?? [];
    this.code = args.code;
    this.details = args.details;
    this.hint = args.hint;
    this.rawResponse = args.rawResponse;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isSupabaseConfigured() {
  return Boolean(supabaseUrl && (anonKey || serviceKey));
}

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

function getPayloadFieldNames(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  return Object.keys(payload as Record<string, unknown>);
}

function parseSupabaseError(rawResponse: string): SupabaseErrorResponse {
  if (!rawResponse) return {};
  try {
    const parsed = JSON.parse(rawResponse) as SupabaseErrorResponse;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { message: rawResponse };
  }
}

async function restRequest(
  path: string,
  init: RequestInit = {},
  admin = false,
  context?: { operation?: SupabaseOperation; table?: string; payload?: unknown },
) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const key = admin ? serviceKey || anonKey : anonKey || serviceKey;
  if (!key) return null;

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
    const rawResponse = await res.text();
    const parsed = parseSupabaseError(rawResponse);
    const message = parsed.message ?? parsed.error ?? `Supabase request failed: ${res.status}`;
    const operation = context?.operation ?? "select";
    const table = context?.table ?? path.split("?")[0];
    const payloadFields = getPayloadFieldNames(context?.payload);

    throw new SupabaseOperationError({
      status: res.status,
      operation,
      resourceType: "table",
      resourceName: table,
      payloadFields,
      message,
      code: parsed.code,
      details: parsed.details,
      hint: parsed.hint,
      rawResponse,
    });
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function selectRows(table: string, params?: QueryParams, admin = false) {
  if (!isSupabaseConfigured()) return [];
  const data = await restRequest(`${table}${buildQuery(params)}`, { method: "GET" }, admin, {
    operation: "select",
    table,
  });
  return Array.isArray(data) ? data : [];
}

export async function insertRow(table: string, payload: unknown, admin = true) {
  if (!isSupabaseConfigured()) return null;
  const data = await restRequest(table, { method: "POST", body: JSON.stringify(payload) }, admin, {
    operation: "insert",
    table,
    payload,
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function upsertRow(table: string, payload: unknown, admin = true) {
  if (!isSupabaseConfigured()) return null;
  const data = await restRequest(
    table,
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(payload),
    },
    admin,
    {
      operation: "insert",
      table,
      payload,
    },
  );
  return Array.isArray(data) ? data[0] : data;
}

export async function updateRow(table: string, id: string, payload: unknown, admin = true) {
  if (!isSupabaseConfigured()) return null;
  const data = await restRequest(`${table}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(payload) }, admin, {
    operation: "update",
    table,
    payload,
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteRow(table: string, id: string, admin = true) {
  if (!isSupabaseConfigured()) return;
  await restRequest(`${table}?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, admin, {
    operation: "delete",
    table,
    payload: { id },
  });
}

export async function ensureBucketExists(bucket: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !serviceKey) return false;
  try {
    const res = await fetch(`${getBaseUrl()}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        public: true,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function uploadToStorage(fileName: string, data: ArrayBuffer, contentType: string, bucket: string) {
  if (!isSupabaseConfigured() || !serviceKey) {
    throw new Error("Supabase Storage is not configured.");
  }

  let res = await fetch(`${getBaseUrl()}/storage/v1/object/${bucket}/${fileName}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: data,
  });

  if (!res.ok) {
    const raw = await res.text();
    // If bucket does not exist, auto-create public bucket and retry upload
    if (res.status === 404 || res.status === 400 || raw.toLowerCase().includes("bucket")) {
      await ensureBucketExists(bucket);
      res = await fetch(`${getBaseUrl()}/storage/v1/object/${bucket}/${fileName}`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": contentType,
          "x-upsert": "true",
        },
        body: data,
      });
      if (res.ok) {
        return `${getBaseUrl()}/storage/v1/object/public/${bucket}/${fileName}`;
      }
    }
    throw new Error(`Storage upload failed: ${raw}`);
  }

  return `${getBaseUrl()}/storage/v1/object/public/${bucket}/${fileName}`;
}

export async function listStorageFiles(bucket: string) {
  if (!isSupabaseConfigured() || !serviceKey) return [];
  const res = await fetch(`${getBaseUrl()}/storage/v1/object/list/${bucket}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ limit: 200, offset: 0, sortBy: { column: "created_at", order: "desc" } }),
    cache: "no-store",
  });

  if (!res.ok) return [];
  const rows = (await res.json()) as Array<{ name: string; created_at?: string | null }>;
  return rows
    .filter((row) => row.name && !row.name.endsWith("/"))
    .map((row) => ({
      name: row.name,
      created_at: row.created_at ?? null,
      url: `${getBaseUrl()}/storage/v1/object/public/${bucket}/${row.name}`,
    }));
}
