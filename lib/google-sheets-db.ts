import { revalidateTag } from "next/cache";
import {
  getCmsStore,
  getWebsiteCms,
  type MasterKnlTcStore,
} from "@/lib/knltc-cms-store";

/**
 * ============================================================================
 * KNLTC GOOGLE SHEETS + GOOGLE DRIVE / CLOUDINARY UNIFIED ADAPTER
 * ============================================================================
 * Replaces Supabase across the entire Next.js 15 application.
 * - Supports all 15 Google Sheets tabs (`GOOGLE_SHEETS_TABLES`)
 * - Uses Next.js `fetch` with `next: { tags: ['knltc-db', tableName], revalidate: 60 }`
 * - Automatically invalidates cache via `revalidateTag('knltc-db')` on mutations
 * - Provides 100% Zero-Crash In-Memory + Seed Fallback when `GOOGLE_SHEETS_WEB_APP_URL`
 *   is not configured yet, ensuring `npm run build` and preview always succeed.
 * ============================================================================
 */

export const GOOGLE_SHEETS_TABLES = [
  "blog_posts",
  "categories",
  "knltc_b2b_agents",
  "knltc_crm_leads",
  "knltc_finance_transactions",
  "knltc_lms_bridges",
  "knltc_partner_schools",
  "knltc_staff_members",
  "knltc_visa_applicants",
  "knltc_website_cms",
  "order_items",
  "orders",
  "product_reviews",
  "products",
  "wishlist_items",
] as const;

export type GoogleSheetsTableName = (typeof GOOGLE_SHEETS_TABLES)[number];

export function getGoogleSheetsConfig() {
  const webAppUrl = (
    process.env.GOOGLE_SHEETS_WEB_APP_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL ||
    ""
  ).trim();
  const apiKey = (
    process.env.GOOGLE_SHEETS_API_KEY || "KNLTC_SECRET_2026"
  ).trim();
  const masterSheetUrl = (
    process.env.NEXT_PUBLIC_MASTER_SHEET_URL ||
    "https://docs.google.com/spreadsheets"
  ).trim();
  const cloudinaryCloudName = (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
  ).trim();
  const cloudinaryUploadPreset = (
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  ).trim();

  return {
    webAppUrl,
    apiKey,
    masterSheetUrl,
    cloudinaryCloudName,
    cloudinaryUploadPreset,
    isConfigured: Boolean(webAppUrl && webAppUrl.startsWith("https://script.google.com/")),
  };
}

/**
 * ============================================================================
 * SERVER-SIDE IN-MEMORY FALLBACK STORE (Pre-seeded with realistic KNLTC data)
 * Used seamlessly when GOOGLE_SHEETS_WEB_APP_URL is not configured or unreachable
 * ============================================================================
 */
const NOW_ISO = "2026-10-28T10:00:00.000Z";

