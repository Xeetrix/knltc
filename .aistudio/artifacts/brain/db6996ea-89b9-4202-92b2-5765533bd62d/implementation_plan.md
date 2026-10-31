# Official Brand Identity & Receipt Overhaul Plan

## 1. Official Brand Name & Contact Standardization
- **Official Full Name**: Standardize the full organization name to **Kurobe Nihongo Language Training Center (KNLTC)** across all receipts, site metadata, footers, and translations.
- **Official Branches & Contact**:
  - **Dhaka Head Office**: Sky View Trade Valley (8th Floor / ৮ম তলা), 66/1 VIP Road, Naya Paltan, Dhaka-1000 (`+880 1805 013633`).
  - **Khulna Branch**: Shibbari More, Khulna.
- **Files to Update**:
  - `/lib/site.ts` & `/app/layout.tsx`: Add `fullName: "Kurobe Nihongo Language Training Center (KNLTC)"` and update page metadata descriptions.
  - `/components/layout/Footer.tsx`: Fix the Bangla floor number discrepancy (`৯ম তলা` → `৮ম তলা`) so all languages match the official 8th Floor address.

## 2. Official Money Receipt Modal Redesign (`/app/dashboard/page.tsx`)
- **Wider Modal Container**: Expand the modal width when `activeModal === "VIEW_RECEIPT"` (`max-w-2xl`) so header elements never wrap or squish.
- **Official Header & Logo**:
  - Replace the fake red `KN` square and wrong `"Kamrul Nippon Language & Training Center (KNLTC)"` heading with the official `/brand/knltc-logo.svg` emblem and **Kurobe Nihongo Language Training Center (KNLTC)**.
  - Replace the fabricated `Govt Reg & Trade License No: 177926` subtext with the official address and phone (`Sky View Trade Valley (8th Floor), 66/1 VIP Road, Naya Paltan, Dhaka-1000 • +880 1805 013633`).
  - Format the right-hand `MONEY RECEIPT` pill, receipt number (`KNLTC-REC-...`), and date with `whitespace-nowrap` and clean alignment.
- **Clean Branch & Signatory**:
  - Change `Dhaka HQ (Dhanmondi)` to `Dhaka HQ (Naya Paltan)` (and `Khulna Branch (Shibbari More)` when applicable).
  - Replace any `"Sheikh Baset"` / `"Shaikh Baset"` fallback on the Authorized Signatory line with `"KNLTC Accounts"` or the active admin's clean title.
- **Human-Readable Payment Methods & Service Particulars**:
  - Format all payment gateway codes (`CASH_OFFICE` → `Cash (Office Counter)`, `BKASH` → `bKash Merchant`, `NAGAD` → `Nagad Merchant`, `BANK_TRANSFER` → `Bank Transfer / A/C`) in both the Money Receipt and the General Ledger table.
  - Format all transaction category codes (`REGULAR_SERVICE_CHARGE` → `Regular Visa Processing & Service Charge`, `REGISTRATION_FEE` → `Student File Opening & Registration Fee`, `COURSE_FEE` → `Japanese Language Course Tuition Fee`, `SERVICE_CHARGE_COE` → `COE & Visa Service Charge`, `PREMIUM_PACKAGE` → `All-Inclusive Package Payment`, `BOOK_PURCHASE` → `Bookstore & Study Material Purchase`, etc.) so raw underscore strings never appear.

## 3. Comprehensive Scrub of Hardcoded Dummy Names & Fake Branches
- **Store & Saved Data Sanitization (`/lib/knltc-cms-store.ts`)**:
  - Replace all default `verifiedBy = "Sheikh Baset (MD)"` arguments in commission and payroll actions with `"KNLTC Accounts"`.
  - Automatically sanitize any cached or synced records in `transactions`, `crmLeads`, and `visaApplicants` where `verifiedBy` or `assignedTo` contains `"Sheikh Baset"`, `"Shaikh Baset"`, `"শেখ বাসেত"`, or `"Amir Hossain"` so legacy local/Sheet entries display `"KNLTC Accounts"` or `"KNLTC Admin"`.
- **Dashboard Translations & Role Labels (`/lib/dashboard-translations.ts`)**:
  - Remove `"MD: Sheikh Baset • Senior Sensei: Amir Hossain"`, `"Main Admin (Sheikh Baset)"`, and `"Japanese Sensei (Amir Hossain)"` across English, Bangla, and Japanese dictionaries, replacing them with role-based titles (`Main Admin`, `Japanese Sensei`).
- **Enrollment Form, API & Portal Data**:
  - `/components/japanese-language/EnrollmentForm.tsx`: Replace the fake `Dhanmondi Branch (Offline)` (`OFFLINE_DHANMONDI`) option with `Khulna Branch (Offline)` (`OFFLINE_KHULNA`) alongside `Naya Paltan (Dhaka HQ)` and `Online Live`.
  - `/app/api/enroll/route.ts`: Replace hardcoded `"আমির হোসেন (Amir Hossain — Senior Sensei)"` with `"KNLTC Academic Team (Senior Sensei)"`.
  - `/lib/portal-data.ts`: Replace fake `Dhanmondi Academic Campus` and `Chattogram Commercial Branch` entries with `Dhaka Head Office (Naya Paltan)` and `Khulna Branch (Shibbari More)`.
