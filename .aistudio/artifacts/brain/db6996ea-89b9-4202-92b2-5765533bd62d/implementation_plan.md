# Cross-Browser Data & Media Sync + Google Drive & Sheet Media Table + Dashboard Connection Settings

This plan resolves the issue where data and uploaded media stay on refresh in the same browser (`localStorage`) but do not appear when opening the app in a new browser, incognito window, or another device, and adds a dedicated **Backend Connection Settings** panel in the Dashboard.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Decisions from Your Answers:**
> 1. **Fix Cross-Browser / Multi-Device Persistence**: Ensure every change (CRM leads, Visa pipeline, Partner schools, B2B agents, Staff, Finance, Website CMS, Bookstore, Blog, and uploaded files) is immediately persisted to the server snapshot and Google Sheets, and automatically hydrated when opening the app in any new browser or device.
> 2. **Permanent Media Storage in Google Drive + Google Sheet `media_vault` Tab**: Store all uploaded images and PDFs in Google Drive plus a dedicated `media_vault` table in Google Sheets so files never disappear across browsers or server restarts, while still serving them through clean white-label `/api/media/file/<id>/<filename>` URLs.
> 3. **Dashboard Backend Connection Settings Panel**: Add a built-in settings panel in the Dashboard where you can paste, test, and save your Google Apps Script Web App URL and Google Sheet URL directly without editing environment variables.

---

## 1. Overview & Core Concept

- **Why New Browsers Were Not Showing Data & Files**:
  1. **Client-Only `localStorage` Trap**: Several store updates saved to browser `localStorage` first, and when a new browser fetched `/api/cms/sync`, any table that returned empty or null failed to fall back to the server snapshot (`snapshotStore`), leaving the new browser with empty lists.
  2. **Mirror Row Drop on Sheet Sync**: When merging Google Sheet rows with the server mirror, newly added local rows or media items that had not yet completed round-trip writing to Google Sheets were overwritten instead of merged.
  3. **Ephemeral Media Index**: Uploaded file metadata (`media-index.json`) only lived on local container disk and was not backed by a `media_vault` table in Google Sheets.
  4. **Hardcoded Env Config**: If `GOOGLE_SHEETS_WEB_APP_URL` was not set in server environment variables, there was no UI in the Dashboard to paste and save the live Google Apps Script deployment URL.

---

## 2. User Experience & Visual Design

- **Backend Connection & Storage Settings Panel (in Media Library & Access Control)**:
  - **Clean Configuration Card**: Inputs for **Google Apps Script Web App URL** (`https://script.google.com/macros/s/.../exec`), **Google Sheet URL**, and **API Key** (`KNLTC_SECRET_2026`).
  - **1-Click Actions**:
    - **Save & Test Connection**: Verifies the Apps Script endpoint, auto-creates all 16 Google Sheet tabs (including `media_vault`) and the Google Drive root folder, and saves the configuration on the server so every browser uses it automatically.
    - **Push All Data & Media to Sheet**: Pushes all existing CRM leads, visa applicants, partner schools, B2B agents, staff, transactions, CMS data, and media files to Google Sheets + Google Drive in one click.
    - **Copy Updated Apps Script (`Code.gs`)**: 1-click button to copy the updated Apps Script code (with `media_vault` table and Drive binary streaming support).
- **Seamless White-Label Media Across All Browsers**:
  - Every image (`avatarUrl`, `logoUrl`, `cover_image`, `featured_image`) and PDF (`fileUrl`) uses `/api/media/file/<id>/<filename>`.
  - When opened in a new browser or device, the server serves the file from disk, or transparently fetches and streams it from Google Drive (`driveFileId`) or the `media_vault` Google Sheet table—with zero broken images or Google Drive cookie blocks.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Transparent Server Proxy Over Google Drive + `media_vault` Sheet Table**
  - *Chosen Approach*: Keep all public links as `/api/media/file/<id>/<filename>` while storing the file in Google Drive (`UPLOAD_FILE_TO_DRIVE`) and recording its metadata (`id`, `name`, `mime_type`, `size`, `drive_file_id`, `drive_url`, and compressed backup for thumbnails) in the `media_vault` Google Sheet tab.
  - *Why*: Google Drive URLs often get blocked by browser third-party cookie restrictions in `<img>` and `<iframe>` tags, and expose backend technology. By proxying through `/api/media/file/<id>/<filename>` and backing it with `media_vault` + Google Drive `GET_DRIVE_FILE`, files load like Supabase Storage in every browser and never expire.
