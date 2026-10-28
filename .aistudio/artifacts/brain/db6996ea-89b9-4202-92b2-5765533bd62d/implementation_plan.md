# KNLTC Website — Full Revert to Previous Commit Version

This plan completely removes all changes introduced in the most recent commit/update and restores the KNLTC website, public pages, store catalog, forms, and database schema to their exact prior state.

## User Review & Critical Decisions

> [!IMPORTANT]
> Both restoration preferences have been confirmed by the user and will be executed without retaining any partial changes from the latest update.

- **Confirmed Decision 1 (Revert Scope)**: Completely revert all changes from the latest update across the entire application rather than keeping partial page edits.
- **Confirmed Decision 2 (Forms, Store & Database Schema)**: Restore all public pages, form submission flows, store catalog, and Prisma database schema 100% back to the previous version's code.

---

## 1. Overview & Core Concept

- **What It Does**: Rolls back the latest update across the KNLTC platform so that the Home page, Study in Japan page, Work in Japan page, Japanese Language Course page, Book Store & Checkout flows, Header/Footer layout, Contact & Enrollment forms, global typography stylesheet, and Prisma schema match the previous commit version.
- **Target Audience / Persona**: Bangladeshi students, job seekers, and KNLTC administrators expecting the stable pre-update version of the website.
- **Key Value**: Guarantees immediate visual, structural, and functional parity with the previous commit by removing the newly added CMS reactive hook bindings, extra home/study page sections, and store/form bridge modifications.

---

## 2. User Experience & Visual Design

- **Key User Flows Restored**:
  1. **Home Page Experience**: Restores the clean pre-update Home layout without the extra floating campaign popup banner, expanded guideline/after-arrival blocks, or Trustpilot/trade-license additions introduced in the last commit.
  2. **Study in Japan & Work in Japan Flows**: Restores the original static trilingual dictionary structure, original package pricing display (`৳ ১,৫০,০০০` / `BDT 150,000` Regular Package), and original job opportunity cards without the extra calculator widget or live CMS hook overrides.
  3. **Japanese Language Enrollment & Contact Flows**: Restores the original N4 course pricing (`৳14,500`) and original form submission handlers (`/api/contact`, `/api/orders`, and the standalone Enrollment reference confirmation flow).
  4. **Header, Footer & Store Catalog**: Restores the static `siteConfig` contact/address bindings in the Header and Footer (removing the top CMS announcement bar) and restores `StoreCatalog` to render the server-provided `products` list directly.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Clean institutional light theme (`--background: 0 0% 100%`, warm stone surfaces `#fcfaf7`, slate typography `#0f172a`).
  - *Color Palette & Mood*: Signature Crimson Red (`--primary: 0 72% 42%` / `#b91c1c`) and Emerald Green (`--accent: 142 71% 29%` / `#15803d`) accents with balanced 60-30-10 surface contrast.
  - *Typography & Hierarchy*: Restores the previous font configuration (`Plus Jakarta Sans`, `Noto Sans Bengali`, `Noto Sans JP`, and `JetBrains Mono`) and original line-height/tracking rules in the global stylesheet.
- **Interactive Feedback & Motion**: Preserves the original `motion/react` entrance animations, interactive language switcher (`en` / `bn` / `ja`), and responsive navigation drawer.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Complete Decoupling of Public Pages from the Reactive CMS Hook**
  - *Chosen Approach*: Remove the reactive CMS hook and revert all public pages and layout components to use their self-contained trilingual dictionaries and `siteConfig` constants.
  - *Why*: Matches the exact code and content behavior of the previous commit without runtime localStorage/CMS overrides altering public page copy or prices.
  - *Alternatives Considered*: Keeping the hook while resetting default values was rejected because the user explicitly requested 100% restoration to the previous code.
- **Decision 2: Full Restoration of Original Form, Store & Schema Code**
  - *Chosen Approach*: Remove the newly added public-to-CRM helper calls from the Checkout, Contact, and Enrollment forms, and revert the Prisma schema and central store helper additions to their previous state.
  - *Why*: Ensures zero residual side effects from the latest commit across both frontend components and backend definitions.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram (Restored Previous Commit State)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Root Layout & Providers                          │
│         LanguageProvider (en / bn / ja)  •  Static siteConfig           │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
                    ▼                                 ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────┐
│      Public Website & Store Pages     │ │   Dashboard & Admin Portal    │
│  ┌─────────────────────────────────┐  │ │  ┌─────────────────────────┐  │
│  │ Home / Study / Work / Language  │  │ │  │ 8-Module ERP / CRM /    │  │
│  │ (Self-Contained i18n Content)   │  │ │  │ CMS Workspace           │  │
│  └─────────────────────────────────┘  │ │  └────────────┬────────────┘  │
│  ┌─────────────────────────────────┐  │ │               │               │
│  │ Store Catalog / Cart / Checkout │  │ │               ▼               │
│  │ (Server CMS Products & Orders)  │  │ │  ┌─────────────────────────┐  │
│  └────────────────┬────────────────┘  │ │  │ Central CMS Store State │  │
└───────────────────┼───────────────────┘ └───────────────┴───────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│     API Routes (/api/orders,          │
│     /api/contact, /api/cms/*)         │
└───────────────────────────────────────┘
```

### Data Model & State Restoration
- **Public Pages & Layout**: Read directly from `translate(..., language)` dictionaries and `siteConfig` without subscribing to `useKnlTcCms`.
- **Store & Checkout**: Render the `products` prop passed from `getPublishedProducts()` and submit checkout payloads directly to `/api/orders`.
- **Contact & Course Enrollment**: Submit inquiries to `/api/contact` and run the original client-side enrollment confirmation workflow without invoking the newly added store mutation helpers.
- **Build & Verification**: After reverting all modified modules and removing the extra hook created in the latest commit, run full TypeScript and Next.js production compilation to confirm a clean build.
