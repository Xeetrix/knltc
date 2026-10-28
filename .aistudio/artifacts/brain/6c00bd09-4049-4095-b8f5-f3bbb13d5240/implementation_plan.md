# KNLTC (Japan Gateway — `knltc.com`) 360° Architectural Diagnostic Audit & Execution Plan

## 1. Repository Diagnostic Summary (Health Scorecard)

| Pillar | Score | Current Status & Core Bottlenecks |
| :--- | :---: | :--- |
| **1. Client-Side (Public Website)** | **6.5 / 10** | Clean institutional UI and trilingual (`bn`/`en`/`ja`) dictionary coverage, **but** public pages (`app/page.tsx`, `app/study-in-japan/page.tsx`, `app/work-in-japan/page.tsx`, `components/japanese-language/*`, `app/store/page.tsx`) still render hardcoded static arrays instead of binding to `lib/knltc-cms-store.ts`. Missing Official Government Trade License showcase, Trustpilot review integration (`trustpilot.com/review/knltc.com`), and financial/lifestyle icons under the 5-step roadmap. Package pricing mismatch between `study-in-japan/page.tsx` (`৳১,৫০,০০০`) and `knltc-cms-store.ts` (`৳১,২০,০০০`). |
| **2. Central ERP/CRM/CMS Dashboard (`/app/dashboard`)** | **8.2 / 10** | All 8 core modules, 7-Role RBAC (`MAIN_ADMIN`, `BRANCH_ADMIN`, `TELE_COUNSELOR`, `TEACHER`, `B2B_AGENT`, `INVESTOR`, `STUDENT`), Branch Switcher (`ALL`, `DHK-HQ`, `KHULNA-01`), 360° Lead/Partner Modals, and full `bn`/`en`/`ja` localization are implemented. **Gaps:** Saving in the Website CMS tab updates `knltc-cms-store.ts` + `/api/cms-store`, but public pages do not subscribe to those changes; some role-filtered KPIs need stricter branch scoping. |
| **3. Frontend Code Quality & Build Health** | **7.5 / 10** | `next build` and `eslint` pass with 0 errors. **Issues:** `app/dashboard/page.tsx` is a monolithic **6,556-line** client component; both `framer-motion` (`^12.38.0`) and `motion` (`^13.5.0`) coexist in `package.json`; `app/page.tsx`, `app/study-in-japan/page.tsx`, and `app/work-in-japan/page.tsx` mark the entire page `"use client"` at line 1, preventing route-level Next.js `Metadata` exports. |
| **4. Backend, Database (`Prisma`) & Store Wiring** | **5.5 / 10** | Dual split-brain state: Dashboard uses `lib/knltc-cms-store.ts` (`localStorage` + `/api/cms-store`), while `/store`, `/checkout`, and `/contact` use legacy `lib/cms.ts` (`/api/orders`, `/api/contact`), and `EnrollmentForm.tsx` only runs a client `setTimeout` without saving to CRM/LMS. `prisma/schema.prisma` has an invalid default enum value on line 437 (`@default(COD)` missing from `enum PaymentMethod`). |
| **5. Multi-Device Responsiveness (360px–1440px+)** | **7.8 / 10** | Desktop and tablet layouts are solid, **but** 360px mobile screens experience horizontal pressure in the 10-step Visa Kanban board, multi-column CRM/Finance tables, and long Bengali compound words / Japanese particles (`は, が, を, に, で`) inside narrow badges. |
| **6. Animations & Micro-Interactions** | **8.0 / 10** | Smooth `motion/react` entrance stagger and `.hover-spotlight` cards on public pages, **but** dashboard module switching, Kanban stage transitions, Minna No Nihongo lesson tab switches, and CMS hydration states lack `AnimatePresence` layout transitions and loading skeletons. |

---

## 2. File-by-File Issue Log

### A. Configuration, Typography & Styling
* **`/package.json`**
  * Contains duplicate animation libraries (`"framer-motion": "^12.38.0"` and `"motion": "^13.5.0"`). All imports should standardize on `motion/react`.
  * `@prisma/client` and `prisma` CLI scripts (`db:generate`, `db:push`) are not yet registered in `package.json`.
