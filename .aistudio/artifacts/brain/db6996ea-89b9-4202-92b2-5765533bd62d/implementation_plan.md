# CRM, 360° Lead Profile & Language LMS Full Synchronization Plan

This plan eliminates all hardcoded fallback data across the CRM, 360° Lead Profile, and Language & LMS modules, establishes a real-time two-way data bridge between course enrollments, CRM leads, and LMS accounts, and upgrades the Lead Profile workflow (Tasks, Documents, Activity Timeline, Follow-up scheduling, and Status tracking).

## User Review & Confirmed Decisions

> [!IMPORTANT]
> All core architectural and workflow choices below have been aligned based on your confirmed preferences:

- **Confirmed Decision 1 (Public Course Form → CRM vs. LMS Routing)**:
  - **"Apply Now" (`আবেদন করুন` / Discuss & Pay Later)** creates or updates a **CRM Lead only** (`status: "NEW"`, tagged with the selected course and consultation note) without prematurely issuing an LMS account.
  - **"Enroll Now" (`এখনই এনরোল করুন` / Instant Payment with TrxID)** creates/updates the **CRM Lead** (`status: "ADMITTED"`, `isCourseEnrolled: true`), issues the **LMS Classroom Bridge** linked by the exact `leadId`, and logs the **Finance Transaction** linked by `linkedLeadId`—syncing all records to the backend database.
- **Confirmed Decision 2 (Language & LMS Dashboard Metrics)**:
  - Replaces the static `৳12,000 / ৳2,000 / ৳10,000` cards in the **Language & LMS** tab with **both** live backend-computed enrollment revenue metrics (Active Enrolled Students, Total Course Fees Collected, Total Course Dues, Net Margin) **and** live course fee rates pulled dynamically from the Website CMS (`JFT Irodori`, `JLPT N5`, `JLPT N4`, `N5+N4 Combo`).
- **Confirmed Decision 3 (360° Lead Profile & Zero-Hardcode Upgrades)**:
  - **100% Backend-Driven Data (Zero Hardcoding)**: Removes all hardcoded fallback schools (`Tokyo International`, `Osaka Meros`, `Fukuoka Kyushu`), fake synthesized `@gmail.com` emails, hardcoded sponsor bank defaults (`Agrani Bank PLC` / `৳18,50,000`), hardcoded dates (`Oct 29, 2026`), and hardcoded staff names (`Senior Sensei Amir Hossen`, `শেখ বাসেত`).
  - **Direct 2-Way CRM ↔ LMS Link**: Click any student in the **Language & LMS** tab to open their **360° CRM Lead Profile**, edit their LMS progress %, batch, or assigned instructor, and view/manage their LMS enrollment directly inside their Lead Profile.
  - **Prominent Header Follow-Up Date Picker & Overdue Alert**: Adds a 1-click Follow-up Date control and status indicator (`Overdue`, `Due Today`, `Scheduled`) directly in the Lead Profile header.
  - **Multi-Channel Activity Log Composer**: Adds a dedicated activity logger in the Overview tab supporting `Call`, `WhatsApp`, `Office Visit`, and `Note` entries, plus automatic timeline logging whenever Tasks or Document statuses are updated.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the CRM, 360° Candidate Profile, and Language & LMS modules into a unified, strictly backend-driven system where every field, metric, school match, task, document, activity log, and LMS credential reflects real stored data synced with Google Sheets and the server snapshot.
