type QueryParams = Record<string, string | number | boolean | null | undefined>;

type SupabaseOperation = "select" | "insert" | "update" | "delete" | "upload" | "list";

type SupabaseErrorResponse = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  error?: string;
};

export class SupabaseOperationError extends Error {
  status: number;
  operation: SupabaseOperation;
  resourceType: "table" | "bucket";
  resourceName: string;
  payloadFields: string[];
  code?: string;
  details?: string;
  hint?: string;
  rawResponse?: string;

  constructor(args: {
    status: number;
    operation: SupabaseOperation;
    resourceType: "table" | "bucket";
    resourceName: string;
    payloadFields?: string[];
    message: string;
    code?: string;
    details?: string;
    hint?: string;
    rawResponse?: string;
  }) {
    super(args.message);
    this.name = "SupabaseOperationError";
    this.status = args.status;
    this.operation = args.operation;
    this.resourceType = args.resourceType;
    this.resourceName = args.resourceName;
    this.payloadFields = args.payloadFields ?? [];
    this.code = args.code;
    this.details = args.details;
    this.hint = args.hint;
    this.rawResponse = args.rawResponse;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isSupabaseConfigured() {
  return Boolean(supabaseUrl && (anonKey || serviceKey));
}

function getBaseUrl() {
  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  return supabaseUrl;
}

function buildQuery(params?: QueryParams) {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    search.set(key, String(value));
  });
  const output = search.toString();
  return output ? `?${output}` : "";
}

function getPayloadFieldNames(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  return Object.keys(payload as Record<string, unknown>);
}

function parseSupabaseError(rawResponse: string): SupabaseErrorResponse {
  if (!rawResponse) return {};
  try {
    const parsed = JSON.parse(rawResponse) as SupabaseErrorResponse;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { message: rawResponse };
  }
}

// -------------------------------------------------------------
// In-Memory Fallback Store (Used when Supabase is not configured)
// -------------------------------------------------------------
type InMemoryRecord = Record<string, any>;

const initialCategories: InMemoryRecord[] = [
  { id: "cat-1", name: "Japanese Books", slug: "japanese-books", type: "product", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-2", name: "JLPT Materials", slug: "jlpt-materials", type: "product", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-3", name: "Stationery", slug: "stationery", type: "product", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-4", name: "Learning Accessories", slug: "learning-accessories", type: "product", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-5", name: "Japan Study Guide", slug: "japan-study-guide", type: "blog", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-6", name: "Visa Tips", slug: "visa-tips", type: "blog", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-7", name: "Japanese Language", slug: "japanese-language", type: "blog", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-8", name: "Career in Japan", slug: "career-in-japan", type: "blog", created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-9", name: "News & Updates", slug: "news-updates", type: "blog", created_at: "2026-01-01T00:00:00.000Z" },
];