* **`/app/layout.tsx` & `/app/globals.css`**
  * Loads `Noto Sans Bengali`, `Noto Sans JP`, `Plus Jakarta Sans`, and `JetBrains Mono` via `<link>` and duplicate `@import url(...)` in `app/globals.css` (causing double font stylesheet requests).
  * Missing `Hind Siliguri` / `Tiro Bangla` display pairing and explicit `font-feature-settings: "kern" 1, "liga" 1, "clig" 1` to guarantee zero broken Bengali conjunct letters (যুক্তবর্ণ) across all browsers.
  * `html[lang="bn"] h1..h6` in `app/globals.css` (line 88) sets `line-height: 1.38`, which is slightly too tight for multi-line Bengali display headlines with upper/lower vowel signs (কার ও ফলা); needs `line-height: 1.55` (`leading-relaxed`) on hero/section headers.
  * Does notsync `<html lang={language}>` dynamically when the user switches between `bn`, `en`, and `ja` in `LanguageProvider`.

### B. Public Client Website Pages & Components
* **`/app/page.tsx` (Home Page — 1,123 lines)**
  * **Static vs. Dynamic CMS Gap:** Uses a hardcoded `t = translate(...)` object instead of binding to `getCmsStore().websiteCms[0]` (`heroSection`, `jobCirculars`, `testimonials`, `faqList`).
  * **UI/UX Audit Gaps:**
    1. Missing **Official Government Trade License showcase** card & legal 300 BDT Judicial Stamp verification badge in the Trust section.
    2. Missing **Trustpilot integration** (`https://www.trustpilot.com/review/knltc.com`) and dynamic **Verified Student Testimonials** carousel/grid from `websiteCms[0].testimonials`.
    3. *"স্বচ্ছ প্রসেস"* (Transparent Process) and *"বাংলাদেশ কেন্দ্রীক গাইডলাইন"* (Bangladesh-Centric Guideline) feature blocks need explicit visible checkmark/bullet icons (`CheckCircle2`) beside every item and distinct context-appropriate Lucide icons across the 3 feature cards.
    4. *"After-Arrival Support"* (`Globe2` pillar & Step 05) needs an expanded, dedicated long-term Japan settlement breakdown (Airport pick-up, safe student hostel, Ward/City Office `Juminhyo` registration, Japan Post/Yuucho bank account, and ongoing 28 hrs/week Baitō job placement) so visitors know support continues long after day one.
    5. The 5-Step Process Roadmap (`lines 980–1006`) lacks contextual financial & lifestyle icons on each step card.
* **`/components/layout/Header.tsx` & `/components/layout/Footer.tsx`**
  * `Header.tsx` uses a static top red utility bar instead of binding to `websiteCms[0].topAnnouncementBar` (`enabled`, `text[language]`, `actionLinkText[language]`, `actionUrl`) and `websiteCms[0].popupBanner` (SSW Construction N4 Free Food & Accommodation campaign modal).
  * `Header.tsx` and `Footer.tsx` read phone/address from static `lib/site.ts` instead of syncing live edits from `websiteCms[0].contactHotline`, `contactWhatsApp`, `dhakaOfficeAddress`, and `khulnaOfficeAddress`.
* **`/app/study-in-japan/page.tsx` (1,652 lines)**
  * **Pricing Discrepancy:** Hardcodes Regular Package as `৳ ১,৫০,০০০` (`BDT 150,000` on lines 136, 176, 290, 330, 444) instead of KNLTC's official business rule and CMS store value `regularPackageFeeBdt: 120000` (`৳ ১,২০,০০০` post-visa, `৳০` file opening).
  * **Static Binding:** Eligibility criteria (`GPA >= 2.5`, `Age <= 30`, `Study Gap <= 5–6 yrs`), Regular/Premium package terms, and FAQ items are hardcoded instead of reading from `websiteCms[0].studyInJapanPage` and `websiteCms[0].faqList`.
  * **Interactive Eligibility Calculator Missing on Public Page:** Needs a public-facing interactive Student Visa Eligibility & Sponsor Bank Loan Calculator (`18 Lakh BDT` solvency + Agrani, Social Islami, and Pubali Bank loan guidance) that feeds qualified leads directly into the CRM.
