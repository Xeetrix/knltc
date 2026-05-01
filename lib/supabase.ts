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
    const rawResponse = await res.text();
    const parsed = parseSupabaseError(rawResponse);
    const message = parsed.message ?? parsed.error ?? `Supabase request failed: ${res.status}`;
    const operation = context?.operation ?? "select";
    const table = context?.table ?? path.split("?")[0];
    const payloadFields = getPayloadFieldNames(context?.payload);

    console.error("[Supabase][REST]", {
      path,
      status: res.status,
      operation,
      table,
      payloadFields,
      code: parsed.code,
      message,
      details: parsed.details,
      hint: parsed.hint,
      response: rawResponse,
    });

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
  return restRequest(`${table}${buildQuery(params)}`, { method: "GET" }, admin, { operation: "select", table });
}

export async function insertRow(table: string, payload: unknown, admin = true) {
  const data = await restRequest(table, { method: "POST", body: JSON.stringify(payload) }, admin, {
    operation: "insert",
    table,
    payload,
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function updateRow(table: string, id: string, payload: unknown, admin = true) {
  const data = await restRequest(`${table}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(payload) }, admin, {
    operation: "update",
    table,
    payload,
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteRow(table: string, id: string, admin = true) {
  await restRequest(`${table}?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, admin, {
    operation: "delete",
    table,
    payload: { id },
  });
}

export async function uploadToStorage(fileName: string, data: ArrayBuffer, contentType: string, bucket: string) {
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");

  const res = await fetch(`${getBaseUrl()}/storage/v1/object/${bucket}/${fileName}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: data,
  });

  if (!res.ok) {
    const rawResponse = await res.text();
    const parsed = parseSupabaseError(rawResponse);
    const message = parsed.message ?? parsed.error ?? "Upload failed";

    console.error("[Supabase][Storage Upload]", {
      bucket,
      fileName,
      status: res.status,
      code: parsed.code,
      message,
      details: parsed.details,
      hint: parsed.hint,
      response: rawResponse,
    });

    throw new SupabaseOperationError({
      status: res.status,
      operation: "upload",
      resourceType: "bucket",
      resourceName: bucket,
      payloadFields: ["file"],
      message,
      code: parsed.code,
      details: parsed.details,
      hint: parsed.hint,
      rawResponse,
    });
  }

  return `${getBaseUrl()}/storage/v1/object/public/${bucket}/${fileName}`;
}


type StorageListItem = { name: string; created_at?: string | null };

export async function listStorageFiles(bucket: string) {
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");

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

  if (!res.ok) {
    const rawResponse = await res.text();
    const parsed = parseSupabaseError(rawResponse);
    throw new SupabaseOperationError({
      status: res.status,
      operation: "list",
      resourceType: "bucket",
      resourceName: bucket,
      message: parsed.message ?? parsed.error ?? "Failed to list storage files",
      code: parsed.code,
      details: parsed.details,
      hint: parsed.hint,
      rawResponse,
    });
  }

  const rows = (await res.json()) as StorageListItem[];
  return rows
    .filter((row) => row.name && !row.name.endsWith("/"))
    .map((row) => ({
      name: row.name,
      created_at: row.created_at ?? null,
      url: `${getBaseUrl()}/storage/v1/object/public/${bucket}/${row.name}`,
    }));
}
