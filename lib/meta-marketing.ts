import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getPersistentDataDir, upsertRow } from "@/lib/google-sheets-db";

export interface MetaStageMapping {
  crmStage: string;
  metaEventName: string;
  descriptionBn: string;
  descriptionEn: string;
  enabled: boolean;
}

export interface MetaAdAccountInfo {
  id: string;
  accountId: string;
  name: string;
  currency: string;
  accountStatus: number;
}

export interface MetaPageInfo {
  id: string;
  name: string;
  category?: string;
  accessToken?: string;
  webhookSubscribed?: boolean;
}

export interface MetaLeadFormItem {
  id: string;
  name: string;
  status: string;
  pageId: string;
  pageName: string;
  leadsCount: number;
  createdTime?: string;
  locale?: string;
}

export interface MetaPageCommentItem {
  id: string;
  fromName: string;
  fromId?: string;
  message: string;
  createdTime: string;
}

export interface MetaPagePostItem {
  id: string;
  pageId: string;
  pageName: string;
  message: string;
  fullPicture?: string;
  permalinkUrl?: string;
  createdTime: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  comments: MetaPageCommentItem[];
}

export interface MetaMarketingConfig {
  appId: string;
  appSecret: string;
  datasetId: string;
  apiVersion: string;
  businessName: string;
  leadEventSource: string;
  accessToken: string;
  adAccountId: string;
  pageId: string;
  pageAccessToken?: string;
  connectedUserName?: string;
  connectedUserId?: string;
  tokenExpiresAt?: string;
  testEventCode: string;
  webhookVerifyToken: string;
  autoSyncCrmStages: boolean;
  stageMappings: MetaStageMapping[];
  // Phase-ready Omni-channel connectors
  googleAdsCustomerId?: string;
  googleAdsConversionId?: string;
  googleAdsConversionLabel?: string;
  youtubeChannelId?: string;
  youtubeChannelHandle?: string;
  gbpDhakaLocationId?: string;
  gbpKhulnaLocationId?: string;
  updatedAt: string;
}

export interface MetaCapiEventLog {
  id: string;
  timestamp: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadEmail?: string;
  metaLeadId?: string;
  crmStage: string;
  metaEventName: string;
  datasetId: string;
  status: "DELIVERED" | "READY_AWAITING_TOKEN" | "FAILED";
  httpStatus?: number;
  eventsReceived?: number;
  fbtraceId?: string;
  isTestEvent?: boolean;
  errorMessage?: string;
  payloadPreview: Record<string, any>;
}

export interface MetaAdItem {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  adSetId: string;
  adSetName: string;
  campaignId: string;
  campaignName: string;
  objective?: string;
  spendBdtOrUsd: number;
  currency: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  metaReportedLeads: number;
  crmMatchedLeadsCount: number;
  crmQualifiedLeadsCount: number;
  crmAdmittedCount: number;
  thumbnailUrl?: string;
  creativeTitle?: string;
  creativeBody?: string;
  createdTime?: string;
}

export interface MetaAdSetItem {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  status: string;
  effectiveStatus: string;
  optimizationGoal?: string;
  dailyBudget?: number;
  spend: number;
  impressions: number;
  clicks: number;
  leadsCount: number;
}

export interface MetaCampaignItem {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  objective: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  spend: number;
  currency: string;
  impressions: number;
  clicks: number;
  ctr: number;
  metaReportedLeads: number;
  crmMatchedLeadsCount: number;
  crmQualifiedLeadsCount: number;
  crmAdmittedCount: number;
  createdTime?: string;
  updatedTime?: string;
}

export interface MetaMarketingStoreData {
  config: MetaMarketingConfig;
  capiLogs: MetaCapiEventLog[];
  adAccounts: MetaAdAccountInfo[];
  pages: MetaPageInfo[];
  leadForms: MetaLeadFormItem[];
  pagePosts: MetaPagePostItem[];
  cachedCampaigns: MetaCampaignItem[];
  cachedAdSets: MetaAdSetItem[];
  cachedAds: MetaAdItem[];
  lastGraphSyncAt?: string;
}

export const DEFAULT_META_STAGE_MAPPINGS: MetaStageMapping[] = [
  {
    crmStage: "NEW",
    metaEventName: "Lead",
    descriptionBn: "নতুন লিড (Website / Meta Lead Form থেকে আগত)",
    descriptionEn: "Initial raw lead captured in KNLTC CRM",
    enabled: true,
  },
  {
    crmStage: "CONTACTED",
    metaEventName: "Contact",
    descriptionBn: "প্রাথমিক ফোনে বা হোয়াটসঅ্যাপে কথা হয়েছে",
    descriptionEn: "Counselor established first phone/WhatsApp contact",
    enabled: true,
  },
  {
    crmStage: "COUNSELED",
    metaEventName: "QualifiedLead",
    descriptionBn: "কাউন্সেলিং সম্পন্ন ও যোগ্য প্রার্থী (Qualified Lead)",
    descriptionEn: "Candidate counseled & verified eligible for Japan pathway",
    enabled: true,
  },
  {
    crmStage: "OFFICE_VISIT_BOOKED",
    metaEventName: "Schedule",
    descriptionBn: "ঢাকা বা খুলনা অফিসে সরাসরি ভিজিট বুকিং",
    descriptionEn: "Candidate scheduled physical visit at Dhaka HQ or Khulna Branch",
    enabled: true,
  },
  {
    crmStage: "LANGUAGE_ENROLLED",
    metaEventName: "StartTrial",
    descriptionBn: "জাপানি ভাষা কোর্সে (N5 / Irodori) ভর্তি সম্পন্ন",
    descriptionEn: "Enrolled in Japanese Language Course & LMS activated",
    enabled: true,
  },
  {
    crmStage: "ADMITTED",
    metaEventName: "Purchase",
    descriptionBn: "চূড়ান্ত ভর্তি / ফাইল ওপেনিং সম্পন্ন (Admitted / Converted)",
    descriptionEn: "Confirmed admission / Visa file opened with contract",
    enabled: true,
  },
  {
    crmStage: "COE_APPROVED",
    metaEventName: "SubmitApplication",
    descriptionBn: "জাপান ইমিগ্রেশন থেকে COE অনুমোদিত",
    descriptionEn: "Certificate of Eligibility (COE) approved from Japan",
    enabled: true,
  },
  {
    crmStage: "VISA_GRANTED",
    metaEventName: "Subscribe",
    descriptionBn: "জাপান অ্যাম্বাসি থেকে ভিসা স্ট্যাম্প সম্পন্ন",
    descriptionEn: "Final Embassy Visa Granted",
    enabled: true,
  },
  {
    crmStage: "ARCHIVED",
    metaEventName: "DisqualifiedLead",
    descriptionBn: "অযোগ্য বা আগ্রহী নয় (Archived / Dropped)",
    descriptionEn: "Archived or unqualified lead",
    enabled: true,
  },
];

