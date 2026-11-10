# Database & Google Apps Script (`Code.gs`) Full Integrity Plan

Complete audit and synchronization upgrade for the Google Sheets + Google Drive database engine (`Code.gs` and server sync layer) so all 17 tables, CRM ↔ LMS relational links, task deletions, and live sheet purges operate with 100% accuracy and zero fallback data.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Database Audit Summary (ডাটাবেস অডিট রিপোর্ট):**
> - **যে অংশগুলো ১০০% ঠিক আছে:** ১৭টি টেবিলের স্ট্রাকচার, `Code.gs`-এর ভেতরে জিরো ডামি সিড ডাটা (`getInitialSeedDataForTable` সম্পূর্ণ খালি `[]`), Google Drive + `media_vault` ফটো/ডকুমেন্ট আপলোড এবং অটোমেটিক কলাম হেডার সিঙ্ক সম্পূর্ণ ঠিক আছে।
> - **যে ৩টি সূক্ষ্ম গ্যাপ পাওয়া গেছে (যা এই প্ল্যানে ফিক্স করা হবে):**
>   1. **`knltc_lms_bridges` টেবিলে `lead_id` কলাম মিসিং:** অ্যাপ থেকে CRM Lead ও LMS-এর ২-মুখী কানেকশনের জন্য `lead_id` পাঠানো হলেও `Code.gs`-এর `TABLE_SCHEMAS.knltc_lms_bridges`-এ `lead_id` কলামটি তালিকাভুক্ত না থাকায় Google Sheet-এ সেটি সেভ হচ্ছিল না।
>   2. **`Code.gs`-এ `PURGE_DUMMY_DATA` শুধু মেসেজ রিটার্ন করছিল:** ড্যাশবোর্ড থেকে ডামি ডাটা ক্লিয়ার করলে লোকাল মিরর পরিষ্কার হলেও লাইভ Google Sheet-এর ট্যাব থেকে পুরনো ডামি আইডি (`lead-01`, `lms-01` ইত্যাদি) মুছছিল না।
>   3. **Task ডিলিট ও `0` Contract Amount সিঙ্ক:** লিড প্রোফাইল থেকে সবগুলো টাস্ক ডিলিট করলে (`tasks: []`) সার্ভার সিঙ্কের সময় পুরনো টাস্ক ফিরে আসার সুযোগ ছিল এবং নতুন লিডের চুক্তির টাকা `0` থাকলে অটোমেটিক `120,000` বসে যাচ্ছিল।

---

## 1. Overview & Core Concept

- **What It Does**: Aligns the Google Apps Script (`Code.gs`) schema, server-side mirror serializer, and client-side hydration logic so every field in CRM Leads, 360° Lead Profiles, and Language & LMS persists losslessly to Google Sheets.
- **Target Audience / Persona**: System Administrators, Counselors, and Language Academy Managers relying on Google Sheets + Google Drive as the single source of truth.
- **Key Value**: Guarantees that copying/deploying `Code.gs` or syncing from the dashboard preserves 100% of relational IDs (`lead_id`), empty task arrays, exact `0` contract amounts for uncontracted leads, and real Google Sheet dummy row cleanup.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **1-Click `Code.gs` Copy & Setup**: When the admin copies `Code.gs` from the Dashboard Storage Manager and runs `SETUP_DATABASE`, `knltc_lms_bridges` automatically includes the `lead_id` column in Row 1 without losing any existing student rows.
  2. **CRM ↔ LMS Relational Persistence**: Enrolling a student or linking an LMS ID writes `lead_id` directly into the `knltc_lms_bridges` Google Sheet tab and local mirror.
  3. **Accurate Task & Contract Sync**: Deleting the last task in a Lead Profile keeps the task list empty after page reload, and newly created inquiry leads retain `৳0` contract amount until a package or course is selected.
- **Visual Identity & Theme**:
  - Preserves existing KNLTC dashboard and Google Sheet header styling (`#0f172a` slate header background with `#ffffff` bold text).