- **Target Audience / Persona**: KNLTC Admissions Counselors, Tele-Counselors, Language Instructors (Sensei), Visa Officers, and Main Admins.
- **Key Value**: Prevents ghost/fake data from polluting student records, ensures consultation leads and paid course enrollments are cleanly separated, and gives counselors a single 360° command center for every candidate.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Public Course Form Submission Flow**:
     - When a student submits **"Apply Now"**, a CRM Lead is created with `status: "NEW"` and synced to the backend. Counselors see the lead immediately in the CRM queue with a `Course Inquiry` tag and follow-up date.
     - When a student submits **"Enroll Now"** with a bKash `TrxID`, the system creates/updates the CRM Lead (`ADMITTED`), creates a linked LMS Bridge record (`leadId`), and creates a linked Finance Ledger entry (`linkedLeadId`), syncing all three to the server.
  2. **360° Lead Profile Header & Follow-Up Workflow**:
     - At the top of the Lead Profile, counselors see the candidate's real contact details, current Status, Priority rating, **LMS Enrollment status**, and an interactive **Next Follow-up Date picker** with semantic state signaling (`Overdue` in crimson `#DC2626`, `Due Today` in amber `#D97706`, `Scheduled` in emerald `#16A34A`).
  3. **Activity Timeline & Multi-Type Composer**:
     - Counselors can log a `Phone Call`, `WhatsApp Message`, `Office Visit`, or `General Note` directly from the Activity Timeline card (with optional follow-up date update), or filter timeline items by activity type.
     - Completing a Task, uploading/verifying a Document, or issuing LMS credentials automatically appends a timestamped audit entry to the candidate's Activity Timeline.
  4. **Two-Way CRM ↔ Language & LMS Workspace**:
     - In the **Language & LMS** tab, top summary cards display real-time calculated totals from the backend alongside current CMS course fees (`JFT`, `N5`, `N4`, `Combo`).
     - Each LMS table row includes a **360° Profile** button that opens the linked CRM Lead Profile, an inline **Progress % / Batch** updater synced to the backend, and a **Delete** action.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-density enterprise SaaS workspace with clean 1px structural borders (`border-slate-200`), zero nested card clutter, and tabular monospace numerals (`font-mono tabular-nums`) for all financial figures, GPA scores, dates, and phone numbers.
  - *Color Palette & Mood*: Crisp slate canvas (`#F8FAFC`) with pure white structural surfaces (`#FFFFFF`), high-contrast slate typography (`#0F172A`), and semantic status accents (Emerald `#16A34A` for Admitted/Verified, Amber `#D97706` for Follow-up Due/Pending, Crimson `#DC2626` for Overdue/Missing).
- **Interactive Feedback & Motion**:
  - Instant optimistic state updates paired with background server persistence and clear toast confirmation messages in Bengali and English.
  - Honest empty states (e.g., if no Partner Schools are registered in the backend yet, the `Matches` tab displays a clean empty state prompting the admin to add partner schools in the B2B module rather than fabricating schools).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Strict Elimination of Hardcoded Fallbacks**
  - *Chosen Approach*: Replace all fabricated fallback values (`@gmail.com` email synthesis, `Agrani Bank PLC`, `৳18,50,000`, `Oct 29, 2026`, `Tokyo International / Osaka Meros / Fukuoka Kyushu`, `Senior Sensei Amir Hossen`, `শেখ বাসেত`) with honest backend values or explicit `"Not provided"` / `"দেওয়া হয়নি"` / `"Unassigned"` states.
  - *Why*: Counselors and visa officers rely on the CRM to know which fields are genuinely collected vs. missing. Fabricated defaults make incomplete student files look complete.
- **Decision 2:Unified `leadId` Foreign-Key Linking Across CRM, LMS, and Finance**
  - *Chosen Approach*: Generate a deterministic or shared `leadId` before dispatching `/api/enroll` and `recordPublicCourseEnrollment` so that `knltc_crm_leads`, `knltc_lms_bridges`, and `knltc_finance_transactions` share the exact same `leadId` on both client and server.
  - *Why*: Guarantees 100% reliable 2-way lookup between CRM Lead Profiles, LMS rows, and Finance receipts even before phone number normalization.
- **Decision 3: Live Reactive Sync Inside `LeadProfileModal`**
  - *Chosen Approach*: Synchronize `LeadProfileModal` state with `lead.id` and `liveStore` updates so external or inline mutations (such as promoting to the Visa Pipeline, activating LMS, or recording an invoice) never get overwritten by stale component state.
  - *Why*: Prevents accidental overwriting of `status`, `paidAmountBdt`, `tasks`, or `activityLog` when switching tabs inside the 360° profile.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Two-Way Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   PUBLIC WEBSITE COURSE ENROLLMENT FORM                    │
│        "Apply Now" (TALK_TO_SALES)   │   "Enroll Now" (DIRECT_PURCHASE)    │
└──────────────────┬───────────────────┴──────────────────┬──────────────────┘
                   │                                      │
                   ▼ (CRM Lead Only)                      ▼ (Lead + LMS + Finance)
┌────────────────────────────────────────────────────────────────────────────┐
│              BACKEND SYNC LAYER (/api/enroll & /api/cms/sync)              │
│   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐   │
│   │  knltc_crm_leads   │◄─┤ knltc_lms_bridges  │  │knltc_finance_txns  │   │
│   │ (id, profile_json) │  │ (lead_id linked)   │  │(linked_lead_id)    │   │
│   └─────────┬──────────┘  └─────────┬──────────┘  └─────────┬──────────┘   │
└─────────────┼───────────────────────┼───────────────────────┼──────────────┘
              │                       │                       │
              ▼                       ▼                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD & 360° WORKSPACE                       │