export const DEFAULT_META_MARKETING_CONFIG: MetaMarketingConfig = {
  appId: process.env.META_APP_ID || process.env.FACEBOOK_APP_ID || "",
  appSecret: process.env.META_APP_SECRET || process.env.FACEBOOK_APP_SECRET || "",
  datasetId: process.env.META_DATASET_ID || "1061685489662581",
  apiVersion: "v22.0",
  businessName: "KNLTC",
  leadEventSource: "KNLTC CRM",
  accessToken: process.env.META_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN || "",
  adAccountId: process.env.META_AD_ACCOUNT_ID || "",
  pageId: process.env.META_PAGE_ID || "",
  pageAccessToken: "",
  connectedUserName: "",
  connectedUserId: "",
  tokenExpiresAt: "",
  testEventCode: process.env.META_TEST_EVENT_CODE || "",
  webhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || "knltc_meta_crm_webhook_2026",
  autoSyncCrmStages: true,
  stageMappings: DEFAULT_META_STAGE_MAPPINGS,
  googleAdsCustomerId: "",
  googleAdsConversionId: "",
  googleAdsConversionLabel: "",
  youtubeChannelId: "",
  youtubeChannelHandle: "@knltc",
  gbpDhakaLocationId: "Dhaka Head Office (Naya Paltan)",
  gbpKhulnaLocationId: "Khulna Branch (Shibbari More)",
  updatedAt: new Date().toISOString(),
};

const globalForMetaStore = globalThis as unknown as {
  __knltc_meta_store?: MetaMarketingStoreData;
};

function getMetaStoreFilePath(): string {
  return path.join(getPersistentDataDir(), "meta-marketing-store.json");
}

export function loadMetaMarketingStore(): MetaMarketingStoreData {
  if (globalForMetaStore.__knltc_meta_store) {
    return globalForMetaStore.__knltc_meta_store;
  }
  const filePath = getMetaStoreFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw) as Partial<MetaMarketingStoreData>;
      const merged: MetaMarketingStoreData = {
        config: {
          ...DEFAULT_META_MARKETING_CONFIG,
          ...(parsed.config || {}),
          datasetId: parsed.config?.datasetId || DEFAULT_META_MARKETING_CONFIG.datasetId,
          apiVersion: parsed.config?.apiVersion || "v22.0",
          stageMappings:
            Array.isArray(parsed.config?.stageMappings) && parsed.config!.stageMappings.length > 0
              ? parsed.config!.stageMappings
              : DEFAULT_META_STAGE_MAPPINGS,
        },
        capiLogs: Array.isArray(parsed.capiLogs) ? parsed.capiLogs.slice(0, 200) : [],
        adAccounts: Array.isArray(parsed.adAccounts) ? parsed.adAccounts : [],
        pages: Array.isArray(parsed.pages) ? parsed.pages : [],
        leadForms: Array.isArray(parsed.leadForms) ? parsed.leadForms : [],
        pagePosts: Array.isArray(parsed.pagePosts) ? parsed.pagePosts : [],
        cachedCampaigns: Array.isArray(parsed.cachedCampaigns) ? parsed.cachedCampaigns : [],
        cachedAdSets: Array.isArray(parsed.cachedAdSets) ? parsed.cachedAdSets : [],
        cachedAds: Array.isArray(parsed.cachedAds) ? parsed.cachedAds : [],
        lastGraphSyncAt: parsed.lastGraphSyncAt,
      };
      globalForMetaStore.__knltc_meta_store = merged;
      return merged;
    }
  } catch (err) {
    console.warn("[MetaMarketing] Failed to read meta-marketing-store.json:", err);
  }

  const initial: MetaMarketingStoreData = {
    config: { ...DEFAULT_META_MARKETING_CONFIG },
    capiLogs: [],
    adAccounts: [],
    pages: [],
    leadForms: [],
    pagePosts: [],
    cachedCampaigns: [],
    cachedAdSets: [],
    cachedAds: [],
  };
  globalForMetaStore.__knltc_meta_store = initial;
  return initial;
}

export function saveMetaMarketingStore(data: MetaMarketingStoreData): MetaMarketingStoreData {
  data.capiLogs = (data.capiLogs || []).slice(0, 200);
  globalForMetaStore.__knltc_meta_store = data;
  try {
    fs.writeFileSync(getMetaStoreFilePath(), JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[MetaMarketing] Failed to save meta-marketing-store.json:", err);
  }
  return data;
}

export function sha256Hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase(), "utf8").digest("hex");
}

export function normalizePhoneForMetaCapi(rawPhone?: string): string {
  if (!rawPhone) return "";
  const digits = String(rawPhone).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("880") && digits.length >= 13) {
    return digits;
  }
  if (digits.startsWith("01") && digits.length === 11) {
    return `88${digits}`;
  }
  if (digits.startsWith("1") && digits.length === 10) {
    return `880${digits}`;
  }
  return digits;
}

export function resolveMetaEventNameForStage(
  crmStage: string,
  mappings: MetaStageMapping[] = DEFAULT_META_STAGE_MAPPINGS,
): string {
  const upper = String(crmStage || "NEW").trim().toUpperCase();
  const found = mappings.find((m) => m.crmStage.toUpperCase() === upper);
  if (found) return found.metaEventName;
  if (upper.includes("ADMIT")) return "Purchase";
  if (upper.includes("COUNSEL")) return "QualifiedLead";
  if (upper.includes("VISIT")) return "Schedule";
  if (upper.includes("CONTACT")) return "Contact";
  if (upper.includes("ENROLL") || upper.includes("LMS")) return "StartTrial";
  if (upper.includes("VISA")) return "Subscribe";
  if (upper.includes("COE")) return "SubmitApplication";
  return "Lead";
}

/**
 * Discovers connected user profile, Ad Accounts (`/me/adaccounts`), Facebook Pages (`/me/accounts`),
 * and Instant Lead Forms (`/{page_id}/leadgen_forms`) using the active Access Token.
 */
