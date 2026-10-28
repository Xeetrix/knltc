# KNLTC (`knltc.com`) — 100% Free Google Sheets + Google Drive / Cloudinary Backend Setup Guide

This guide walks you through connecting your **KNLTC (`Kurobe Nihongo Language Training Center`)** Next.js 15 application and `/dashboard` ERP/CRM/CMS to your own **Google Sheet (`KNLTC_Master_Database`)** and **Google Drive (`KNLTC_Uploads_And_Visa_Docs`)** for 100% free hosting of all 15 database tables and student/visa media files.

---

## 📋 Overview of the 15 Automated Tabs (Sheets)

When you run the 1-click setup function, the script automatically creates, styles (Deep Forest Green `#133e29` header, white bold text, frozen Row 1), and seeds all **15 tables**:

1. `blog_posts` — Blog articles & Japan visa advisories
2. `categories` — Product & blog categories
3. `knltc_b2b_agents` — Local sub-agents, referral counts & BDT commissions
4. `knltc_crm_leads` — Student inquiries, counseling notes, academic GPA & follow-ups
5. `knltc_finance_transactions` — Income/Expense ledger, bKash/Nagad receipts & 10L BDT Investor Open-Book pool
6. `knltc_lms_bridges` — `https://npw.bd/knltc` LMS classroom credentials & ৳2,000 portal fee split
7. `knltc_partner_schools` — Japanese language schools (e.g., HLA Gakuin Hiroshima — ¥80,000 commission)
8. `knltc_staff_members` — HR directory, counselor call KPIs, Sensei batches & monthly payroll
9. `knltc_visa_applicants` — 10-Stage Student & SSW Visa pipeline (Regular ৳1.2L & Premium ৳11–12L packages)
10. `knltc_website_cms` — Dynamic website CMS content, extended 360° student/school/agent profiles & RBAC accounts
11. `order_items` — Individual book line items per store order
12. `orders` — Customer bookstore orders (Minna No Nihongo N5/N4 sets, Irodori, Kanji books)
13. `product_reviews` — Verified student book reviews & ratings
14. `products` — Bookstore inventory, pricing & stock
15. `wishlist_items` — Customer saved books wishlist

---

## 🚀 Step-by-Step Setup (Takes Less Than 3 Minutes)

### Step 1: Open Your Google Sheet & Apps Script Editor
1. Create or open your Google Sheet named **`KNLTC_Master_Database`** in Google Drive.
2. Copy the browser URL of your Google Sheet — you will use this as `NEXT_PUBLIC_MASTER_SHEET_URL`.
3. In the top menu bar of your Google Sheet, click **`Extensions` > `Apps Script`**.

### Step 2: Paste `Code.gs` & Run 1-Click Auto-Setup
1. Delete any default `function myFunction() {}` code inside the Apps Script editor.
2. Open [`google-apps-script/Code.gs`](./Code.gs) from this repository, copy the **entire file**, and paste it into the Apps Script editor.
3. Press **`Ctrl + S`** (or click the **Save** floppy disk icon).
4. In the top toolbar dropdown (next to **Run** and **Debug**), select **`setupKNLTCDatabase`**.
5. Click **`Run`**.
6. **Grant Permissions**:
   - Google will show an *"Authorization required"* prompt.
   - Click **Review permissions** -> Select your Google account -> Click **Advanced** -> Click **Go to Untitled project (unsafe)** -> Click **Allow**.
7. Check your Google Sheet! All **15 Tabs** are now created, formatted with `#133e29` headers, and populated with realistic KNLTC seed data, and a folder named **`KNLTC_Uploads_And_Visa_Docs`** has been created in your Google Drive.

### Step 3: Deploy as a Web App
1. In the top-right corner of the Apps Script editor, click **`Deploy` > `New deployment`**.
2. Click the gear icon ⚙️ next to **Select type** and choose **`Web app`**.
3. Fill in the deployment settings:
   - **Description**: `KNLTC Master Database & Drive API v1`
   - **Execute as**: **`Me`** *(your Google account)*
   - **Who has access**: **`Anyone`** *(CRITICAL: Must be set to "Anyone" so Next.js server routes can read/write without OAuth popups)*
4. Click **`Deploy`**.
5. Copy the generated **Web app URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Add Environment Variables to `.env.local` (and Vercel / Hosting)
Create or update your `.env.local` file in the root of the Next.js project:

```env
# 1. Google Apps Script Web App URL (from Step 3)
GOOGLE_SHEETS_WEB_APP_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"

# 2. Secret API Key for Write Protection (matches DEFAULT_API_KEY in Code.gs)
GOOGLE_SHEETS_API_KEY="KNLTC_SECRET_2026"

# 3. Direct link to your Google Sheet (for the "Open Master Google Sheet" button in /dashboard)
NEXT_PUBLIC_MASTER_SHEET_URL="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"

# 4. Optional: Cloudinary Free Tier for instant CDN image optimization (falls back to Google Drive automatically)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""
```

---

## 🔄 Updating Your Google Sheet from the `/dashboard` UI
Once deployed, open **`/dashboard`** in your browser:
- Look at the **Google Sheets & Drive Sync Bar** at the top of the workspace.
- Click **"Push Initial Data to Google Sheet"** at any time to bulk-sync all local dashboard records, CMS settings, and bookstore items directly into your 15 Google Sheet tabs.
- Click **"Refresh Cache"** to immediately invalidate the Next.js 60-second cache (`revalidateTag('knltc-db')`) after manual edits inside Google Sheets.
- Use the **"Upload to Google Drive"** button inside Visa Document Checklists, Bookstore Product Forms, Blog Posts, and Payment Receipts to upload PDFs/images directly to your `KNLTC_Uploads_And_Visa_Docs` Google Drive folder!