* **`/app/work-in-japan/page.tsx` (325 lines)**
  * **Static Job Circulars:** Renders a hardcoded 3-item `opportunities` array (`lines 93–112`) instead of reading published circulars dynamically from `websiteCms[0].jobCirculars` (including the flagship SSW Construction campaign: *"JLPT N4 পাসদের ঢাকায় ফ্রি থাকা-খাওয়া ও স্কিল ট্রেনিং"*).
  * Missing an inline Job Application / SSW Assessment modal that captures applicant JLPT/JFT status and creates a `CrmLead` in `knltc-cms-store.ts`.
* **`/app/japanese-language/page.tsx` & `/components/japanese-language/*`**
  * `CoursePackagesSection.tsx` and `EnrollmentForm.tsx` (`line 63`) hardcode N4 price as `৳14,500` instead of binding to `websiteCms[0].languageCoursePage` (`n5PriceBdt: 12000`, `n4PriceBdt: 12000`, `comboPriceBdt: 21500`, `bonuses`, `externalLmsUrl: "https://npw.bd/knltc"`).
  * `InteractiveLanguageLab.tsx` uses internal static lesson data instead of merging dynamic lessons created in the Dashboard CMS (`websiteCms[0].languageCoursePage.lessons`).
  * **Broken Enrollment Funnel (`EnrollmentForm.tsx` lines 318–337):** Submitting the enrollment form only triggers a `setTimeout` and shows a reference modal; it **never calls** `addPublicLeadToCrm()` or creates an `LmsUserBridge` entry in `lib/knltc-cms-store.ts` / `/api/cms-store`.
* **`/app/store/page.tsx`, `/app/cart/page.tsx`, `/app/checkout/page.tsx`**
  * **Split-Brain Store Data:** `app/store/page.tsx` fetches from legacy `getPublishedProducts()` (`lib/cms.ts`), while the Dashboard Book Store manager reads/writes `websiteCms[0].storeProducts` and `websiteCms[0].customerOrders` in `lib/knltc-cms-store.ts`.
  * `app/checkout/page.tsx` posts to `/api/orders` (legacy `lib/cms.ts`) instead of pushing a `CustomerStoreOrder` into `knltc-cms-store.ts` + `/api/cms-store`.
* **`/app/contact/page.tsx` & `/components/forms/ContactForm.tsx`**
  * `ContactForm.tsx` posts to `/api/contact` (legacy `lib/cms.ts`) instead of also calling `addPublicLeadToCrm()` so website inquiries immediately appear in the Dashboard Omni-Channel CRM pipeline (`source: "WEBSITE_FORM"`).

### C. Central ERP/CRM/CMS Dashboard & Store Engine
* **`/app/dashboard/page.tsx` (6,556 lines)**
  * **Monolithic File Size:** All 8 modules, role switchers, KPI calculators, Kanban boards, and CMS forms live inside a single 6,556-line file, increasing compilation and memory overhead.
  * **Role & Branch Filtering Refinements:**
    * When `activeBranch` is switched between `ALL`, `DHK-HQ` (Dhaka Naya Paltan), and `KHULNA-01` (Khulna), CRM Leads, Visa Applicants, Financial Transactions, and Staff KPIs filter properly, but LMS Bridges (`lmsBridges`) and B2B referral counts need branch-aware filtering.
    * When `activeRole` is `TEACHER` (Sensei - Amir Hossain), `B2B_AGENT` (Nexus Group / BWBS), or `INVESTOR` (10,00,000 BDT Open-Book View), the Overview KPI cards should dynamically highlight role-relevant metrics first.
  * **Live CMS Sync Trigger:** Clicking *"Save & Publish"* in the Website CMS tab saves to `localStorage` and `/api/cms-store`, and dispatches `knltc-cms-updated`, but public pages need a shared `useKnlTcCms()` hook that listens to `knltc-cms-updated` and `/api/cms-store` so edits reflect immediately across tabs and routes.
* **`/prisma/schema.prisma` (492 lines)**
  * **Line 437 Schema Error:** `paymentMethod PaymentMethod @default(COD)` fails Prisma validation because `COD` is missing from `enum PaymentMethod` (lines 77–84: `BKASH`, `NAGAD`, `BANK_TRANSFER`, `CASH_OFFICE`, `AAMARPAY`, `SSLCOMMERZ`).
  * Missing `SUB_AGENT` in `enum LeadSource` (present in TypeScript `knltc-cms-store.ts` line 50).
  * Missing `SISTER` and `SELF` in `VisaApplication.sponsorRelation` documentation/constraints and extended JSON fields for 12-item `documentChecklist` and `activityLog` on `CrmLead`.

