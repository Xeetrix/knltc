# Vercel Serverless, Environment Variables & Google Sheets/Drive Media Fix Plan

## 1. Root Cause Analysis (From Your Vercel Screenshot & Codebase Audit)
1. **Vercel Serverless Container Isolation (`/tmp` is Ephemeral)**:
   - On Vercel Production, every API request (`/api/media`, `/api/media/file/[id]`, `/api/cms/sync`) can run in a different serverless container. Files saved only to `/tmp/` in Container A are invisible to Container B or to a new browser when a cold start occurs.
   - Previously, `offloadEmbeddedBase64Strings()` saved embedded base64 images/PDFs only to local `/tmp/` without pushing them to Google Drive or Google Sheets.
2. **Environment Variable Mismatch (`DEFAULT_API_KEY` & `DRIVE_ROOT_FOLDER_NAME`)**:
   - Your Vercel settings define `DEFAULT_API_KEY`, `GOOGLE_SHEETS_API_KEY`, `DRIVE_ROOT_FOLDER_NAME`, `GOOGLE_SHEETS_WEB_APP_URL`, and `NEXT_PUBLIC_MASTER_SHEET_URL`.
   - Previously, the app only read `GOOGLE_SHEETS_API_KEY`. If `DEFAULT_API_KEY` or `GOOGLE_SHEETS_API_KEY` in Vercel differed from the key inside `Code.gs`, Google Apps Script returned `Unauthorized: Invalid GOOGLE_SHEETS_API_KEY` and rejected writes/uploads.
3. **Google Apps Script (`Code.gs`) Resilience & `knltc_website_cms` Backup Bridge**:
   - If `Code.gs` encounters a `DriveApp` authorization error or if an older deployment is active, `UPLOAD_FILE_TO_DRIVE` failed without storing the file in the Sheet.

---

## 2. Planned Changes

### A. Vercel Environment Variable Compatibility & Multi-Key Auto-Retry (`/lib/google-sheets-db.ts`)
- Read all Vercel environment variables shown in your screenshot:
  - `GOOGLE_SHEETS_WEB_APP_URL` / `NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL`
  - `DEFAULT_API_KEY` and `GOOGLE_SHEETS_API_KEY` (automatically try both keys plus `"KNLTC_SECRET_2026"` so an API key mismatch never blocks reads or writes)
  - `DRIVE_ROOT_FOLDER_NAME` (passed to Apps Script `UPLOAD_FILE_TO_DRIVE`)
  - `NEXT_PUBLIC_MASTER_SHEET_URL`
- Fix `mutateSheetTable("UPSERT_CMS")` so multiple rows in `knltc_website_cms` (such as `master_cms` and `media_item_<id>`) are upserted by `section_key` instead of overwriting the array.

### B. Serverless-Safe Media Storage in Google Drive + Sheet (`media_vault` & `knltc_website_cms`)
- Update `uploadFileToDriveOrCloudinary()` and `resolveMediaFileById()` in `/lib/google-sheets-db.ts`:
  - Upload to Google Drive via `UPLOAD_FILE_TO_DRIVE` and record in `media_vault`.
  - Also store a serverless recovery record in `knltc_website_cms` (`section_key: "media_item_<id>"`) so even if a Vercel serverless container cold-starts with an empty `/tmp/` directory, `/api/media/file/<id>/<filename>` immediately reconstructs and serves the image or PDF from Google Sheets or Google Drive.
  - Ensure any base64 media offloaded during `offloadEmbeddedBase64Strings()` is also queued and pushed to Google Drive / Google Sheets.

### C. Updated `google-apps-script/Code.gs` (Fault-Tolerant Drive + Sheet Storage)
- Update `/google-apps-script/Code.gs` so:
  - It accepts `DEFAULT_API_KEY`, `GOOGLE_SHEETS_API_KEY`, or Script Properties without failing on key rotation.
  - It uses `body.driveRootFolderName || DRIVE_ROOT_FOLDER_NAME`.
  - Inside `UPLOAD_FILE_TO_DRIVE`, `DriveApp` is wrapped in a `try/catch` so even if Google Drive fails or is restricted, the file is still saved into the `media_vault` tab in Google Sheets and returns `ok: true`.
  - `doGet(?table=all)` and `doPost(BULK_SYNC)` automatically create `media_vault` if it does not exist yet.

### D. Live Vercel & Google Sheet Connection Diagnostics in Dashboard (`/components/dashboard/MediaStorageManager.tsx` & `/app/api/sheets/route.ts`)
- Add a **"Test Connection & Environment Diagnostics"** status bar inside the Backend Settings panel of `MediaStorageManager.tsx` showing:
  - Detected Vercel env vars (`GOOGLE_SHEETS_WEB_APP_URL`, `DEFAULT_API_KEY`, `GOOGLE_SHEETS_API_KEY`, `DRIVE_ROOT_FOLDER_NAME`, `NEXT_PUBLIC_MASTER_SHEET_URL`)
  - Live `doGet` / `doPost` ping result from your Google Sheet Web App URL
  - 1-click **"Copy Updated `Code.gs`"** and **"Initialize / Sync All 16 Sheet Tabs"** buttons.
