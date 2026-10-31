import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import {
  getCmsStore,
  getWebsiteCms,
  type MasterKnlTcStore,
} from "@/lib/knltc-cms-store";

/**
 * ============================================================================
 * KNLTC GOOGLE SHEETS + GOOGLE DRIVE + PERSISTENT SERVER STORAGE ADAPTER
 * ============================================================================
 * - Supports all 15 Google Sheets tabs (`GOOGLE_SHEETS_TABLES`)
 * - Persists all tables & uploaded media files to `.data/` on disk (with `/tmp` fallback)
 *   so page refreshes and server restarts NEVER lose data or uploaded files.
 * - Automatically offloads embedded `data:<mime>;base64,...` strings into short
 *   `/api/media/file/<id>/<filename>` URLs so Google Sheets cells never exceed
 *   the 50,000-character limit and browser `localStorage` never overflows.
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

export interface MediaVaultItem {
  id: string;
  name: string;
  safeFileName: string;
  folderName: string;
  mimeType: string;
  size: number;
  url: string;
  downloadUrl: string;
  driveUrl?: string;
  driveFileId?: string;
  provider: "google-drive" | "cloudinary" | "persistent-disk";
  createdAt: string;
  updatedAt: string;
}

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
 * PERSISTENT DISK STORAGE DIRECTORY & MEDIA VAULT ENGINE
 * ============================================================================
 */
let cachedDataDir: string | null = null;

export function getPersistentDataDir(): string {
  if (cachedDataDir) return cachedDataDir;
  const primaryDir = path.join(process.cwd(), ".data");
  try {
    fs.mkdirSync(path.join(primaryDir, "media-files"), { recursive: true });
    cachedDataDir = primaryDir;
    return primaryDir;
  } catch {
    const fallbackDir = path.join("/tmp", "knltc-persistent-data");
    try {
      fs.mkdirSync(path.join(fallbackDir, "media-files"), { recursive: true });
    } catch {
      // Ignore if already exists
    }
    cachedDataDir = fallbackDir;
    return fallbackDir;
  }
}

function getTablesMirrorFilePath(): string {
  return path.join(getPersistentDataDir(), "sheets-db-mirror.json");
}

function getMediaIndexFilePath(): string {
  return path.join(getPersistentDataDir(), "media-index.json");
}

function getMediaBinaryFilePath(fileId: string): string {
  const cleanId = fileId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(getPersistentDataDir(), "media-files", cleanId);
}

function sanitizeFileName(rawName: string, mimeType = "application/octet-stream"): string {
  const trimmed = String(rawName || "file").trim();
  const cleaned = trimmed
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 80);

  if (cleaned.includes(".")) return cleaned;

  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  };
  const ext = extMap[mimeType.toLowerCase()] || "bin";
  return `${cleaned || "knltc_file"}.${ext}`;
}

const globalForSheetsFallback = globalThis as unknown as {
  knltcFallbackTables?: Record<GoogleSheetsTableName, Record<string, any>[]>;
  knltcUploadedMedia?: MediaVaultItem[];
  knltcDiskLoaded?: boolean;
};

function loadMediaIndexFromDisk(): MediaVaultItem[] {
  try {
    const file = getMediaIndexFilePath();
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[GoogleSheetsDB] Failed to read media-index.json:", err);
  }
  return [];
}

function saveMediaIndexToDisk(items: MediaVaultItem[]): void {
  try {
    const file = getMediaIndexFilePath();
    fs.writeFileSync(file, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.warn("[GoogleSheetsDB] Failed to write media-index.json:", err);
  }
}

export function getUploadedMediaList(filters?: {
  folder?: string;
  type?: "ALL" | "IMAGE" | "PDF" | "OTHER";
  search?: string;
}): MediaVaultItem[] {
  if (!globalForSheetsFallback.knltcUploadedMedia) {
    globalForSheetsFallback.knltcUploadedMedia = loadMediaIndexFromDisk();
  }
  let list = globalForSheetsFallback.knltcUploadedMedia;

  if (!filters) return list;

  if (filters.folder && filters.folder !== "ALL") {
    list = list.filter((item) => item.folderName === filters.folder);
  }
  if (filters.type && filters.type !== "ALL") {
    if (filters.type === "IMAGE") {
      list = list.filter((item) => item.mimeType.startsWith("image/"));
    } else if (filters.type === "PDF") {
      list = list.filter((item) => item.mimeType === "application/pdf" || item.name.toLowerCase().endsWith(".pdf"));
    } else {
      list = list.filter(
        (item) => !item.mimeType.startsWith("image/") && item.mimeType !== "application/pdf",
      );
    }
  }
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.folderName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q),
    );
  }
  return list;
}

