import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getPersistentDataDir } from "@/lib/google-sheets-db";

export interface MetaStageMapping {
  crmStage: string;
  metaEventName: string;
  descriptionBn: string;
  descriptionEn: string;
  enabled: boolean;
}

export interface MetaMarketingConfig {
  datasetId: string;
  apiVersion: string;
  businessName: string;
  leadEventSource: string;
  accessToken: string;
  adAccountId: string;
  pageId: string;
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
  datasetId: process.env.META_DATASET_ID || "1061685489662581",
  apiVersion: "v22.0",
  businessName: "KNLTC",
  leadEventSource: "KNLTC CRM",
  accessToken: process.env.META_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN || "",
  adAccountId: process.env.META_AD_ACCOUNT_ID || "",
  pageId: process.env.META_PAGE_ID || "",
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

/**
 * Normalizes Bangladesh & international phone numbers to digits-only with country code (e.g. 8801805013633)
 * before SHA-256 hashing, per Meta Conversions API specification.
 */
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
  const cleanCity = String(input.city || "dhaka")
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

  // Include Meta 15/16-digit Lead ID if this lead originated from Meta Lead Ads (highest matching priority)
  const rawMetaLeadId = String(input.metaLeadId || "").replace(/\D/g, "");
  if (rawMetaLeadId && rawMetaLeadId.length >= 10) {
    userData.lead_id = Number(rawMetaLeadId) || rawMetaLeadId;
  }
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  // Remove undefined keys from user_data
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
      "Access Token not configured yet — CAPI payload structured & queued locally. Add your Dataset Access Token in the Meta Hub to transmit live.";
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

function extractLeadCountFromActions(actions?: Array<{ action_type?: string; value?: string | number }>): number {
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
 * and cross-references them with KNLTC CRM leads so the admin sees real-time Campaign -> Ad -> Lead attribution.
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
      errorMessage: "Meta Access Token not added yet. Add your Access Token to load live Ad Account campaigns.",
      campaigns: store.cachedCampaigns || [],
      adSets: store.cachedAdSets || [],
      ads: store.cachedAds || [],
    };
  }

  try {
    let adAccountId = (config.adAccountId || process.env.META_AD_ACCOUNT_ID || "").trim();

    // Auto-discover Ad Account ID from `/me/adaccounts` if not explicitly entered
    if (!adAccountId) {
      const accRes = await fetch(
        `https://graph.facebook.com/${apiVersion}/me/adaccounts?fields=id,name,account_id,currency,account_status&limit=10&access_token=${encodeURIComponent(accessToken)}`,
        { cache: "no-store" },
      );
      const accJson = await accRes.json().catch(() => ({}));
      if (accRes.ok && Array.isArray(accJson.data) && accJson.data.length > 0) {
        adAccountId = String(accJson.data[0].id);
        store.config.adAccountId = adAccountId;
      } else if (accJson?.error) {
        return {
          ok: false,
          connectedToGraphApi: false,
          errorMessage: accJson.error.message || "Unable to fetch Meta Ad Accounts with this token.",
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
        errorMessage: "No Ad Account ID found. Please enter your Meta Ad Account ID (e.g., act_123456789).",
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

    const campaigns: MetaCampaignItem[] = (Array.isArray(campJson.data) ? campJson.data : []).map(
      (c: any) => {
        const insight = c.insights?.data?.[0] || {};
        const matchedLeads = crmLeads.filter(
          (l) =>
            String(l.metaCampaignId || "") === String(c.id) ||
            (l.metaCampaignName &&
              String(l.metaCampaignName).toLowerCase() === String(c.name || "").toLowerCase()) ||
            (l.notes && String(l.notes).toLowerCase().includes(String(c.name || "").toLowerCase())),
        );
        const qualifiedCount = matchedLeads.filter((l) =>
          ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(String(l.status || "").toUpperCase()),
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
          lifetimeBudget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : undefined,
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
      },
    );

    const adSets: MetaAdSetItem[] = (Array.isArray(adSetJson.data) ? adSetJson.data : []).map(
      (as: any) => {
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
      },
    );

    const ads: MetaAdItem[] = (Array.isArray(adsJson.data) ? adsJson.data : []).map((ad: any) => {
      const insight = ad.insights?.data?.[0] || {};
      const matchedLeads = crmLeads.filter(
        (l) =>
          String(l.metaAdId || "") === String(ad.id) ||
          (l.metaAdName &&
            String(l.metaAdName).toLowerCase() === String(ad.name || "").toLowerCase()) ||
          (l.notes && String(l.notes).toLowerCase().includes(String(ad.name || "").toLowerCase())),
      );
      const qualifiedCount = matchedLeads.filter((l) =>
        ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(String(l.status || "").toUpperCase()),
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
        createdTime: ad.created_time,
      };
    });

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