---

## 3. Prioritized Phased Execution Plan (Phases 1 to 5)

### Phase 1: Build Health, Global Typography (`bn`/`en`/`ja`), & Core UI/Responsiveness Fixes
1. **Unify Font Loading & Fix Bengali Conjunct Rendering (`app/layout.tsx`, `app/globals.css`, `components/layout/LanguageProvider.tsx`):**
   - Remove the duplicate `@import url(...)` from `app/globals.css` and load `Hind Siliguri` (600, 700), `Noto Sans Bengali` (400, 500, 600, 700), `Noto Sans JP`, `Plus Jakarta Sans`, and `JetBrains Mono` cleanly in `app/layout.tsx`.
   - Sync `document.documentElement.lang = language` inside `LanguageProvider.tsx` whenever `bn`, `en`, or `ja` is selected.
   - Add `font-feature-settings: "kern" 1, "liga" 1, "clig" 1` and increase Bengali heading `line-height` to `1.55` (`leading-relaxed`) with balanced center/left alignment so multi-line Bengali headlines and conjunct letters (যুক্তবর্ণ) never clip or overlap.
2. **Japanese Particle & Mobile Overflow Guards (`app/globals.css`):**
   - Add CJK/Japanese word-wrapping utilities (`word-break: keep-all; overflow-wrap: anywhere`) for Japanese grammar particles (`は, が, を, に, で`) and responsive container padding for `360px` viewports.
3. **Clean Up Dependencies (`package.json`):**
   - Standardize all animations on `motion/react` and remove unused/conflicting imports.

### Phase 2: Wiring Public Client Pages to Central CMS Store & Fixing Conversion Funnels
1. **Create Reactive CMS Hook (`/hooks/use-knltc-cms.ts`):**
   - Build a lightweight client/SSR-safe hook that reads `getCmsStore()` on mount, fetches latest server state from `/api/cms-store`, and subscribes to `knltc-cms-updated` & `storage` events for real-time public page updates.
2. **Global Announcement Bar & Campaign Popup (`components/layout/Header.tsx`, `components/layout/Footer.tsx`):**
   - Bind the top announcement bar, SSW Construction N4 popup banner, office addresses (Dhaka Naya Paltan & Khulna), and hotline/WhatsApp (`+880 1805 013633`) dynamically to `websiteCms[0]`.
3. **Home Page Audit Fixes & CMS Binding (`app/page.tsx`):**
   - Bind Hero headline, subtitle, stats, active opportunities, and FAQs to `websiteCms[0]`.
   - Add visible `CheckCircle2` icons beside all items under *"স্বচ্ছ প্রসেস"* and *"বাংলাদেশ কেন্দ্রীক গাইডলাইন"*, and ensure distinct Lucide icons on all feature cards.
   - Expand the **After-Arrival Support in Japan** section to clearly showcase continuous long-term care (Airport pick-up, student hostel, City Office registration, bank account opening, and 28 hrs/week part-time job placement).
   - Add the **Official Government Trade License & 300 BDT Judicial Stamp** trust showcase, **Verified Student Testimonials** from `websiteCms[0].testimonials`, **Trustpilot Review badge (`trustpilot.com/review/knltc.com`)**, and financial/lifestyle icons on the 5-step process cards.
4. **Study in Japan & Work in Japan CMS Sync (`app/study-in-japan/page.tsx`, `app/work-in-japan/page.tsx`):**
   - Fix the Regular Package fee on `/study-in-japan` to read dynamically from `websiteCms[0].studyInJapanPage.regularPackageFeeBdt` (`৳১,২০,০০০` post-visa, `৳০` file opening) alongside the Premium Package (`৳১১,০০,০০০`).
   - Add an interactive **Student Visa Eligibility & 18L Sponsor / Bank Loan Calculator** (GPA >= 2.5, Age <= 30, Gap <= 5–6 yrs; Agrani, Social Islami, Pubali Bank) on `/study-in-japan`.
   - Bind `/work-in-japan` job circulars dynamically to `websiteCms[0].jobCirculars` with a 1-click SSW/TITP application modal connected to CRM.