export function saveBinaryToMediaVault(options: {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  folderName?: string;
  customId?: string;
  driveUrl?: string;
  driveFileId?: string;
  cloudinaryUrl?: string;
  provider?: "google-drive" | "cloudinary" | "persistent-disk";
}): MediaVaultItem {
  const list = getUploadedMediaList();
  const hash = crypto.createHash("sha1").update(options.buffer).digest("hex").slice(0, 16);
  const fileId = options.customId || `med-${hash}`;
  const safeFileName = sanitizeFileName(options.fileName, options.mimeType);
  const folderName = options.folderName || "KNLTC_General_Uploads";
  const nowIso = new Date().toISOString();

  try {
    const binPath = getMediaBinaryFilePath(fileId);
    if (!fs.existsSync(binPath)) {
      fs.writeFileSync(binPath, options.buffer);
    }
  } catch (err) {
    console.warn("[GoogleSheetsDB] Failed to write media binary:", err);
  }

  const localServeUrl = `/api/media/file/${fileId}/${encodeURIComponent(safeFileName)}`;
  const primaryUrl = options.cloudinaryUrl || localServeUrl;
  const downloadUrl = `${localServeUrl}?download=1`;

  const existingIdx = list.findIndex((m) => m.id === fileId);
  const item: MediaVaultItem = {
    id: fileId,
    name: options.fileName || safeFileName,
    safeFileName,
    folderName,
    mimeType: options.mimeType || "application/octet-stream",
    size: options.buffer.byteLength,
    url: primaryUrl,
    downloadUrl,
    driveUrl: options.driveUrl || ( existingIdx >= 0 ? list[existingIdx].driveUrl : undefined ),
    driveFileId: options.driveFileId || ( existingIdx >= 0 ? list[existingIdx].driveFileId : undefined ),
    provider:
      options.provider ||
      (options.cloudinaryUrl
        ? "cloudinary"
        : options.driveUrl
          ? "google-drive"
          : existingIdx >= 0
            ? list[existingIdx].provider
            : "persistent-disk"),
    createdAt: existingIdx >= 0 ? list[existingIdx].createdAt : nowIso,
    updatedAt: nowIso,
  };

  if (existingIdx >= 0) {
    list[existingIdx] = item;
  } else {
    list.unshift(item);
  }

  saveMediaIndexToDisk(list);
  return item;
}

export function getMediaFileById(fileId: string): {
  meta: MediaVaultItem | null;
  buffer: Buffer | null;
} {
  const cleanId = fileId.replace(/[^a-zA-Z0-9_-]/g, "");
  const list = getUploadedMediaList();
  const meta = list.find((m) => m.id === cleanId) || null;
  try {
    const binPath = getMediaBinaryFilePath(cleanId);
    if (fs.existsSync(binPath)) {
      const buffer = fs.readFileSync(binPath);
      return { meta, buffer };
    }
  } catch (err) {
    console.warn("[GoogleSheetsDB] Failed to read media file buffer:", err);
  }
  return { meta, buffer: null };
}

export function deleteUploadedMedia(fileId: string): boolean {
  const cleanId = fileId.replace(/[^a-zA-Z0-9_-]/g, "");
  const list = getUploadedMediaList();
  const idx = list.findIndex((m) => m.id === cleanId);
  if (idx === -1) return false;

  list.splice(idx, 1);
  saveMediaIndexToDisk(list);

  try {
    const binPath = getMediaBinaryFilePath(cleanId);
    if (fs.existsSync(binPath)) {
      fs.unlinkSync(binPath);
    }
  } catch {
    // Ignore unlink errors
  }
  return true;
}

/**
 * Automatically inspects any value (string, array, object, or serialized JSON string like `profile_json`)
 * and converts any embedded `data:<mime>;base64,...` (> 500 chars) into a persistent file in `.data/media-files/`
 * returning a short `/api/media/file/<id>/<name>` URL.
 * Prevents Google Sheets 50,000-char cell limit errors and browser localStorage QuotaExceededError!
 */