- **Interactive Feedback & Motion**:
  - Instant background sync indicators and accurate toast confirmations when testing or syncing the Google Sheets connection.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Add `lead_id` & `created_at` to `knltc_lms_bridges` Schema**
  - *Chosen Approach*: Add `"lead_id"` and `"created_at"` to `TABLE_SCHEMAS.knltc_lms_bridges` in Google Apps Script and include `lead_id` in all bulk sync mappers.
  - *Why*: Ensures the 2-way link between CRM Lead Profile and Language & LMS survives full Google Sheets re-syncs even if a student updates their phone number later.
  - *Alternatives Considered*: Matching only by phone number (fragile if a student changes phone format).

- **Decision 2: Real Sheet Row Cleanup on `PURGE_DUMMY_DATA` in `Code.gs`**
  - *Chosen Approach*: Execute actual row deletion in `Code.gs` for known legacy seed IDs (`lead-01..06`, `visa-01..04`, `lms-01..03`, `sch-01..04`, `b2b-01..03`, `stf-01..05`, `trx-01..05`) while leaving real user-created records untouched.
  - *Why*: Ensures live Google Sheets and the Next.js server mirror stay 100% identical and free of legacy test rows.

- **Decision 3: Preserve Explicit Empty Arrays (`[]`) and Zero (`0`) Contract Amounts**
  - *Chosen Approach*: Check `Array.isArray(parsedProfile.tasks)` instead of `parsedProfile.tasks.length > 0` during hydration, and only apply default contract amounts when explicitly requested rather than overwriting `0` with `120000`.
  - *Why*: Prevents deleted tasks from reappearing on refresh and prevents uncontracted inquiry leads from inflating financial pipeline totals.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Data Sync Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        KNLTC Next.js Application                           │
│                                                                            │
│  ┌──────────────────────────┐         ┌─────────────────────────────────┐  │
│  │ 360° Lead Profile & LMS  │ ──────► │   CMS Store & Sheet Serializer  │  │
│  │ (Tasks, Docs, Activities,│         │ • Preserves tasks: [] & ৳0      │  │
│  │  Follow-up, lead_id)     │ ◄────── │ • Maps lead_id on LMS Bridges   │  │
│  └──────────────────────────┘         └────────────────┬────────────────┘  │
└────────────────────────────────────────────────────────┼───────────────────┘
                                                         │
                                           /api/cms/sync & /api/sheets
                                                         │
                                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│               Google Sheets + Google Drive Backend (Code.gs)               │
│                                                                            │
│  ┌──────────────────────────┐         ┌─────────────────────────────────┐  │
│  │ knltc_crm_leads          │ ◄─────► │ knltc_lms_bridges               │  │
│  │ • id, phone, status      │ lead_id │ • id, lead_id, student_name     │  │
│  │ • follow_up_date         │         │ • course_level, enrollment_no   │  │
│  │ • profile_json (Full 360)│         │ • portal_fee, net_margin, batch │  │
│  └──────────────────────────┘         └─────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Component & State Mapping
- **`knltc_lms_bridges` Schema & Bulk Sync Mapper**: Maps `lead_id` alongside `id`, `student_name`, `phone`, `course_level`, `enrollment_no`, `portal_username`, `portal_password_masked`, `portal_fee_deducted_bdt`, `net_knltc_margin_bdt`, `credentials_sent_via_wa`, `credentials_sent_at`, `progress_percentage`, `active_batch`, `assigned_sensei_id`, `assigned_sensei_name`, and `created_at`.
- **`knltc_crm_leads` Serializer & Hydrator**: Preserves `contract_amount_bdt = 0` when a lead has no contract yet, and respects empty `tasks: []` and `activityLog: []` arrays in `profile_json`.
- **Apps Script `PURGE_DUMMY_DATA` Handler**: Iterates across the sheet tabs and removes only legacy demo row IDs while keeping all real leads, enrollments, and transactions intact.
