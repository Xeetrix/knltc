# Implementation Plan: Backend 360° Sheet Sync, Clean Card-List Dashboard Redesign & Access Control Fix

## 1. Overview & Goals
Based on your feedback and reference screenshots, we will execute three focused upgrades across the KNLTC platform:

1. **Full Backend & Google Sheets (`Code.gs`) Sync for 6-Tab 360° Profiles**:
   - Ensure every field from the 6-tab 360° Profile Workspace (**Overview**, **Tasks**, **Documents**, **Matches**, **Applications**, **Invoices**) is persisted and synced in real time to Google Sheets across all four entities: **CRM Leads (`knltc_crm_leads`)**, **Visa Applicants (`knltc_visa_applicants`)**, **Partner Schools (`knltc_partner_schools`)**, and **B2B Agents (`knltc_b2b_agents`)**.
   - Expand `lib/knltc-cms-store.ts`, `lib/google-sheets-db.ts`, and `public/KNLTC_Google_Apps_Script_Backend.js` (`Code.gs`) so that:
     - `knltc_crm_leads` includes explicit columns for `ssc_gpa`, `hsc_gpa`, `tasks_json`, `documents_json`, `applications_json`, and `profile_json`.
     - `knltc_visa_applicants`, `knltc_partner_schools`, and `knltc_b2b_agents` also store `profile_json` (preserving all tasks, uploaded documents, timeline updates, and invoices) and automatically re-hydrate `profile_json` when loading from Google Sheets.

2. **Clean Card-List CRM & Dashboard Redesign (Inspired by Reference Screenshot)**:
   - Replace the heavy multi-card header and cluttered multi-column table in **CRM & Counseling** with the clean, modern SaaS layout from your reference screenshot:
     - **Minimal Page Header Card**: White rounded header bar with vertical accent indicator (`| Leads`) and clean action buttons (`Statuses`, `Import`, `Export`, `+ Add lead`).
     - **Compact Filter Pills & Status Strip**: Streamlined `All time`, `All consultants`, and program/source filter pills, paired with a clean horizontal status pill bar (`All`, `New Lead`, `Contacted`, `Counseled`, `Office Visit`, `Admitted`, `+ more`).
     - **Single-Row Horizontal Lead Cards**: Each lead is displayed as an interactive, clean horizontal card row with an initial avatar circle, candidate name, phone number, `Japan · Program` subtitle, status pill badge, relative timestamp & assigned consultant, quick `⋮` action menu (WhatsApp, Fee Collection, Pipeline, Delete), and `>` chevron that opens the full-page 6-tab 360° Profile.
     - **Clean Sidebar & Top Bar**: Refine the left sidebar and top navigation bar to match the airy, high-contrast aesthetic of the reference screenshot.

3. **Remove Hardcoded Dummy Account (`শেখ বাসেত / baset@knltc.com`) & Enable Full Access Control**:
   - Remove the hardcoded `শেখ বাসেত (baset@knltc.com / admin123)` dummy seed from `DEFAULT_SYSTEM_ACCOUNTS` in `lib/knltc-cms-store.ts`, `purgeStoreOfDummyData()`, and all fallback initializers so it is never auto-injected again.
   - Remove all hardcoded `"শেখ বাসেত"` fallback strings from the dashboard sidebar footer, lead assignment defaults, and transaction verifiers (using `"KNLTC Admin"` or the active logged-in user instead).
   - Upgrade **Access Control (`UserAccessControlPanel.tsx`)** so any account (including `MAIN_ADMIN` accounts) can have its **Name**, **Email/Login ID**, **Phone**, **Password**, **Role**, and **Branch** edited directly, and any unwanted/dummy account can be deleted cleanly with a single click.

---

## 2. Technical Changes by File

### A. Backend & Google Apps Script Synchronization
- **`/lib/knltc-cms-store.ts`**:
  - Update `serializeLeadToSheetRow`, `serializeVisaToSheetRow`, `serializeSchoolToSheetRow`, and `serializeAgentToSheetRow` to include `ssc_gpa`, `hsc_gpa`, and full `profile_json` (capturing `tasks`, `documentChecklist` / `documents`, `activityLog`, `applications`, and `invoices`).
  - Update `fetchAndSyncFromServer` so that when `visaApplicants`, `partnerSchools`, and `b2bAgents` are loaded from `/api/sheets`, their `profile_json` column is parsed and merged seamlessly (just like `crmLeads`).
  - Set `DEFAULT_SYSTEM_ACCOUNTS = []` and update `getSystemAccounts()` / `purgeStoreOfDummyData()` so deleted or purged dummy accounts never reappear.
- **`/lib/google-sheets-db.ts`**:
  - Add `ssc_gpa`, `hsc_gpa`, and `profile_json` mappings to `buildInitialFallbackTables()` and `bulkSyncMasterStoreToSheets()` across `knltc_crm_leads`, `knltc_visa_applicants`, `knltc_partner_schools`, and `knltc_b2b_agents`.
- **`/public/KNLTC_Google_Apps_Script_Backend.js`**:
  - Update the `TABLE_HEADERS` schema in `Code.gs` for `knltc_crm_leads`, `knltc_visa_applicants`, `knltc_partner_schools`, and `knltc_b2b_agents` to include `ssc_gpa`, `hsc_gpa`, and `profile_json` so Google Sheets columns stay 100% aligned.

### B. CRM Leads & Dashboard UI Redesign
- **`/app/dashboard/page.tsx`**:
  - Redesign the `activeTab === "crm"` view to match the reference screenshot:
    - Top `| Leads` header card with count and clean toolbar (`Statuses`, `Import`, `Export`, `+ Add lead`).
    - Compact filter pills (`All time / Follow-up`, `All consultants`, `All programs`) and horizontal status pill bar.
    - Clean horizontal card-row list for leads (with checkbox selection support, avatar circle, name, phone, country & program label, status badge, relative date & consultant, quick action buttons, and `>` arrow to open the full-page 360° profile).
  - Replace hardcoded `"শেখ বাসেত"` fallback strings in the sidebar profile bar and default form handlers with dynamic user identity (`currentUser?.name || "KNLTC Admin"`).

### C. Access Control Account Management Fix
- **`/components/admin/UserAccessControlPanel.tsx`**:
  - Allow editing **Name**, **Email / Login ID**, **Phone**, and **Password** directly on every account card.
  - Enable the **Delete (`Trash2`)** button on all accounts (including `MAIN_ADMIN` dummy accounts) and add a "Clear All Dummy Accounts" or direct delete action that permanently syncs the removal to the backend.