export function offloadEmbeddedBase64Strings<T = any>(
  input: T,
  folderHint = "KNLTC_Auto_Offloaded",
  nameHint = "embedded_media",
): { value: T; offloadedCount: number; freedBytes: number } {
  let offloadedCount = 0;
  let freedBytes = 0;

  function transform(val: any, keyHint: string): any {
    if (typeof val === "string") {
      // Case 1: Direct data:...;base64,... URI
      if (val.startsWith("data:") && val.includes(";base64,") && val.length > 500) {
        const markerIdx = val.indexOf(";base64,");
        if (markerIdx > 5) {
          const mimeType = val.slice(5, markerIdx).trim() || "image/jpeg";
          const b64 = val.slice(markerIdx + 8).trim();
          try {
            const buffer = Buffer.from(b64, "base64");
            const saved = saveBinaryToMediaVault({
              fileName: sanitizeFileName(keyHint || nameHint, mimeType),
              mimeType,
              buffer,
              folderName: folderHint,
            });
            offloadedCount++;
            freedBytes += Math.max(0, val.length - saved.url.length);
            return saved.url;
          } catch {
            return val;
          }
        }
      }

      // Case 2: Serialized JSON string (e.g. `profile_json` or `data`) that contains `"data:...;base64,`
      if (
        (val.startsWith("{") || val.startsWith("[")) &&
        val.includes(";base64,") &&
        val.length > 800
      ) {
        try {
          const parsed = JSON.parse(val);
          const transformedParsed = transform(parsed, keyHint);
          return JSON.stringify(transformedParsed);
        } catch {
          return val;
        }
      }

      return val;
    }

    if (Array.isArray(val)) {
      return val.map((item, idx) => transform(item, `${keyHint}_${idx}`));
    }

    if (val && typeof val === "object") {
      const out: Record<string, any> = {};
      const recordName =
        val.fileName || val.name || val.titleEn || val.organizationName || val.id || keyHint;
      for (const [k, v] of Object.entries(val)) {
        out[k] = transform(v, `${recordName}_${k}`);
      }
      return out;
    }

    return val;
  }

  const value = transform(input, nameHint) as T;
  return { value, offloadedCount, freedBytes };
}

/**
 * ============================================================================
 * SERVER-SIDE PERSISTENT MIRROR + SEED FALLBACK STORE
 * ============================================================================
 */
const NOW_ISO = "2026-10-28T10:00:00.000Z";

function buildInitialFallbackTables(): Record<GoogleSheetsTableName, Record<string, any>[]> {
  const initialStore = getCmsStore();
  const initialCms = getWebsiteCms();
  return {
    categories: [],
    products: [],
    blog_posts: [],
    orders: [],
    order_items: [],
    product_reviews: [],
    wishlist_items: [],
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
      priority: l.priority || "WARM",
      passport_no: l.passportNo || "",
      education: l.education,
      japanese_proficiency: l.japaneseProficiency,
      study_gap_years: l.studyGapYears,
      assigned_to: l.assignedTo,
      branch: l.branch,
      target_school: l.targetSchool || l.targetSchoolName || "",
      b2b_agent_name: l.b2bAgentName || l.referredByAgentName || "",
      contract_amount_bdt: l.contractAmountBdt ?? 120000,
      paid_amount_bdt: l.paidAmountBdt ?? 0,
      due_amount_bdt: l.dueAmountBdt ?? Math.max(0, (l.contractAmountBdt ?? 120000) - (l.paidAmountBdt ?? 0)),
      notes: l.notes,
      follow_up_date: l.followUpDate,
      last_contacted_at: l.lastContactedAt,
      ssc_gpa: l.sscGpa || "",
      hsc_gpa: l.hscGpa || "",
      profile_json: JSON.stringify(l),
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
      visa_track: v.visaTrack || "",
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
      profile_json: JSON.stringify(v),
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
      profile_json: JSON.stringify(s),
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
      profile_json: JSON.stringify(a),
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

function saveFallbackTablesToDisk(
  tables: Record<GoogleSheetsTableName, Record<string, any>[]>,
): void {
  try {
    const file = getTablesMirrorFilePath();
    fs.writeFileSync(file, JSON.stringify(tables), "utf-8");
  } catch (err) {
    console.warn("[GoogleSheetsDB] Failed to persist sheets-db-mirror.json:", err);
  }
}

function getFallbackTables(): Record<GoogleSheetsTableName, Record<string, any>[]> {
  if (!globalForSheetsFallback.knltcFallbackTables) {
    const initial = buildInitialFallbackTables();
    try {
      const file = getTablesMirrorFilePath();
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          for (const tbl of GOOGLE_SHEETS_TABLES) {
            if (Array.isArray(parsed[tbl])) {
              initial[tbl] = parsed[tbl];
            }
          }
        }
      } else {
        saveFallbackTablesToDisk(initial);
      }
    } catch (err) {
      console.warn("[GoogleSheetsDB] Using default tables (mirror read error):", err);
    }
    globalForSheetsFallback.knltcFallbackTables = initial;
  }
  return globalForSheetsFallback.knltcFallbackTables;
}