export async function discoverMetaAssetsWithToken(overrideToken?: string): Promise<{
  ok: boolean;
  connectedUserName?: string;
  connectedUserId?: string;
  adAccounts: MetaAdAccountInfo[];
  pages: MetaPageInfo[];
  leadForms: MetaLeadFormItem[];
  errorMessage?: string;
}> {
  const store = loadMetaMarketingStore();
  const apiVersion = (store.config.apiVersion || "v22.0").trim();
  const token = (
    overrideToken ||
    store.config.accessToken ||
    process.env.META_ACCESS_TOKEN ||
    process.env.FACEBOOK_ACCESS_TOKEN ||
    ""
  ).trim();

  if (!token) {
    return {
      ok: false,
      adAccounts: store.adAccounts || [],
      pages: store.pages || [],
      leadForms: store.leadForms || [],
      errorMessage: "No Meta Access Token configured.",
    };
  }

  try {
    const [meRes, adAccRes, pagesRes] = await Promise.all([
      fetch(
        `https://graph.facebook.com/${apiVersion}/me?fields=id,name&access_token=${encodeURIComponent(token)}`,
        { cache: "no-store" },
      ),
      fetch(
        `https://graph.facebook.com/${apiVersion}/me/adaccounts?fields=id,name,account_id,currency,account_status&limit=25&access_token=${encodeURIComponent(token)}`,
        { cache: "no-store" },
      ),
      fetch(
        `https://graph.facebook.com/${apiVersion}/me/accounts?fields=id,name,category,access_token,is_webhooks_subscribed&limit=25&access_token=${encodeURIComponent(token)}`,
        { cache: "no-store" },
      ),
    ]);

    const [meJson, adAccJson, pagesJson] = await Promise.all([
      meRes.json().catch(() => ({})),
      adAccRes.json().catch(() => ({})),
      pagesRes.json().catch(() => ({})),
    ]);

    if (meJson?.error) {
      return {
        ok: false,
        adAccounts: store.adAccounts || [],
        pages: store.pages || [],
        leadForms: store.leadForms || [],
        errorMessage: meJson.error.message || "Invalid Meta Access Token",
      };
    }

    if (meJson?.id) {
      store.config.connectedUserId = String(meJson.id);
      store.config.connectedUserName = String(meJson.name || "Meta Business User");
    }

    const adAccounts: MetaAdAccountInfo[] = (
      Array.isArray(adAccJson?.data) ? adAccJson.data : []
    ).map((a: any) => ({
      id: String(a.id),
      accountId: String(a.account_id || String(a.id).replace(/^act_/, "")),
      name: String(a.name || `Ad Account ${a.account_id || a.id}`),
      currency: String(a.currency || "USD"),
      accountStatus: Number(a.account_status ?? 1),
    }));

    if (adAccounts.length > 0) {
      store.adAccounts = adAccounts;
      if (!store.config.adAccountId) {
        store.config.adAccountId = adAccounts[0].id;
      }
    }

    const pages: MetaPageInfo[] = (
      Array.isArray(pagesJson?.data) ? pagesJson.data : []
    ).map((p: any) => ({
      id: String(p.id),
      name: String(p.name || "Facebook Page"),
      category: p.category ? String(p.category) : undefined,
      accessToken: p.access_token ? String(p.access_token) : undefined,
      webhookSubscribed: Boolean(p.is_webhooks_subscribed),
    }));

    if (pages.length > 0) {
      store.pages = pages;
      const selectedPage =
        pages.find((p) => p.id === store.config.pageId) || pages[0];
      store.config.pageId = selectedPage.id;
      if (selectedPage.accessToken) {
        store.config.pageAccessToken = selectedPage.accessToken;
      }
    }

    saveMetaMarketingStore(store);

    // Also discover Lead Forms for all discovered pages
    const leadFormsResult = await syncMetaPageLeadForms();

    return {
      ok: true,
      connectedUserName: store.config.connectedUserName,
      connectedUserId: store.config.connectedUserId,
      adAccounts: store.adAccounts,
      pages: store.pages,
      leadForms: leadFormsResult.leadForms,
    };
  } catch (err: any) {
    return {
      ok: false,
      adAccounts: store.adAccounts || [],
      pages: store.pages || [],
      leadForms: store.leadForms || [],
      errorMessage: err?.message || "Failed to discover Meta assets",
    };
  }
}

/**
 * Exchanges an OAuth `code` from Facebook Login for a short-lived token,
 * automatically upgrades it to a 60-day Long-Lived Token (`fb_exchange_token`),
 * and discovers all Ad Accounts, Pages (with never-expiring Page Tokens), and Lead Forms.
 */
export async function exchangeMetaOAuthCodeForLongLivedToken(input: {
  code: string;
  redirectUri: string;
}): Promise<{
  ok: boolean;
  connectedUserName?: string;
  errorMessage?: string;
}> {
  const store = loadMetaMarketingStore();
  const apiVersion = (store.config.apiVersion || "v22.0").trim();
  const appId = (
    store.config.appId ||
    process.env.META_APP_ID ||
    process.env.FACEBOOK_APP_ID ||
    ""
  ).trim();
  const appSecret = (
    store.config.appSecret ||
    process.env.META_APP_SECRET ||
    process.env.FACEBOOK_APP_SECRET ||
    ""
  ).trim();

  if (!appId || !appSecret) {
    return {
      ok: false,
      errorMessage: "Meta App ID and App Secret must be saved before completing OAuth.",
    };
  }

  try {
    // 1. Exchange authorization code for user access token
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: input.redirectUri,
      code: input.code,
    });
    const tokenRes = await fetch(
      `https://graph.facebook.com/${apiVersion}/oauth/access_token?${tokenParams.toString()}`,
      { cache: "no-store" },
    );
    const tokenJson = await tokenRes.json().catch(() => ({}));
    if (!tokenRes.ok || tokenJson?.error || !tokenJson?.access_token) {
      return {
        ok: false,
        errorMessage:
          tokenJson?.error?.message || "Failed to exchange OAuth code for Meta access token.",
      };
    }

    let finalToken = String(tokenJson.access_token);
    let expiresInSec = Number(tokenJson.expires_in || 0);

    // 2. Upgrade to 60-day Long-Lived User Access Token
    try {
      const llParams = new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: finalToken,
      });
      const llRes = await fetch(
        `https://graph.facebook.com/${apiVersion}/oauth/access_token?${llParams.toString()}`,
        { cache: "no-store" },
      );
      const llJson = await llRes.json().catch(() => ({}));
      if (llRes.ok && llJson?.access_token) {
        finalToken = String(llJson.access_token);
        expiresInSec = Number(llJson.expires_in || 5184000); // ~60 days
      }
    } catch {
      // Keep initial token if exchange warning occurs
    }

    store.config.accessToken = finalToken;
    if (expiresInSec > 0) {
      store.config.tokenExpiresAt = new Date(
        Date.now() + expiresInSec * 1000,
      ).toISOString();
    }
    store.config.updatedAt = new Date().toISOString();
    saveMetaMarketingStore(store);

    // 3. Auto-discover Ad Accounts, Pages, and Lead Forms
    const discovered = await discoverMetaAssetsWithToken(finalToken);
    await syncLiveMetaCampaignsAndAds([]);

    return {
      ok: true,
      connectedUserName: discovered.connectedUserName || "Meta Business Connected",
    };
  } catch (err: any) {
    return {
      ok: false,
      errorMessage: err?.message || "OAuth token exchange error",
    };
  }
}

