# KNLTC White-Label Direct Media Storage & Automatic Sheet Link Synchronization

This revised plan makes the entire media and file system **100% seamless and white-label** (just like Supabase Storage or native S3/CDN object storage) so the underlying backend technology is never exposed in the UI, profile pictures/logos/book covers/documents render directly everywhere, and **every uploaded file's direct URL is automatically stored in its corresponding Google Sheet tab and column**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Updated based on your feedback: zero backend technology jargon in the UI, instant direct rendering of all images/files, and automatic link storage in the respective Sheet tabs.

- **Confirmed Decision 1 (White-Label, Technology-Agnostic Media Experience)**: All upload buttons, document vaults, profile avatars, and the Media Library will look and behave like native cloud object storage (e.g., Supabase Storage). Labels such as *"Upload to Google Drive"*, *"Persistent Disk"*, or *"Cloudinary"* will be replaced with clean, direct actions (*"Upload Photo"*, *"Upload Document"*, *"View File"*).
- **Confirmed Decision 2 (Direct Rendering of Profile Pictures, Logos & Documents Everywhere)**:
  - Uploaded **Student Profile Pictures (`avatarUrl`)** will display directly in the CRM table, 360° Student Profile header, Visa Kanban cards, and Student Portal.
  - Uploaded **Partner School Logos & B2B Agent Logos (`logoUrl`)** will display directly on Partner cards, 360° Partner Profiles, and School Matcher cards.
  - Uploaded **Book Covers & Blog Images** will display directly in the Bookstore and Blog.
  - Clicking **View (`দেখুন`)** on any uploaded PDF or image will open it directly in a clean, instant **In-App Preview Modal** (with direct full-tab view and download support).
- **Confirmed Decision 3 (Automatic File Link Storage in Corresponding Sheet Tabs)**: Whenever a photo, logo, voucher, or document is uploaded, its full clickable URL (`https://<domain>/api/media/file/<id>/<filename>`) will be automatically saved into the exact corresponding table/sheet row:
  - `knltc_crm_leads` → `avatar_url`, `documents_urls` (all uploaded COE/Visa document links), and `profile_json`
  - `knltc_visa_applicants` → `avatar_url`, `documents_urls`, and `profile_json`
  - `knltc_partner_schools` → `logo_url`, `documents_urls` (MOU, Brochure, Fee Structure links), and `profile_json`
  - `knltc_b2b_agents` → `logo_url`, `documents_urls` (Trade License, NID, MOU links), and `profile_json`
  - `products` → `cover_image`
  - `blog_posts` → `featured_image`
  - `knltc_finance_transactions` → `reference_or_trx` (Expense voucher / receipt file URL)

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Direct Object-Storage URLs (`/api/media/file/<id>/<filename>`)**: Every uploaded image or PDF is stored in a resilient server media vault (backed by binary disk storage + embedded self-healing backup + background sync) and served with proper `Content-Type` headers at a clean, permanent URL (`https://<domain>/api/media/file/<id>/<filename>`).
  2. **Zero Backend Exposure (White-Label UI)**: Removes technical storage provider names from buttons, toasts, and modals across `LeadProfileModal`, `PartnerProfileModal`, `DriveFileUploadButton`, `MediaStorageManager`, and `Dashboard`. Everything presents as native **KNLTC Media Vault** storage.
  3. **Automatic Sheet Column Link Sync**: Formats and writes full, clickable URLs for profile pictures, logos, and document checklists directly into dedicated columns (`avatar_url`, `logo_url`, `documents_urls`, `cover_image`, `featured_image`, `reference_or_trx`) in the respective Google Sheet tabs whenever any file is uploaded or updated.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Student Profile Picture & Document Upload (`CRM & Visa Pipeline`)**:
     - Clicking the camera icon on a student's 360° Profile uploads the photo and immediately renders the student's avatar in the profile header, CRM row, and Visa Kanban card.
     - Uploading any of the 12 COE/Embassy documents immediately marks the document as `Submitted`, enables the **Preview (`দেখুন`)** and **Download** buttons, and writes the full document URL into `knltc_crm_leads` (`avatar_url` & `documents_urls` columns) and `knltc_visa_applicants`.
  2. **Partner School & B2B Agent Logo & Document Upload**:
     - Uploading a logo or MOU/Trade License PDF in Partner School or B2B Agent modal immediately renders the logo across all cards and writes `logo_url` and `documents_urls` into `knltc_partner_schools` or `knltc_b2b_agents`.
  3. **Direct In-App Document & Media Preview**:
     - Clicking any document or image opens a clean, distraction-free preview modal showing the live image or PDF document with one-click **Copy Direct Link** and **Download**.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Clean, modern SaaS object-storage experience (inspired by Supabase Storage) with zero technical clutter.
  - *Color Palette & Mood*: Crisp white (`#FFFFFF`) and slate (`#F8FAFC`) surfaces, subtle `1px` borders (`#E2E8F0`), KNLTC Deep Forest Green (`#133E29`) for primary actions, and `font-mono tabular-nums` for file sizes and timestamps.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Self-Healing Direct Media Endpoint (`/api/media/file/<id>/<filename>`)**
  - *Chosen Approach*: Store both the raw binary in `.data/media-files/<id>` and a compressed base64 backup in `.data/media-index.json` (plus background sync to external cloud/Drive if configured), and resolve full URLs (`${origin}/api/media/file/<id>/<filename>`) when saving to Sheet rows.
  - *Why*: Guarantees `<img src="..." />` and PDF previews load instantaneously like Supabase Storage without ever breaking or showing a 404, while storing a real clickable `https://...` URL inside the Sheet cells.