export function purgeFallbackTables(): void {
  const fallback = getFallbackTables();
  fallback.categories = [];
  fallback.products = [];
  fallback.blog_posts = [];
  fallback.knltc_crm_leads = [];
  fallback.knltc_visa_applicants = [];
  fallback.knltc_lms_bridges = [];
  fallback.knltc_b2b_agents = [];
  fallback.knltc_partner_schools = [];
  fallback.knltc_staff_members = [];
  fallback.knltc_finance_transactions = [];
  fallback.orders = [];
  fallback.order_items = [];
  fallback.product_reviews = [];
  fallback.wishlist_items = [];
  saveFallbackTablesToDisk(fallback);
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

/**
 * Merges remote Google Sheets rows with our persistent local mirror rows so that:
 * 1. Any rich `profile_json`, `documents`, `logo_url`, or newly created local records
 *    that haven't finished writing or were truncated in Sheets are NEVER lost on refresh!
 */
function mergeRemoteAndMirrorRows(
  tableName: GoogleSheetsTableName,
  remoteRows: Record<string, any>[],
  mirrorRows: Record<string, any>[],
): Record<string, any>[] {
  if (!Array.isArray(remoteRows) || remoteRows.length === 0) {
    return mirrorRows;
  }
  if (!Array.isArray(mirrorRows) || mirrorRows.length === 0) {
    return remoteRows;
  }

  const mirrorMap = new Map<string, Record<string, any>>();
  for (const m of mirrorRows) {
    const key = String(m.id || m.section_key || "");
    if (key) mirrorMap.set(key, m);
  }

  const mergedRemote = remoteRows.map((remote) => {
    const key = String(remote.id || remote.section_key || "");
    const localMirror = key ? mirrorMap.get(key) : undefined;
    if (!localMirror) return remote;

    const merged = { ...localMirror, ...remote };

    // Preserve logo_url, cover_image, featured_image if remote is empty
    if (!remote.logo_url && localMirror.logo_url) merged.logo_url = localMirror.logo_url;
    if (!remote.cover_image && localMirror.cover_image) merged.cover_image = localMirror.cover_image;
    if (!remote.featured_image && localMirror.featured_image) merged.featured_image = localMirror.featured_image;

    // Deep-merge profile_json so uploaded documents, tasks, and checklists never vanish
    if (localMirror.profile_json) {
      try {
        const localProf =
          typeof localMirror.profile_json === "string"
            ? JSON.parse(localMirror.profile_json)
            : localMirror.profile_json;
        const remoteProf = remote.profile_json
          ? typeof remote.profile_json === "string"
            ? JSON.parse(remote.profile_json)
            : remote.profile_json
          : {};

        const combinedProf = {
          ...localProf,
          ...remoteProf,
          logoUrl: remoteProf.logoUrl || localProf.logoUrl || merged.logo_url,
          documents:
            Array.isArray(remoteProf.documents) && remoteProf.documents.some((d: any) => d.fileUrl)
              ? remoteProf.documents
              : localProf.documents || remoteProf.documents,
          documentChecklist:
            Array.isArray(remoteProf.documentChecklist) &&
            remoteProf.documentChecklist.some((d: any) => d.fileUrl)
              ? remoteProf.documentChecklist
              : localProf.documentChecklist || remoteProf.documentChecklist,
          tasks:
            Array.isArray(remoteProf.tasks) && remoteProf.tasks.length > 0
              ? remoteProf.tasks
              : localProf.tasks || remoteProf.tasks,
          activityLog:
            Array.isArray(remoteProf.activityLog) && remoteProf.activityLog.length > 0
              ? remoteProf.activityLog
              : localProf.activityLog || remoteProf.activityLog,
        };
        merged.profile_json = JSON.stringify(combinedProf);
      } catch {
        if (!remote.profile_json) {
          merged.profile_json = localMirror.profile_json;
        }
      }
    }

    return merged;
  });

  // For knltc_website_cms, return mergedRemote directly
  if (tableName === "knltc_website_cms") {
    return mergedRemote;
  }

  return mergedRemote;
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
 * READ OPERATIONS (Google Sheets Web App + Persistent Disk Mirror)
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
        revalidate: 30,
      },
    });

    if (!response.ok) {
      return (fallback[safeTable] || []) as T[];
    }

    const json = await response.json();
    if (json && json.ok && Array.isArray(json.data)) {
      if (json.data.length > 0 || (fallback[safeTable] || []).length === 0) {
        const merged = mergeRemoteAndMirrorRows(safeTable, json.data, fallback[safeTable] || []);
        fallback[safeTable] = merged;
        saveFallbackTablesToDisk(fallback);
      }
      return (fallback[safeTable] || []) as T[];
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
        revalidate: 30,
      },
    });

    if (!response.ok) return fallback;
    const json = await response.json();
    if (json && json.ok && json.data && typeof json.data === "object") {
      for (const tbl of GOOGLE_SHEETS_TABLES) {
        if (Array.isArray(json.data[tbl]) && json.data[tbl].length > 0) {
          fallback[tbl] = mergeRemoteAndMirrorRows(tbl, json.data[tbl], fallback[tbl] || []);
        }
      }
      saveFallbackTablesToDisk(fallback);
      return fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Supports PostgREST-style query filter strings used by `lib/cms.ts`
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
 * WRITE OPERATIONS (Auto-Offload Base64 + Persistent Disk Mirror + Google Sheets)
 * ============================================================================
 */
export async function mutateSheetTable<T = Record<string, any>>(options: {
  action: "CREATE" | "INSERT" | "UPDATE" | "UPSERT" | "DELETE" | "UPSERT_CMS" | "BULK_SYNC" | "PURGE_DUMMY_DATA";
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

  // Automatically offload any embedded base64 strings in payload or tables
  // so Google Sheets 50,000-character cell limit is NEVER exceeded!
  if (options.payload) {
    options.payload = offloadEmbeddedBase64Strings(
      options.payload,
      `KNLTC_${tableName}`,
      tableName,
    ).value;
  }
  if (options.tables) {
    const cleanedTables: Record<string, any[]> = {};
    for (const [tbl, rows] of Object.entries(options.tables)) {
      cleanedTables[tbl] = offloadEmbeddedBase64Strings(rows, `KNLTC_${tbl}`, tbl).value;
    }
    options.tables = cleanedTables;
  }

  // 1. Update local persistent mirror immediately so reads are always instant & durable
  if (options.action === "PURGE_DUMMY_DATA") {
    purgeFallbackTables();
  } else if (options.action === "BULK_SYNC" && options.tables) {
    for (const [tbl, rows] of Object.entries(options.tables)) {
      if (Array.isArray(rows) && GOOGLE_SHEETS_TABLES.includes(tbl as GoogleSheetsTableName)) {
        fallback[tbl as GoogleSheetsTableName] = rows.map((r) => normalizeRowRecord(r));
      }
    }
    saveFallbackTablesToDisk(fallback);
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
    saveFallbackTablesToDisk(fallback);
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
    saveFallbackTablesToDisk(fallback);
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
      console.warn(`[GoogleSheetsDB] Remote POST (${options.action}) failed, saved in persistent disk mirror:`, err);
    }
  }

  invalidateSheetsCache(options.table);
  return (options.payload ?? { ok: true }) as T;
}

/**
 * ============================================================================
 * HYBRID GOOGLE DRIVE + CLOUDINARY + PERSISTENT DISK MEDIA UPLOAD ENGINE
 * ============================================================================
 * 1. Decodes the uploaded file binary and ALWAYS saves it to `.data/media-files/<id>`
 *    on persistent server disk.
 * 2. Also uploads to Cloudinary (if configured) or Google Drive (`UPLOAD_FILE_TO_DRIVE`
 *    in `KNLTC_Uploads_And_Visa_Docs/<folderName>`).
 * 3. Returns a clean, short `/api/media/file/<id>/<filename>` URL (< 70 chars) so
 *    images/PDFs load instantaneously without Google Drive cookie blocks and NEVER
 *    overflow Google Sheets' 50,000-character cell limit or browser `localStorage`!
 */
export async function uploadFileToDriveOrCloudinary(options: {
  fileName: string;
  mimeType: string;
  base64Data?: string;
  buffer?: Buffer;
  folderName?: string;
}): Promise<{
  success: boolean;
  url: string;
  downloadUrl: string;
  driveUrl?: string;
  fileId: string;
  provider: "google-drive" | "cloudinary" | "persistent-disk";
  size: number;
}> {
  const {
    webAppUrl,
    apiKey,
    cloudinaryCloudName,
    cloudinaryUploadPreset,
    isConfigured,
  } = getGoogleSheetsConfig();

  let buffer: Buffer;
  let cleanBase64: string;

  if (options.buffer) {
    buffer = options.buffer;
    cleanBase64 = buffer.toString("base64");
  } else {
    const rawB64 = options.base64Data || "";
    cleanBase64 = rawB64.includes("base64,") ? rawB64.split("base64,")[1] : rawB64;
    buffer = Buffer.from(cleanBase64, "base64");
  }

  const mimeType = options.mimeType || "application/octet-stream";
  const folderName = options.folderName || "KNLTC_General_Uploads";
  const dataUri = `data:${mimeType};base64,${cleanBase64}`;

  let cloudinaryUrl: string | undefined;
  let driveUrl: string | undefined;
  let driveFileId: string | undefined;
  let provider: "google-drive" | "cloudinary" | "persistent-disk" = "persistent-disk";

  // Step 1: Optional Cloudinary CDN upload for images
  if (
    cloudinaryCloudName &&
    cloudinaryUploadPreset &&
    mimeType.startsWith("image/")
  ) {
    try {
      const form = new FormData();
      form.append("file", dataUri);
      form.append("upload_preset", cloudinaryUploadPreset);
      form.append("folder", `knltc/${folderName}`);
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
          cloudinaryUrl = data.secure_url;
          provider = "cloudinary";
        }
      }
    } catch (err) {
      console.warn("[GoogleSheetsDB] Cloudinary upload failed, continuing with Drive + Persistent Disk:", err);
    }
  }

  // Step 2: Upload to Google Drive (`KNLTC_Uploads_And_Visa_Docs`) via Google Apps Script `doPost`
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
          mimeType,
          base64Data: cleanBase64,
          folderName,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.ok && json?.url) {
          driveUrl = json.url;
          driveFileId = json.fileId;
          if (!cloudinaryUrl) {
            provider = "google-drive";
          }
        }
      }
    } catch (err) {
      console.warn("[GoogleSheetsDB] Google Drive upload failed, using persistent server disk:", err);
    }
  }

  // Step 3: Save binary & metadata into Persistent Server Media Vault (`.data/media-files/<id>`)
  const vaultItem = saveBinaryToMediaVault({
    fileName: options.fileName,
    mimeType,
    buffer,
    folderName,
    driveUrl,
    driveFileId,
    cloudinaryUrl,
    provider,
  });

  return {
    success: true,
    url: vaultItem.url,
    downloadUrl: vaultItem.downloadUrl,
    driveUrl: vaultItem.driveUrl,
    fileId: vaultItem.id,
    provider: vaultItem.provider,
    size: vaultItem.size,
  };
}

