# 360° Lead & Student Profile Command Center Upgrade

This plan transforms the existing two-column Lead Profile modal into a multi-tab **360° Student & Visa Command Center**. Counselors and administrators will be able to evaluate Japan visa eligibility, track 12 required immigration documents, calculate sponsor bank solvency and education loan needs, log timestamped counseling and call activities with priority tags, send 1-click contextual WhatsApp templates, collect fee installments with instant money receipts, advance 10-step visa stages, and print an official Student Assessment & Admission Sheet—all from a single unified profile interface.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> All four core product decisions have been confirmed through your selections and are incorporated into this architecture:

- **Confirmed Decision 1 (Interface Architecture)**: **Multi-Tab 360° Command Center** with five dedicated workspace tabs:
  1. **Bio & Eligibility (`bio`)**: Personal/academic bio, Japan Exam (JLPT/NAT/JFT) score tracker, and live **Auto Japan Visa Eligibility Score** (0–100%).
  2. **Documents & Sponsor (`docs`)**: **12-Item Immigration Document Checklist Vault** (Pending / Submitted / Verified) + **Sponsor Bank Solvency & Loan Eligibility Calculator**.
  3. **Finance & Visa (`finance_visa`)**: **Live Student Ledger** (Contract, Paid, Due, 1-Click Fee Collection & Receipt) + **Direct 10-Step Visa Stage Controller** & School Interview status + **LMS Batch Progress & Attendance Summary**.
  4. **Counseling Timeline (`timeline`)**: **Timestamped Call & Meeting Activity Log**, **Priority Tags (`HOT`, `WARM`, `COLD`)**, scheduled follow-up reminders, and **1-Click Contextual WhatsApp Templates**.
  5. **Portal Login & Print (`access_print`)**: Student Portal Login provisioning, module permission toggles, and a **Printable Official Student Assessment & Admission Sheet**.
- **Confirmed Decision 2 (Eligibility & Document Vault)**: Automatic calculation of Japan Immigration eligibility based on SSC/HSC GPA, Study Gap years, Japanese proficiency/exam scores, and Sponsor Bank Solvency, paired with a persistent 12-document verification vault.
- **Confirmed Decision 3 (Counseling & Communication Engine)**: Structured activity log entries (Call, Office Visit, Voice/Meeting Summary, Document Follow-up, WhatsApp Sent) with counselor attribution, priority status, and pre-filled WhatsApp message templates in Bengali and English.
- **Confirmed Decision 4 (Live Cross-Module ERP Actions)**: Direct synchronization with the central ERP store so fee collection, visa stage updates, LMS batch progress updates, and partner school/agent assignments immediately reflect across Overview, CRM, Visa Pipeline, Partners, HR, and Finance.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces the static lead edit dialog with a comprehensive 360° candidate dossier that guides a student from initial inquiry all the way to Japanese language batch progress, COE document verification, fee settlement, and visa stamping.
- **Target Audience / Persona**: Admission Counselors, Tele-Counselors, Visa Processing Officers, and Branch Managers at Dhaka HQ and Khulna Branch.
- **Key Value**: Eliminates switching between 5 different dashboard tabs to check a student's payment history, visa stage, LMS attendance, or missing documents. Everything linked to a candidate is viewable and actionable in one place.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Header & Quick-Status Bar**: Displays candidate avatar initials, full name, file tracking ID, priority badge (`HOT` / `WARM` / `COLD`), live **Japan Visa Eligibility Score** meter, quick-call/WhatsApp triggers, and a **"Print Assessment Sheet"** action button.
  2. **Tab 1 — Bio, Academic & Exam Score Tracker**: Edit personal/guardian details, SSC/HSC/Diploma/BSc GPA breakdown, study gap years, and JLPT/NAT/JFT exam registration/score details. A live **Eligibility Breakdown Panel** explains the candidate's score across 4 criteria (GPA, Study Gap, Language Level, Sponsor Solvency).
  3. **Tab 2 — Document Checklist Vault & Sponsor Solvency Calculator**:
     - Interactive 12-item Japan Immigration COE checklist (Passport, Birth Certificate, NID, SSC & HSC Transcripts/Certificates, Language Certificate, Bank Solvency Certificate, 6-Month Bank Statement, Sponsor Tax/TIN Certificate, Income Source Proof, Family Relationship Certificate) with 1-click status cycling (`MISSING` ➔ `SUBMITTED` ➔ `VERIFIED`) and completion progress bar.
     - Sponsor Solvency Calculator comparing required balance (e.g., ৳18,00,000 – ৳22,00,000 BDT) against current sponsor balance and flagging whether Bank Loan Assistance (Agrani / Social Islami / Pubali Bank) is required.
  4. **Tab 3 — Live Finance, 10-Step Visa Controller & LMS Summary**:
     - **Student Ledger**: Shows Contract Amount, Paid Amount, Due Balance, and a chronological table of all receipts linked to this student, plus an inline **"Collect Fee Installment"** form that issues an official receipt and updates Finance immediately.
     - **10-Step Visa Stage Controller**: Interactive stage selector (Stage 1 to Stage 10), COE status, School Interview status (`NOT_SCHEDULED`, `SCHEDULED`, `PASSED`, `RE_INTERVIEW`), Target Partner School, and Assigned Visa Officer.
     - **LMS Batch & Attendance Summary**: Shows enrolled batch, assigned Japanese Sensei, course progress percentage slider, and attendance percentage.
  5. **Tab 4 — Counseling Timeline, Priority & WhatsApp Templates**:
     - Set lead priority (`HOT` / `WARM` / `COLD`) and next follow-up date.
     - Add timestamped counseling/call/meeting summary notes (tagged as Phone Call, Office Visit, Document Review, or Guardian Meeting).
     - 1-Click WhatsApp Templates (Initial Counseling Summary, Missing Document Reminder, Zoom School Interview Prep, Due Fee Installment Reminder, Login Credentials) that open WhatsApp with personalized Bengali/English messages and auto-log the outreach in the timeline.
  6. **Tab 5 — Portal Login Access & Printable Official Dossier**:
     - Manage Student Portal credentials and module access permissions.
     - Preview and print a clean A4 **Official Student Assessment & Admission Sheet** containing bio, eligibility score, document checklist status, financial summary, and signature blocks for Student and Counselor.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-density enterprise SaaS dossier with clean single-elevation surfaces, crisp 1px structural borders (`border-slate-200/80`), and zero nested card clutter.
  - *Color Palette & Mood*: Crisp white (`#FFFFFF`) and cool slate (`#F8FAFC`) canvas, deep slate (`#0F172A`) primary typography and active tab indicators, semantic emerald (`#16A34A`) for verified/eligible states, amber (`#D97706`) for pending documents/warm priority, and crimson (`#B91C1C`) for hot priority/missing critical items.
  - *Typography & Hierarchy*: Clean sans-serif headings with `tabular-nums` (`font-mono`) strictly enforced on all financial figures, eligibility percentages, GPA numbers, and dates.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Deterministic Auto-Calculated Japan Visa Eligibility Score**
  - *Chosen Approach*: Compute a transparent 0–100% score in real time from 4 weighted factors: Academic GPA (30 pts), Study Gap (25 pts — 0–2 yrs full points, 3–5 yrs moderate, 6+ yrs requires SSW/strong justification), Japanese Language Level/Exam (25 pts), and Sponsor Solvency/Document Readiness (20 pts).
  - *Why*: Gives counselors an instant, objective assessment of whether a candidate is best suited for Regular Student Visa, Premium Package, or SSW Skill Visa.