- **Decision 2: Unified Server Snapshot + Live Sheet Hydration on New Browser Load**
  - *Chosen Approach*: Every mutation in `knltc-cms-store` immediately updates both the individual Google Sheet table and the master server snapshot (`knltc-cms-server-snapshot-v4.json`). When a new browser opens `/dashboard` or the public site, `fetchLiveStoreFromServer()` merges rows from both Google Sheets and `snapshotStore`.
  - *Why*: Guarantees that even if a user opens a brand-new browser 1 second after uploading a photo or adding a lead, the exact state is immediately visible.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     ANY BROWSER / DEVICE (Chrome, Safari, Mobile)          │
│  • Hydrates on mount from GET /api/cms/sync & GET /api/media               │
│  • Every edit / upload immediately syncs to Server + Google Sheets         │
└───────────────────┬────────────────────────────────────┬───────────────────┘
                    │                                    │
                    ▼                                    ▼
┌───────────────────────────────────────┐  ┌─────────────────────────────────┐
│     /api/cms/sync & /api/sheets       │  │   /api/media & /api/media/file  │
│  • Persists Backend Config JSON       │  │  • Saves binary to Disk Vault   │
│  • Bi-directional union merge between │  │  • Uploads to Google Drive      │
│    Server Mirror & Google Sheets      │  │  • Syncs row to `media_vault`   │
│  • Always updates snapshotStore       │  │  • Auto-heals from Drive/Sheet  │
└───────────────────┬───────────────────┘  └─────────────┬───────────────────┘
                    │                                    │
                    └─────────────────┬──────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│            GOOGLE APPS SCRIPT (`Code.gs`) + GOOGLE SHEETS & DRIVE          │
│  • 16 Tabs (15 ERP/Store tabs + `media_vault` table)                       │
│  • Google Drive Folder (`KNLTC_Uploads_And_Visa_Docs`)                     │
│  • `UPLOAD_FILE_TO_DRIVE` & `GET_DRIVE_FILE` base64 recovery endpoint      │
└────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Component & State Mapping
1. **Runtime Backend Config Persistence**:
   - Store runtime credentials (`webAppUrl`, `masterSheetUrl`, `apiKey`) in `.data/backend-config.json` and also inside `knltc_website_cms` so `getGoogleSheetsConfig()` works immediately when saved from the Dashboard UI without requiring `.env` edits.
2. **Cross-Browser Hydration Fix (`fetchLiveStoreFromServer` & `/api/cms/sync`)**:
   - Update `POST /api/cms/sync` so every `INSERT`, `UPSERT`, `DELETE`, and `CMS_UPDATE` also updates `knltc-cms-server-snapshot-v4.json`.
   - Update `GET /api/cms/sync` and `fetchLiveStoreFromServer()` so that when a new browser loads with an empty `localStorage`, it hydrates all entities (`crmLeads`, `visaApplicants`, `partnerSchools`, `b2bAgents`, `staffList`, `transactions`, `lmsBridges`, `websiteCms`) from the union of Google Sheets rows and `snapshotStore`.
   - Update `mergeRemoteAndMirrorRows()` to preserve any local mirror rows not yet present in `remoteRows` and push them to Google Sheets.
3. **`media_vault` Google Sheet Table & Auto-Healing Proxy**:
   - Add `media_vault` to `GOOGLE_SHEETS_TABLES` and `Code.gs` (`TABLE_SCHEMAS.media_vault`).
   - Whenever a file is uploaded, upsert its record into `media_vault` in Google Sheets and upload the binary to Google Drive.
   - Update `/api/media/file/[id]/[...filename]` and `getMediaFileById` so if a new container or new browser requests a file that isn't cached on local disk, it automatically restores the binary from `media_vault` (`base64_chunk`) or fetches it from Google Drive (`driveFileId`) and streams it seamlessly.