const initialProducts: InMemoryRecord[] = [
  {
    id: "prod-1",
    name: "Minna No Nihongo Shokyu 1 (Bengali Translation & Notes)",
    slug: "minna-no-nihongo-shokyu-1-bangla",
    category_id: "cat-1",
    short_description: "The most popular textbook for Japanese beginners (Lessons 1-25) with detailed Bengali explanation.",
    full_description: "<p>Minna No Nihongo Shokyu 1 is the quintessential textbook for Japanese language beginners. This edition includes vocabulary, translation, and grammar notes translated accurately into Bengali, making it effortless for Bangladeshi students preparing for JLPT N5 and JFT-Basic.</p>",
    price: 450,
    sale_price: 390,
    stock: 45,
    featured_image: "/placeholder.svg",
    gallery: ["/placeholder.svg"],
    status: "published",
    is_featured: true,
    sku: "MNN-01",
    created_at: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "prod-2",
    name: "JLPT N5 Official Practice Workbook with Audio",
    slug: "jlpt-n5-official-practice-workbook",
    category_id: "cat-2",
    short_description: "Real exam simulation questions, vocabulary drills, grammar patterns, and listening comprehension tests.",
    full_description: "<p>Prepare thoroughly for the Japanese Language Proficiency Test (JLPT) N5 with full-length mock tests, authentic answer sheets, and downloadable audio tracks.</p>",
    price: 550,
    sale_price: 480,
    stock: 30,
    featured_image: "/placeholder.svg",
    gallery: ["/placeholder.svg"],
    status: "published",
    is_featured: true,
    sku: "JLPT-N5-01",
    created_at: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "prod-3",
    name: "Japanese Hiragana & Katakana Mastery Writing Grid Notebook",
    slug: "hiragana-katakana-grid-notebook",
    category_id: "cat-3",
    short_description: "Specialized square-grid calligraphy manuscript paper designed for perfect Japanese stroke order.",
    full_description: "<p>Master kana calligraphy with stroke-by-stroke guides, balance reference centers, and high quality fountain-pen friendly Japanese paper.</p>",
    price: 200,
    sale_price: 160,
    stock: 80,
    featured_image: "/placeholder.svg",
    gallery: ["/placeholder.svg"],
    status: "published",
    is_featured: false,
    sku: "GENKO-01",
    created_at: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "prod-4",
    name: "Essential Kanji Flashcards (N5 & N4 - 300 Cards)",
    slug: "kanji-flashcards-n5-n4",
    category_id: "cat-4",
    short_description: "300 pocket-sized flashcards with Onyomi, Kunyomi, stroke orders, and high-frequency example compounds.",
    full_description: "<p>Portable, ring-bound flashcards covering all 103 N5 kanji plus essential N4 kanji with clear Bengali and English meanings.</p>",
    price: 380,
    sale_price: 320,
    stock: 25,
    featured_image: "/placeholder.svg",
    gallery: ["/placeholder.svg"],
    status: "published",
    is_featured: true,
    sku: "FLASH-K01",
    created_at: "2026-03-01T00:00:00.000Z",
  },
];

const initialBlogPosts: InMemoryRecord[] = [
  {
    id: "post-1",
    title: "Complete Guide to Japanese Student Visa Application from Bangladesh (2026)",
    slug: "complete-guide-student-visa-japan-from-bangladesh",
    category_id: "cat-5",
    excerpt: "Learn step-by-step how to prepare your academic certificates, financial sponsorship documents, COE application, and embassy interview.",
    content: "<h2>Introduction</h2><p>Applying for higher studies in Japan from Bangladesh is one of the most rewarding educational decisions. Japanese language schools, vocational colleges (Senmon Gakko), and top national and private universities welcome thousands of Bangladeshi students annually.</p><h3>Step 1: Japanese Language Preparation</h3><p>Ensure you have at least 150 hours of Japanese language study or JLPT N5/NAT-TEST 5Q certification before beginning your school selection.</p><h3>Step 2: Certificate of Eligibility (COE)</h3><p>Your chosen school submits your documents to Japanese Immigration. Financial sponsorship documents from your parents/guardian must show steady income and bank solvency.</p><h3>Step 3: Embassy Visa Stamping</h3><p>Once your COE is issued, visit the Embassy of Japan or VFS Global in Dhaka for final visa stamping.</p>",
    cover_image: "/images/hero-bg.jpg",
    tags: ["Student Visa", "COE", "Study in Japan"],
    author: "KNLTC Expert Team",
    publish_date: "2026-03-15",
    status: "published",
    created_at: "2026-03-15T00:00:00.000Z",
  },
  {
    id: "post-2",
    title: "SSW (Specified Skilled Worker) vs TITP: Which Pathway Should You Choose?",
    slug: "ssw-vs-titp-pathway-guide",
    category_id: "cat-8",
    excerpt: "Understanding the salary differences, job mobility, test requirements, and residency paths between SSW and Technical Intern Training in Japan.",
    content: "<h2>Overview of Japan's Employment Programs</h2><p>Japan currently provides two major avenues for Bangladeshi professionals and young workers: SSW (Specified Skilled Worker) and TITP (Technical Intern Training Program).</p><h3>SSW (Tokutei Ginou)</h3><p>SSW offers direct employment under standard Japanese labor laws, equal pay to Japanese nationals, and potential for permanent residency (SSW-ii). It requires JFT-Basic or JLPT N4 plus a skill test (e.g. Caregiver, Agriculture, Food Service).</p><h3>TITP Program</h3><p>TITP focuses on transfer of technical skills with structured on-the-job training. Many candidates complete TITP and smoothly transition to SSW-i without retaking exams.</p>",
    cover_image: "/images/hero-bg.jpg",
    tags: ["SSW", "TITP", "Work in Japan"],
    author: "KNLTC Career Cell",
    publish_date: "2026-03-20",
    status: "published",
    created_at: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "post-3",
    title: "5 Proven Strategies to Pass JLPT N5 on Your First Attempt",
    slug: "how-to-pass-jlpt-n5-first-attempt",
    category_id: "cat-7",
    excerpt: "A strategic study schedule focusing on Hiragana, Katakana, basic 100 Kanji, and Minna no Nihongo Lessons 1-25.",
    content: "<h2>Passing JLPT N5 with Confidence</h2><p>The JLPT N5 exam tests basic Japanese reading, vocabulary, grammar, and listening. By following KNLTC's proven 12-week preparation roadmap, you can comfortably score in the top percentile.</p><p>Daily vocabulary drills combined with shadowing audio tracks builds both conversational fluency and test reflexes.</p>",
    cover_image: "/images/hero-bg.jpg",
    tags: ["JLPT N5", "Japanese Language", "Tips"],
    author: "Sensei Tanvir",
    publish_date: "2026-03-28",
    status: "published",
    created_at: "2026-03-28T00:00:00.000Z",
  },
];

