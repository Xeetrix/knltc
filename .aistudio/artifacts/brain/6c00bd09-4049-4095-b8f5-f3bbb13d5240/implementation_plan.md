# 360° Partner Institution (School / University) & B2B Agent Profile Command Center + Empty-State Centering Fix

This upgrade resolves the left-shifted empty-state text alignment across the dashboard and introduces a comprehensive **4-Tab 360° Profile Command Center** for both **Partner Institutions (Japanese Language Schools, Universities, Vocational Colleges, SSW Employers)** and **B2B Sub-Agents / Partner Agencies**, complete with institutional logos, brochure/license/MOU document vaults, tuition & commission breakdowns, live student rosters, 1-click financial settlements, B2B portal login credentials, and printable official dossiers.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> All four product and workflow decisions below were confirmed during our interactive clarification phase and govern the implementation:

- **Confirmed Decision 1 — 4-Tab 360° Profile Command Center Modal**: Both Partner Institutions (Schools/Universities) and B2B Agents will open in a dedicated multi-tab 360° Profile Command Center Modal (`Overview & Branding`, `Brochures, Licenses & MOU Vault`, `Assigned / Referred Students`, and `Commission & Financial Ledger`) alongside a fixed Empty-State Alignment across all centered containers.
- **Confirmed Decision 2 — Partner School & University Profile Scope**: Tracks Institution Logo, Category (`Japanese Language School`, `University`, `Vocational College / Senmon Gakko`, `SSW Employer`), Website & Contact Details, Intake Sessions (`Jan`, `Apr`, `Jul`, `Oct`), Seat Quota vs. Active Students, 1st-Year Tuition / Admission / Hostel Fee & Commission Breakdown (`JPY ¥` & `BDT ৳`), Eligibility Criteria (Min GPA, Study Gap, JLPT/NAT Requirement), and a Document Vault for Brochures, Prospectuses, Application Forms, and Signed MOUs.
- **Confirmed Decision 3 — B2B Sub-Agent Profile Scope**: Tracks Agency Logo, Organization Type (`Institutional Partner`, `Local Sub-Agent`, `Campus Ambassador`), Trade License No., NID/Passport No., Bank/bKash/Nagad Settlement Account Details, Document Vault (Trade License, NID, Signed B2B MOU Agreement), Referred Students List with Live 10-Step Visa Stage & COE Status, Commission Ledger with 1-Click Payout & Settlement History, and a B2B Portal Login Credentials Generator.
- **Confirmed Decision 4 — Live Executable Actions**: Supports direct File/Data-URL or Link Upload for Logos, Brochures, Trade Licenses, and MOUs; 1-Click Student Assignment (linking CRM/Visa students to a School or B2B Agent); 1-Click JPY/BDT Commission Claim & Payout Settlement synced with the Finance Ledger; Direct WhatsApp & Email Communication Templates; and Printable Official Partner Dossier & Commission Statement Sheets.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Empty-State Alignment Fix**: Fixes the global CSS rule (`p { max-width: 72ch }`) that caused paragraphs inside `.text-center` cards and table cells to sit on the left while icons and buttons were centered.
  2. **360° Partner School / University Command Center**: Transforms each partner school/university card into an interactive institutional hub where admins and counselors can view and edit academic categories, intake sessions, fee structures, download brochures/application forms, assign students, claim JPY commissions, and print official school dossiers.
  3. **360° B2B Agent Command Center**: Transforms each B2B agency row/card into a complete partner relationship portal with trade license & MOU verification vaults, live tracking of every student referred by that agent across the 10-step visa pipeline, automated COE commission accruals, 1-click payouts, and dedicated B2B login credential issuance.
- **Target Audience / Persona**: Main Admin (MD Sheikh Baset), Branch Admins (Dhaka HQ & Khulna), Admission Counselors, Visa Officers, and B2B Partner Agencies.
- **Key Value**: Eliminates scattered institutional documents and manual commission tracking by unifying branding, brochures, legal licenses, student quotas, and financial settlements into a single 360° profile view.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Centered Empty States**: When no Partner Schools or B2B Agents are present, the icon, heading, descriptive subtext, and primary CTA button are all cleanly centered along a single vertical axis.
  2. **Opening a 360° Partner Profile**: Clicking `"360° প্রোফাইল ও ব্রশিউর"` (`360° Profile & Vault`) or clicking on any Partner School/University card or B2B Agent row opens the full-featured **Partner 360° Command Center Modal**.
  3. **Uploading Logos, Brochures & Licenses**: Inside Tab 1 (`Overview`) or Tab 2 (`Documents & Brochures Vault`), admins can upload an image/PDF file from their computer (stored as a data URL or file reference) or paste a cloud/Drive link for the Institution Logo, Official Brochure, Application Form, Trade License, NID, or Signed MOU.
  4. **Assigning Students & Settling Commissions**: Inside Tab 3 (`Students & Quota`), admins can link existing CRM/Visa students to the school or agent with 1 click. Inside Tab 4 (`Commission & Ledger`), admins can claim school commissions (JPY ➔ BDT) or disburse pending B2B agent commissions directly into the Finance Ledger and print an official statement.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-craft corporate ERP workspace matching the existing KNLTC Command Center (`Plus Jakarta Sans` + `Noto Sans Bengali` + `JetBrains Mono` for tabular numerals).
  - *Color Palette & Mood*: Crisp white (`#FFFFFF`) and cool slate (`#F8FAFC`) structural surfaces with KNLTC Crimson (`#B91C1C`) primary actions, Emerald (`#15803D`) verified/financial settlement states, and Amber (`#D97706`) pending commission indicators.
  - *Component Styling & Layout*: Single-elevation bordered surfaces (`border-slate-200/80`), sticky modal header with institutional logo avatar, category/location metadata with clean `·` typographic separators, and `tabular-nums` across all JPY/BDT fee and commission tables.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Unified vs. Specialized 360° Profile Modals**:
  - *Chosen Approach*: Dedicated 4-tab 360° Command Center architecture tailored specifically to the distinct needs of **Partner Educational Institutions** (Tuition/Hostel JPY breakdown, Intake months, Brochures, Seat Quota) vs. **B2B Sub-Agents** (Trade License/NID/MOU verification, Referred Student ROI, B2B Portal Login, BDT Payouts & Payment Methods).
  - *Why*: Educational institutions in Japan operate in JPY with academic intakes and prospectuses, whereas local B2B sub-agents operate in BDT with trade licenses, referral tracking, and mobile/bank payouts.