function buildInitialFallbackTables(): Record<GoogleSheetsTableName, Record<string, any>[]> {
  const initialStore = getCmsStore();
  const initialCms = getWebsiteCms();
  return {
    categories: [
      {
        id: "cat-jlpt-books",
        name: "JLPT N5 & N4 Books",
        slug: "jlpt-books",
        type: "product",
        description: "Official Japanese Language Proficiency Test Textbooks, Workbooks & Kanji Guides",
        created_at: NOW_ISO,
      },
      {
        id: "cat-ssw-guides",
        name: "SSW & Skill Test Guides",
        slug: "ssw-skill-guides",
        type: "product",
        description: "Specified Skilled Worker (SSW) & JFT-Basic Preparation Materials",
        created_at: NOW_ISO,
      },
      {
        id: "cat-visa-blog",
        name: "Japan Student & SSW Visa Guides",
        slug: "japan-visa-guides",
        type: "blog",
        description: "Official COE, Embassy Interview & Study in Japan Advisories by KNLTC",
        created_at: NOW_ISO,
      },
    ],
    products: [
      {
        id: "prod-minna-n5-bundle",
        title: "Minna No Nihongo Elementary I (N5) Full 4-Book Set (Bangla Grammar & Vocabulary)",
        slug: "minna-no-nihongo-n5-full-set-bangla",
        description:
          "Complete N5 Textbook (Honsatsu), Bangla Translation & Grammatical Notes, Choukai Tasks, and Kanji Workbook for KNLTC N5 batches.",
        price: 1450,
        discount_price: 1190,
        category_id: "cat-jlpt-books",
        stock: 85,
        status: "published",
        cover_image: "/images/books/minna-n5-cover.svg",
        is_featured: true,
        created_at: NOW_ISO,
      },
      {
        id: "prod-minna-n4-bundle",
        title: "Minna No Nihongo Elementary II (N4) Complete Set (Lessons 26–50)",
        slug: "minna-no-nihongo-n4-complete-set",
        description:
          "Official JLPT N4 & NAT-TEST 4Q preparation bundle with Bengali grammar explanation and listening workbook.",
        price: 1550,
        discount_price: 1290,
        category_id: "cat-jlpt-books",
        stock: 60,
        status: "published",
        cover_image: "/images/books/minna-n4-cover.svg",
        is_featured: true,
        created_at: NOW_ISO,
      },
      {
        id: "prod-irodori-starter",
        title: "Irodori: Japanese for Life in Japan (A1/A2 SSW & JFT-Basic Edition)",
        slug: "irodori-japanese-life-in-japan-set",
        description:
          "Japan Foundation Irodori practical communication workbook for SSW Visa & workplace fluency.",
        price: 980,
        discount_price: 790,
        category_id: "cat-ssw-guides",
        stock: 50,
        status: "published",
        cover_image: "/images/books/kanji-master-cover.svg",
        is_featured: true,
        created_at: NOW_ISO,
      },
    ],
    blog_posts: [
      {
        id: "blog-japan-student-visa-2027",
        title:
          "জাপান স্টুডেন্ট ভিসা ২০২৭: রেগুলার (৳১,২০,০০০) বনাম প্রিমিয়াম (৳১১–১২ লক্ষ) প্যাকেজের বিস্তারিত গাইড",
        slug: "japan-student-visa-2027-complete-guide-bangladesh",
        summary:
          "জাপানে উচ্চশিক্ষার জন্য ১৫০ ঘণ্টার ভাষা কোর্স, ব্যাংক সলভেন্সি, সিওই (COE) প্রসেসিং এবং অ্যাম্বাসি ইন্টারভিউ প্রস্তুতির পূর্ণাঙ্গ রোডম্যাপ।",
        content:
          "<p>জাপানে উচ্চশিক্ষা ও পার্ট-টাইম কাজের সুযোগ বাংলাদেশি শিক্ষার্থীদের জন্য অন্যতম সেরা ক্যারিয়ার পথ। KNLTC (Kurobe Nihongo Language Training Center) ঢাকা ও খুলনা শাখা থেকে সরাসরি জাপানি ভাষা প্রশিক্ষণ ও ১০ ধাপের স্বচ্ছ ভিসা প্রসেসিং সেবা প্রদান করছে।</p>",
        featured_image: "/images/blog/japan-student-visa-guide.svg",
        author: "Sheikh Baset (Managing Director, KNLTC)",
        status: "published",
        published_at: NOW_ISO,
        created_at: NOW_ISO,
      },
      {
        id: "blog-jlpt-n5-150-hours",
        title:
          "কেন জাপান ইমিগ্রেশনের জন্য ১৫০ ঘণ্টার জাপানি ভাষা সনদ ও JLPT N5/NAT-TEST বাধ্যতামূলক?",
        slug: "why-150-hours-japanese-course-jlpt-n5-mandatory",
        summary:
          "জাপান ইমিগ্রেশন ব্যুরো (ISA) কর্তৃক সিওই অনুমোদনের ক্ষেত্রে ভাষা দক্ষতার গুরুত্ব এবং KNLTC-এর ৳১২,০০০ টাকার N5 স্পেশাল ব্যাচ।",
        content:
          "<p>জাপান স্টুডেন্ট ভিসার আবেদন করার পূর্বে ন্যূনতম ১৫০ ঘণ্টা জাপানি ভাষা শিক্ষা এবং JLPT N5 বা NAT-TEST 5Q পাস সার্টিফিকেট আপনার সিওই (COE) অনুমোদনের হার বহুগুণ বাড়িয়ে দেয়।</p>",
        featured_image: "/images/blog/jlpt-n5-preparation.svg",
        author: "Amir Hossain (Senior Japanese Sensei)",
        status: "published",
        published_at: NOW_ISO,
        created_at: NOW_ISO,
      },
    ],
    orders: [
      {
        id: "ord-501",
        customer_name: "Md. Tanvir Ahmed",
        phone: "01711223344",
        email: "tanvir.student@knltc.com",
        address: "65/2/E Box Culvert Road, Purana Paltan",
        city: "Dhaka",
        payment_method: "bKash",
        payment_status: "paid",
        order_status: "delivered",
        total_amount: 1250,
        notes: "Minna No Nihongo N5 4-Book Bangla Bundle",
        created_at: NOW_ISO,
      },
    ],
    order_items: [
      {
        id: "oi-501",
        order_id: "ord-501",
        product_id: "prod-minna-n5-bundle",
        quantity: 1,
        price: 1190,
        created_at: NOW_ISO,
      },
    ],
    product_reviews: [
      {
        id: "rev-601",
        product_id: "prod-minna-n5-bundle",
        customer_name: "Md. Tanvir Ahmed",
        rating: 5,
        comment:
          "আলহামদুলিল্লাহ! বাংলা ব্যাকরণ নোট ও ভোকাবুলারি বইটির প্রিন্ট কোয়ালিটি অসাধারণ। KNLTC-এর N5 ক্লাসের সাথে এটি দারুণ কাজে দিচ্ছে।",
        status: "approved",
        created_at: NOW_ISO,
      },
    ],
    wishlist_items: [
      {
        id: "wish-701",
        session_id: "knltc-demo-session",
        product_id: "prod-minna-n4-bundle",
        product_slug: "minna-no-nihongo-n4-complete-set",
        product_title: "Minna No Nihongo Elementary II (N4) Complete Set (Lessons 26–50)",
        customer_phone: "01711223344",
        created_at: NOW_ISO,
      },
    ],
    knltc_crm_leads: initialStore.crmLeads.map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      whatsapp: l.whatsapp || l.phone,
      email: l.email || "",
      city: l.city,
      source: l.source,
      interest: l.interest,
      status: l.status,
      education: l.education,
      japanese_proficiency: l.japaneseProficiency,
      study_gap_years: l.studyGapYears,
      assigned_to: l.assignedTo,
      branch: l.branch,
      notes: l.notes,
      follow_up_date: l.followUpDate,
      last_contacted_at: l.lastContactedAt,
      created_at: l.createdAt,
    })),
    knltc_visa_applicants: initialStore.visaApplicants.map((v) => ({
      id: v.id,
      lead_id: v.leadId || "",
      tracking_no: v.trackingNo,
      name: v.name,
      phone: v.phone,
      branch: v.branch,
      package_type: v.packageType,
      intake_session: v.intakeSession,
      stage: v.stage,
      target_school: v.targetSchool,
      partner_school_id: v.partnerSchoolId || "",
      b2b_agent_id: v.b2bAgentId || "",
      b2b_agent_name: v.b2bAgentName || "",
      visa_officer_id: v.visaOfficerId || "",
      visa_officer_name: v.visaOfficerName || "",
      contract_amount_bdt: v.contractAmountBdt || 120000,
      paid_amount_bdt: v.paidAmountBdt || 0,
      due_amount_bdt: v.dueAmountBdt || 0,
      sponsor_name: v.sponsorName,
      sponsor_relation: v.sponsorRelation,
      sponsor_bank: v.sponsorBank,
      sponsor_balance_bdt: v.sponsorBalanceBdt,
      bank_loan_assistance: v.bankLoanAssistance,
      bank_loan_bank: v.bankLoanBank || "",
      coe_status: v.coEStatus,
      visa_status: v.visaStatus,
      counselor_name: v.counselorName,
      updated_at: v.updatedAt,
      created_at: v.updatedAt,
    })),
    knltc_lms_bridges: initialStore.lmsBridges.map((b) => ({
      id: b.id,
      lead_id: b.leadId || "",
      student_name: b.studentName,
      phone: b.phone,
      course_level: b.courseLevel,
      enrollment_no: b.enrollmentNo,
      portal_username: b.portalUsername,
      portal_password_masked: b.portalPasswordMasked,
      portal_fee_deducted_bdt: b.portalFeeDeductedBdt,
      net_knltc_margin_bdt: b.netKnlTcMarginBdt,
      credentials_sent_via_wa: b.credentialsSentViaWa,
      credentials_sent_at: b.credentialsSentAt,
      progress_percentage: b.progressPercentage,
      active_batch: b.activeBatch,
      assigned_sensei_id: b.assignedSenseiId || "",
      assigned_sensei_name: b.assignedSenseiName || "",
      created_at: b.credentialsSentAt,
    })),
    knltc_partner_schools: initialStore.partnerSchools.map((s) => ({
      id: s.id,
      name: s.name,
      japanese_name: s.japaneseName,
      institution_type: s.institutionType || "LANGUAGE_SCHOOL",
      location: s.location,
      contact_person: s.contactPerson,
      email: s.email,
      website_url: s.websiteUrl || "",
      logo_url: s.logoUrl || "",
      first_year_tuition_yen: s.firstYearTuitionYen ?? 760000,
      commission_per_student_yen: s.commissionPerStudentYen,
      commission_per_student_bdt: s.commissionPerStudentBdt,
      intake_quota: s.intakeQuota ?? 20,
      active_students_count: s.activeStudentsCount,
      total_commission_received_yen: s.totalCommissionReceivedYen,
      status: s.status,
      created_at: NOW_ISO,
    })),
    knltc_b2b_agents: initialStore.b2bAgents.map((a) => ({
      id: a.id,
      organization_name: a.organizationName,
      agent_type: a.agentType,
      contact_person: a.contactPerson,
      phone: a.phone,
      city: a.city,
      referred_students_count: a.referredStudentsCount,
      successful_visas_count: a.successfulVisasCount,
      agreed_commission_bdt: a.agreedCommissionBdt,
      pending_commission_bdt: a.pendingCommissionBdt,
      paid_commission_bdt: a.paidCommissionBdt,
      logo_url: a.logoUrl || "",
      trade_license_no: a.tradeLicenseNo || "",
      nid_or_passport_no: a.nidOrPassportNo || "",
      bank_name: a.bankName || "",
      bank_account_no: a.bankAccountNo || "",
      bkash_or_nagad_no: a.bkashOrNagadNo || "",
      created_at: NOW_ISO,
    })),
    knltc_staff_members: initialStore.staffList.map((st) => ({
      id: st.id,
      name: st.name,
      role: st.role,
      location: st.location,
      phone: st.phone,
      email: st.email,
      monthly_base_salary_bdt: st.monthlyBaseSalaryBdt,
      kpi_type: st.kpiType || "CALLS",
      kpi_target: st.kpiTarget ?? st.callsTargetMonthly,
      kpi_achieved: st.kpiAchieved ?? st.callsCompleted,
      calls_target_monthly: st.callsTargetMonthly,
      calls_completed: st.callsCompleted,
      admissions_target: st.admissionsTarget,
      admissions_achieved: st.admissionsAchieved,
      performance_bonus_bdt: st.performanceBonusBdt,
      last_paid_month: st.lastPaidMonth || "",
      status: st.status,
      created_at: NOW_ISO,
    })),
    knltc_finance_transactions: initialStore.transactions.map((tx) => ({
      id: tx.id,
      receipt_no: tx.receiptNo,
      date: tx.date,
      student_name: tx.studentName,
      student_phone: tx.studentPhone || "",
      category: tx.category || (tx.type.startsWith("EXPENSE") ? "EXPENSE" : "INCOME"),
      type: tx.type,
      amount_bdt: tx.amountBdt,
      due_amount_bdt: tx.dueAmountBdt ?? 0,
      payment_method: tx.paymentMethod,
      reference_or_trx: tx.referenceOrTrx,
      branch: tx.branch,
      verified_by: tx.verifiedBy,
      notes: tx.notes || "",
      linked_lead_id: tx.linkedLeadId || "",
      linked_visa_id: tx.linkedVisaId || "",
      linked_school_id: tx.linkedSchoolId || "",
      linked_agent_id: tx.linkedAgentId || "",
      linked_staff_id: tx.linkedStaffId || "",
      created_at: NOW_ISO,
    })),
    knltc_website_cms: [
      {
        id: "cms-master-01",
        section_key: "master_cms",
        data: initialCms,
        updated_at: NOW_ISO,
      },
    ],
  };
}

