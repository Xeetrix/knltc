import { NextResponse } from "next/server";
import {
  GOOGLE_SHEETS_TABLES,
  bulkSyncMasterStoreToSheets,
  fetchAllSheetTables,
  fetchSheetTable,
  getGoogleSheetsConfig,
  getStorageStatusSummary,
  invalidateSheetsCache,
  mutateSheetTable,
  optimizeAllTablesMedia,
  uploadFileToDriveOrCloudinary,
  type GoogleSheetsTableName,
} from "@/lib/google-sheets-db";

/**
 * ============================================================================
 * UNIFIED GOOGLE SHEETS + GOOGLE DRIVE / CLOUDINARY API ROUTE (`/api/sheets`)
 * ============================================================================
 * GET:
 * - `/api/sheets?action=status` -> Connection status, masterSheetUrl, tables, storageSummary
 * - `/api/sheets?table=all`     -> All 15 Google Sheets tables
 * - `/api/sheets?table=<name>`  -> Rows for a specific table
 *
 * POST:
 * - `action: "CREATE" | "INSERT" | "UPDATE" | "UPSERT" | "DELETE" | "UPSERT_CMS"`
 * - `action: "BULK_SYNC"`       -> Push full MasterKnlTcStore & bookstore tables to Google Sheets
 * - `action: "REFRESH_CACHE"`   -> Revalidate Next.js 15 cache tags (`knltc-db`)
 * - `action: "UPLOAD_FILE_TO_DRIVE"` -> Upload base64 file/image to Google Drive / Cloudinary / Persistent Disk
 * - `action: "OPTIMIZE_MEDIA_STORAGE"` -> Offload inline base64 strings across all 15 tables
 * ============================================================================
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "";
    const table = searchParams.get("table") || "";
    const id = searchParams.get("id") || "";

    const config = getGoogleSheetsConfig();

    if (action === "status") {
      return NextResponse.json({
        ok: true,
        connected: config.isConfigured,
        mode: config.isConfigured ? "GOOGLE_SHEETS_LIVE" : "LOCAL_SEED_FALLBACK",
        masterSheetUrl: config.masterSheetUrl,
        webAppConfigured: config.isConfigured,
        cloudinaryConfigured: Boolean(config.cloudinaryCloudName && config.cloudinaryUploadPreset),
        storageSummary: getStorageStatusSummary(),
        tables: GOOGLE_SHEETS_TABLES,
        timestamp: new Date().toISOString(),
      });
    }

    if (!table || table === "all") {
      const allData = await fetchAllSheetTables();
      return NextResponse.json({
        ok: true,
        connected: config.isConfigured,
        masterSheetUrl: config.masterSheetUrl,
        data: allData,
      });
    }

    const rows = await fetchSheetTable<Record<string, any>>(table as GoogleSheetsTableName);
    if (id) {
      const match =
        rows.find((r) => String(r.id) === String(id) || String(r.section_key) === String(id)) ||
        null;
      return NextResponse.json({
        ok: true,
        table,
        data: match,
      });
    }

    return NextResponse.json({
      ok: true,
      table,
      data: rows,
    });
  } catch (error) {
    console.error("[API][/api/sheets][GET]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to read Google Sheets data",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action || body.type || "").toUpperCase();

    if (action === "REFRESH_CACHE") {
      invalidateSheetsCache(body.table);
      return NextResponse.json({
        ok: true,
        revalidated: true,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "OPTIMIZE_MEDIA_STORAGE") {
      const result = await optimizeAllTablesMedia();
      return NextResponse.json(result);
    }

    if (action === "UPLOAD_FILE_TO_DRIVE") {
      const { fileName, mimeType, base64Data, folderName } = body;
      if (!base64Data) {
        return NextResponse.json(
          { ok: false, error: "Missing base64Data for file upload" },
          { status: 400 },
        );
      }

      const uploadResult = await uploadFileToDriveOrCloudinary({
        fileName: fileName || `knltc-upload-${Date.now()}`,
        mimeType: mimeType || "application/octet-stream",
        base64Data,
        folderName: folderName || "KNLTC_Dashboard_Uploads",
      });

      return NextResponse.json({
        ok: true,
        ...uploadResult,
      });
    }

    if (action === "BULK_SYNC") {
      const syncResult = await bulkSyncMasterStoreToSheets(body.store, Boolean(body.replaceAll));
      return NextResponse.json(syncResult);
    }

    if (action === "PURGE_DUMMY_DATA" || action === "PURGE_ALL_DUMMY") {
      const result = await mutateSheetTable({
        action: "PURGE_DUMMY_DATA",
      });
      return NextResponse.json({
        ok: true,
        message: "All dummy data successfully purged from database and local fallback.",
        data: result,
      });
    }

    if (
      action === "CREATE" ||
      action === "INSERT" ||
      action === "UPDATE" ||
      action === "UPSERT" ||
      action === "DELETE" ||
      action === "UPSERT_CMS" ||
      action === "CMS_UPDATE"
    ) {
      const normalizedAction = action === "CMS_UPDATE" ? "UPSERT_CMS" : action;
      const result = await mutateSheetTable({
        action: normalizedAction as any,
        table: body.table || body.entity,
        payload: body.payload || body.data || body.row,
        id: body.id || body.payload?.id,
        matchKey: body.matchKey,
      });

      return NextResponse.json({
        ok: true,
        action: normalizedAction,
        table: body.table || body.entity || "knltc_website_cms",
        data: result,
      });
    }

    return NextResponse.json(
      { ok: false, error: `Unsupported action: ${action}` },
      { status: 400 },
    );
  } catch (error) {
    console.error("[API][/api/sheets][POST]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Google Sheets mutation failed",
      },
      { status: 500 },
    );
  }
}