│  ┌───────────────────────────────┐     ┌────────────────────────────────┐  │
│  │        CRM Leads Tab          │◄───►│       Language & LMS Tab       │  │
│  │ • Filter by LMS / Follow-up   │     │ • Live CMS Course Fee Strip    │  │
│  │ • Real Counselor & GPA Data   │     │ • Live Enrolled / Paid / Due   │  │
│  └───────────────┬───────────────┘     │ • Click Student → 360° Profile │  │
│                  │                     │ • Edit Progress % / Batch      │  │
│                  ▼                     └────────────────┬───────────────┘  │
│  ┌──────────────────────────────────────────────────────┴───────────────┐  │
│  │                    360° Candidate Profile Modal                      │  │
│  │  • Header: Status + Priority + 1-Click Follow-Up Date + Overdue Tag  │  │
│  │  • Overview: Honest Lead Info + Multi-Type Activity Log Composer     │  │
│  │  • Tasks: Category/Due Date Edit + Auto Activity Log on Completion   │  │
│  │  • Documents: 12-Doc Vault + Auto Activity Log on Status Change      │  │
│  │  • Matches: Strictly Real Partner Schools from Backend Store         │  │
│  │  • Applications & LMS: All 4 Courses (JFT, N5, N4, Combo) + Progress │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Synchronization

1. **Zero-Hardcode Data Sanitization**:
   - **Lead Information**: `email` displays `lead.email || "Not provided"` (never synthesizes `${name}@gmail.com`). `sponsorBankName` defaults to `""` and `sponsorBankBalanceBdt` defaults to `0` unless entered. `createdAt` formats the real timestamp or `"—"`.
   - **Partner School Matching**: `schoolMatches` in `LeadProfileModal` reads exclusively from `liveStore.partnerSchools`. If `partnerSchools` is empty, it renders an empty state with a button to navigate to the B2B Partner Schools tab.
   - **Staff & Sensei Assignment**: `recordPublicCourseEnrollment`, `/api/enroll`, and Tele-Caller actions resolve instructors and counselors dynamically from `store.staffList` or `currentUser?.name`, falling back to `"Unassigned"` rather than hardcoded personal names.
2. **Public Enrollment → CRM & LMS Bridge (`recordPublicCourseEnrollment` & `/api/enroll`)**:
   - Accepts `flowMode` (`"TALK_TO_SALES"` vs `"DIRECT_PURCHASE"`) and a shared `leadId`.
   - When `flowMode === "TALK_TO_SALES"` (or no `trxId` is provided):
     - Creates/updates the CRM Lead (`status: "NEW"`, `isCourseEnrolled: false`, `contractAmountBdt: netCourseFeeBdt`, `paidAmountBdt: 0`, `dueAmountBdt: netCourseFeeBdt`) and records the application in `knltc_course_enrollments`.
     - Does **not** create a premature `knltc_lms_bridges` row until the student enrolls or an admin activates their LMS portal.
   - When `flowMode === "DIRECT_PURCHASE"` (with `trxId`):
     - Creates/updates the CRM Lead (`status: "ADMITTED"`, `isCourseEnrolled: true`), creates the `knltc_lms_bridges` record with `lead_id: existingLead.id`, and creates the `knltc_finance_transactions` row with `linked_lead_id: existingLead.id`.
     - Calls `syncToServer("UPSERT", ...)` for `knltc_crm_leads`, `knltc_lms_bridges`, and `knltc_finance_transactions` so client and server state remain 100% identical.
3. **Interactive Component & State Mapping**:
   - **Header Follow-Up Date Control**: Changing the date input in the Lead Profile header immediately calls `persistLeadChanges({ followUpDate })` and appends a `FOLLOW_UP` activity log entry.
   - **Standalone Activity Composer**: Allows logging `CALL`, `WHATSAPP`, `OFFICE_VISIT`, or `MEETING_NOTE` without forcing a status change, while optionally updating `followUpDate`.
   - **Task & Document Audit Trail**: Toggling a task checkbox, editing a task due date/category, or changing a document's verification status (`MISSING` / `SUBMITTED` / `VERIFIED`) persists the updated array to `knltc_crm_leads` (`profile_json` + `leadExtendedProfiles`) and logs the action in `activityLog`.
   - **Language & LMS Tab Controls**: Adds inline progress slider/input (`0%–100%`), batch/sensei editor, delete button, and `Open 360° Lead Profile` trigger for every LMS student row.