const initialReviews: InMemoryRecord[] = [
  {
    id: "rev-1",
    product_id: "prod-1",
    customer_name: "Mahmud Hasan",
    rating: 5,
    comment: "Excellent Bengali translation and grammar explanations. Very helpful for my N5 preparation at KNLTC.",
    status: "approved",
    created_at: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "rev-2",
    product_id: "prod-2",
    customer_name: "Farhana Akter",
    rating: 5,
    comment: "The audio listening CD and practice test sheets match the actual JLPT exam format exactly.",
    status: "approved",
    created_at: "2026-03-18T14:30:00.000Z",
  },
];

const initialOrders: InMemoryRecord[] = [];
const initialOrderItems: InMemoryRecord[] = [];
const initialCrmLeads: InMemoryRecord[] = [];
const initialStorageFiles: { name: string; created_at: string; url: string }[] = [];

// Global singleton map to keep state across module re-evaluations in dev
const globalForStore = globalThis as unknown as {
  __knltc_tables?: Map<string, InMemoryRecord[]>;
  __knltc_storage?: { name: string; created_at: string; url: string }[];
};

if (!globalForStore.__knltc_tables) {
  const tables = new Map<string, InMemoryRecord[]>();
  tables.set("categories", [...initialCategories]);
  tables.set("products", [...initialProducts]);
  tables.set("blog_posts", [...initialBlogPosts]);
  tables.set("product_reviews", [...initialReviews]);
  tables.set("orders", [...initialOrders]);
  tables.set("order_items", [...initialOrderItems]);
  tables.set("crm_leads", [...initialCrmLeads]);
  globalForStore.__knltc_tables = tables;
  globalForStore.__knltc_storage = [...initialStorageFiles];
}

function getTable(table: string): InMemoryRecord[] {
  const tables = globalForStore.__knltc_tables!;
  if (!tables.has(table)) {
    tables.set(table, []);
  }
  return tables.get(table)!;
}

