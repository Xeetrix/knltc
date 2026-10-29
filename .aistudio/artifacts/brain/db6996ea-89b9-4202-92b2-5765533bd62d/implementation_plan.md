# Unified Full-Page 360° Profile Workspace (CRM Leads, Visa, B2B Agents & Partner Schools)

Transform the student, visa applicant, B2B sub-agent, and partner school profile views into a clean, full-page workspace inspired by modern international education CRM design—featuring a dedicated `← Back` navigation header, quick `Rate Lead` & `Edit` controls, a 6-tab horizontal architecture (`Overview`, `Tasks`, `Documents`, `Matches`, `Applications`, `Invoices`), an `AI Profile Summary` card with 1-click Gemini AI counselor advice, an inline `Update Status` composer, and a chronological `Activity Timeline` synced with Google Sheets.

## User Review & Critical Decisions

> [!IMPORTANT]
> All core product decisions have been confirmed from your answers and the reference design:

- **Confirmed Decision 1 — Full-Page Workspace Navigation**: Clicking on any Student Lead, Visa Applicant, B2B Sub-Agent, or Partner School opens a full-page workspace inside the dashboard canvas with a top `← Back to Leads / Schools / Agents` navigation bar (plus `Prev / Next` record stepping) rather than a cramped popup modal.
- **Confirmed Decision 2 — Unified Across All 4 Core Entities**: This 6-tab layout (`Overview`, `Tasks`, `Documents`, `Matches`, `Applications`, `Invoices`) applies uniformly across **CRM Student Leads**, **Visa Pipeline Applicants**, **B2B Sub-Agents**, and **Japanese Partner Schools**.
- **Confirmed Decision 3 — Hybrid Instant + 1-Click Gemini AI Profile Summary**: The `✨ AI PROFILE SUMMARY` card immediately renders an intelligent narrative summary from live academic, document, and call-log data, and includes a **1-Click AI Counselor Advice** button powered by server-side Gemini (`gemini-3.8-flash`) that saves the generated counselor strategy directly to the Google Sheet `profile_json`.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces modal-based profile popups with an airy, structured, two-column full-page profile command center that gives counselors, visa officers, and branch managers complete context on a candidate or partner at a glance.
- **Target Audience / Persona**: KNLTC Tele-Counselors, Admission Counselors, Visa Officers, and Branch Managers handling 350+ student leads, partner Japanese language institutes, and B2B referral agents.
- **Key Value**: Eliminates visual clutter by organizing 360° profile data into scannable cards (`Lead Information`, `Academic Profile`, `AI Profile Summary`, `Update Status`, `Activity Timeline`) while keeping deep actions (`Tasks`, `Documents`, `School Matches`, `Visa/COE Applications`, `Invoices`) one tab click away.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Opening a Profile**: Clicking a row or `360° Profile` in CRM Leads, Visa Kanban, B2B Agents, or Partner Schools transitions the workspace into the Full-Page Profile View with a top `← Back to Leads` breadcrumb and `Prev / Next` candidate switcher.
  2. **Header & Quick Actions**: Displays the circular initial/photo avatar, full name, `Edit` button (toggles inline profile editor modal/drawer for full bio fields), `Delete` button, `🌐 Japan · [Program Label]` subtitle, current status pill (`📞 Contacted`), and a `Rate lead ⌄` dropdown (`Hot`, `Warm`, `Cold`).
  3. **Tab 1 — `👤 Overview` (2-Column Asymmetric Layout)**:
     - **Left Column (35% width)**:
       - **Lead / Partner Information Card**: Clean white card with icon-labeled rows for `Phone` (with 1-click call/WhatsApp), `Email`, `Country (Japan)`, `Program`, `Source`, `Added Date`, `Counselor & Branch`, and `Passport No`.
       - **Academic & Language Profile Card**: Soft indigo-tinted card (`bg-indigo-50/70 border-indigo-100`) displaying `SSC GPA`, `HSC GPA`, `Program / JLPT Level`, `Study Gap`, and `Eligibility %` (or `Tuition Fee`, `Min GPA`, `Commission Rate` for Partner Schools/Agents).
     - **Right Column (65% width)**:
       - **`✨ AI PROFILE SUMMARY` Card**: Soft violet/indigo-accented card presenting a natural-language executive summary of academic strength, program interest, document readiness, recent call notes, and recommended next counselor action—plus a **`✨ Deep AI Analysis`** button.
       - **`UPDATE STATUS` Card**: Displays the active status badge (`📞 Contacted — current status`) alongside a **`+ Add Update`** button that opens an inline status + call note form (`New Status`, `Next Follow-up Date`, `Call Note`) and logs the transition directly to the timeline and Google Sheets.
       - **`🕒 ACTIVITY TIMELINE` Card**: Chronological vertical timeline showing status transition pills (`New Lead → Contacted`), timestamp + counselor name, and italicized call notes inside quotation marks.
  4. **Tab 2 — `📋 Tasks`**: Interactive counselor follow-up and document collection task list with checkboxes, due dates, assignee tags, and `+ Add Task`.
  5. **Tab 3 — `📁 Documents`**: 12-item Japan COE & Embassy Document Vault (or Partner MOU Vault) with direct Google Drive upload, verification status (`Pending`, `Uploaded`, `Verified`), and file preview.
  6. **Tab 4 — `✨ Matches`**: Smart compatibility matcher that automatically scores and ranks Partner Japanese Schools & SSW Programs against the student's GPA, study gap, and language level with 1-click school assignment (or shows matched students when viewing a Partner School/Agent).
  7. **Tab 5 — `🏛️ Applications`**: 10-Stage Japan COE & Embassy Visa Pipeline progress tracker and LMS Japanese Language Batch enrollment controls.
  8. **Tab 6 — `🧾 Invoices`**: Contract breakdown (`Contract BDT`, `Paid BDT`, `Due BDT`), payment history table, 1-click fee collection, and printable official money receipt.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-Trust Atmospheric Minimalism & Clean SaaS CRM Workspace.
  - *Color Palette & Mood*: Crisp `#F8FAFC` (`bg-slate-50/70`) workspace canvas, pure `#FFFFFF` surface cards with `#E2E8F0` (`border-slate-200/80`) 1px borders, soft `#EEF2FF` (`bg-indigo-50/60`) academic highlight card, `#F5F3FF` (`bg-violet-50/70`) AI summary surface with `#6D28D9` (`text-violet-700`) header badge, and `#EFF6FF` (`bg-blue-50 text-blue-700`) status pills.
  - *Typography & Hierarchy*: Clean sans-serif hierarchy with `text-2xl font-bold tracking-tight` candidate name, `text-[11px] font-bold uppercase tracking-wider text-slate-400` card section headers, and `tabular-nums` for all GPAs, dates, and financial figures.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Full-Page Workspace View Instead of Overlay Modal**
  - *Chosen Approach*: Render the selected profile directly inside the main dashboard viewport with a `← Back` button and keyboard/button `Prev / Next` navigation.
  - *Why*: Matches the reference design, eliminates double scrollbars, gives the 6 tabs and 2-column layout room to breathe, and feels like a dedicated enterprise CRM page.