/**
 * Toggles Campaign, Ad Set, or Ad status (`ACTIVE` | `PAUSED`) or updates `daily_budget`
 * directly via Meta Marketing API (`POST https://graph.facebook.com/v22.0/{objectId}`).
 */
export async function updateMetaObjectStatusAndBudget(input: {
  objectId: string;
  objectType: "CAMPAIGN" | "ADSET" | "AD";
  status?: "ACTIVE" | "PAUSED";
  dailyBudget?: number;
}): Promise<{
  ok: boolean;
  errorMessage?: string;
}> {
  const store = loadMetaMarketingStore();
  const apiVersion = (store.config.apiVersion || "v22.0").trim();
  const token = (
    store.config.accessToken ||
    process.env.META_ACCESS_TOKEN ||
    process.env.FACEBOOK_ACCESS_TOKEN ||
    ""
  ).trim();

  if (!token) {
    return {
      ok: false,
      errorMessage: "Meta Access Token not connected. Connect your Meta App first.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.set("access_token", token);
    if (input.status) {
      params.set("status", input.status);
    }
    if (input.dailyBudget !== undefined && input.dailyBudget > 0) {
      // Meta expects daily_budget in minor currency units (cents/poisha = * 100)
      params.set("daily_budget", String(Math.round(Number(input.dailyBudget) * 100)));
    }

    const res = await fetch(
      `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(input.objectId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        cache: "no-store",
      },
    );
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.error) {
      return {
        ok: false,
        errorMessage:
          json?.error?.message ||
          json?.error?.error_user_msg ||
          `Meta Graph API HTTP ${res.status}`,
      };
    }

    // Update local cached state immediately for instant UI response
    if (input.objectType === "CAMPAIGN") {
      store.cachedCampaigns = (store.cachedCampaigns || []).map((c) =>
        c.id === input.objectId
          ? {
              ...c,
              status: input.status || c.status,
              effectiveStatus: input.status || c.effectiveStatus,
              dailyBudget:
                input.dailyBudget !== undefined ? input.dailyBudget : c.dailyBudget,
            }
          : c,
      );
    } else if (input.objectType === "ADSET") {
      store.cachedAdSets = (store.cachedAdSets || []).map((as) =>
        as.id === input.objectId
          ? {
              ...as,
              status: input.status || as.status,
              effectiveStatus: input.status || as.effectiveStatus,
              dailyBudget:
                input.dailyBudget !== undefined ? input.dailyBudget : as.dailyBudget,
            }
          : as,
      );
    } else if (input.objectType === "AD") {
      store.cachedAds = (store.cachedAds || []).map((ad) =>
        ad.id === input.objectId
          ? {
              ...ad,
              status: input.status || ad.status,
              effectiveStatus: input.status || ad.effectiveStatus,
            }
          : ad,
      );
    }

    saveMetaMarketingStore(store);
    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      errorMessage: err?.message || "Failed to update Meta object",
    };
  }
}

/**
 * Discovers all Instant Lead Generation Forms (`leadgen_forms`) across connected Facebook Pages.
 */
export async function syncMetaPageLeadForms(): Promise<{
  ok: boolean;
  leadForms: MetaLeadFormItem[];
  errorMessage?: string;
}> {
  const store = loadMetaMarketingStore();
  const apiVersion = (store.config.apiVersion || "v22.0").trim();
  const userToken = (
    store.config.accessToken ||
    process.env.META_ACCESS_TOKEN ||
    process.env.FACEBOOK_ACCESS_TOKEN ||
    ""
  ).trim();

  if (!userToken && !store.config.pageAccessToken) {
    return {
      ok: false,
      leadForms: store.leadForms || [],
      errorMessage: "Connect your Meta App or Access Token to discover Page Lead Forms.",
    };
  }

  try {
    let pages = store.pages || [];
    if (pages.length === 0 && userToken) {
      const pagesRes = await fetch(
        `https://graph.facebook.com/${apiVersion}/me/accounts?fields=id,name,category,access_token,is_webhooks_subscribed&limit=25&access_token=${encodeURIComponent(userToken)}`,
        { cache: "no-store" },
      );
      const pagesJson = await pagesRes.json().catch(() => ({}));
      if (Array.isArray(pagesJson?.data)) {
        pages = pagesJson.data.map((p: any) => ({
          id: String(p.id),
          name: String(p.name || "Facebook Page"),
          category: p.category,
          accessToken: p.access_token,
          webhookSubscribed: Boolean(p.is_webhooks_subscribed),
        }));
        store.pages = pages;
      }
    }

    // If a specific pageId was configured manually without /me/accounts
    if (pages.length === 0 && store.config.pageId) {
      pages = [
        {
          id: store.config.pageId,
          name: "KNLTC Facebook Page",
          accessToken: store.config.pageAccessToken || userToken,
        },
      ];
    }

    const discoveredForms: MetaLeadFormItem[] = [];
    for (const page of pages) {
      const pToken = page.accessToken || store.config.pageAccessToken || userToken;
      if (!pToken) continue;
      const fRes = await fetch(
        `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(page.id)}/leadgen_forms?fields=id,name,status,leads_count,created_time,locale&limit=50&access_token=${encodeURIComponent(pToken)}`,
        { cache: "no-store" },
      );
      const fJson = await fRes.json().catch(() => ({}));
      if (Array.isArray(fJson?.data)) {
        for (const f of fJson.data) {
          discoveredForms.push({
            id: String(f.id),
            name: String(f.name || "Instant Lead Form"),
            status: String(f.status || "ACTIVE"),
            pageId: page.id,
            pageName: page.name,
            leadsCount: Number(f.leads_count ?? 0),
            createdTime: f.created_time,
            locale: f.locale,
          });
        }
      }
    }

    store.leadForms = discoveredForms;
    saveMetaMarketingStore(store);

    return {
      ok: true,
      leadForms: discoveredForms,
    };
  } catch (err: any) {
    return {
      ok: false,
      leadForms: store.leadForms || [],
      errorMessage: err?.message || "Failed to fetch Facebook Page Lead Forms",
    };
  }
}