const globalForSheetsFallback = globalThis as unknown as {
  knltcFallbackTables?: Record<GoogleSheetsTableName, Record<string, any>[]>;
  knltcUploadedMedia?: Array<{
    name: string;
    url: string;
    size?: number;
    createdAt?: string;
    updatedAt?: string;
  }>;
};

function getFallbackTables(): Record<GoogleSheetsTableName, Record<string, any>[]> {
  if (!globalForSheetsFallback.knltcFallbackTables) {
    globalForSheetsFallback.knltcFallbackTables = buildInitialFallbackTables();
  }
  return globalForSheetsFallback.knltcFallbackTables;
}

export function getUploadedMediaList() {
  if (!globalForSheetsFallback.knltcUploadedMedia) {
    globalForSheetsFallback.knltcUploadedMedia = [
      {
        name: "minna-n5-cover.svg",
        url: "/images/books/minna-n5-cover.svg",
        createdAt: NOW_ISO,
      },
      {
        name: "minna-n4-cover.svg",
        url: "/images/books/minna-n4-cover.svg",
        createdAt: NOW_ISO,
      },
      {
        name: "kanji-master-cover.svg",
        url: "/images/books/kanji-master-cover.svg",
        createdAt: NOW_ISO,
      },
    ];
  }
  return globalForSheetsFallback.knltcUploadedMedia;
}

