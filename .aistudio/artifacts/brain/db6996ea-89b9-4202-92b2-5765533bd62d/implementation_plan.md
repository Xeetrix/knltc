# 100% Free Google Drive Storage Architecture & Integration Plan for KNLTC

## Executive Summary
KNLTC (`knltc.com`) operates an enterprise-grade ERP/CRM and student visa processing pipeline for Japan aspirants from Dhaka and Khulna. To eliminate recurring cloud storage costs (AWS S3, Firebase, Supabase), **100% of student visa documents, passports, solvency certificates, MOUs, book covers, and CMS media will be securely stored inside your free 15 GB Google Drive storage** linked directly to the same Google account powering `KNLTC_Master_Database` Google Sheets.

---

## 1. Storage Technology Analysis & Comparison

| Storage Provider | Cost | Bandwidth Limit | Security & Control | Best Suited For | Verdict for KNLTC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Drive (Current Choice)** | **100% Free (15 GB)** | High (Fair Use) | **Private to your Google Account** | Student PDFs, Passports, Bank Docs, Receipts, Photos | **Optimal (Selected by User)** |
| **Cloudinary** | Free (25 GB/mo bandwidth) | 25 Credits/mo | Hosted on 3rd party CDN | High-traffic e-commerce image CDN | Optional secondary for book images |
| **Supabase / Firebase Storage** | Free tier capped at 1GB / 5GB | Metered egress | External vendor lock-in | Mobile apps / Auth-tied buckets | Retired in favor of Google ecosystem |
| **Cloudflare R2 / AWS S3** | $0.015/GB (Credit card required) | Unlimited | Enterprise object storage | Millions of files / Streaming | Overkill for 15GB KNLTC requirement |

---

## 2. Google Drive Architecture for KNLTC

### Folder Hierarchy inside Your Google Drive
When files are uploaded via the KNLTC Dashboard, Google Apps Script automatically creates and organizes files in your Google Drive under:

```
My Drive (Google Drive)
└── 📁 KNLTC_Uploads_And_Visa_Docs/
    ├── 📁 KNLTC_Visa_Applicants/          (Passports, NID, Academic Certificates, Bank Solvency)
    ├── 📁 KNLTC_Partner_Schools/          (HLA Gakuin & Japanese School MOUs, Licenses, Logos)
    ├── 📁 KNLTC_B2B_Agents/               (Nexus Group, BWBS MOUs, Trade Licenses, Cheques)
    ├── 📁 KNLTC_Finance_Receipts/         (Money Receipts, Bank Slips, Bkash/Nagad Trx Screenshots)
    ├── 📁 KNLTC_Store_Books/              (Minna No Nihongo, JLPT Workbook Cover Images)
    ├── 📁 KNLTC_Blog_Media/               (Japan Visa Guides & Student Thumbnails)
    └── 📁 KNLTC_General_Uploads/          (Staff documents, miscellaneous files)
```

### Free Direct-Link & CDN Image Delivery
- **Document Viewing & Download:**
  - View URL: `https://drive.google.com/uc?export=view&id={fileId}`
  - Download URL: `https://drive.google.com/uc?export=download&id={fileId}`
- **High-Speed Image CDN (Google Usercontent):**
  - Instant image delivery: `https://lh3.googleusercontent.com/d/{fileId}`
  - Configured in Next.js `next.config.mjs` (`remotePatterns`) for zero-broken image rendering and high Lighthouse performance.

---

## 3. Step-by-Step Guide for KNLTC Admin

### Step 1: Verify Google Drive Permissions in Apps Script
1. Open your `KNLTC_Master_Database` Google Sheet.
2. Go to **Extensions > Apps Script**.
3. When you run `setupKNLTCDatabase()` or deploy the Web App, Google requests standard Google Drive permissions (`DriveApp` scope).
4. Click **Review Permissions**, select your Google account (`contact.knltc@gmail.com`), and click **Allow**.
5. Once approved, Apps Script can automatically create folders and save uploaded files without requiring any paid API key!

### Step 2: How File Uploads Work in the Dashboard
1. Go to `/dashboard` (e.g. Visa Pipeline, B2B Agents, or Partner Schools).
2. Click the **"Drive-এ আপলোড"** button on any document or photo field.
3. Select any file (PDF, JPG, PNG, WEBP, DOCX up to 15MB).
4. The dashboard converts the file to base64, sends it to your Google Apps Script Web App (`UPLOAD_FILE_TO_DRIVE`), which saves it into `KNLTC_Uploads_And_Visa_Docs/{Folder}`.
5. The direct Google Drive URL is immediately filled into the form and stored in the Google Sheet.

### Step 3: Monitoring 15GB Free Storage
- 15 GB can easily hold **10,000 to 15,000 student documents and photos** (average PDF/JPG is 1MB to 1.5MB).
- You can check your storage anytime at [drive.google.com/drive/u/0/quota](https://drive.google.com/drive/u/0/quota).
- If your agency ever exceeds 15,000 files in future years, Google One offers 100 GB for just ~$1.99/month (no migration needed).

---

## 4. Planned System Refinements

1. **Google Drive CDN Image URL Enhancement (`google-apps-script/Code.gs`):**
   - Provide `lh3.googleusercontent.com/d/{fileId}` as `cdnUrl` alongside `drive.google.com/uc?export=view&id={fileId}` so website book covers and blog thumbnails load at maximum speed.
2. **Next.js Config Verification (`next.config.mjs`):**
   - Ensure both `drive.google.com` and `lh3.googleusercontent.com` are whitelisted in `remotePatterns`.
3. **Upload Feedback & Error Prevention:**
   - Display file size and upload progress indicator on dashboard upload buttons.