/**
 * Pulls leads directly from a Facebook Instant Lead Form (`/{formId}/leads`)
 * and upserts them into Google Sheets (`knltc_crm_leads`) with full Campaign/Ad attribution.
 */
export async function pullLeadsFromMetaForm(input: {
  formId: string;
  pageId?: string;
  existingLeads?: Array<Record<string, any>>;
}): Promise<{
  ok: boolean;
  pulledCount: number;
  newLeadsCount: number;
  errorMessage?: string;
}> {
  const store = loadMetaMarketingStore();
  const apiVersion = (store.config.apiVersion || "v22.0").trim();
  const pageObj = (store.pages || []).find(
    (p) => p.id === (input.pageId || store.config.pageId),
  );
  const token = (
    pageObj?.accessToken ||
    store.config.pageAccessToken ||
    store.config.accessToken ||
    process.env.META_ACCESS_TOKEN ||
    ""
  ).trim();

  if (!token) {
    return {
      ok: false,
      pulledCount: 0,
      newLeadsCount: 0,
      errorMessage: "No Page or User Access Token available to pull leads.",
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(input.formId)}/leads?fields=id,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,field_data&limit=100&access_token=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.error) {
      return {
        ok: false,
        pulledCount: 0,
        newLeadsCount: 0,
        errorMessage:
          json?.error?.message || `Failed to pull leads from form ${input.formId}`,
      };
    }

    const rawLeads = Array.isArray(json.data) ? json.data : [];
    const existingIds = new Set(
      (input.existingLeads || []).map((l) => String(l.id || "")),
    );
    const existingMetaIds = new Set(
      (input.existingLeads || [])
        .map((l) => String(l.metaLeadId || ""))
        .filter(Boolean),
    );

    let newLeadsCount = 0;

    for (const item of rawLeads) {
      const leadgenId = String(item.id || "").trim();
      if (!leadgenId) continue;
      const crmId = `lead-meta-${leadgenId}`;
      const isAlreadyInCrm =
        existingIds.has(crmId) || existingMetaIds.has(leadgenId);

      let fullName = "Meta Lead Candidate";
      let phone = "";
      let email = "";
      let city = "Dhaka";
      let education = "HSC / Alim";

      const fieldData = Array.isArray(item.field_data) ? item.field_data : [];
      for (const f of fieldData) {
        const key = String(f?.name || "").toLowerCase();
        const val = Array.isArray(f?.values) ? String(f.values[0] || "") : "";
        if (!val) continue;
        if (key.includes("name") || key === "full_name") fullName = val;
        else if (key.includes("phone") || key.includes("mobile") || key.includes("whatsapp"))
          phone = val;
        else if (key.includes("email")) email = val;
        else if (key.includes("city") || key.includes("district") || key.includes("location"))
          city = val;
        else if (key.includes("education") || key.includes("qualification"))
          education = val;
      }

      if (isAlreadyInCrm) continue;

      const createdIso = item.created_time
        ? new Date(item.created_time).toISOString()
        : new Date().toISOString();
      const campaignName = String(item.campaign_name || "Meta Lead Campaign");
      const adSetName = String(item.adset_name || "");
      const adName = String(item.ad_name || "Meta Instant Form Ad");

      const leadRecord = {
        id: crmId,
        name: fullName,
        phone: phone || "+8801",
        whatsapp: phone || "+8801",
        email,
        city,
        source: "FACEBOOK_META",
        interest: "STUDENT_VISA_REGULAR",
        status: "NEW",
        priority: "HOT",
        education,
        japaneseProficiency: "NONE",
        studyGapYears: 0,
        assignedTo: "Sales & Marketing Team",
        branch: city.toLowerCase().includes("khulna") ? "KHULNA-01" : "DHK-HQ",
        notes: `[Pulled from Meta Form • ${campaignName} • ${adName}] Lead ID: ${leadgenId}`,
        followUpDate: new Date().toISOString().slice(0, 10),
        lastContactedAt: createdIso,
        createdAt: createdIso,
        metaLeadId: leadgenId,
        metaCampaignId: String(item.campaign_id || ""),
        metaCampaignName: campaignName,
        metaAdSetId: String(item.adset_id || ""),
        metaAdSetName: adSetName,
        metaAdId: String(item.ad_id || ""),
        metaAdName: adName,
      };

      await upsertRow("knltc_crm_leads", {
        id: crmId,
        name: leadRecord.name,
        phone: leadRecord.phone,
        whatsapp: leadRecord.whatsapp,
        email: leadRecord.email,
        city: leadRecord.city,
        source: "FACEBOOK_META",
        interest: leadRecord.interest,
        status: "NEW",
        education: leadRecord.education,
        ssc_gpa: "",
        hsc_gpa: "",
        japanese_proficiency: "NONE",
        study_gap_years: 0,
        assigned_to: leadRecord.assignedTo,
        branch: leadRecord.branch,
        notes: leadRecord.notes,
        follow_up_date: leadRecord.followUpDate,
        last_contacted_at: createdIso,
        created_at: createdIso,
        priority: "HOT",
        passport_no: "",
        target_school: "",
        b2b_agent_name: "",
        contract_amount_bdt: 0,
        paid_amount_bdt: 0,
        due_amount_bdt: 0,
        avatar_url: "",
        documents_urls: "",
        profile_json: JSON.stringify(leadRecord),
      });

      newLeadsCount += 1;
    }

    return {
      ok: true,
      pulledCount: rawLeads.length,
      newLeadsCount,
    };
  } catch (err: any) {
    return {
      ok: false,
      pulledCount: 0,
      newLeadsCount: 0,
      errorMessage: err?.message || "Failed to pull leads from Meta Form",
    };
  }
}

/**
 * Subscribes a Facebook Page to real-time `leadgen` webhook events in 1 click.
 */