- **Decision 2 — Local File Upload + External URL Hybrid for Brochures, Logos & Licenses**:
  - *Chosen Approach*: Allow admins to either pick a local image/PDF file directly from their device (converted client-side for instant preview/download) OR paste an external URL (Google Drive, official website PDF, etc.) for logos, brochures, trade licenses, and MOUs.
  - *Why*: Gives immediate zero-friction usability for logos and scanned licenses while supporting large multi-page university brochures hosted on Drive or official school websites.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                   KNLTC Central ERP Store & Supabase Sync                  │
│  • JapanesePartnerSchool (Logo, Category, Intakes, Fees, Docs, Quota)      │
│  • B2bAgent (Logo, Trade License, NID, MOU Docs, Payment Info, Login)      │
│  • Cross-Module Links: CrmLead ⇄ VisaApplicant ⇄ FinancialTransaction      │
└───────────────────┬────────────────────────────────────┬───────────────────┘
                    │                                    │
                    ▼                                    ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────┐
│  360° Partner School / Univ Modal    │  │    360° B2B Agent Profile Modal  │
│ ──────────────────────────────────── │  │ ──────────────────────────────── │
│ [Tab 1] Overview, Logo, Fees & Quota │  │ [Tab 1] Agency Bio, License, Pay │
│ [Tab 2] Brochure, Prospectus & MOU   │  │ [Tab 2] License, NID & MOU Vault │
│ [Tab 3] Enrolled Students & Assign   │  │ [Tab 3] Referred Students & COE  │
│ [Tab 4] JPY⇄BDT Commission Ledger    │  │ [Tab 4] Commission Payout & Auth │
│ [Print] Official Institution Dossier │  │ [Print] Official B2B Statement   │
└──────────────────────────────────────┘  └──────────────────────────────────┘
```

### Data Model Enhancements
1. **Partner Institution (`JapanesePartnerSchool`) Extensions**:
   - `institutionType`: `"LANGUAGE_SCHOOL" | "UNIVERSITY" | "VOCATIONAL_COLLEGE" | "SSW_EMPLOYER"`
   - `logoUrl`, `websiteUrl`, `phone`, `addressJapan`, `establishedYear`
   - `intakeMonths`: `("JANUARY" | "APRIL" | "JULY" | "OCTOBER")[]`
   - `firstYearTuitionYen`, `admissionFeeYen`, `hostelFeeMonthlyYen`
   - `minGpaRequired`, `maxStudyGapYears`, `minLanguageLevel`
   - `documents`: Array of `PartnerDocumentItem` (`BROCHURE`, `PROSPECTUS`, `MOU_AGREEMENT`, `APPLICATION_FORM`, `FEE_CHART`, `LICENSE_ACCREDITATION`) with status, fileUrl/fileName, uploadedAt, and notes.
   - `notes`: Institutional summary & interview guidelines.
2. **B2B Agent (`B2bAgent`) Extensions**:
   - `logoUrl`, `email`, `whatsapp`, `officeAddress`, `establishedYear`
   - `tradeLicenseNo`, `nidOrPassportNo`, `tinCertificateNo`
   - `paymentDetails`: `{ preferredMethod: "BANK" | "BKASH" | "NAGAD"; bankName?: string; accountName?: string; accountNumber?: string; branchName?: string; mobileWalletNo?: string }`
   - `documents`: Array of `PartnerDocumentItem` (`TRADE_LICENSE`, `NID_PASSPORT`, `SIGNED_MOU`, `TIN_TAX`, `VISITING_CARD`) with verification status (`VERIFIED`, `UPLOADED`, `MISSING`), fileUrl/fileName, and uploadedAt.
   - `portalAccountId`: Linked system login account ID for 1-click B2B Portal access generation.
   - `notes`: Agreement terms & bonus tiers.

### Interactive Component & State Mapping
- **Global Centering Fix**: Update `p` inside `.text-center` in global styles (`margin-inline: auto`) and wrap empty-state blocks in `flex flex-col items-center justify-center text-center` so headings, descriptions, icons, and buttons are always aligned.
- **1-Click Student Linking**: Inside both modals, selecting an unlinked student from the dropdown updates `CrmLead` and `VisaApplicant` (`targetSchoolId`/`targetSchoolName` or `referredByAgentId`/`referredByAgentName`), recalculates active student / referral counts, and persists to the store.
- **Document & Logo Upload Handler**: Supports `<input type="file" accept="image/*,.pdf" />` (converting to data URL with file metadata) as well as external URL attachment, instant preview/download, and status toggling (`MISSING` ➔ `UPLOADED` ➔ `VERIFIED`).
- **Printable Official Dossier**: Dedicated print view formatter generating an A4 institutional profile & financial statement sheet with KNLTC header, partner logo, fee/commission breakdown, linked student roster, and signature blocks.
