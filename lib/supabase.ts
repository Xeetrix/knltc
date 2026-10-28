import {
  getUploadedMediaList,
  mutateSheetTable,
  querySheetTable,
  uploadFileToDriveOrCloudinary,
} from "@/lib/google-sheets-db";

/**
 * ============================================================================
 * GOOGLE SHEETS + GOOGLE DRIVE COMPATIBILITY BRIDGE (`lib/supabase.ts`)
 * ============================================================================
 * All legacy `selectRows`, `insertRow`, `upsertRow`, `updateRow`, `deleteRow`,
 * `uploadToStorage`, `listStorageObjects`, and `listStorageFiles` calls across
 * `lib/cms.ts` and `/app/api/*` route 100% through our free Google Sheets +
 * Google Drive / Cloudinary backend (`lib/google-sheets-db.ts`).
 * ============================================================================
 */

export class SupabaseOperationError extends Error {
  status: number;
  resourceType: "table" | "bucket";
  resourceName: string;
  payloadFields: string[];
  code?: string | null;
  details?: string | null;
  hint?: string | null;

  constructor(options: {
    message: string;
    status?: number;
    resourceType?: "table" | "bucket";
    resourceName?: string;
    payloadFields?: string[];
    code?: string | null;
    details?: string | null;
    hint?: string | null;
  }) {
    super(options.message);
    this.name = "SupabaseOperationError";
    this.status = options.status ?? 500;
    this.resourceType = options.resourceType ?? "table";
    this.resourceName = options.resourceName ?? "";
    this.payloadFields = options.payloadFields ?? [];
    this.code = options.code ?? null;
    this.details = options.details ?? null;
    this.hint = options.hint ?? null;
  }
}

function normalizeQueryString(
  query?: string | Record<string, string | number | boolean | undefined>,
): string {
  if (!query) return "";
  if (typeof query === "string") return query;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null) {
      params.set(k, String(v));
    }
  }
  return params.toString();
}

export async function selectRows<T = any>(
  table: string,
  query?: string | Record<string, string | number | boolean | undefined>,
  _useAdmin?: boolean,
): Promise<T[]> {
  return querySheetTable<T>(table, normalizeQueryString(query));
}

export async function insertRow<T = any>(
  table: string,
  payload: unknown,
  _useAdmin?: boolean,
): Promise<T> {
  const result = await mutateSheetTable<T>({
    action: "INSERT",
    table,
    payload,
  });
  return (Array.isArray(result) ? result[0] : result) as T;
}

export async function upsertRow<T = any>(
  table: string,
  payload: unknown,
  onConflictOrUseAdmin: string | boolean = "id",
): Promise<T> {
  const matchKey = typeof onConflictOrUseAdmin === "string" ? onConflictOrUseAdmin : "id";
  const result = await mutateSheetTable<T>({
    action: "UPSERT",
    table,
    payload,
    matchKey,
  });
  return (Array.isArray(result) ? result[0] : result) as T;
}

export async function updateRow<T = any>(
  table: string,
  matchQuery: string,
  payload: unknown,
  _useAdmin?: boolean,
): Promise<T> {
  let idVal: string | undefined;
  let matchKey = "id";

  if (matchQuery.includes("=")) {
    const params = new URLSearchParams(matchQuery);
    for (const [k, v] of params.entries()) {
      matchKey = k;
      idVal = v.startsWith("eq.") ? v.slice(3) : v;
      break;
    }
  } else {
    idVal = matchQuery;
  }

  const mergedPayload =
    payload && typeof payload === "object"
      ? { ...(payload as Record<string, any>), [matchKey]: idVal }
      : { [matchKey]: idVal };

  const result = await mutateSheetTable<T>({
    action: "UPDATE",
    table,
    payload: mergedPayload,
    id: idVal,
    matchKey,
  });
  return (Array.isArray(result) ? result[0] : result) as T;
}

export async function deleteRow(
  table: string,
  matchQuery: string,
  _useAdmin?: boolean,
): Promise<void> {
  let idVal = matchQuery;
  if (matchQuery.includes("=")) {
    const params = new URLSearchParams(matchQuery);
    for (const [, v] of params.entries()) {
      idVal = v.startsWith("eq.") ? v.slice(3) : v;
      break;
    }
  }
  await mutateSheetTable({
    action: "DELETE",
    table,
    id: idVal,
  });
}

export async function uploadToStorage(
  filePath: string,
  fileData: ArrayBuffer,
  contentType: string,
  folderName = "KNLTC_Media",
): Promise<string> {
  const base64Data = Buffer.from(fileData).toString("base64");
  const cleanName = filePath.split("/").pop() || `knltc-${Date.now()}`;
  const uploaded = await uploadFileToDriveOrCloudinary({
    fileName: cleanName,
    mimeType: contentType || "image/jpeg",
    base64Data,
    folderName,
  });
  return uploaded.url;
}

export type StorageObjectItem = {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  } | null;
  publicUrl?: string;
};

export async function listStorageObjects(
  _prefix = "",
  limit = 100,
  offset = 0,
): Promise<{ items: StorageObjectItem[]; bucketName: string }> {
  const media = getUploadedMediaList();
  const sliced = media.slice(offset, offset + limit).map((item, idx) => ({
    name: item.name,
    id: `media-${idx}`,
    created_at: item.createdAt,
    updated_at: item.updatedAt || item.createdAt,
    metadata: { size: item.size || 0 },
    publicUrl: item.url,
  }));

  return {
    items: sliced,
    bucketName: "KNLTC_Google_Drive",
  };
}

export async function listStorageFiles(bucketName = "blog-images") {
  const { items } = await listStorageObjects(bucketName, 100, 0);
  return items.map((item) => ({
    name: item.name,
    url: item.publicUrl || item.name,
    createdAt: item.created_at || new Date().toISOString(),
  }));
}

export function getPublicStorageObjectUrl(objectPath: string, _bucketName?: string): string {
  if (
    objectPath.startsWith("http://") ||
    objectPath.startsWith("https://") ||
    objectPath.startsWith("data:") ||
    objectPath.startsWith("/")
  ) {
    return objectPath;
  }
  const match = getUploadedMediaList().find(
    (m) => m.name === objectPath || m.url.endsWith(objectPath),
  );
  return match?.url || `/images/books/${objectPath}`;
}