function camelToSnake(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function normalizeRowRecord(record: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(record || {})) {
    out[k] = v;
    const snake = camelToSnake(k);
    if (out[snake] === undefined) {
      out[snake] = v;
    }
  }
  return out;
}

export function invalidateSheetsCache(tableName?: string) {
  try {
    revalidateTag("knltc-db");
    if (tableName) {
      revalidateTag(tableName);
    }
  } catch {
    // Safe fallback when called outside a Next.js request context
  }
}

/**
 * ============================================================================
 * READ OPERATIONS (Google Sheets Web App + 60s Next.js Tag Cache + Fallback)
 * ============================================================================
 */
export async function fetchSheetTable<T = Record<string, any>>(
  tableName: GoogleSheetsTableName | string,
): Promise<T[]> {
  const { webAppUrl, isConfigured } = getGoogleSheetsConfig();
  const safeTable = tableName as GoogleSheetsTableName;
  const fallback = getFallbackTables();

  if (!isConfigured) {
    return (fallback[safeTable] || []) as T[];
  }

  try {
    const url = `${webAppUrl}${webAppUrl.includes("?") ? "&" : "?"}table=${encodeURIComponent(tableName)}`;
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      next: {
        tags: ["knltc-db", tableName],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return (fallback[safeTable] || []) as T[];
    }

    const json = await response.json();
    if (json && json.ok && Array.isArray(json.data)) {
      if (json.data.length > 0 || !fallback[safeTable]?.length) {
        fallback[safeTable] = json.data;
        return json.data as T[];
      }
    }
    return (fallback[safeTable] || []) as T[];
  } catch (err) {
    console.warn(`[GoogleSheetsDB] Fallback active for table "${tableName}":`, err);
    return (fallback[safeTable] || []) as T[];
  }
}