/**
 * Returns storage health & diagnostic metrics for the Dashboard Media & Storage Manager.
 */
export function getStorageStatusSummary() {
  const config = getGoogleSheetsConfig();
  const mediaList = getUploadedMediaList();
  const fallback = getFallbackTables();

  const totalBytes = mediaList.reduce((acc, m) => acc + (m.size || 0), 0);
  const imageCount = mediaList.filter((m) => m.mimeType.startsWith("image/")).length;
  const pdfCount = mediaList.filter(
    (m) => m.mimeType === "application/pdf" || m.name.toLowerCase().endsWith(".pdf"),
  ).length;
  const driveSyncedCount = mediaList.filter((m) => Boolean(m.driveUrl || m.provider === "google-drive")).length;

  const folderCounts: Record<string, number> = {};
  for (const item of mediaList) {
    folderCounts[item.folderName] = (folderCounts[item.folderName] || 0) + 1;
  }

  // Check if any table row still has un-offloaded inline base64 strings
  let inlineBase64Count = 0;
  let maxCellLength = 0;
  for (const tbl of GOOGLE_SHEETS_TABLES) {
    const rows = fallback[tbl] || [];
    for (const row of rows) {
      for (const val of Object.values(row || {})) {
        if (typeof val === "string") {
          if (val.length > maxCellLength) maxCellLength = val.length;
          if (val.includes(";base64,") && val.length > 1000) {
            inlineBase64Count++;
          }
        }
      }
    }
  }

  return {
    ok: true,
    googleSheetsConnected: config.isConfigured,
    googleDriveConnected: config.isConfigured,
    cloudinaryConnected: Boolean(config.cloudinaryCloudName && config.cloudinaryUploadPreset),
    persistentDiskActive: true,
    persistentDir: getPersistentDataDir(),
    totalFiles: mediaList.length,
    totalBytes,
    imageCount,
    pdfCount,
    driveSyncedCount,
    folderCounts,
    inlineBase64Count,
    maxCellLength,
    sheetsCellHealthOk: maxCellLength < 45000 && inlineBase64Count === 0,
  };
}

