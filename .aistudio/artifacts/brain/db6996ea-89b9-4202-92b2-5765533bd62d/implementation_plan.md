# KNLTC Unified ERP Engine & Google Sheets 360° Live Synchronization

This plan resolves the 300-lead display cap, enables 100% persistence of the 360° Lead Profile directly inside `knltc_crm_leads`, establishes real-time cross-module ERP synchronization across all 15 Google Sheets tabs, and embeds an automated **Master Executive Dashboard** sheet inside `Code.gs` for live spreadsheet telemetry.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Architectural Choices (from Phase 1 Clarifications)**
> 1. **Unlimited Row Loading (No 300-Row Cap)**: Removed all artificial row limits (`limit: 300`, `limit: 200`, `limit: 100`) in `/api/cms/sync` so 100% of your 356+ CRM leads and all other module records load in full across the Overview, CRM Workspace, and Export tools.
> 2. **360° Lead Profile Persistence via `profile_json`**: Added a dedicated `profile_json` column to `knltc_crm_leads` (alongside explicit financial columns `contract_amount_bdt`, `paid_amount_bdt`, `due_amount_bdt`, `priority`, and `passport_no`) so every detail edited in the 360° Lead Drawer (academic GPAs, passport, sponsor solvency, 12-item document checklist, and call/activity timeline) is saved directly into the lead's row in Google Sheets.
> 3. **Full Cross-Module Real-Time Auto-Sync**: Every interconnected business action in the dashboard (Admitting a lead, Promoting to Visa Kanban, Enrolling in LMS, Logging a Fee Payment, Advancing Visa Stages, Claiming School Commission, Settling B2B Agent Commission, or Disbursing Staff Payroll) immediately writes/updates the linked rows across **all** affected Google Sheets tabs in real time.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the KNLTC Workspace Portal and its 15-tab Google Sheets backend into a tightly coupled, zero-loss relational ERP system where every lead, visa file, LMS enrollment, B2B referral, partner school quota, staff KPI, and financial transaction stays 100% synchronized in both directions.
- **Target Audience / Persona**: Managing Director (Sheikh Baset), Branch Admins (Dhaka HQ & Khulna Branch), Tele-Counselors, Visa Officers, Senseis, and B2B Partner Agents.
- **Key Value**:
  - **Zero Truncation**: All 356+ leads (and thousands of future rows) appear accurately in Overview and CRM.
  - **Full 360° Profile Sync**: No lead attribute is ever lost or trapped in browser memory; every field syncs to `knltc_crm_leads`.
  - **End-to-End Relational Integrity**: One action in CRM or Finance automatically updates the connected records in Visa, LMS, B2B, Partner Schools, HR, and Finance sheets.
  - **Automated Master Executive Dashboard in Google Sheets**: `Code.gs` includes a one-click `setupMasterExecutiveDashboard()` generator that builds/updates the live executive telemetry tab (`MASTER_EXECUTIVE_DASHBOARD`) directly inside your Google Spreadsheet using live `COUNTA`/`SUMIF` formulas.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Unlimited Lead Sync & Smart Normalization**: When the user clicks **Sync** or opens the dashboard, `/api/cms/sync` fetches all rows from Google Sheets without any 300-row limit. Leads imported directly into the sheet with custom status/source labels (e.g., `"New Lead"`, `"KNLTC_SSW_July2026_N4_Leads"`) are automatically normalized to canonical status codes (`NEW`, `CONTACTED`, `COUNSELED`, etc.) while preserving the campaign name in `notes`/tags so status filter tabs show accurate counts.
  2. **360° Lead Drawer Instant Save**: Editing any field in the 360° Lead Profile modal (Personal, Academic, Language, Sponsor, 12-Doc Checklist, Call Log, or Contract/Due amounts) immediately serializes the full extended profile into `profile_json` and syncs the row to `knltc_crm_leads`.
  3. **One-Click Cross-Module Cascade**:
     - Changing a lead to **Admitted** or clicking **Promote to Visa Pipeline** automatically creates/updates the row in `knltc_visa_applicants`, increments the counselor's `admissions_achieved` & bonus in `knltc_staff_members`, increments `active_students_count` in `knltc_partner_schools`, and increments `referred_students_count` in `knltc_b2b_agents`—writing all 5 tables to Google Sheets simultaneously.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-density enterprise ERP workspace with clean tabular alignment (`font-mono tabular-nums`), crisp slate surfaces (`#F8FAFC` / `#FFFFFF`), KNLTC crimson primary actions (`#B91C1C`), and deep forest green (`#133E29`) spreadsheet telemetry accents.
  - *Interactive Feedback*: Instant optimistic state updates paired with background multi-table Google Sheets writes and clear toast confirmations.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Removing All Row Caps & Normalizing Raw Sheet Imports**
  - *Chosen Approach*: Remove `limit: 300` in `/api/cms/sync` and normalize case-insensitive/human-readable status strings from Google Sheets (e.g. `"New Lead"` $\rightarrow$ `"NEW"`, `"Contacted"` $\rightarrow$ `"CONTACTED"`).
  - *Why*: In Screenshot 2, `All Leads` showed `300` while `New Lead` tab showed `0` because raw sheet rows had `"New Lead"` instead of `"NEW"` and were cut off at 300 rows by `querySheetTable`. Normalizing status values ensures both the total count (`356+`) and every status filter tab (`New Lead`, `Contacted`, etc.) work accurately.
- **Decision 2: Hybrid Structured Columns + `profile_json` in `knltc_crm_leads`**
  - *Chosen Approach*: Add key scannable columns (`priority`, `passport_no`, `contract_amount_bdt`, `paid_amount_bdt`, `due_amount_bdt`, `target_school`, `b2b_agent_name`, `profile_json`) to `knltc_crm_leads`.
  - *Why*: Keeps the Google Sheet clean and readable for human operators inspecting finances/passports in columns, while `profile_json` stores nested arrays (12-document checklist, call history timeline, academic GPAs, sponsor details) with 100% fidelity.