export async function subscribeMetaPageToLeadgenWebhook(pageId?: string): Promise<{
  ok: boolean;
  errorMessage?: string;
}> {
  const store = loadMetaMarketingStore();
  const apiVersion = (store.config.apiVersion || "v22.0").trim();
  const targetPageId = pageId || store.config.pageId || store.pages?.[0]?.id;
  if (!targetPageId) {
    return { ok: false, errorMessage: "No Facebook Page ID selected." };
  }

  const pageObj = (store.pages || []).find((p) => p.id === targetPageId);
  const pageToken = (
    pageObj?.accessToken ||
    store.config.pageAccessToken ||
    store.config.accessToken ||
    ""
  ).trim();

  if (!pageToken) {
    return {
      ok: false,
      errorMessage: "Page Access Token is required to subscribe to webhooks.",
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(targetPageId)}/subscribed_apps`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          subscribed_fields: "leadgen",
          access_token: pageToken,
        }).toString(),
        cache: "no-store",
      },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.error) {
      return {
        ok: false,
        errorMessage:
          json?.error?.message || "Failed to subscribe Page to leadgen webhook",
      };
    }

    store.pages = (store.pages || []).map((p) =>
      p.id === targetPageId ? { ...p, webhookSubscribed: true } : p,
    );
    saveMetaMarketingStore(store);
    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      errorMessage: err?.message || "Network error subscribing page webhook",
    };
  }
}

/**
 * Fetches published Facebook Page posts, reach/likes/shares, and recent comments
 * so the team can monitor Page content & convert commenters into CRM leads.
 */
export async function syncMetaPagePostsAndComments(pageId?: string): Promise<{
  ok: boolean;
  pagePosts: MetaPagePostItem[];
  errorMessage?: string;
}> {
  const store = loadMetaMarketingStore();
  const apiVersion = (store.config.apiVersion || "v22.0").trim();
  const targetPageId = pageId || store.config.pageId || store.pages?.[0]?.id;
  if (!targetPageId) {
    return {
      ok: false,
      pagePosts: store.pagePosts || [],
      errorMessage: "Select or connect a Facebook Page first.",
    };
  }

  const pageObj = (store.pages || []).find((p) => p.id === targetPageId);
  const token = (
    pageObj?.accessToken ||
    store.config.pageAccessToken ||
    store.config.accessToken ||
    ""
  ).trim();

  if (!token) {
    return {
      ok: false,
      pagePosts: store.pagePosts || [],
      errorMessage: "No Page Access Token configured.",
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(targetPageId)}/published_posts?fields=id,message,created_time,full_picture,permalink_url,shares,likes.summary(true),comments.limit(15).summary(true){id,from,message,created_time}&limit=15&access_token=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.error) {
      return {
        ok: false,
        pagePosts: store.pagePosts || [],
        errorMessage:
          json?.error?.message || "Failed to fetch Facebook Page posts",
      };
    }

    const posts: MetaPagePostItem[] = (
      Array.isArray(json.data) ? json.data : []
    ).map((p: any) => ({
      id: String(p.id),
      pageId: targetPageId,
      pageName: pageObj?.name || "KNLTC Facebook Page",
      message: String(p.message || "(Media / Photo Post)"),
      fullPicture: p.full_picture ? String(p.full_picture) : undefined,
      permalinkUrl: p.permalink_url ? String(p.permalink_url) : undefined,
      createdTime: String(p.created_time || new Date().toISOString()),
      likesCount: Number(p.likes?.summary?.total_count ?? 0),
      sharesCount: Number(p.shares?.count ?? 0),
      commentsCount: Number(p.comments?.summary?.total_count ?? 0),
      comments: (Array.isArray(p.comments?.data) ? p.comments.data : []).map(
        (c: any) => ({
          id: String(c.id),
          fromName: String(c.from?.name || "Facebook User"),
          fromId: c.from?.id ? String(c.from.id) : undefined,
          message: String(c.message || ""),
          createdTime: String(c.created_time || new Date().toISOString()),
        }),
      ),
    }));

    store.pagePosts = posts;
    saveMetaMarketingStore(store);

    return {
      ok: true,
      pagePosts: posts,
    };
  } catch (err: any) {
    return {
      ok: false,
      pagePosts: store.pagePosts || [],
      errorMessage: err?.message || "Failed to sync Facebook Page posts",
    };
  }
}

/**
 * Sends a CRM funnel stage event to Meta Conversions API (`POST https://graph.facebook.com/v22.0/{datasetId}/events`)
 * adhering strictly to Meta's "Send a CRM event" specification (`action_source: "system_generated"`, `event_source: "crm"`).
 */
export async function sendMetaCrmConversionEvent(input: {
  leadId: string;
  leadName: string;
  phone: string;
  email?: string;
  city?: string;
  crmStage: string;
  customEventName?: string;
  interest?: string;
  branch?: string;
  contractAmountBdt?: number;
  metaLeadId?: string;
  fbc?: string;
  fbp?: string;
  isTestEvent?: boolean;
  overrideTestEventCode?: string;
}): Promise<MetaCapiEventLog> {
  const store = loadMetaMarketingStore();
  const { config } = store;

  const datasetId = (config.datasetId || "1061685489662581").trim();
  const apiVersion = (config.apiVersion || "v22.0").trim();
  const accessToken = (
    config.accessToken ||
    process.env.META_ACCESS_TOKEN ||
    process.env.FACEBOOK_ACCESS_TOKEN ||
    ""
  ).trim();

  const eventTimeUnix = Math.floor(Date.now() / 1000);
  const metaEventName =
    input.customEventName || resolveMetaEventNameForStage(input.crmStage, config.stageMappings);

  const normPhone = normalizePhoneForMetaCapi(input.phone);
  const normEmail = String(input.email || "").trim().toLowerCase();
  const nameParts = String(input.leadName || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  const cleanCity =
    String(input.city || "dhaka")
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "") || "dhaka";

  const userData: Record<string, any> = {
    ph: normPhone ? [sha256Hash(normPhone)] : undefined,
    em: normEmail ? [sha256Hash(normEmail)] : undefined,
    fn: firstName ? [sha256Hash(firstName)] : undefined,
    ln: lastName ? [sha256Hash(lastName)] : undefined,
    ct: [sha256Hash(cleanCity)],
    country: [sha256Hash("bd")],
    external_id: input.leadId ? [sha256Hash(String(input.leadId))] : undefined,
  };

  const rawMetaLeadId = String(input.metaLeadId || "").replace(/\D/g, "");
  if (rawMetaLeadId && rawMetaLeadId.length >= 10) {
    userData.lead_id = Number(rawMetaLeadId) || rawMetaLeadId;
  }
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  for (const k of Object.keys(userData)) {
    if (userData[k] === undefined) delete userData[k];
  }

  const eventPayload: Record<string, any> = {
    data: [
      {
        action_source: "system_generated",
        event_name: metaEventName,
        event_time: eventTimeUnix,
        event_id: `knltc-${input.leadId}-${input.crmStage}-${eventTimeUnix}`,
        custom_data: {
          event_source: "crm",
          lead_event_source: config.leadEventSource || "KNLTC CRM",
          crm_stage: input.crmStage,
          interest: input.interest || "STUDENT_VISA_REGULAR",
          branch: input.branch || "DHK-HQ",
          ...(input.contractAmountBdt && input.contractAmountBdt > 0
            ? { value: Number(input.contractAmountBdt), currency: "BDT" }
            : {}),
        },
        user_data: userData,
      },
    ],
  };

  const activeTestCode = (
    input.overrideTestEventCode !== undefined
      ? input.overrideTestEventCode
      : input.isTestEvent
        ? config.testEventCode
        : ""
  ).trim();

  if (activeTestCode) {
    eventPayload.test_event_code = activeTestCode;
  }

  const logEntry: MetaCapiEventLog = {
    id: `capi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    leadId: input.leadId,
    leadName: input.leadName,
    leadPhone: input.phone,
    leadEmail: input.email,
    metaLeadId: rawMetaLeadId || undefined,
    crmStage: input.crmStage,
    metaEventName,
    datasetId,
    status: "READY_AWAITING_TOKEN",
    isTestEvent: Boolean(activeTestCode || input.isTestEvent),
    payloadPreview: eventPayload,
  };

  if (!accessToken) {
    logEntry.errorMessage =
      "Access Token not configured yet — CAPI payload structured & queued locally. Connect your Meta App or add a Dataset Token to transmit live.";
    store.capiLogs.unshift(logEntry);
    saveMetaMarketingStore(store);
    return logEntry;
  }

  try {
    const endpoint = `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(datasetId)}/events?access_token=${encodeURIComponent(accessToken)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventPayload),
      cache: "no-store",
    });

    const json = await response.json().catch(() => ({}));
    logEntry.httpStatus = response.status;

    if (response.ok && !json.error) {
      logEntry.status = "DELIVERED";
      logEntry.eventsReceived = Number(json.events_received ?? 1);
      logEntry.fbtraceId = json.fbtrace_id ? String(json.fbtrace_id) : undefined;
    } else {
      logEntry.status = "FAILED";
      logEntry.errorMessage =
        json?.error?.message ||
        json?.error?.error_user_msg ||
        `Meta Graph API HTTP ${response.status}`;
      logEntry.fbtraceId = json?.error?.fbtrace_id;
    }
  } catch (err: any) {
    logEntry.status = "FAILED";
    logEntry.errorMessage = err?.message || "Network error contacting graph.facebook.com";
  }

  store.capiLogs.unshift(logEntry);
  saveMetaMarketingStore(store);
  return logEntry;
}

