# KNLTC Enterprise ERP — Unified Cross-Module Interconnection & Industry-Grade Upgrade

An end-to-end relational upgrade of the KNLTC Operations Dashboard that interconnects **CRM**, **Visa Pipeline**, **Partner Institutions & B2B Agents**, **LMS**, **HR & Payroll**, **Finance**, and **Executive Overview** into a single, reactive operational engine where actions in any module automatically propagate across all linked business records.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and workflow decisions were confirmed during interactive discovery and govern how all six core modules synchronize in real time:

- **Confirmed Decision 1 — Automated Lead-to-Pipeline & Partner Sync**: Enrolling a CRM lead or opening a Visa File automatically provisions a linked **Visa Pipeline** applicant record, binds the selected **Japanese Partner School** (updating active student seat counts), and links the referring **B2B Agent** (incrementing referral counters).
- **Confirmed Decision 2 — Financial Ledger, Student Dues, B2B Commission & 1-Click Payroll Sync**:
  - Student fee payments in **Finance** bind directly to CRM/Visa student profiles to automatically calculate total contract value, paid installments, and live remaining dues.
  - Advancing a student to **Stage 6 (COE Approved)** or **Stage 9 (Visa Stamped)** in the Pipeline automatically calculates Japanese Partner School commission receivables (JPY/BDT) and triggers pending commission accruals for the linked B2B Agent.
  - **HR** includes a **1-Click Monthly Payroll Disbursement** action (individual or bulk) that computes base salary + earned performance bonuses and logs verified `EXPENSE_PAYROLL` entries into the Finance General Ledger.
- **Confirmed Decision 3 — Role-Based HR Assignment & Automated KPI Attribution**:
  - **Counselors / Tele-Counselors** are dynamically selectable when assigning CRM leads; converting a lead to `ADMITTED` automatically increments the assigned counselor's admission KPI.
  - **Senior Sensei** are linked to LMS language batches; logging a class session updates their monthly class KPI.
  - **Visa Officers** are assigned to Visa Pipeline files; advancing a file across COE/Embassy milestones automatically increments their processed file KPI.
- **Confirmed Decision 4 — Executive Overview Command Center**: The Overview tab features four live cross-module intelligence blocks:
  1. **End-to-End Conversion Funnel** (CRM Leads → Counseled → Enrolled/LMS → Visa File Opened → COE Approved → Visa Stamped & Departed).
  2. **Actionable Financial Alerts** (Students with pending fee dues & B2B Agents with payable commission balances).
  3. **Partner School Quota & Placement Matrix** (Seat allocation vs. assigned students and expected JPY commission per school).
  4. **Top Performer Leaderboard** (Ranking Counselors by conversion rate and B2B Agents by successful placements).

---

### 1. Overview & Core Concept

