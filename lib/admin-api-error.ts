import { SupabaseOperationError } from "@/lib/supabase";

type AdminErrorResponse = {
  status: number;
  error: string;
  issue: string;
  table: string | null;
  bucket: string | null;
  payloadFields: string[];
  code: string | null;
  details: string | null;
  hint: string | null;
};

function classifySupabaseIssue(error: SupabaseOperationError) {
  const haystack = `${error.message} ${error.code ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();

  if (haystack.includes("bucket") && haystack.includes("not found")) return "missing_storage_bucket";
  if (haystack.includes("bucket") && (haystack.includes("invalid") || haystack.includes("does not exist"))) return "wrong_bucket_name";
  if (haystack.includes("relation") && haystack.includes("does not exist")) return "missing_table";
  if (haystack.includes("column") && haystack.includes("does not exist")) return "missing_required_column";
  if (haystack.includes("row-level security") || haystack.includes("rls") || haystack.includes("permission denied")) return "rls_policy";
  if (haystack.includes("invalid input") || haystack.includes("json") || haystack.includes("violates") || haystack.includes("null value")) {
    return "invalid_payload_shape";
  }

  if (error.resourceType === "bucket") return "storage_upload_failure";
  return "supabase_write_failure";
}

export function toAdminErrorResponse(error: unknown, fallbackMessage: string): AdminErrorResponse {
  if (error instanceof SupabaseOperationError) {
    return {
      status: error.status,
      error: error.message,
      issue: classifySupabaseIssue(error),
      table: error.resourceType === "table" ? error.resourceName : null,
      bucket: error.resourceType === "bucket" ? error.resourceName : null,
      payloadFields: error.payloadFields,
      code: error.code ?? null,
      details: error.details ?? null,
      hint: error.hint ?? null,
    };
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  return {
    status: 500,
    error: message,
    issue: "unexpected_error",
    table: null,
    bucket: null,
    payloadFields: [],
    code: null,
    details: null,
    hint: null,
  };
}