function filterInMemory(table: string, params?: QueryParams): InMemoryRecord[] {
  let rows = [...getTable(table)];
  const categories = getTable("categories");
  const orderItems = getTable("order_items");

  if (params) {
    for (const [key, val] of Object.entries(params)) {
      if (val === null || val === undefined || key === "select" || key === "order" || key === "limit") continue;
      const strVal = String(val);
      if (strVal.startsWith("eq.")) {
        const expected = strVal.slice(3);
        rows = rows.filter((r) => String(r[key]) === expected);
      } else if (strVal.startsWith("neq.")) {
        const expected = strVal.slice(4);
        rows = rows.filter((r) => String(r[key]) !== expected);
      } else {
        rows = rows.filter((r) => String(r[key]) === strVal);
      }
    }

    if (params.order) {
      const orderStr = String(params.order);
      const [col, dir] = orderStr.split(".");
      rows.sort((a, b) => {
        const aVal = a[col] ?? "";
        const bVal = b[col] ?? "";
        if (aVal < bVal) return dir === "desc" ? 1 : -1;
        if (aVal > bVal) return dir === "desc" ? -1 : 1;
        return 0;
      });
    }

    if (params.limit) {
      const limit = Number(params.limit);
      if (!isNaN(limit)) {
        rows = rows.slice(0, limit);
      }
    }
  }

  // Handle joins for select
  const selectStr = params?.select ? String(params.select) : "*";
  return rows.map((r) => {
    const item = { ...r };
    if (selectStr.includes("categories")) {
      const category = categories.find((c) => c.id === item.category_id);
      item.categories = category ? { name: category.name, slug: category.slug } : null;
    }
    if (selectStr.includes("order_items")) {
      item.order_items = orderItems.filter((oi) => oi.order_id === item.id);
    }
    return item;
  });
}

// -------------------------------------------------------------
// Real Supabase Request with Fallback
// -------------------------------------------------------------
async function restRequest(
  path: string,
  init: RequestInit = {},
  admin = false,
  context?: { operation?: SupabaseOperation; table?: string; payload?: unknown },
) {
  if (!isSupabaseConfigured()) {
    // Return null to trigger in-memory fallback
    return null;
  }

  const key = admin ? serviceKey : anonKey;
  if (!key) return null;

  const res = await fetch(`${getBaseUrl()}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const rawResponse = await res.text();
    const parsed = parseSupabaseError(rawResponse);
    const message = parsed.message ?? parsed.error ?? `Supabase request failed: ${res.status}`;
    const operation = context?.operation ?? "select";
    const table = context?.table ?? path.split("?")[0];
    const payloadFields = getPayloadFieldNames(context?.payload);

    console.error("[Supabase][REST]", {
      path,
      status: res.status,
      operation,
      table,
      payloadFields,
      code: parsed.code,
      message,
      details: parsed.details,
      hint: parsed.hint,
      response: rawResponse,
    });

    throw new SupabaseOperationError({
      status: res.status,
      operation,
      resourceType: "table",
      resourceName: table,
      payloadFields,
      message,
      code: parsed.code,
      details: parsed.details,
      hint: parsed.hint,
      rawResponse,
    });
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function selectRows(table: string, params?: QueryParams, admin = false) {
  if (isSupabaseConfigured()) {
    try {
      const data = await restRequest(`${table}${buildQuery(params)}`, { method: "GET" }, admin, { operation: "select", table });
      if (data !== null) return data;
    } catch (err) {
      console.warn(`[Supabase] Live query to ${table} failed, falling back to in-memory:`, err);
    }
  }
  return filterInMemory(table, params);
}

export async function insertRow(table: string, payload: unknown, admin = true) {
  if (isSupabaseConfigured()) {
    try {
      const data = await restRequest(table, { method: "POST", body: JSON.stringify(payload) }, admin, {
        operation: "insert",
        table,
        payload,
      });
      if (data !== null) return Array.isArray(data) ? data[0] : data;
    } catch (err) {
      console.warn(`[Supabase] Live insert to ${table} failed, falling back to in-memory:`, err);
    }
  }

  const tableRows = getTable(table);
  const now = new Date().toISOString();
  const id = (payload as any)?.id || `gen-${Math.random().toString(36).slice(2, 10)}`;
  const record: InMemoryRecord = {
    ...(payload as Record<string, any>),
    id,
    created_at: (payload as any)?.created_at || now,
    updated_at: now,
  };
  tableRows.unshift(record);
  return record;
}

export async function updateRow(table: string, id: string, payload: unknown, admin = true) {
  if (isSupabaseConfigured()) {
    try {
      const data = await restRequest(`${table}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(payload) }, admin, {
        operation: "update",
        table,
        payload,
      });
      if (data !== null) return Array.isArray(data) ? data[0] : data;
    } catch (err) {
      console.warn(`[Supabase] Live update to ${table} failed, falling back to in-memory:`, err);
    }
  }

  const tableRows = getTable(table);
  const index = tableRows.findIndex((r) => r.id === id);
  if (index !== -1) {
    const updated = {
      ...tableRows[index],
      ...(payload as Record<string, any>),
      updated_at: new Date().toISOString(),
    };
    tableRows[index] = updated;
    return updated;
  }
  return payload;
}