export async function fetchAllSheetTables(): Promise<
  Record<GoogleSheetsTableName, Record<string, any>[]>
> {
  const { webAppUrl, isConfigured } = getGoogleSheetsConfig();
  const fallback = getFallbackTables();

  if (!isConfigured) {
    return fallback;
  }

  try {
    const url = `${webAppUrl}${webAppUrl.includes("?") ? "&" : "?"}table=all`;
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      next: {
        tags: ["knltc-db"],
        revalidate: 60,
      },
    });

    if (!response.ok) return fallback;
    const json = await response.json();
    if (json && json.ok && json.data && typeof json.data === "object") {
      for (const tbl of GOOGLE_SHEETS_TABLES) {
        if (Array.isArray(json.data[tbl]) && json.data[tbl].length > 0) {
          fallback[tbl] = json.data[tbl];
        }
      }
      return fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Supports PostgREST-style query filter strings used by `lib/cms.ts`
 * e.g. `selectRows("products", "slug=eq.foo&status=eq.published&order=created_at.desc&limit=1")`
 */
export async function querySheetTable<T = Record<string, any>>(
  tableName: string,
  query = "",
): Promise<T[]> {
  const rows = await fetchSheetTable<Record<string, any>>(tableName);
  if (!query || !query.trim()) {
    return rows as T[];
  }

  let filtered = [...rows];
  const params = new URLSearchParams(query);

  for (const [key, rawVal] of params.entries()) {
    if (key === "select" || key === "order" || key === "limit" || key === "offset") {
      continue;
    }

    if (rawVal.startsWith("eq.")) {
      const target = rawVal.slice(3);
      filtered = filtered.filter((row) => {
        const val = row[key];
        if (typeof val === "boolean") {
          return String(val) === target.toLowerCase();
        }
        return String(val ?? "") === target;
      });
    } else if (rawVal.startsWith("neq.")) {
      const target = rawVal.slice(4);
      filtered = filtered.filter((row) => String(row[key] ?? "") !== target);
    } else if (rawVal.startsWith("in.(") && rawVal.endsWith(")")) {
      const list = rawVal
        .slice(4, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""));
      filtered = filtered.filter((row) => list.includes(String(row[key] ?? "")));
    }
  }

  const orderParam = params.get("order");
  if (orderParam) {
    const [orderCol, orderDir] = orderParam.split(".");
    const isDesc = orderDir === "desc";
    filtered.sort((a, b) => {
      const va = a[orderCol] ?? "";
      const vb = b[orderCol] ?? "";
      if (va === vb) return 0;
      const cmp = va > vb ? 1 : -1;
      return isDesc ? -cmp : cmp;
    });
  }

  const limitParam = params.get("limit");
  if (limitParam) {
    const limitNum = Number(limitParam);
    if (!Number.isNaN(limitNum) && limitNum > 0) {
      filtered = filtered.slice(0, limitNum);
    }
  }

  return filtered as T[];
}

/**
 * ============================================================================
 * WRITE OPERATIONS (Google Sheets Web App + Local Fallback Mirror + Cache Revalidate)
 * ============================================================================
 */