function extractLeadCountFromActions(
  actions?: Array<{ action_type?: string; value?: string | number }>,
): number {
  if (!Array.isArray(actions)) return 0;
  let total = 0;
  for (const act of actions) {
    const t = String(act?.action_type || "").toLowerCase();
    if (
      t === "lead" ||
      t === "onsite_conversion.lead_grouped" ||
      t === "offsite_conversion.fb_pixel_lead" ||
      t === "onsite_conversion.messaging_conversation_started_7d"
    ) {
      total = Math.max(total, Number(act.value || 0));
    }
  }
  return total;
}

/**
 * Fetches live Campaigns, Ad Sets, Ads, and Insights from Meta Marketing Graph API (`v22.0`)
 * and cross-references them with KNLTC CRM leads.
 */
export async function syncLiveMetaCampaignsAndAds(
  crmLeads: Array<Record<string, any>> = [],
): Promise<{
  ok: boolean;
  connectedToGraphApi: boolean;
  errorMessage?: string;
  discoveredAdAccountId?: string;
  campaigns: MetaCampaignItem[];
  adSets: MetaAdSetItem[];
  ads: MetaAdItem[];
}> {
  const store = loadMetaMarketingStore();
  const { config } = store;
  const accessToken = (
    config.accessToken ||
    process.env.META_ACCESS_TOKEN ||
    process.env.FACEBOOK_ACCESS_TOKEN ||
    ""
  ).trim();
  const apiVersion = (config.apiVersion || "v22.0").trim();

  if (!accessToken) {
    return {
      ok: true,
      connectedToGraphApi: false,
      errorMessage:
        "Meta App or Access Token not connected yet. Connect via 1-Click Meta Login or enter your token.",
      campaigns: store.cachedCampaigns || [],
      adSets: store.cachedAdSets || [],
      ads: store.cachedAds || [],
    };
  }

  try {
    let adAccountId = (config.adAccountId || process.env.META_AD_ACCOUNT_ID || "").trim();

    if (!adAccountId) {
      const accRes = await fetch(
        `https://graph.facebook.com/${apiVersion}/me/adaccounts?fields=id,name,account_id,currency,account_status&limit=10&access_token=${encodeURIComponent(accessToken)}`,
        { cache: "no-store" },
      );
      const accJson = await accRes.json().catch(() => ({}));
      if (accRes.ok && Array.isArray(accJson.data) && accJson.data.length > 0) {
        adAccountId = String(accJson.data[0].id);
        store.config.adAccountId = adAccountId;
        store.adAccounts = accJson.data.map((a: any) => ({
          id: String(a.id),
          accountId: String(a.account_id || String(a.id).replace(/^act_/, "")),
          name: String(a.name || `Ad Account ${a.id}`),
          currency: String(a.currency || "USD"),
          accountStatus: Number(a.account_status ?? 1),
        }));
      } else if (accJson?.error) {
        return {
          ok: false,
          connectedToGraphApi: false,
          errorMessage:
            accJson.error.message || "Unable to fetch Meta Ad Accounts with this token.",
          campaigns: store.cachedCampaigns || [],
          adSets: store.cachedAdSets || [],
          ads: store.cachedAds || [],
        };
      }
    }

    if (adAccountId && !adAccountId.startsWith("act_")) {
      adAccountId = `act_${adAccountId}`;
    }

    if (!adAccountId) {
      return {
        ok: false,
        connectedToGraphApi: false,
        errorMessage:
          "No Ad Account ID found. Please select or enter your Meta Ad Account ID (e.g., act_123456789).",
        campaigns: store.cachedCampaigns || [],
        adSets: store.cachedAdSets || [],
        ads: store.cachedAds || [],
      };
    }

    const [campRes, adSetRes, adsRes] = await Promise.all([
      fetch(
        `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(adAccountId)}/campaigns?fields=id,name,status,effective_status,objective,daily_budget,lifetime_budget,created_time,updated_time,insights.date_preset(maximum){spend,impressions,clicks,ctr,actions,account_currency}&limit=50&access_token=${encodeURIComponent(accessToken)}`,
        { cache: "no-store" },
      ),
      fetch(
        `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(adAccountId)}/adsets?fields=id,name,campaign_id,campaign{name},status,effective_status,optimization_goal,daily_budget,insights.date_preset(maximum){spend,impressions,clicks,actions}&limit=100&access_token=${encodeURIComponent(accessToken)}`,
        { cache: "no-store" },
      ),
      fetch(
        `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(adAccountId)}/ads?fields=id,name,status,effective_status,adset_id,adset{name},campaign_id,campaign{name,objective},creative{id,name,title,body,thumbnail_url},created_time,insights.date_preset(maximum){spend,impressions,clicks,ctr,cpc,actions,account_currency}&limit=100&access_token=${encodeURIComponent(accessToken)}`,
        { cache: "no-store" },
      ),
    ]);

    const [campJson, adSetJson, adsJson] = await Promise.all([
      campRes.json().catch(() => ({})),
      adSetRes.json().catch(() => ({})),
      adsRes.json().catch(() => ({})),
    ]);

    if (campJson?.error) {
      return {
        ok: false,
        connectedToGraphApi: false,
        errorMessage: campJson.error.message || "Meta Graph API error fetching campaigns.",
        campaigns: store.cachedCampaigns || [],
        adSets: store.cachedAdSets || [],
        ads: store.cachedAds || [],
      };
    }

    const campaigns: MetaCampaignItem[] = (
      Array.isArray(campJson.data) ? campJson.data : []
    ).map((c: any) => {
      const insight = c.insights?.data?.[0] || {};
      const matchedLeads = crmLeads.filter(
        (l) =>
          String(l.metaCampaignId || "") === String(c.id) ||
          (l.metaCampaignName &&
            String(l.metaCampaignName).toLowerCase() ===
              String(c.name || "").toLowerCase()) ||
          (l.notes &&
            String(l.notes)
              .toLowerCase()
              .includes(String(c.name || "").toLowerCase())),
      );
      const qualifiedCount = matchedLeads.filter((l) =>
        ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(
          String(l.status || "").toUpperCase(),
        ),
      ).length;
      const admittedCount = matchedLeads.filter(
        (l) => String(l.status || "").toUpperCase() === "ADMITTED",
      ).length;

      return {
        id: String(c.id),
        name: String(c.name || "Untitled Campaign"),
        status: String(c.status || "ACTIVE"),
        effectiveStatus: String(c.effective_status || c.status || "ACTIVE"),
        objective: String(c.objective || "OUTCOME_LEADS"),
        dailyBudget: c.daily_budget ? Number(c.daily_budget) / 100 : undefined,
        lifetimeBudget: c.lifetime_budget
          ? Number(c.lifetime_budget) / 100
          : undefined,
        spend: Number(insight.spend || 0),
        currency: String(insight.account_currency || "USD"),
        impressions: Number(insight.impressions || 0),
        clicks: Number(insight.clicks || 0),
        ctr: Number(insight.ctr || 0),
        metaReportedLeads: extractLeadCountFromActions(insight.actions),
        crmMatchedLeadsCount: matchedLeads.length,
        crmQualifiedLeadsCount: qualifiedCount,
        crmAdmittedCount: admittedCount,
        createdTime: c.created_time,
        updatedTime: c.updated_time,
      };
    });

    const adSets: MetaAdSetItem[] = (
      Array.isArray(adSetJson.data) ? adSetJson.data : []
    ).map((as: any) => {
      const insight = as.insights?.data?.[0] || {};
      return {
        id: String(as.id),
        name: String(as.name || "Untitled Ad Set"),
        campaignId: String(as.campaign_id || ""),
        campaignName: String(as.campaign?.name || ""),
        status: String(as.status || "ACTIVE"),
        effectiveStatus: String(as.effective_status || as.status || "ACTIVE"),
        optimizationGoal: as.optimization_goal,
        dailyBudget: as.daily_budget ? Number(as.daily_budget) / 100 : undefined,
        spend: Number(insight.spend || 0),
        impressions: Number(insight.impressions || 0),
        clicks: Number(insight.clicks || 0),
        leadsCount: extractLeadCountFromActions(insight.actions),
      };
    });

    const ads: MetaAdItem[] = (Array.isArray(adsJson.data) ? adsJson.data : []).map(
      (ad: any) => {
        const insight = ad.insights?.data?.[0] || {};
        const matchedLeads = crmLeads.filter(
          (l) =>
            String(l.metaAdId || "") === String(ad.id) ||
            (l.metaAdName &&
              String(l.metaAdName).toLowerCase() ===
                String(ad.name || "").toLowerCase()) ||
            (l.notes &&
              String(l.notes)
                .toLowerCase()
                .includes(String(ad.name || "").toLowerCase())),
        );
        const qualifiedCount = matchedLeads.filter((l) =>
          ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(
            String(l.status || "").toUpperCase(),
          ),
        ).length;
        const admittedCount = matchedLeads.filter(
          (l) => String(l.status || "").toUpperCase() === "ADMITTED",
        ).length;

        return {
          id: String(ad.id),
          name: String(ad.name || "Untitled Ad"),
          status: String(ad.status || "ACTIVE"),
          effectiveStatus: String(ad.effective_status || ad.status || "ACTIVE"),
          adSetId: String(ad.adset_id || ""),
          adSetName: String(ad.adset?.name || ""),
          campaignId: String(ad.campaign_id || ""),
          campaignName: String(ad.campaign?.name || ""),
          objective: ad.campaign?.objective,
          spendBdtOrUsd: Number(insight.spend || 0),
          currency: String(insight.account_currency || "USD"),
          impressions: Number(insight.impressions || 0),
          clicks: Number(insight.clicks || 0),
          ctr: Number(insight.ctr || 0),
          cpc: Number(insight.cpc || 0),
          metaReportedLeads: extractLeadCountFromActions(insight.actions),
          crmMatchedLeadsCount: matchedLeads.length,
          crmQualifiedLeadsCount: qualifiedCount,
          crmAdmittedCount: admittedCount,
          thumbnailUrl: ad.creative?.thumbnail_url,
          creativeTitle: ad.creative?.title,
          creativeBody: ad.creative?.body,
          createdTime: ad.created_time,
        };
      },
    );

    store.cachedCampaigns = campaigns;
    store.cachedAdSets = adSets;
    store.cachedAds = ads;
    store.lastGraphSyncAt = new Date().toISOString();
    saveMetaMarketingStore(store);

    return {
      ok: true,
      connectedToGraphApi: true,
      discoveredAdAccountId: adAccountId,
      campaigns,
      adSets,
      ads,
    };
  } catch (err: any) {
    return {
      ok: false,
      connectedToGraphApi: false,
      errorMessage: err?.message || "Failed to connect to Meta Graph API",
      campaigns: store.cachedCampaigns || [],
      adSets: store.cachedAdSets || [],
      ads: store.cachedAds || [],
    };
  }
}