- **Decision 2: Relational Sync Between Profile Tabs and Global ERP Store**
  - *Chosen Approach*: Recording a fee payment, advancing a visa stage, or updating LMS progress inside the Lead Profile invokes the same central store orchestrators (`addFinancialTransaction`, `updateVisaStage`, `promoteLeadToVisaPipeline`) used by the main dashboard tabs.
  - *Why*: Guarantees 100% data consistency across CRM, Finance, Visa Pipeline, Partners, and HR KPIs without duplicate state logic.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   LeadProfileModal (360° Command Center)                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Top Summary Header: Avatar · Tracking ID · Priority · Eligibility %  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────┬───────────────┬───────────────┬──────────────┬────────┐  │
│  │ 1. Bio &     │ 2. Docs &     │ 3. Finance,   │ 4. Timeline  │ 5.     │  │
│  │ Eligibility  │ Sponsor Vault │ Visa & LMS    │ & WhatsApp   │ Login  │  │
│  │              │               │               │              │ & Print│  │
│  └──────┬───────┴───────┬───────┴───────┬───────┴──────┬───────┴────┬───┘  │
└─────────┼───────────────┼───────────────┼──────────────┼────────────┼──────┘
          │               │               │              │            │
          ▼               ▼               ▼              ▼            ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    Central ERP Store (knltc-cms-store)                     │
│  • CrmLead (priority, examScores, documentChecklist, activityLog, sponsor) │
│  • VisaApplicant (10-Step Stage, interviewStatus, COE & B2B Commission)    │
│  • FinancialTransaction (Live Student Receipts, Contract/Paid/Due Sync)    │
│  • LmsUserBridge (Batch, Sensei, Progress %, Attendance %)                 │
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Model Enhancements (`CrmLead`)

We will extend `CrmLead` with structured optional fields (fully backward-compatible with existing leads):
- `priority?: "HOT" | "WARM" | "COLD"`
- `sscGpa?: string`, `hscGpa?: string`, `graduationYear?: string`
- `japaneseExamType?: "NONE" | "JLPT_N5" | "JLPT_N4" | "NAT_5Q" | "NAT_4Q" | "JFT_BASIC"`
- `japaneseExamScore?: string`, `japaneseExamStatus?: "NOT_REGISTERED" | "REGISTERED" | "PASSED"`
- `sponsorRelation?: "FATHER" | "MOTHER" | "BROTHER" | "SISTER" | "SELF"`, `sponsorOccupation?: string`, `sponsorMonthlyIncomeBdt?: number`, `sponsorBankName?: string`, `sponsorBankBalanceBdt?: number`, `bankLoanRequired?: boolean`, `preferredLoanBank?: string`
- `schoolInterviewStatus?: "NOT_SCHEDULED" | "SCHEDULED" | "PASSED" | "RE_INTERVIEW"`, `schoolInterviewDate?: string`
- `attendancePercentage?: number`
- `documentChecklist?: Array<{ id: string; titleBn: string; titleEn: string; status: "MISSING" | "SUBMITTED" | "VERIFIED"; updatedAt?: string }>`
- `activityLog?: Array<{ id: string; type: "CALL" | "VISIT" | "MEETING_NOTE" | "WHATSAPP" | "DOC_UPDATE" | "PAYMENT" | "STAGE_CHANGE"; summary: string; counselorName: string; createdAt: string }>`

### Interactive Component & State Mapping

- **CRM Table Integration**: The main CRM table will display the candidate's **Priority tag (`HOT`/`WARM`/`COLD`)**, **Document Readiness (`X/12 Verified`)**, and **Eligibility Score (`%`)** alongside their school, agent, and financial due status so counselors can filter and prioritize leads at a glance.
- **Printable Official Dossier**: Clicking **"Print Official Assessment Sheet"** renders a clean print-ready layout (`window.print()`) formatted specifically for physical student files and guardian sign-off.
