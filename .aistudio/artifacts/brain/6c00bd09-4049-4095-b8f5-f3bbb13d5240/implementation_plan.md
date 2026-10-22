# KNLTC Brand, Bilingual Typography & Enterprise UI/UX Upgrade Plan

## 1. Overview & Objectives
We will upgrade the **Kagawa Nippon Language Training Center (KNLTC)** platform across both the public-facing website and the internal enterprise portal so it looks and feels like a bespoke, institutional-grade system:
- **Official Brand Logo Integration**: Replace all placeholder red `"KN"` square badges in the Portal Login/Registration page and the Enterprise Dashboard with the official KNLTC emblem (`/brand/knltc-logo.svg`).
- **Professional Bilingual Typography (`Plus Jakarta Sans` + `Noto Sans Bengali`)**: Eliminate the unpolished fallback system font appearance when switching to Bengali (`বাংলা`) by loading `Noto Sans Bengali` alongside `Plus Jakarta Sans` and tuning line-heights, font weights, and letter-spacing specifically for Bengali script.
- **Split-Screen Portal Login & Registration**: Transform the centered login card into an executive split-screen portal featuring a KNLTC institutional showcase panel on the left and a clean, structured authentication & registration workspace on the right.
- **Left-Sidebar Enterprise Dashboard**: Replace the crowded multi-row horizontal pill navigation in the dashboard with a structured left sidebar organized by operational domain (`Operations`, `Academic & LMS`, `Finance & Partners`, `Governance`) paired with a clean top utility bar.
- **Client-Side & Dashboard UI/UX Polish**: Remove generic AI-template visual patterns (excessive floating pills, heavy drop shadows, over-tracked uppercase Bengali labels) in favor of crisp `1px` structural borders, balanced spacing, and high-trust institutional hierarchy.

---

## 2. Key Changes by Area

### A. Bilingual Typography & Global Styling (`app/layout.tsx`, `app/globals.css`, `components/layout/LanguageProvider.tsx`)
1. **Google Font Pairing**:
   - Load `Plus_Jakarta_Sans` (weights `400, 500, 600, 700, 800`), `Noto_Sans_Bengali` (weights `400, 500, 600, 700`), and `JetBrains_Mono` in `app/layout.tsx`.
   - Bind both `--font-sans` and `--font-display` so English glyphs render in `Plus Jakarta Sans` and Bengali Unicode glyphs automatically render in `Noto Sans Bengali`.
2. **Bengali Script Typographic Rules**:
   - Update `LanguageProvider` to synchronize `document.documentElement.lang` (`"en"` or `"bn"`) whenever the language switches.
   - Add dedicated CSS rules in `app/globals.css` for Bengali (`html[lang="bn"]`) that neutralize wide uppercase letter-spacing (`letter-spacing: 0 !important`), provide comfortable vertical line-height (`1.65` for body copy, `1.35` for headings) so Bengali vowel diacritics (কার ও ফলা) never clip, and refine font weights for crisp readability.

### B. Portal Login & Registration (`app/admin/login/page.tsx`)
1. **Official KNLTC Logo**:
   - Replace the hardcoded red `KN` square badge with the official KNLTC logo (`/brand/knltc-logo.svg`) and institutional lockup.
2. **Split-Screen Enterprise Architecture**:
   - **Left Panel (Institutional Brand Showcase)**: Dark slate architectural panel featuring the KNLTC crest, bilingual institutional headline, key operational highlights (COE Visa Pipeline, JLPT & SSW Academy, Multi-Branch Governance), and official Rajshahi HQ credentials.
   - **Right Panel (Authentication & Student Registration Workspace)**:
     - Clean top utility row with "Back to Website" link and `EN / বাংলা` language switcher.
     - Segmented mode switcher (`Portal Sign In` vs. `Student Registration`) with refined borders and subtle active indicators.
     - Streamlined form inputs with clear labels, show/hide password toggle, and high-contrast submit action.
     - Collapsible or neatly structured **Quick Demo Access** table at the bottom for testing Super Admin, Counselor, Compliance, Instructor, Accountant, and Student Portal accounts without cluttering the primary login form.

### C. Enterprise Dashboard (`app/dashboard/page.tsx`)
1. **Left Sidebar Navigation + Clean Top Bar**:
   - **Sidebar Header**: Displays the official KNLTC logo (`/brand/knltc-logo.svg`) with institutional title and active role badge.
   - **Categorized Sidebar Navigation**:
     - *Core Overview*: Executive Overview (`overview`)
     - *Operations & Visa*: CRM & Counseling (`crm`), Visa & COE Pipeline (`kanban`), B2B Sub-Agents (`partners`)
     - *Academy & Assessment*: Japan Academy LMS (`academy`), Mock Visa Test (`mock-test`)
     - *Finance & Intelligence*: Finance & Ledger (`finance`), Analytics & BI (`analytics`)
     - *Administration*: Website CMS (`cms`), Audit & Security (`security`), Users & Access Control modal trigger
   - **Top Utility Header**: Displays the active module title and breadcrumb on the left; Branch filter, Cloud Sync indicator, Language toggle (`EN / বাংলা`), Public Website shortcut, and User Profile / Sign Out controls on the right.
2. **Refined Data Cards & Tables**:
   - Replace heavy rounded cards (`rounded-3xl`) and thick colorful borders with clean enterprise panels (`rounded-xl`, `border-slate-200/80`, subtle elevation, and tabular numerals for BDT/JPY currency and KPIs).

### D. Public Website UI/UX Refinement (`components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, `app/page.tsx`)
1. **Header & Navigation Polish**:
   - Ensure consistent logo alignment, refined nav item spacing that accommodates both English and Bengali labels without wrapping, and a clean "Registration / Login" call-to-action button.
2. **Hero & Section Refinement**:
   - Clean up section headers, stat blocks, and interactive calculators/verify modals on the home page so borders, spacing, and Bengali typography look cohesive and authentic.

---

## 3. Verification Criteria
- Confirm the official KNLTC logo is rendered accurately on the Navbar, Footer, Portal Login/Registration screen, and Dashboard sidebar.
- Verify switching between `EN` and `বাংলা` updates all UI labels smoothly and applies `Noto Sans Bengali` with zero clipped characters or awkward letter-spacing.
- Verify full compilation (`compile_applet`) with zero TypeScript or Next.js build errors.