export async function deleteRow(table: string, id: string, admin = true) {
  if (isSupabaseConfigured()) {
    try {
      await restRequest(`${table}?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, admin, {
        operation: "delete",
        table,
        payload: { id },
      });
      return;
    } catch (err) {
      console.warn(`[Supabase] Live delete from ${table} failed, falling back to in-memory:`, err);
    }
  }

  const tableRows = getTable(table);
  const index = tableRows.findIndex((r) => r.id === id);
  if (index !== -1) {
    tableRows.splice(index, 1);
  }
}

export async function uploadToStorage(fileName: string, data: ArrayBuffer, contentType: string, bucket: string) {
  if (isSupabaseConfigured() && serviceKey) {
    try {
      const res = await fetch(`${getBaseUrl()}/storage/v1/object/${bucket}/${fileName}`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": contentType,
          "x-upsert": "false",
        },
        body: data,
      });

      if (res.ok) {
        return `${getBaseUrl()}/storage/v1/object/public/${bucket}/${fileName}`;
      }
    } catch (err) {
      console.warn(`[Supabase] Live storage upload failed, falling back to in-memory:`, err);
    }
  }

  // In-memory mock storage
  const mockUrl = `/images/${fileName}`;
  globalForStore.__knltc_storage = globalForStore.__knltc_storage || [];
  globalForStore.__knltc_storage.unshift({
    name: fileName,
    created_at: new Date().toISOString(),
    url: mockUrl,
  });
  return mockUrl;
}

export async function listStorageFiles(bucket: string) {
  if (isSupabaseConfigured() && serviceKey) {
    try {
      const res = await fetch(`${getBaseUrl()}/storage/v1/object/list/${bucket}`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit: 200, offset: 0, sortBy: { column: "created_at", order: "desc" } }),
        cache: "no-store",
      });

      if (res.ok) {
        const rows = (await res.json()) as Array<{ name: string; created_at?: string | null }>;
        return rows
          .filter((row) => row.name && !row.name.endsWith("/"))
          .map((row) => ({
            name: row.name,
            created_at: row.created_at ?? null,
            url: `${getBaseUrl()}/storage/v1/object/public/${bucket}/${row.name}`,
          }));
      }
    } catch (err) {
      console.warn(`[Supabase] Live listStorageFiles failed, falling back to in-memory:`, err);
    }
  }

  return (globalForStore.__knltc_storage || [
    { name: "hero-bg.jpg", created_at: "2026-01-01T00:00:00.000Z", url: "/images/hero-bg.jpg" },
    { name: "knltc-logo.svg", created_at: "2026-01-01T00:00:00.000Z", url: "/brand/knltc-logo.svg" },
  ]);
}