/**
 * Scans all 15 tables in the persistent mirror, converts any remaining inline base64 strings
 * into short `/api/media/file/...` URLs, saves to disk, and triggers a Google Sheets sync.
 */
export async function optimizeAllTablesMedia() {
  const fallback = getFallbackTables();
  let totalOffloaded = 0;
  let totalFreedBytes = 0;

  for (const tbl of GOOGLE_SHEETS_TABLES) {
    const rows = fallback[tbl] || [];
    const { value, offloadedCount, freedBytes } = offloadEmbeddedBase64Strings(
      rows,
      `KNLTC_${tbl}`,
      tbl,
    );
    fallback[tbl] = value;
    totalOffloaded += offloadedCount;
    totalFreedBytes += freedBytes;
  }

  saveFallbackTablesToDisk(fallback);

  const { isConfigured } = getGoogleSheetsConfig();
  if (isConfigured && totalOffloaded > 0) {
    try {
      await mutateSheetTable({
        action: "BULK_SYNC",
        tables: fallback,
        replaceAll: false,
      });
    } catch {
      // Ignore remote sync error
    }
  }

  return {
    ok: true,
    optimizedCount: totalOffloaded,
    freedBytes: totalFreedBytes,
    summary: getStorageStatusSummary(),
  };
}

/**
 * Converts a full client `MasterKnlTcStore` + bookstore tables into a 15-table payload,
 * offloads any embedded base64 data to `.data/media-files/`, and pushes to Google Sheets via `BULK_SYNC`.
 */
