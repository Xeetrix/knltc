# Media & Storage System Overhaul & Persistence Plan

## 1. Root Cause Analysis (Why Media & Storage Were Failing)
1. **Google Sheets 50,000-Character Cell Limit Failure**:
   - When an image or PDF was uploaded and Google Drive returned an error or fallback, the system generated a large `data:image/...;base64,...` or `data:application/pdf;base64,...` string (often 100 KB to 3 MB).
   - When that base64 string was placed inside `profile_json` (for Student/Visa document vaults, Partner Schools, or B2B Agents), `logo_url`, `cover_image`, or `knltc_website_cms`, Google Sheets rejected the write (`Your input contains more than the maximum of 50000 characters in a single cell`).
2. **Browser `localStorage` Quota Overflow & Refresh Wipe**:
   - Storing base64 documents/images inside `localStorage` exceeded the browser's 5 MB quota (`QuotaExceededError`), silently failing to save locally.
   - Upon page refresh, `fetchLiveStoreFromServer()` pulled the older un-updated row from Google Sheets and overwrote local state, causing uploaded documents, images, and recent edits to disappear.
3. **Google Drive Direct Image Blocking & Ephemeral Memory List**:
   - `drive.google.com/uc?export=view` links are frequently blocked by browser third-party cookie policies when embedded in `<img>` tags.
   - The server's uploaded media list (`globalThis.knltcUploadedMedia`) was stored only in volatile RAM rather than persistent disk + sheet storage.

---

## 2. Architecture & Storage Engine Upgrades

### A. Hybrid Google Drive + Persistent Server Disk Storage (`/lib/google-sheets-db.ts` & `/app/api/media/*`)
- **Persistent Disk Vault (`/data/uploads/` & `/data/media-index.json`)**:
  - Every uploaded image or document (JPEG, PNG, WebP, SVG, PDF, DOC/DOCX) is saved to persistent server disk storage with a unique ID and metadata record (`id`, `fileName`, `folderName`, `mimeType`, `size`, `driveUrl`, `localUrl`, `createdAt`), in addition to uploading to Google Drive (`KNLTC_Uploads_And_Visa_Docs`) or Cloudinary when configured.
- **Short, Permanent Serving URLs (`/api/media/file/[id]`)**:
  - Instead of returning giant base64 `data:` strings that break Google Sheets and `localStorage`, the upload API always returns a short, permanent URL (`/api/media/file/<id>/<filename>` or verified CDN/Drive thumbnail link under 80 characters).
  - `/api/media/file/[id]` streams the file with proper `Content-Type` and cache headers from local persistent storage (or proxies from Google Drive if needed), ensuring 100% reliability for both image previews and PDF downloads.
- **Google Apps Script (`Code.gs`) Drive Enhancement**:
  - Update `UPLOAD_FILE_TO_DRIVE` in `Code.gs` to also log uploaded file metadata to a `knltc_media_library` sheet tab and return embed-safe thumbnail/view/download URLs.

### B. Zero-Data-Loss Persistence & Smart Refresh Sync (`/lib/knltc-cms-store.ts` & `/lib/google-sheets-db.ts`)
- **Persistent Server Database Mirror (`/data/knltc-db-mirror.json`)**:
  - Persist all 15 fallback/mirror tables to disk on the server so server restarts or offline Google Sheets periods never lose a single record.
- **Automatic Base64-to-URL Sanitizer for Google Sheets Sync**:
  - Before any row (`knltc_crm_leads`, `knltc_visa_applicants`, `knltc_partner_schools`, `knltc_b2b_agents`, `products`, `blog_posts`, `knltc_website_cms`) is written to Google Sheets or `localStorage`, automatically offload any embedded `data:` base64 payloads above 2 KB into `/api/media` so every Google Sheets cell remains lightweight and 100% under the 50,000-character limit.
- **Smart Merge on Page Refresh (`fetchLiveStoreFromServer`)**:
  - Preserve locally uploaded `documents`, `tasks`, `logoUrl`, and newer `updatedAt` records when merging server rows on page reload so newly uploaded files or edits never vanish on refresh.

### C. Fix All Upload Touchpoints Across the Platform
- **Student 360 & Visa Kanban Document Vaults**:
  - Support uploading PDF, JPG, PNG, and WebP files up to 15 MB with progress feedback, instant preview/download buttons, and immediate sync to both `knltc_crm_leads` and `knltc_visa_applicants`.
- **Partner Schools & B2B Agents**:
  - Fix school/agent logo uploads and agreement/brochure PDF vault uploads so logos render immediately and persist permanently.
- **Bookstore Products, Blog Posts, and Website CMS**:
  - Unify `/api/admin/upload`, `/api/admin/blog-images`, and `uploadMediaImage()` so product covers, blog images, hero banners, team photos, and certificates upload cleanly and can also be picked from existing Media Library files.

### D. Centralized Media Library & Storage Status Manager (`/app/dashboard/page.tsx`)
- Add a dedicated **Media & Storage** management view accessible from the Dashboard sidebar (under **Content & Store -> Media & Storage**) featuring:
  - **Storage Health & Telemetry Bar**: Shows live status of Google Drive Sync, Persistent Server Storage, Google Sheets Cell Health, total files count, and storage usage.
  - **Drag-and-Drop Multi-File Uploader**: Upload images, PDFs, brochures, or student documents directly into organized folders (`Student & Visa Docs`, `Schools & B2B`, `Bookstore & Blog`, `Website CMS`).
  - **Visual File Browser & Filter**: Filter by folder or file type (Images vs. Documents), preview images/PDFs in a modal, copy file link with one click, download, or delete files.
  - **One-Click Storage Optimizer**: Scans existing CRM, Visa, Partner, Bookstore, and CMS records to convert any legacy base64 data URLs into clean `/api/media/file/...` links and syncs them to Google Sheets.