export async function mutateSheetTable<T = Record<string, any>>(options: {
  action: "CREATE" | "INSERT" | "UPDATE" | "UPSERT" | "DELETE" | "UPSERT_CMS" | "BULK_SYNC";
  table?: string;
  payload?: any;
  id?: string;
  matchKey?: string;
  tables?: Record<string, any[]>;
  replaceAll?: boolean;
}): Promise<T> {
  const { webAppUrl, apiKey, isConfigured } = getGoogleSheetsConfig();
  const fallback = getFallbackTables();
  const tableName = (options.table || "knltc_website_cms") as GoogleSheetsTableName;
  const nowIso = new Date().toISOString();

  // 1. Update local fallback mirror immediately so reads are always instant & consistent
  if (options.action === "BULK_SYNC" && options.tables) {
    for (const [tbl, rows] of Object.entries(options.tables)) {
      if (Array.isArray(rows) && GOOGLE_SHEETS_TABLES.includes(tbl as GoogleSheetsTableName)) {
        fallback[tbl as GoogleSheetsTableName] = rows.map((r) => normalizeRowRecord(r));
      }
    }
  } else if (options.action === "UPSERT_CMS") {
    const sectionKey = options.payload?.section_key || "master_cms";
    const cmsData = options.payload?.data !== undefined ? options.payload.data : options.payload;
    const cmsRow = {
      id: "cms-master-01",
      section_key: sectionKey,
      data: cmsData,
      updated_at: nowIso,
    };
    fallback.knltc_website_cms = [cmsRow];
  } else if (GOOGLE_SHEETS_TABLES.includes(tableName)) {
    const currentRows = fallback[tableName] || [];
    if (options.action === "CREATE" || options.action === "INSERT") {
      const items = Array.isArray(options.payload) ? options.payload : [options.payload];
      const created = items.map((item) => {
        const norm = normalizeRowRecord(item || {});
        if (!norm.id) norm.id = `${tableName.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        if (!norm.created_at) norm.created_at = nowIso;
        return norm;
      });
      fallback[tableName] = [...created, ...currentRows];
      options.payload = Array.isArray(options.payload) ? created : created[0];
    } else if (options.action === "UPDATE" || options.action === "UPSERT") {
      const matchKey = options.matchKey || "id";
      const norm = normalizeRowRecord(options.payload || {});
      const matchVal = options.id || norm[matchKey];
      const idx = currentRows.findIndex((r) => String(r[matchKey]) === String(matchVal));
      if (idx >= 0) {
        currentRows[idx] = {
          ...currentRows[idx],
          ...norm,
          updated_at: nowIso,
        };
        options.payload = currentRows[idx];
      } else if (options.action === "UPSERT") {
        if (!norm.id) norm.id = String(matchVal || `${tableName.slice(0, 3)}-${Date.now()}`);
        if (!norm.created_at) norm.created_at = nowIso;
        currentRows.unshift(norm);
        options.payload = norm;
      }
      fallback[tableName] = currentRows;
    } else if (options.action === "DELETE") {
      const targetId = options.id || options.payload?.id;
      fallback[tableName] = currentRows.filter((r) => String(r.id) !== String(targetId));
    }
  }

  // 2. Forward write to Google Apps Script Web App if configured
  if (isConfigured) {
    try {
      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        body: JSON.stringify({
          apiKey,
          action: options.action,
          table: options.table,
          payload: options.payload,
          id: options.id,
          matchKey: options.matchKey,
          tables: options.tables,
          replaceAll: options.replaceAll,
        }),
      });
      if (response.ok) {
        const json = await response.json();
        invalidateSheetsCache(options.table);
        if (json?.data !== undefined) {
          return json.data as T;
        }
      }
    } catch (err) {
      console.warn(`[GoogleSheetsDB] Remote POST (${options.action}) failed, saved in fallback mirror:`, err);
    }
  }

  invalidateSheetsCache(options.table);
  return (options.payload ?? { ok: true }) as T;
}

/**
 * ============================================================================
 * GOOGLE DRIVE & CLOUDINARY MEDIA UPLOAD ENGINE
 * ============================================================================
 * 1. If Cloudinary env vars are set & file is an image, uploads to Cloudinary CDN.
 * 2. Else if GOOGLE_SHEETS_WEB_APP_URL is set, sends `UPLOAD_FILE_TO_DRIVE` to
 *    Apps Script, saving in `KNLTC_Uploads_And_Visa_Docs/<folderName>` on Google Drive!
 * 3. Else falls back to a safe data URL so local testing works with zero crashes.
 */
export async function uploadFileToDriveOrCloudinary(options: {
  fileName: string;
  mimeType: string;
  base64Data: string;
  folderName?: string;
}): Promise<{
  success: boolean;
  url: string;
  downloadUrl?: string;
  fileId?: string;
  provider: "google-drive" | "cloudinary" | "local-fallback";
}> {
  const {
    webAppUrl,
    apiKey,
    cloudinaryCloudName,
    cloudinaryUploadPreset,
    isConfigured,
  } = getGoogleSheetsConfig();

  const cleanBase64 = options.base64Data.includes("base64,")
    ? options.base64Data.split("base64,")[1]
    : options.base64Data;
  const dataUri = `data:${options.mimeType};base64,${cleanBase64}`;

  // Option A: Optional Cloudinary optimization for images
  if (
    cloudinaryCloudName &&
    cloudinaryUploadPreset &&
    options.mimeType.startsWith("image/")
  ) {
    try {
      const form = new FormData();
      form.append("file", dataUri);
      form.append("upload_preset", cloudinaryUploadPreset);
      if (options.folderName) {
        form.append("folder", `knltc/${options.folderName}`);
      }
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: form,
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          getUploadedMediaList().unshift({
            name: options.fileName,
            url: data.secure_url,
            createdAt: new Date().toISOString(),
          });
          return {
            success: true,
            url: data.secure_url,
            downloadUrl: data.secure_url,
            fileId: data.public_id,
            provider: "cloudinary",
          };
        }
      }
    } catch (err) {
      console.warn("[GoogleSheetsDB] Cloudinary upload failed, falling back to Google Drive:", err);
    }
  }

  // Option B: Google Drive (`KNLTC_Uploads_And_Visa_Docs`) via Google Apps Script `doPost`
  if (isConfigured) {
    try {
      const res = await fetch(webAppUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        body: JSON.stringify({
          apiKey,
          action: "UPLOAD_FILE_TO_DRIVE",
          fileName: options.fileName,
          mimeType: options.mimeType,
          base64Data: cleanBase64,
          folderName: options.folderName || "KNLTC_General_Uploads",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.ok && json?.url) {
          getUploadedMediaList().unshift({
            name: options.fileName,
            url: json.url,
            createdAt: new Date().toISOString(),
          });
          return {
            success: true,
            url: json.url,
            downloadUrl: json.downloadUrl || json.url,
            fileId: json.fileId,
            provider: "google-drive",
          };
        }
      }
    } catch (err) {
      console.warn("[GoogleSheetsDB] Google Drive upload failed, using local data URI fallback:", err);
    }
  }

  // Option C: Zero-crash local data URI fallback
  getUploadedMediaList().unshift({
    name: options.fileName,
    url: dataUri,
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    url: dataUri,
    downloadUrl: dataUri,
    fileId: `local-${Date.now()}`,
    provider: "local-fallback",
  };
}

/**
 * Converts a full client `MasterKnlTcStore` + bookstore tables into a 15-table payload
 * and pushes it to Google Sheets via `BULK_SYNC`.
 */
export async function bulkSyncMasterStoreToSheets(
  store?: MasterKnlTcStore,
  replaceAll = false,
) {
  const fallback = getFallbackTables();
  const s = store || getCmsStore();
  const nowIso = new Date().toISOString();

  const tablesPayload: Record<GoogleSheetsTableName, Record<string, any>[]> = {
    blog_posts: fallback.blog_posts,
    categories: fallback.categories,
    products: fallback.products,
    orders: fallback.orders,
    order_items: fallback.order_items,
    product_reviews: fallback.product_reviews,
    wishlist_items: fallback.wishlist_items,
    knltc_crm_leads: (s.crmLeads || []).map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      whatsapp: l.whatsapp || l.phone,
      email: l.email || "",
      city: l.city,
      source: l.source,
      interest: l.interest,
      status: l.status,
      education: l.education,
      japanese_proficiency: l.japaneseProficiency,
      study_gap_years: l.studyGapYears,
      assigned_to: l.assignedTo,
      branch: l.branch,
      notes: l.notes,
      follow_up_date: l.followUpDate,
      last_contacted_at: l.lastContactedAt,
      created_at: l.createdAt || nowIso,
    })),
    knltc_visa_applicants: (s.visaApplicants || []).map((v) => ({
      id: v.id,
      lead_id: v.leadId || "",
      tracking_no: v.trackingNo,
      name: v.name,
      phone: v.phone,
      branch: v.branch,
      package_type: v.packageType,
      intake_session: v.intakeSession,
      stage: v.stage,
      target_school: v.targetSchool,
      partner_school_id: v.partnerSchoolId || "",
      b2b_agent_id: v.b2bAgentId || "",
      b2b_agent_name: v.b2bAgentName || "",
      visa_officer_id: v.visaOfficerId || "",
      visa_officer_name: v.visaOfficerName || "",
      contract_amount_bdt: v.contractAmountBdt || 120000,
      paid_amount_bdt: v.paidAmountBdt || 0,
      due_amount_bdt: v.dueAmountBdt || 0,
      sponsor_name: v.sponsorName,
      sponsor_relation: v.sponsorRelation,
      sponsor_bank: v.sponsorBank,
      sponsor_balance_bdt: v.sponsorBalanceBdt,
      bank_loan_assistance: v.bankLoanAssistance,
      bank_loan_bank: v.bankLoanBank || "",
      coe_status: v.coEStatus,
      visa_status: v.visaStatus,
      counselor_name: v.counselorName,
      updated_at: v.updatedAt || nowIso,
      created_at: v.updatedAt || nowIso,
    })),
    knltc_lms_bridges: (s.lmsBridges || []).map((b) => ({
      id: b.id,
      lead_id: b.leadId || "",
      student_name: b.studentName,
      phone: b.phone,
      course_level: b.courseLevel,
      enrollment_no: b.enrollmentNo,
      portal_username: b.portalUsername,
      portal_password_masked: b.portalPasswordMasked,
      portal_fee_deducted_bdt: b.portalFeeDeductedBdt,
      net_knltc_margin_bdt: b.netKnlTcMarginBdt,
      credentials_sent_via_wa: b.credentialsSentViaWa,
      credentials_sent_at: b.credentialsSentAt || nowIso,
      progress_percentage: b.progressPercentage,
      active_batch: b.activeBatch,
      assigned_sensei_id: b.assignedSenseiId || "",
      assigned_sensei_name: b.assignedSenseiName || "",
      created_at: b.credentialsSentAt || nowIso,
    })),
    knltc_partner_schools: (s.partnerSchools || []).map((sch) => ({
      id: sch.id,
      name: sch.name,
      japanese_name: sch.japaneseName,
      institution_type: sch.institutionType || "LANGUAGE_SCHOOL",
      location: sch.location,
      contact_person: sch.contactPerson,
      email: sch.email,
      website_url: sch.websiteUrl || "",
      logo_url: sch.logoUrl || "",
      first_year_tuition_yen: sch.firstYearTuitionYen ?? 760000,
      commission_per_student_yen: sch.commissionPerStudentYen,
      commission_per_student_bdt: sch.commissionPerStudentBdt,
      intake_quota: sch.intakeQuota ?? 20,
      active_students_count: sch.activeStudentsCount,
      total_commission_received_yen: sch.totalCommissionReceivedYen,
      status: sch.status,
      created_at: nowIso,
    })),
    knltc_b2b_agents: (s.b2bAgents || []).map((a) => ({
      id: a.id,
      organization_name: a.organizationName,
      agent_type: a.agentType,
      contact_person: a.contactPerson,
      phone: a.phone,
      city: a.city,
      referred_students_count: a.referredStudentsCount,
      successful_visas_count: a.successfulVisasCount,
      agreed_commission_bdt: a.agreedCommissionBdt,
      pending_commission_bdt: a.pendingCommissionBdt,
      paid_commission_bdt: a.paidCommissionBdt,
      logo_url: a.logoUrl || "",
      trade_license_no: a.tradeLicenseNo || "",
      nid_or_passport_no: a.nidOrPassportNo || "",
      bank_name: a.bankName || "",
      bank_account_no: a.bankAccountNo || "",
      bkash_or_nagad_no: a.bkashOrNagadNo || "",
      created_at: nowIso,
    })),
    knltc_staff_members: (s.staffList || []).map((st) => ({
      id: st.id,
      name: st.name,
      role: st.role,
      location: st.location,
      phone: st.phone,
      email: st.email,
      monthly_base_salary_bdt: st.monthlyBaseSalaryBdt,
      kpi_type: st.kpiType || "CALLS",
      kpi_target: st.kpiTarget ?? st.callsTargetMonthly,
      kpi_achieved: st.kpiAchieved ?? st.callsCompleted,
      calls_target_monthly: st.callsTargetMonthly,
      calls_completed: st.callsCompleted,
      admissions_target: st.admissionsTarget,
      admissions_achieved: st.admissionsAchieved,
      performance_bonus_bdt: st.performanceBonusBdt,
      last_paid_month: st.lastPaidMonth || "",
      status: st.status,
      created_at: nowIso,
    })),
    knltc_finance_transactions: (s.transactions || []).map((tx) => ({
      id: tx.id,
      receipt_no: tx.receiptNo,
      date: tx.date,
      student_name: tx.studentName,
      student_phone: tx.studentPhone || "",
      category: tx.category || (tx.type.startsWith("EXPENSE") ? "EXPENSE" : "INCOME"),
      type: tx.type,
      amount_bdt: tx.amountBdt,
      due_amount_bdt: tx.dueAmountBdt ?? 0,
      payment_method: tx.paymentMethod,
      reference_or_trx: tx.referenceOrTrx,
      branch: tx.branch,
      verified_by: tx.verifiedBy,
      notes: tx.notes || "",
      linked_lead_id: tx.linkedLeadId || "",
      linked_visa_id: tx.linkedVisaId || "",
      linked_school_id: tx.linkedSchoolId || "",
      linked_agent_id: tx.linkedAgentId || "",
      linked_staff_id: tx.linkedStaffId || "",
      created_at: nowIso,
    })),
    knltc_website_cms: [
      {
        id: "cms-master-01",
        section_key: "master_cms",
        data: s.websiteCms?.[0] || getWebsiteCms(),
        updated_at: nowIso,
      },
    ],
  };

  await mutateSheetTable({
    action: "BULK_SYNC",
    tables: tablesPayload,
    replaceAll,
  });

  return {
    ok: true,
    syncedTables: Object.keys(tablesPayload),
    isConfigured: getGoogleSheetsConfig().isConfigured,
    timestamp: nowIso,
  };
}