export async function bulkSyncMasterStoreToSheets(
  store?: MasterKnlTcStore,
  replaceAll = false,
) {
  const fallback = getFallbackTables();
  const rawStore = store || getCmsStore();
  const s = offloadEmbeddedBase64Strings(rawStore, "KNLTC_MasterStore", "store").value;
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
      priority: l.priority || "WARM",
      passport_no: l.passportNo || "",
      education: l.education,
      japanese_proficiency: l.japaneseProficiency,
      study_gap_years: l.studyGapYears,
      assigned_to: l.assignedTo,
      branch: l.branch,
      target_school: l.targetSchool || l.targetSchoolName || "",
      b2b_agent_name: l.b2bAgentName || l.referredByAgentName || "",
      contract_amount_bdt: l.contractAmountBdt ?? 120000,
      paid_amount_bdt: l.paidAmountBdt ?? 0,
      due_amount_bdt: l.dueAmountBdt ?? Math.max(0, (l.contractAmountBdt ?? 120000) - (l.paidAmountBdt ?? 0)),
      notes: l.notes,
      follow_up_date: l.followUpDate,
      last_contacted_at: l.lastContactedAt,
      ssc_gpa: l.sscGpa || "",
      hsc_gpa: l.hscGpa || "",
      profile_json: JSON.stringify(l),
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
      visa_track: v.visaTrack || "",
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
      profile_json: JSON.stringify(v),
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
      profile_json: JSON.stringify(sch),
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
      profile_json: JSON.stringify(a),
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