- **What It Does**: Transforms isolated dashboard tabs into a relational Enterprise Resource Planning (ERP) suite tailored for a Japanese Language & Visa Processing consultancy. Every student, partner school, B2B sub-agent, staff member, and financial voucher shares relational IDs so state transitions cascade cleanly without manual double-entry.
- **Target Audience / Persona**: Managing Director (Super Admin), Branch Managers (Dhaka HQ & Khulna), Tele-Counselors, Japanese Language Sensei, Visa Documentation Officers, and Open-Book Investors.
- **Key Value**: Eliminates data silos, prevents revenue leakage (untracked student dues or unbilled school commissions), automates B2B agent commission accounting, and gives leadership real-time visibility into operational bottlenecks.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Lead Intake to Admission (CRM → HR → LMS → Pipeline → Partners → Finance)**:
     - Admin/Counselor creates or edits a Lead in CRM, assigning an active **Counselor** (from HR), an optional **B2B Referring Agent** (from Partners), and a **Target Partner School**.
     - When the Lead is admitted/enrolled (via quick admission or the 360° Student Provisioning modal), the system automatically:
       - Creates/updates the **Visa Pipeline** card linked to the chosen Partner School and Visa Officer.
       - Increments the **Partner School's** active student count and the **B2B Agent's** referred student count.
       - Increments the assigned **Counselor's** achieved admissions KPI in HR.
       -Optionally logs the initial **Course Fee / Package Advance** directly into the **Finance** ledger and generates an instant Money Receipt.
  2. **Visa Stage Progression to Commission & Billing (Pipeline → Partners → Finance → HR)**:
     - Moving a candidate in the **10-Stage Visa Pipeline** to **Stage 6 (COE Approved)** or **Stage 9 (Visa Stamped)** automatically:
       - Marks COE/Visa status and increments the assigned **Visa Officer's** file processing KPI.
       - Accrues the **B2B Agent's** pending commission (`agreedCommissionBdt`) and increments their `successfulVisasCount`.
       - Updates the **Partner School's** expected/received JPY commission and flags the student's **COE Service Charge (৳1,20,000)** or **Premium Package** balance as due in Finance.
  3. **B2B Payout & HR Payroll Settlement (Partners / HR → Finance)**:
     - Clicking **"Settle Commission"** on a B2B Agent card moves their balance from `pendingCommissionBdt` to `paidCommissionBdt` and records an `EXPENSE_B2B_COMMISSION` voucher in Finance.
     - Clicking **"Disburse Salary"** on an HR staff member (or **"Run Monthly Payroll"**) records an `EXPENSE_PAYROLL` transaction (Base Salary + Performance Bonus) in Finance.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-density, executive SaaS workspace following strict single-elevation depth (`1px solid` hairline borders, zero nested card sandwiches, zero decorative pulsing dots, zero thick left accent borders).
  - *Color Palette & Mood*: 60% Crisp Neutral Slate Canvas (`#F8FAFC` / `#FFFFFF`), 30% Structural Surfaces & Hairline Dividers (`#E2E8F0`, `#475569`), 10% High-Intent Accent Budget (`#0F172A` Primary Executive Slate, `#E11D48` Crimson Japan Accent, `#059669` Nominal/Paid Emerald, `#D97706` Pending/Due Amber).
  - *Typography & Hierarchy*: Clean geometric display headers paired with high-legibility body prose and strict `font-mono tabular-nums` on every financial figure, conversion percentage, phone number, receipt ID, and KPI counter.
  - *Zero-Pill Metadata Discipline*: Informational metadata (dates, branch codes, tracking numbers, secondary tags) rendered as clean inline text with middle-dot (`·`) separators; segmented controls and interactive status filters styled as crisp functional buttons.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Relational Foreign Keys with Graceful Fallback Matching**:
  - *Chosen Approach*: Add explicit relational fields (`leadId`, `visaApplicantId`, `partnerSchoolId`, `b2bAgentId`, `assignedCounselorId`, `assignedVisaOfficerId`, `assignedSenseiId`, `contractAmountBdt`, `paidAmountBdt`) while maintaining backward-compatible fallback matching by name/phone for existing records.
  - *Why*: Ensures 100% compatibility with existing records and Supabase tables while enabling deterministic cross-module updates.
  - *Alternatives Considered*: Strict database-only foreign keys that would break if a user types a custom school or staff name before creating the entity.
- **Decision 2 — Atomic Cross-Module Orchestrator Functions in Store**:
  - *Chosen Approach*: Centralize multi-entity state mutations inside dedicated store actions (e.g., `promoteLeadToPipeline`, `advanceVisaStageWithSync`, `recordStudentPaymentWithSync`, `settleB2bCommission`, `disburseStaffPayroll`) that update local state and fire non-blocking Supabase syncs.
  - *Why*: Guarantees UI consistency across all tabs immediately upon any user interaction without page reloads or stale counters.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Cross-Module Synchronization Diagram**:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                   EXECUTIVE OVERVIEW COMMAND CENTER (Live KPIs)                   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐  │
│  │ Lead→Visa Funnel │ │ Dues & B2B Alert │ │ School Quota Map │ │ Leaderboards │  │
│  └────────▲─────────┘ └────────▲─────────┘ └────────▲─────────┘ └──────▲───────┘  │
└───────────┼────────────────────┼────────────────────┼──────────────────┼──────────┘
            │                    │                    │                  │
┌───────────┴────────────────────┴────────────────────┴──────────────────┴──────────┐
│                 RELATIONAL ERP STATE ENGINE & SUPABASE SYNC                       │
└─────┬─────────────────┬──────────────────┬──────────────────┬───────────────┬─────┘
      │                 │                  │                  │               │
      ▼                 ▼                  ▼                  ▼               ▼