- **Decision 3: Multi-Table Relational Write Engine**
  - *Chosen Approach*: Upgrade `knltc-cms-store.ts` mutations so that cross-module actions emit `syncToServer` calls for every affected table (not just the primary table).
  - *Why*: Ensures that the Master Executive Dashboard in Google Sheets (`knltc_visa_applicants`, `knltc_finance_transactions`, `knltc_partner_schools`, `knltc_b2b_agents`, `knltc_staff_members`, `knltc_lms_bridges`) always reflects live counts and BDT/JPY totals.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Cross-Module Synchronization Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     KNLTC NEXT.JS 15 WORKSPACE PORTAL                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │ 360° Lead Drawer │  │ Visa Kanban (10) │  │ Finance, LMS, B2B & HR     │  │
│  └────────┬─────────┘  └────────┬─────────┘  └─────────────┬──────────────┘  │
│           └─────────────────────┼──────────────────────────┘                 │
│                                 ▼                                            │
│         ┌───────────────────────────────────────────────────────┐            │
│         │   Relational ERP Engine (lib/knltc-cms-store.ts)      │            │
│         │  • Serializes full 360° Lead into profile_json        │            │
│         │  • Normalizes raw Sheet status & source values        │            │
│         │  • Cascades updates across linked modules             │            │
│         └───────────────────────┬───────────────────────────────┘            │
└─────────────────────────────────┼────────────────────────────────────────────┘
                                  │ Multi-Table Real-Time Sync (No Row Limits)
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│               GOOGLE SHEETS 15-TABLE + EXECUTIVE DASHBOARD                   │
│                                                                              │
│  [knltc_crm_leads] ──────────► [knltc_visa_applicants] (Auto-created on Adm) │
│   (356+ rows + profile_json)          │                                      │
│         │                             ├──► [knltc_partner_schools] (+Seat)   │
│         ├──► [knltc_lms_bridges]      ├──► [knltc_b2b_agents] (+Ref/Comm)    │
│         ├──► [knltc_staff_members]    └──► [knltc_finance_transactions]      │
│         └──► [MASTER_EXECUTIVE_DASHBOARD] (Live Telemetry Formulas)          │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Component & Cross-Module State Mapping

1. **Lead Profile Save (`updateCrmLeadProfile` & `addCrmLead`)**:
   - Writes all 18 core columns + `priority`, `passport_no`, `contract_amount_bdt`, `paid_amount_bdt`, `due_amount_bdt`, `target_school`, `b2b_agent_name`, and `profile_json` (containing `documentChecklist`, `activityLog`, `sscGpa`, `hscGpa`, `sponsorBankName`, `sponsorBankBalanceBdt`, etc.) directly to `knltc_crm_leads`.
   - If the lead has a linked `VisaApplicant` or `LmsUserBridge`, automatically updates the student's name, phone, target school, sponsor, and contract/due figures in `knltc_visa_applicants` and `knltc_lms_bridges`.
2. **Lead Admission & Login Provisioning (`updateCrmLeadStatus` / `provisionLeadLoginAndEnrollment` / `promoteLeadToVisaPipeline`)**:
   - Upserts `knltc_crm_leads` (`status = "ADMITTED"`, `profile_json`).
   - Upserts `knltc_visa_applicants` (creates/updates Stage 1 Visa file).
   - Upserts `knltc_lms_bridges` (when language course is enrolled).
   - Upserts `knltc_partner_schools` (recalculates live `active_students_count`).
   - Upserts `knltc_b2b_agents` (recalculates live `referred_students_count`).
   - Upserts `knltc_staff_members` (updates counselor `admissions_achieved` and `performance_bonus_bdt`).
   - Inserts `knltc_finance_transactions` (when initial admission payment > 0).
3. **Visa Stage Progression (`updateVisaStage`)**:
   - Upserts `knltc_visa_applicants` (`stage`, `coe_status`, `visa_status`).
   - Upserts `knltc_crm_leads` (appends stage progression to `activityLog` in `profile_json`).
   - Upserts `knltc_staff_members` (increments Visa Officer `kpi_achieved`).
   - At Stage $\ge 6$ (COE Approved): Upserts `knltc_b2b_agents` (`successful_visas_count`, `pending_commission_bdt`).
4. **Financial Transactions & Settlements (`addFinancialTransaction`, `deleteFinancialTransaction`, `claimPartnerSchoolCommission`, `settleB2bAgentCommission`, `disburseStaffPayroll`)**:
   - Inserts/Deletes row in `knltc_finance_transactions`.
   - Automatically recalculates `paid_amount_bdt` and `due_amount_bdt` on the linked `knltc_crm_leads` and `knltc_visa_applicants` rows and syncs both to Google Sheets.
   - Syncs updated commission/payroll balances to `knltc_partner_schools`, `knltc_b2b_agents`, and `knltc_staff_members`.
5. **Google Apps Script (`google-apps-script/Code.gs`)**:
   - Expands `TABLE_SCHEMAS.knltc_crm_leads` with the new 360° profile columns (`priority`, `passport_no`, `contract_amount_bdt`, `paid_amount_bdt`, `due_amount_bdt`, `target_school`, `b2b_agent_name`, `profile_json`).
   - Adds `setupMasterExecutiveDashboard(ss)` inside `setupKNLTCDatabase()` so the live **Master Executive Dashboard** sheet (matching your screenshot) is automatically kept in sync with live formulas across all 15 tables.