5. **Unify Public Conversion Funnels (`EnrollmentForm.tsx`, `ContactForm.tsx`, `/store`, `/cart`, `/checkout`):**
   - Wire `EnrollmentForm.tsx` to call `addPublicLeadToCrm()` + create a pending `LmsUserBridge` record in `knltc-cms-store.ts` and sync with `/api/cms-store`.
   - Wire `ContactForm.tsx` to push leads directly into `knltc-cms-store.ts` (`source: "WEBSITE_FORM"`).
   - Connect `/store` and `/checkout` to `websiteCms[0].storeProducts` and `websiteCms[0].customerOrders` so book orders placed by students immediately appear in the Dashboard Book Store & Finance modules.

### Phase 3: Completing & Modularizing the 8-Module / 7-Role Dashboard & Live CMS Sync
1. **Modularize `/app/dashboard/page.tsx` into Clean Sub-Components (`/components/dashboard/*`):**
   - Extract dedicated, maintainable sub-components for:
     - `ExecutiveKpiModule.tsx` (July & October 2027 intake countdowns, May COE deadline, role-aware KPI cards)
     - `OmniChannelCrmModule.tsx` (Meta Ads, Website, WhatsApp `+880 1805 013633` lead pipeline & 1-click `wa.me` triggers)
     - `VisaKanbanModule.tsx` (Eligibility calculator, 10-step interactive Kanban board, 18L Sponsor & Bank Loan tracker)
     - `LmsBridgeModule.tsx` (N5/N4 12,000 BDT + 3 Free Bonus Courses table & `https://npw.bd/knltc` credential dispatcher)
     - `B2bPartnersModule.tsx` (HLA Gakuin Hiroshima 80,000 JPY commission tracker, Nexus Group, local sub-agents, and BWBS UK/USA/Europe referrals)
     - `FinanceInvestorModule.tsx` (Regular 1.2L vs Premium 11L–12L ledger + 10,00,000 BDT Investor Open-Book Portal with 30% Setup 3L, 20% Marketing 2L, 30% Runway 3L, 20% Reserve 2L & 10% Net Profit Share calculator)
     - `StoreHrModule.tsx` (Book Store order fulfillment + remote female Tele-Counselor & Sensei payroll/KPI tracker)
     - `WebsiteCmsModule.tsx` (Live editor for all public pages with instant *"Save & Publish"* sync)
2. **Tighten 7-Role RBAC & Branch Switcher Scoping:**
   - Ensure switching between `ALL`, `DHK-HQ`, and `KHULNA-01` filters LMS batches/bridges, CRM leads, Visa Kanban cards, Financial receipts, and HR staff metrics consistently.

### Phase 4: Backend API Routes / Server Actions & Prisma Database Synchronization
1. **Fix `prisma/schema.prisma` & Add Missing Enums/Fields:**
   - Add `COD` to `enum PaymentMethod` and `SUB_AGENT` to `enum LeadSource`.
   - Add JSON columns (`documentChecklist`, `activityLog`, `extendedProfile`) to `CrmLead`, `JapanesePartnerSchool`, and `B2bPartner` so the PostgreSQL schema matches `lib/knltc-cms-store.ts` 1:1.
2. **Unified Persistence Layer (`/api/cms-store`, `/api/orders`, `/api/contact`, `/api/payment/initiate`):**
   - Bridge `/api/orders` and `/api/contact` into the central `knltc-cms-store` persistence engine (with automatic Prisma PostgreSQL write-through when `DATABASE_URL` is configured, and zero-downtime JSON file persistence in preview).
   - Provide structured payment verification hooks for Manual bKash/Nagad TrxID verification and SSLCommerz / aamarPay checkout initiation.

### Phase 5: Motion Micro-Interactions, Mobile Polish (360px+) & Final Verification
1. **Mobile Dashboard & Public Responsive Polish (`360px` to `1440px+`):**
   - Refine the `#133e29` Deep Forest Green collapsible mobile drawer, sticky top role/branch header bar, touch-friendly horizontal scroll snap on the 10-step Visa Kanban board, and responsive card summaries for CRM/Finance tables on small viewports.
2. **Micro-Interactions & Feedback Polish (`motion/react`):**
   - Add `AnimatePresence` transitions to Dashboard module switches, Minna No Nihongo interactive lesson tabs, toast confirmations on every form/CMS action, and skeleton states during store hydration.
3. **End-to-End Build & Lint Verification:**
   - Run `compile_applet` and `lint_applet` to verify zero TypeScript, ESLint, or Next.js production build errors.