┌───────────┐     ┌───────────┐      ┌───────────┐      ┌───────────┐   ┌───────────┐
│  1. CRM   │────▶│2. PIPELINE│─────▶│3. PARTNERS│      │   4. HR   │   │ 5. FINANCE│
│  & LEADS  │     │ (10-STAGE)│      │ & B2B NET │      │ & PAYROLL │   │  & LEDGER │
├───────────┤     ├───────────┤      ├───────────┤      ├───────────┤   ├───────────┤
│• Counselor│     │• Visa Off.│      │• JP School│      │• Role KPIs│   │• Fee Dues │
│• B2B Ref  │     │• School ID│      │  Seat/Comm│      │• Auto-Sync│   │• B2B Pay  │
│• School   │     │• Stage 6/9│      │• B2B Agent│      │• 1-Click  │   │• Payroll  │
│• Auto-Sync│     │  Triggers │      │  Accruals │      │  Disburse │   │• P&L/Vouch│
└───────────┘     └───────────┘      └───────────┘      └───────────┘   └───────────┘
```

- **Data Model & Relational Enhancements**:
  - **CRM Lead (`CrmLead`)**: Adds `b2bAgentId`, `partnerSchoolId`, `assignedCounselorId`, `assignedSenseiId`, `contractTotalBdt`, `totalPaidBdt`, and `dueAmountBdt`.
  - **Visa Applicant (`VisaApplicant`)**: Adds `leadId`, `partnerSchoolId`, `b2bAgentId`, `visaOfficerId`, `contractTotalBdt`, `totalPaidBdt`, `schoolCommissionClaimed`, and `b2bCommissionTriggered`.
  - **Partner School (`JapanesePartnerSchool`)**: Adds `intakeQuota` (default 20 seats per intake) to track filled vs. available seats and live student roster filtering.
  - **HR Staff (`StaffMember`)**: Adds `lastPayrollPaidMonth` and automatic KPI linkage to assigned Leads (`COUNSELOR` / `TELE_COUNSELOR`), LMS Batches (`SENIOR_SENSEI`), and Visa Files (`VISA_OFFICER`).
  - **Financial Transaction (`FinancialTransaction`)**: Adds `linkedLeadId`, `linkedVisaId`, `linkedAgentId`, `linkedStaffId`, and `linkedSchoolId` for full audit traceability.

- **Interactive Component & State Mapping**:
  - **Overview Module**:
    - *End-to-End Funnel Bar*: Interactive stage bars showing exact count and conversion % from `Total Leads` → `Counseled` → `Admitted / LMS` → `Visa File Open` → `COE Approved` → `Visa Stamped`. Clicking any stage jumps directly to that filtered view.
    - *Dues & Commission Alert Panel*: Lists students with `dueAmountBdt > 0` (with 1-click **"Collect Fee"** button opening the pre-filled payment modal) and B2B Agents with `pendingCommissionBdt > 0` (with 1-click **"Pay Commission"** button).
    - *Partner School Quota Tracker*: Visual capacity bars (`activeStudentsCount / intakeQuota`) and expected JPY commission per school.
    - *Top Performer Leaderboard*: Live ranking of Counselors (by admissions & conversion %) and B2B Agents (by referrals & COE success).
  - **CRM Module**:
    - Lead creation and 360° Student Profile modals include live dropdown selectors populated from **HR Counselors**, **Partner Schools**, and **B2B Agents** (with graceful empty-state prompts if none exist yet).
    - Status change to `ADMITTED` or clicking **"Promote to Visa Pipeline"** automatically creates the linked Visa Pipeline record, updates Partner School & B2B Agent counters, and increments the Counselor's admission KPI.
    - Displays live **Payment Status (Paid / Due ৳)** directly on each student row with a 1-click **"Collect Payment"** action.
  - **Visa Pipeline Module**:
    - Filterable by **Partner School**, **Assigned Visa Officer**, **Package Type**, and **Stage**.
    - Advancing a student to **Stage 6 (COE Approved)** automatically triggers B2B Agent pending commission accrual and flags the student's COE service charge receivable.
    - Advancing to **Stage 7/9** provides a 1-click **"Claim School JPY Commission"** action that converts the school's JPY commission into a verified `INCOME` ledger transaction and updates `totalCommissionReceivedYen`.
  - **Partners & B2B Module**:
    - Each **Japanese Partner School** card displays its live assigned students from CRM/Pipeline, seat quota utilization (`Filled / Quota`), and a **"Record School Commission (JPY → BDT)"** button that logs the inflow in Finance.
    - Each **B2B Agent** card displays live referred students, successful COE/Visas, pending vs. paid commission, and a **"Pay Commission"** button that settles the pending balance and creates an `EXPENSE_B2B_COMMISSION` entry in Finance.
  - **HR & Payroll Module**:
    - Displays each staff member's live linked workload (e.g., Assigned Leads count for Counselors, Active Batches for Sensei, Active Visa Files for Visa Officers).
    - Includes a **"Pay Monthly Salary"** button on each staff card (plus a bulk **"Disburse All Active Payroll"** action) that calculates `monthlyBaseSalaryBdt + performanceBonusBdt`, marks the current month as paid, and posts an `EXPENSE_PAYROLL` voucher in Finance.
  - **Finance Module**:
    - **Student Fee Collection Modal** includes a searchable **Student Selector** (from CRM/Visa Pipeline) that auto-fills the student's name, phone, branch, package type, and current due balance, deducting the payment from their remaining due upon save.
    - **Student Dues Sub-View / Filter** inside Finance shows all enrolled students, their total package contract (`৳1,20,000` Regular / `৳11,00,000` Premium / `৳12,000` Course), total paid to date, remaining balance, and 1-click receipt generation.