- **Decision 2 — Instant Narrative Summary + Optional Server-Side Gemini Enhancement**
  - *Chosen Approach*: Immediately synthesize a readable English/Bengali narrative summary from the candidate's GPA, program, document count, and latest call note so the card is never empty or slow, while offering a 1-click Gemini (`gemini-3.8-flash`) button for deeper counselor recommendations.
  - *Why*: Guarantees zero-latency loading across all 356+ leads while giving counselors on-demand AI strategy saved directly into `profile_json`.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        KNLTC Master Dashboard Canvas                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation Bar:  [← Back to Leads]     [◀ Prev] [14 of 356] [Next ▶]│  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │ Profile Header: (A) Ahmad Abdullah  [✎ Edit] [🗑]                      │  │
│  │                 🌐 Japan · Language Program                            │  │
│  │                 [📞 Contacted]  [Rate lead: Warm ▾]                    │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │ 6-Tab Bar: [👤 Overview] [📋 Tasks] [📁 Documents] [✨ Matches]         │  │
│  │            [🏛️ Applications] [🧾 Invoices]                             │  │
│  └───────────────┬────────────────────────────────────────┬───────────────┘  │
│                  │                                        │                  │
│                  ▼ (Left Column 35%)                      ▼ (Right Column 65%)│
│  ┌───────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ LEAD / PARTNER INFORMATION    │  │ ✨ AI PROFILE SUMMARY               │  │
│  │ • Phone, Email, Country       │  │ Instant narrative + [✨ AI Advice]  │  │
│  │ • Program, Source, Added Date │  ├─────────────────────────────────────┤  │
│  ├───────────────────────────────┤  │ UPDATE STATUS        [+ Add Update] │  │
│  │ ACADEMIC / PARTNER PROFILE    │  │ [📞 Contacted] — current status     │  │
│  │ • SSC GPA, HSC GPA            │  ├─────────────────────────────────────┤  │
│  │ • Program Level, Study Gap    │  │ 🕒 ACTIVITY TIMELINE                │  │
│  └───────────────────────────────┘  │ ● New Lead → [Contacted]            │  │
│                                     │   Oct 29, 2026 · "Call note..."     │  │
│                                     └─────────────────────────────────────┘  │
└──────────────────────────────────────────────┬───────────────────────────────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    ▼                                                     ▼
   ┌─────────────────────────────────┐                   ┌─────────────────────────────────┐
   │ /api/admin/ai-profile-summary   │                   │ /api/admin/sheets-sync          │
   │ Server-side @google/genai       │                   │ Google Apps Script (Code.gs)    │
   │ (gemini-3.8-flash)              │                   │ Persists profile_json & tables  │
   └─────────────────────────────────┘                   └─────────────────────────────────┘
```

### Data Model & State
- **Extended `profile_json` Support**:
  - Stores `sscGpa`, `hscGpa`, `tasks` (array of `{ id, title, dueDate, completed, category }`), `aiSummary` (cached narrative string), `documents` (12-item vault), and `activityLog` (status transitions `{ fromStatus, toStatus, note, createdAt, actorName }`).
- **Interactive Component & State Mapping**:
  - **`+ Add Update` Handler**: Opens an inline composer inside the `UPDATE STATUS` card; submitting updates the lead's status, records a `fromStatus → toStatus` entry in `activityLog`, triggers cross-module sync (`promoteLeadToVisaPipeline` if `ADMITTED`), and saves to Google Sheets.
  - **`Rate lead ▾` Dropdown**: Updates `priority` (`HOT`, `WARM`, `COLD`) in real time and logs the rating change.
  - **`✨ Matches` Engine**: Compares candidate `sscGpa`/`hscGpa`, `studyGapYears`, and `japaneseProficiency` against `partnerSchools` criteria (`minGpaRequired`, `maxStudyGapYears`, `minLanguageLevel`) and allows 1-click school assignment.