- **Decision 2: Dedicated `avatar_url` and `documents_urls` Columns in Sheet Serialization**
  - *Chosen Approach*: Include `avatar_url` and a human-readable + clickable `documents_urls` summary (e.g., `Passport: https://.../passport.pdf | SSC: https://.../ssc.pdf`) alongside `profile_json` in `knltc_crm_leads`, `knltc_visa_applicants`, `knltc_partner_schools`, and `knltc_b2b_agents`.
  - *Why*: When you open your Sheet, you can immediately see and click the direct links to every student's profile picture and uploaded documents in their respective columns without having to read raw JSON.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Sheet Link Synchronization Flow**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     USER UPLOADS IMAGE OR PDF DOCUMENT                     │
│  • Student Avatar / 12 COE Docs       • School Logo / MOU / Prospectus     │
│  • B2B Agent Logo / Trade License     • Book Cover / Blog Cover / Voucher  │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│            DIRECT MEDIA STORAGE ENGINE (/api/media/file/<id>/<name>)       │
│  • Generates permanent direct URL: https://<host>/api/media/file/<id>/<fn> │
│  • Serves direct binary with immutable cache & inline Content-Disposition  │
│  • Self-heals from media-index backup so images/PDFs never 404             │
└──────────────────┬───────────────────────────────────┬─────────────────────┘
                   │                                   │
                   ▼                                   ▼
┌─────────────────────────────────────┐ ┌────────────────────────────────────┐
│   DIRECT UI RENDERING EVERYWHERE    │ │  RESPECTIVE SHEET ROW LINK SYNC    │
│  • <img src={url} /> in CRM, Visa,  │ │  • knltc_crm_leads:                │
│    Partner Cards, Bookstore, Blog   │ │    avatar_url, documents_urls      │
│  • In-App DocumentPreviewModal for  │ │  • knltc_visa_applicants:          │
│    instant PDF & Image viewing      │ │    avatar_url, documents_urls      │
│                                     │ │  • knltc_partner_schools:          │
│                                     │ │    logo_url, documents_urls        │
│                                     │ │  • knltc_b2b_agents:               │
│                                     │ │    logo_url, documents_urls        │
│                                     │ │  • products: cover_image           │
│                                     │ │  • blog_posts: featured_image      │
│                                     │ │  • knltc_finance_transactions:     │
│                                     │ │    reference_or_trx                │
└─────────────────────────────────────┘ └────────────────────────────────────┘
```

- **Data Model & Sheet Column Mapping**:
  - `knltc_crm_leads`: Adds `avatar_url` and `documents_urls` (newline-separated list of `<Doc Title>: <Direct URL>` for all uploaded documents in `documentChecklist`) in `serializeLeadToSheetRow`, `bulkSyncMasterStoreToSheets`, and `Code.gs` schema.
  - `knltc_visa_applicants`: Adds `avatar_url` and `documents_urls` synced from the linked student's uploaded documents.
  - `knltc_partner_schools`: Populates `logo_url` and `documents_urls` (all uploaded school MOU/brochure links) in `serializeSchoolToSheetRow` and `bulkSyncMasterStoreToSheets`.
  - `knltc_b2b_agents`: Populates `logo_url` and `documents_urls` (Trade License, NID, Agreement links) in `serializeAgentToSheetRow` and `bulkSyncMasterStoreToSheets`.
  - `products` & `blog_posts`: Stores direct full media URLs in `cover_image` and `featured_image`.
- **Interactive Component & State Mapping**:
  - **`components/admin/DocumentPreviewModal.tsx`**: Clean, white-label preview modal for viewing any image or PDF inline, copying its direct URL, or downloading it.
  - **`components/admin/LeadProfileModal.tsx` & `PartnerProfileModal.tsx` & `StudentProfileView.tsx`**:
    - White-label all upload labels (`Upload File` / `ফাইল আপলোড`, `Upload Photo` / `ছবি আপলোড`).
    - Wire `View File` (`ফাইল দেখুন`) to open `DocumentPreviewModal` immediately.
    - Render `avatarUrl` and `logoUrl` directly in CRM Lead tables, Visa Kanban cards, Partner School cards, and B2B Agent cards.
  - **`components/dashboard/MediaStorageManager.tsx`**:
    - Clean, Supabase-style **Media Bucket & File Browser** (folders for `Student & Visa Documents`, `Profile Photos & Avatars`, `Partner Schools`, `B2B Agents`, `Bookstore & Blog`, `Finance Vouchers`) with instant upload, preview, direct URL copy, and file management—with zero confusing backend technology labels.
