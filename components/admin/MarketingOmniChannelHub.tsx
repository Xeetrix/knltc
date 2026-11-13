"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Layers,
  Link2,
  Loader2,
  MapPin,
  Megaphone,
  MessageSquare,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Video,
  Webhook,
  Zap,
  AlertCircle,
  Check,
  KeyRound,
  Download,
  ThumbsUp,
  Share2,
  DollarSign,
} from "lucide-react";
import type { CrmLead } from "@/lib/knltc-cms-store";

interface StageMapping {
  crmStage: string;
  metaEventName: string;
  descriptionBn: string;
  descriptionEn: string;
  enabled: boolean;
}

interface AdAccountInfo {
  id: string;
  accountId: string;
  name: string;
  currency: string;
  accountStatus: number;
}

interface PageInfo {
  id: string;
  name: string;
  category?: string;
  webhookSubscribed?: boolean;
}

interface LeadFormItem {
  id: string;
  name: string;
  status: string;
  pageId: string;
  pageName: string;
  leadsCount: number;
  createdTime?: string;
  locale?: string;
}

interface PageCommentItem {
  id: string;
  fromName: string;
  fromId?: string;
  message: string;
  createdTime: string;
}

interface PagePostItem {
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
  comments: PageCommentItem[];
}

interface MetaConfig {
  appId: string;
  appSecret: string;
  datasetId: string;
  apiVersion: string;
  businessName: string;
  leadEventSource: string;
  accessToken: string;
  adAccountId: string;
  pageId: string;
  connectedUserName?: string;
  connectedUserId?: string;
  tokenExpiresAt?: string;
  testEventCode: string;
  webhookVerifyToken: string;
  autoSyncCrmStages: boolean;
  stageMappings: StageMapping[];
  googleAdsCustomerId?: string;
  googleAdsConversionId?: string;
  googleAdsConversionLabel?: string;
  youtubeChannelId?: string;
  youtubeChannelHandle?: string;
  gbpDhakaLocationId?: string;
  gbpKhulnaLocationId?: string;
  hasAccessToken?: boolean;
  updatedAt?: string;
}

interface CapiLogItem {
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

interface CampaignItem {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  objective: string;
  dailyBudget?: number;
  spend: number;
  currency: string;
  impressions: number;
  clicks: number;
  ctr: number;
  metaReportedLeads: number;
  crmMatchedLeadsCount: number;
  crmQualifiedLeadsCount: number;
  crmAdmittedCount: number;
}

interface AdSetItem {
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

interface AdItem {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  adSetId: string;
  adSetName: string;
  campaignId: string;
  campaignName: string;
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
}

interface MarketingOmniChannelHubProps {
  crmLeads: CrmLead[];
  onRefreshStore?: () => void;
  onOpenLeadProfile?: (lead: CrmLead) => void;
  onSwitchDashboardTab?: (tabId: any) => void;
}

const DEV_CALLBACK_URL =
  "https://ais-dev-jwatijyq6vmvrdy7wbhk4e-851527139864.asia-southeast1.run.app/api/admin/meta-oauth/callback";
const SHARED_CALLBACK_URL =
  "https://ais-pre-jwatijyq6vmvrdy7wbhk4e-851527139864.asia-southeast1.run.app/api/admin/meta-oauth/callback";
const PROD_CALLBACK_URL = "https://knltc.com/api/admin/meta-oauth/callback";

export default function MarketingOmniChannelHub({
  crmLeads,
  onRefreshStore,
  onOpenLeadProfile,
  onSwitchDashboardTab,
}: MarketingOmniChannelHubProps) {
  const [activePlatform, setActivePlatform] = useState<
    "META" | "GOOGLE_ADS" | "YOUTUBE" | "GBP" | "BLOG_SEO"
  >("META");

  const [metaSubView, setMetaSubView] = useState<
    | "META_APP_CONNECT"
    | "CAMPAIGNS_ADS"
    | "LEAD_FORMS_PULL"
    | "PAGE_POSTS_COMMENTS"
    | "STAGE_MAPPING"
    | "DELIVERY_LOGS"
  >("CAMPAIGNS_ADS");

  const [drilldownTab, setDrilldownTab] = useState<
    "CAMPAIGNS" | "ADSETS" | "ADS" | "ATTRIBUTED_LEADS"
  >("CAMPAIGNS");

  const [savingConfig, setSavingConfig] = useState(false);
  const [connectingOAuth, setConnectingOAuth] = useState(false);
  const [syncingGraph, setSyncingGraph] = useState(false);
  const [sendingTestEvent, setSendingTestEvent] = useState(false);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [updatingObjectId, setUpdatingObjectId] = useState<string | null>(null);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [budgetDraftValue, setBudgetDraftValue] = useState<string>("");
  const [pullingFormId, setPullingFormId] = useState<string | null>(null);
  const [subscribingPage, setSubscribingPage] = useState(false);
  const [syncingPosts, setSyncingPosts] = useState(false);

  const [showToken, setShowToken] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "warn" | "error";
    text: string;
  } | null>(null);

  const [config, setConfig] = useState<MetaConfig>({
    appId: "",
    appSecret: "",
    datasetId: "1061685489662581",
    apiVersion: "v22.0",
    businessName: "KNLTC",
    leadEventSource: "KNLTC CRM",
    accessToken: "",
    adAccountId: "",
    pageId: "",
    connectedUserName: "",
    connectedUserId: "",
    tokenExpiresAt: "",
    testEventCode: "",
    webhookVerifyToken: "knltc_meta_crm_webhook_2026",
    autoSyncCrmStages: true,
    stageMappings: [],
    googleAdsCustomerId: "",
    googleAdsConversionId: "",
    googleAdsConversionLabel: "",
    youtubeChannelId: "",
    youtubeChannelHandle: "@knltc",
    gbpDhakaLocationId: "Dhaka Head Office (Naya Paltan)",
    gbpKhulnaLocationId: "Khulna Branch (Shibbari More)",
  });

  const [adAccounts, setAdAccounts] = useState<AdAccountInfo[]>([]);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [leadForms, setLeadForms] = useState<LeadFormItem[]>([]);
  const [pagePosts, setPagePosts] = useState<PagePostItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [adSets, setAdSets] = useState<AdSetItem[]>([]);
  const [ads, setAds] = useState<AdItem[]>([]);
  const [capiLogs, setCapiLogs] = useState<CapiLogItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [selectedPayloadLog, setSelectedPayloadLog] = useState<CapiLogItem | null>(null);

  // Quick Lead Import Form State
  const [newMetaLead, setNewMetaLead] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Dhaka",
    interest: "STUDENT_VISA_REGULAR",
    branch: "DHK-HQ",
    metaLeadId: "",
    metaCampaignName: "Japan Student Visa 2027 Lead Campaign",
    metaAdSetName: "HSC & Diploma Pass (18-28) Bangladesh",
    metaAdName: "Zero Advance Fee Student Visa Video Ad",
  });
  const [importingLead, setImportingLead] = useState(false);

  // Tag Existing Lead State
  const [tagLeadId, setTagLeadId] = useState("");
  const [tagCampaignName, setTagCampaignName] = useState("");
  const [tagAdName, setTagAdName] = useState("");
  const [tagMetaLeadId, setTagMetaLeadId] = useState("");
  const [taggingLead, setTaggingLead] = useState(false);

  const showToast = useCallback(
    (type: "success" | "warn" | "error", text: string) => {
      setToastMsg({ type, text });
      setTimeout(() => setToastMsg(null), 5500);
    },
    [],
  );

  const fetchHubData = useCallback(async (liveSync = false) => {
    try {
      if (liveSync) setSyncingGraph(true);
      const res = await fetch(
        `/api/admin/meta-marketing${liveSync ? "?liveSync=1" : ""}`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (json.ok) {
        if (json.config) setConfig(json.config);
        if (Array.isArray(json.adAccounts)) setAdAccounts(json.adAccounts);
        if (Array.isArray(json.pages)) setPages(json.pages);
        if (Array.isArray(json.leadForms)) setLeadForms(json.leadForms);
        if (Array.isArray(json.pagePosts)) setPagePosts(json.pagePosts);
        if (Array.isArray(json.campaigns)) setCampaigns(json.campaigns);
        if (Array.isArray(json.adSets)) setAdSets(json.adSets);
        if (Array.isArray(json.ads)) setAds(json.ads);
        if (Array.isArray(json.capiLogs)) setCapiLogs(json.capiLogs);
        if (Array.isArray(json.blogPosts)) setBlogPosts(json.blogPosts);
      }
    } catch (err) {
      console.warn("[MarketingHub] Failed to load hub data:", err);
    } finally {
      setSyncingGraph(false);
    }
  }, []);

  useEffect(() => {
    fetchHubData(false);
    const onCapiEvent = () => fetchHubData(false);
    window.addEventListener("knltc-meta-capi-sent", onCapiEvent);
    return () => window.removeEventListener("knltc-meta-capi-sent", onCapiEvent);
  }, [fetchHubData]);

  // Listen for OAuth Popup Completion Message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin || "";
      if (
        !origin.endsWith(".run.app") &&
        !origin.includes("localhost") &&
        !origin.includes("knltc.com")
      ) {
        return;
      }
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        setConnectingOAuth(false);
        showToast(
          "success",
          `মেটা অ্যাকাউন্ট (${event.data.connectedUserName || "Meta Business"}) সফলভাবে সংযুক্ত হয়েছে! সব অ্যাড অ্যাকাউন্ট, পেজ ও ক্যাম্পেইন লোড হচ্ছে...`,
        );
        fetchHubData(true);
      } else if (event.data?.type === "OAUTH_AUTH_ERROR") {
        setConnectingOAuth(false);
        showToast(
          "error",
          `মেটা OAuth ত্রুটি: ${event.data.error || "সংযোগ সম্পন্ন হয়নি"}`,
        );
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchHubData, showToast]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1-Click Meta OAuth Popup Connect
  const handleConnectMetaOAuth = async () => {
    if (!config.appId.trim() || !config.appSecret.trim()) {
      setMetaSubView("META_APP_CONNECT");
      showToast(
        "warn",
        "১-ক্লিকে মেটা লগইন করার পূর্বে আপনার Meta App ID এবং App Secret ঘরে মান বসিয়ে নিন।",
      );
      return;
    }

    setConnectingOAuth(true);
    try {
      const res = await fetch("/api/admin/meta-oauth/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: config.appId.trim(),
          appSecret: config.appSecret.trim(),
          origin:
            typeof window !== "undefined"
              ? window.location.origin
              : "https://knltc.com",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok || !json.url) {
        setConnectingOAuth(false);
        showToast("error", json.error || "OAuth URL তৈরি করা যায়নি।");
        return;
      }

      // Open Facebook's authorization dialog directly in a popup window
      const authWindow = window.open(
        json.url,
        "knltc_meta_oauth_popup",
        "width=640,height=740,scrollbars=yes",
      );
      if (!authWindow) {
        setConnectingOAuth(false);
        showToast(
          "warn",
          "ব্রাউজারে পপ-আপ ব্লক করা হয়েছে। অনুগ্রহ করে এই সাইটের জন্য পপ-আপ Allow করুন।",
        );
      }
    } catch (err: any) {
      setConnectingOAuth(false);
      showToast("error", err?.message || "মেটা OAuth পপ-আপ ওপেন করতে সমস্যা হয়েছে।");
    }
  };

  const handleSaveConfig = async (overridePartial?: Partial<MetaConfig>) => {
    setSavingConfig(true);
    const mergedConfig = { ...config, ...(overridePartial || {}) };
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SAVE_CONFIG",
          config: mergedConfig,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        if (json.config) setConfig(json.config);
        if (Array.isArray(json.adAccounts)) setAdAccounts(json.adAccounts);
        if (Array.isArray(json.pages)) setPages(json.pages);
        if (Array.isArray(json.leadForms)) setLeadForms(json.leadForms);
        if (json.liveSyncResult?.campaigns) {
          setCampaigns(json.liveSyncResult.campaigns);
          setAdSets(json.liveSyncResult.adSets || []);
          setAds(json.liveSyncResult.ads || []);
        }
        showToast(
          "success",
          "মেটা অ্যাপ, অ্যাড অ্যাকাউন্ট ও কনভার্সন এপিআই (Dataset 1061685489662581) সংরক্ষিত ও সিঙ্ক হয়েছে!",
        );
      } else {
        showToast("error", json.error || "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      showToast("error", err?.message || "নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSavingConfig(false);
    }
  };

  // Toggle Campaign, Ad Set, or Ad Status (ACTIVE <-> PAUSED) or Update Budget
  const handleUpdateMetaObject = async (input: {
    objectId: string;
    objectType: "CAMPAIGN" | "ADSET" | "AD";
    status?: "ACTIVE" | "PAUSED";
    dailyBudget?: number;
  }) => {
    setUpdatingObjectId(input.objectId);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_META_OBJECT",
          ...input,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        if (Array.isArray(json.campaigns)) setCampaigns(json.campaigns);
        if (Array.isArray(json.adSets)) setAdSets(json.adSets);
        if (Array.isArray(json.ads)) setAds(json.ads);
        setEditingBudgetId(null);
        showToast(
          "success",
          input.status
            ? `মেটা ${input.objectType} স্ট্যাটাস "${input.status}"-এ পরিবর্তন করা হয়েছে!`
            : `মেটা ${input.objectType}-এর ডেইলি বাজেট আপডেট করা হয়েছে!`,
        );
      } else {
        showToast(
          "error",
          json.errorMessage || "মেটায় পরিবর্তন আপডেট করতে সমস্যা হয়েছে।",
        );
      }
    } catch (err: any) {
      showToast("error", err?.message || "নেটওয়ার্ক ত্রুটি।");
    } finally {
      setUpdatingObjectId(null);
    }
  };

  const handlePullLeadsFromForm = async (formId: string, pageId?: string) => {
    setPullingFormId(formId);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PULL_FORM_LEADS",
          formId,
          pageId,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        showToast(
          "success",
          `মেটা ফর্ম থেকে মোট ${json.pulledCount || 0}টি লিড চেক করে ${json.newLeadsCount || 0} জন নতুন লিড সরাসরি CRM ও গুগল শিটে যুক্ত হয়েছে!`,
        );
        fetchHubData(false);
        onRefreshStore?.();
      } else {
        showToast("error", json.errorMessage || "ফর্ম থেকে লিড আনতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      showToast("error", err?.message || "লিড পুল ব্যর্থ হয়েছে।");
    } finally {
      setPullingFormId(null);
    }
  };

  const handleSubscribePageWebhook = async (pageId?: string) => {
    setSubscribingPage(true);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBSCRIBE_PAGE_WEBHOOK",
          pageId: pageId || config.pageId,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        if (Array.isArray(json.pages)) setPages(json.pages);
        showToast(
          "success",
          "ফেসবুক পেজটি রিয়েল-টাইম `leadgen` ওয়েবহুকে সফলভাবে সাবস্ক্রাইব হয়েছে! এখন নতুন লিড ফর্ম পূরণ করলেই সাথে সাথে CRM-এ চলে আসবে।",
        );
      } else {
        showToast("warn", json.errorMessage || "ওয়েবহুক সাবস্ক্রিপশন ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      showToast("error", err?.message || "নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSubscribingPage(false);
    }
  };

  const handleSyncPagePosts = async () => {
    setSyncingPosts(true);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SYNC_PAGE_POSTS",
          pageId: config.pageId,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setPagePosts(json.pagePosts || []);
        showToast(
          "success",
          `ফেসবুক পেজ থেকে ${json.pagePosts?.length || 0}টি পোস্ট ও কমেন্ট লোড হয়েছে!`,
        );
      } else {
        showToast("warn", json.errorMessage || "পোস্ট লোড করতে প্রথমে পেজ কানেক্ট করুন।");
      }
    } catch (err: any) {
      showToast("error", err?.message || "পোস্ট লোড ব্যর্থ হয়েছে।");
    } finally {
      setSyncingPosts(false);
    }
  };

  const handleSendTestEvent = async (customStage = "COUNSELED") => {
    setSendingTestEvent(true);
    try {
      const sampleLead = crmLeads[0];
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_TEST_EVENT",
          leadId: sampleLead?.id || `knltc-test-${Date.now()}`,
          leadName: sampleLead?.name || "Tanvir Ahmed (KNLTC Test)",
          phone: sampleLead?.phone || "+8801805013633",
          email: sampleLead?.email || "student@knltc.com",
          city: sampleLead?.city || "Dhaka",
          crmStage: customStage,
          interest: sampleLead?.interest || "STUDENT_VISA_REGULAR",
          branch: sampleLead?.branch || "DHK-HQ",
          testEventCode: config.testEventCode || undefined,
        }),
      });
      const json = await res.json();
      if (json.ok && json.logEntry) {
        setCapiLogs(json.capiLogs || [json.logEntry, ...capiLogs]);
        setSelectedPayloadLog(json.logEntry);
        if (json.logEntry.status === "DELIVERED") {
          showToast(
            "success",
            `Meta Dataset (${config.datasetId})-এ "${json.logEntry.metaEventName}" ইভেন্ট সফলভাবে ডেলিভার হয়েছে!`,
          );
        } else if (json.logEntry.status === "READY_AWAITING_TOKEN") {
          showToast(
            "warn",
            `CAPI পে-লোড প্রস্তুত ও লগ করা হয়েছে (${json.logEntry.metaEventName})। লাইভ পাঠাতে Meta App কানেক্ট করুন।`,
          );
        } else {
          showToast(
            "error",
            `Meta Graph API ত্রুটি: ${json.logEntry.errorMessage || "Failed"}`,
          );
        }
      }
    } catch (err: any) {
      showToast("error", err?.message || "টেস্ট ইভেন্ট পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setSendingTestEvent(false);
    }
  };

  const handleSyncLiveCampaigns = async () => {
    setSyncingGraph(true);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SYNC_META_CAMPAIGNS" }),
      });
      const json = await res.json();
      if (json.campaigns) setCampaigns(json.campaigns);
      if (json.adSets) setAdSets(json.adSets);
      if (json.ads) setAds(json.ads);
      if (json.adAccounts) setAdAccounts(json.adAccounts);
      if (json.pages) setPages(json.pages);
      if (json.leadForms) setLeadForms(json.leadForms);
      if (json.connectedToGraphApi) {
        showToast(
          "success",
          `মেটা অ্যাড অ্যাকাউন্ট থেকে ${json.campaigns?.length || 0}টি ক্যাম্পেইন, ${json.adSets?.length || 0}টি অ্যাড সেট এবং ${json.ads?.length || 0}টি অ্যাড সিঙ্ক হয়েছে!`,
        );
      } else {
        setMetaSubView("META_APP_CONNECT");
        showToast(
          "warn",
          json.errorMessage ||
            "মেটা অ্যাড অ্যাকাউন্ট থেকে লাইভ ক্যাম্পেইন আনতে ১-ক্লিকে মেটা অ্যাপ কানেক্ট করুন।",
        );
      }
    } catch (err: any) {
      showToast("error", err?.message || "মেটা ক্যাম্পেইন সিঙ্ক ব্যর্থ হয়েছে।");
    } finally {
      setSyncingGraph(false);
    }
  };

  const handleBatchSyncAllLeads = async () => {
    setBatchSyncing(true);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BATCH_SYNC_CRM_LEADS",
          stageFilter: "ALL",
        }),
      });
      const json = await res.json();
      if (json.ok) {
        if (Array.isArray(json.capiLogs)) setCapiLogs(json.capiLogs);
        showToast(
          "success",
          `${json.processedCount || 0} জন CRM লিডের বর্তমান স্টেজ মেটা CAPI Dataset (${config.datasetId})-এ সিঙ্ক করা হয়েছে!`,
        );
      }
    } catch (err: any) {
      showToast("error", err?.message || "ব্যাচ সিঙ্ক ব্যর্থ হয়েছে।");
    } finally {
      setBatchSyncing(false);
    }
  };

  const handleImportMetaLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetaLead.name.trim() || !newMetaLead.phone.trim()) {
      showToast("warn", "লিডের নাম এবং ফোন নম্বর আবশ্যক।");
      return;
    }
    setImportingLead(true);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "IMPORT_META_LEAD",
          ...newMetaLead,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        showToast(
          "success",
          `"${newMetaLead.name}" সরাসরি গুগল শিট CRM এবং মেটা CAPI-তে যুক্ত হয়েছে!`,
        );
        setNewMetaLead({
          ...newMetaLead,
          name: "",
          phone: "",
          email: "",
          metaLeadId: "",
        });
        fetchHubData(false);
        onRefreshStore?.();
      }
    } catch (err: any) {
      showToast("error", err?.message || "লিড ইমপোর্ট ব্যর্থ হয়েছে।");
    } finally {
      setImportingLead(false);
    }
  };

  const handleTagExistingLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagLeadId) {
      showToast("warn", "অনুগ্রহ করে একজন লিড নির্বাচন করুন।");
      return;
    }
    setTaggingLead(true);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TAG_LEAD_CAMPAIGN",
          leadId: tagLeadId,
          metaCampaignName: tagCampaignName,
          metaAdName: tagAdName,
          metaLeadId: tagMetaLeadId,
          sendCapiNow: true,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        showToast(
          "success",
          "লিডের ক্যাম্পেইন ও অ্যাড অ্যাট্রিবিউশন আপডেট এবং মেটা CAPI-তে পাঠানো হয়েছে!",
        );
        fetchHubData(false);
        onRefreshStore?.();
      }
    } catch (err: any) {
      showToast("error", err?.message || "ট্যাগিং ব্যর্থ হয়েছে।");
    } finally {
      setTaggingLead(false);
    }
  };

  const metaLeads = crmLeads.filter(
    (l) =>
      l.source === "FACEBOOK_META" ||
      Boolean(l.metaCampaignName) ||
      Boolean(l.metaAdName) ||
      Boolean(l.metaLeadId),
  );
  const qualifiedMetaLeads = metaLeads.filter((l) =>
    ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(l.status),
  );
  const admittedMetaLeads = metaLeads.filter((l) => l.status === "ADMITTED");
  const websiteLeads = crmLeads.filter((l) => l.source === "WEBSITE_FORM");
  const walkinLeads = crmLeads.filter((l) => l.source === "OFFICE_WALKIN");
  const dhakaLeads = crmLeads.filter((l) => l.branch === "DHK-HQ");
  const khulnaLeads = crmLeads.filter((l) => l.branch === "KHULNA-01");

  const derivedCampaignGroups = React.useMemo(() => {
    const map = new Map<
      string,
      {
        campaignName: string;
        adName: string;
        totalLeads: number;
        contacted: number;
        qualified: number;
        admitted: number;
        leads: CrmLead[];
      }
    >();

    for (const l of metaLeads) {
      const camp = l.metaCampaignName || "Facebook / Meta Lead Ads (General)";
      const ad = l.metaAdName || "All Meta Ad Creatives";
      const key = `${camp}|||${ad}`;
      const existing = map.get(key) || {
        campaignName: camp,
        adName: ad,
        totalLeads: 0,
        contacted: 0,
        qualified: 0,
        admitted: 0,
        leads: [],
      };
      existing.totalLeads += 1;
      if (l.status !== "NEW") existing.contacted += 1;
      if (["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(l.status)) {
        existing.qualified += 1;
      }
      if (l.status === "ADMITTED") existing.admitted += 1;
      existing.leads.push(l);
      map.set(key, existing);
    }
    return Array.from(map.values());
  }, [metaLeads]);

  const webhookCallbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/webhooks/meta-leads`
      : "https://knltc.com/api/webhooks/meta-leads";

  const isMetaConnected = Boolean(config.accessToken || config.hasAccessToken);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${
            toastMsg.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/95 text-emerald-200"
              : toastMsg.type === "warn"
                ? "border-amber-500/40 bg-amber-950/95 text-amber-200"
                : "border-rose-500/40 bg-rose-950/95 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* Top Executive Header & Quick Account Switchers */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                <Megaphone className="h-3.5 w-3.5" />
                META APP & OMNI-CHANNEL COMMAND CENTER
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 tabular-nums">
                <TrendingUp className="h-3.5 w-3.5" />
                Meta CAPI: -18.4% Cost Per Quality Lead
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700 tabular-nums">
                Dataset ID: {config.datasetId || "1061685489662581"}
              </span>
              {config.connectedUserName && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                  Connected: {config.connectedUserName}
                </span>
              )}
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              মেটা অ্যাপ (OAuth), অ্যাড ম্যানেজার, লিড ফর্ম ও অমনি-চ্যানেল কন্ট্রোল প্যানেল
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              ওয়েবসাইটের ড্যাশবোর্ড থেকেই মেটা অ্যাপ কানেক্ট করুন, ক্যাম্পেইন/অ্যাড চালু বা পজ (Active/Pause) করুন, ফেসবুক পেজের লিড ফর্ম থেকে সব লিড টেনে আনুন এবং CAPI সিগন্যাল পাঠান।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                if (config.appId && config.appSecret) {
                  handleConnectMetaOAuth();
                } else {
                  setMetaSubView("META_APP_CONNECT");
                }
              }}
              disabled={connectingOAuth}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#166fe5] disabled:opacity-50"
            >
              {connectingOAuth ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {isMetaConnected
                ? "Reconnect Meta App (OAuth)"
                : "১-ক্লিকে Meta App কানেক্ট করুন"}
            </button>

            <button
              onClick={handleSyncLiveCampaigns}
              disabled={syncingGraph}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
            >
              {syncingGraph ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              লাইভ ডাটা সিঙ্ক করুন
            </button>
          </div>
        </div>

        {/* Discovered Ad Account & Facebook Page Selector Bar */}
        {(adAccounts.length > 0 || pages.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs">
            {adAccounts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Ad Account:</span>
                <select
                  value={config.adAccountId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setConfig({ ...config, adAccountId: nextId });
                    handleSaveConfig({ adAccountId: nextId });
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-slate-900"
                >
                  {adAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.id} • {acc.currency})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {pages.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Facebook Page:</span>
                <select
                  value={config.pageId}
                  onChange={(e) => {
                    const nextPageId = e.target.value;
                    setConfig({ ...config, pageId: nextPageId });
                    handleSaveConfig({ pageId: nextPageId });
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (ID: {p.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] text-slate-600 tabular-nums">
                Instant Lead Forms: <strong>{leadForms.length}টি</strong>
              </span>
              <button
                onClick={() => setMetaSubView("LEAD_FORMS_PULL")}
                className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
              >
                ফর্মের লিড টেনে আনুন
              </button>
            </div>
          </div>
        )}

        {/* 4-Card KPI Strip */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>META APP & DATASET CAPI</span>
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {config.datasetId || "1061685489662581"}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  isMetaConnected ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isMetaConnected ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {isMetaConnected
                  ? "Connected & Auto-Syncing"
                  : "App ID / Token সংযোগের অপেক্ষায়"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>META AD LEADS IN CRM</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-bold text-slate-900">
                {metaLeads.length}
              </span>
              <span className="text-xs font-medium text-slate-500">
                / মোট {crmLeads.length} লিড
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600 tabular-nums">
              যোগ্য (Qualified):{" "}
              <strong className="text-emerald-700">
                {qualifiedMetaLeads.length}
              </strong>{" "}
              • ভর্তি (Admitted):{" "}
              <strong className="text-blue-700">
                {admittedMetaLeads.length}
              </strong>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>CRM ➔ META CAPI EVENTS</span>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-bold text-slate-900">
                {capiLogs.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                ({capiLogs.filter((l) => l.status === "DELIVERED").length} Delivered)
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600">
              Auto-Trigger:{" "}
              <strong className="text-slate-900">
                {config.autoSyncCrmStages ? "প্রতিটি স্টেজ পরিবর্তনে চালু" : "ম্যানুয়াল"}
              </strong>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>CAMPAIGNS, FORMS & BLOG</span>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-bold text-slate-900">
                {campaigns.length > 0 ? campaigns.length : derivedCampaignGroups.length}
              </span>
              <span className="text-xs text-slate-500">ক্যাম্পেইন</span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600 tabular-nums">
              লিড ফর্ম: <strong>{leadForms.length}টি</strong> • ব্লগ:{" "}
              <strong>{blogPosts.length}টি</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Omni-Channel Platform Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          {
            id: "META",
            labelBn: "১. Meta App, Ads & CRM CAPI",
            badge: "Full Control",
            icon: Megaphone,
          },
          {
            id: "GOOGLE_ADS",
            labelBn: "২. Google Ads & Search",
            badge: `${websiteLeads.length} Leads`,
            icon: Target,
          },
          {
            id: "YOUTUBE",
            labelBn: "৩. YouTube Channel Monitor",
            badge: config.youtubeChannelHandle || "@knltc",
            icon: Video,
          },
          {
            id: "GBP",
            labelBn: "৪. Google Business (ঢাকা ও খুলনা)",
            badge: `${walkinLeads.length} Walk-ins`,
            icon: MapPin,
          },
          {
            id: "BLOG_SEO",
            labelBn: "৫. Website Blog & SEO Content",
            badge: `${blogPosts.length} Posts`,
            icon: Globe,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activePlatform === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePlatform(tab.id as any)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.labelBn}</span>
              <span
                className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* PLATFORM 1: META APP, ADS MANAGER, LEAD FORMS & CAPI                  */}
      {/* ===================================================================== */}
      {activePlatform === "META" && (
        <div className="space-y-6">
          {/* Sub-Navigation for Meta Command Center */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                {
                  id: "META_APP_CONNECT",
                  label: "১. Meta App ও ১-ক্লিক কানেকশন (Setup)",
                  icon: KeyRound,
                },
                {
                  id: "CAMPAIGNS_ADS",
                  label: "২. ক্যাম্পেইন ও অ্যাড কন্ট্রোল (Active/Pause)",
                  icon: Layers,
                },
                {
                  id: "LEAD_FORMS_PULL",
                  label: `৩. পেজ লিড ফর্ম ও অটো-পুল (${leadForms.length})`,
                  icon: Download,
                },
                {
                  id: "PAGE_POSTS_COMMENTS",
                  label: `৪. ফেসবুক পেজ পোস্ট ও কমেন্ট (${pagePosts.length})`,
                  icon: MessageSquare,
                },
                {
                  id: "STAGE_MAPPING",
                  label: "৫. CRM স্টেজ ➔ CAPI ম্যাপিং",
                  icon: Activity,
                },
                {
                  id: "DELIVERY_LOGS",
                  label: `৬. CAPI ইভেন্ট লগ (${capiLogs.length})`,
                  icon: Terminal,
                },
              ].map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = metaSubView === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setMetaSubView(sub.id as any)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                      isSubActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <SubIcon className="h-3.5 w-3.5" />
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 1: META APP (APP ID + SECRET) & 1-CLICK OAUTH WIZARD   */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "META_APP_CONNECT" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Meta App (App ID + App Secret) ও ১-ক্লিক OAuth সংযোগ
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      মেটায় একটি অ্যাপ তৈরি করে এখানে App ID ও App Secret বসালে ১ ক্লিকেই আপনার পুরো বিজনেস অ্যাকাউন্ট, অ্যাডস, পেজ এবং Dataset (`1061685489662581`) যুক্ত হয়ে যাবে।
                    </p>
                  </div>
                  <button
                    onClick={handleConnectMetaOAuth}
                    disabled={connectingOAuth}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#166fe5] disabled:opacity-50"
                  >
                    {connectingOAuth ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4" />
                    )}
                    Facebook / Meta দিয়ে ১-ক্লিকে লগইন করুন
                  </button>
                </div>

                {/* App ID & App Secret Inputs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      ১. Meta App ID (`developers.facebook.com` ➔ App Settings ➔ Basic)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: 1122334455667788"
                      value={config.appId}
                      onChange={(e) =>
                        setConfig({ ...config, appId: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      ২. Meta App Secret (`App Settings ➔ Basic ➔ App secret`)
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showSecret ? "text" : "password"}
                        placeholder="আপনার ৩২ ক্যারেক্টারের App Secret..."
                        value={config.appSecret}
                        onChange={(e) =>
                          setConfig({ ...config, appSecret: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 py-2 pl-3.5 pr-10 font-mono text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showSecret ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Copyable OAuth Redirect URIs Box */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2.5">
                  <div className="text-xs font-bold text-blue-950">
                    ৩. মেটা অ্যাপে নিচের Valid OAuth Redirect URI গুলো কপি করে বসান (`Facebook Login for Business ➔ Settings`):
                  </div>
                  {[
                    {
                      key: "dev_uri",
                      label: "Development URL",
                      url: DEV_CALLBACK_URL,
                    },
                    {
                      key: "shared_uri",
                      label: "Shared / Preview URL",
                      url: SHARED_CALLBACK_URL,
                    },
                    {
                      key: "prod_uri",
                      label: "Main Domain (knltc.com)",
                      url: PROD_CALLBACK_URL,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex flex-col justify-between gap-2 rounded-lg border border-blue-200/80 bg-white px-3 py-2 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          {item.label}
                        </span>
                        <span className="font-mono text-xs text-slate-800 break-all">
                          {item.url}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.key, item.url)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        {copiedKey === item.key ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* System User / Dataset Access Token Fallback & Manual Overrides */}
                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <div className="text-xs font-bold text-slate-800">
                    বিকল্প সংযোগ (ঐচ্ছিক): আপনি যদি OAuth পপ-আপের বদলে সরাসরি System User / Dataset Access Token ব্যবহার করতে চান:
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Access Token (OAuth করলে এটি স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে)
                      </label>
                      <div className="relative mt-1">
                        <input
                          type={showToken ? "text" : "password"}
                          placeholder="EAABsbCS1iHgBO..."
                          value={config.accessToken}
                          onChange={(e) =>
                            setConfig({ ...config, accessToken: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 py-2 pl-3.5 pr-10 font-mono text-xs text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showToken ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Meta Dataset ID (CRM Conversions API)
                      </label>
                      <input
                        type="text"
                        value={config.datasetId}
                        onChange={(e) =>
                          setConfig({ ...config, datasetId: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Meta Ad Account ID (`act_...`)
                      </label>
                      <input
                        type="text"
                        placeholder="অটো-ডিসকভার হবে অথবা act_12345 লিখুন"
                        value={config.adAccountId}
                        onChange={(e) =>
                          setConfig({ ...config, adAccountId: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Facebook Page ID
                      </label>
                      <input
                        type="text"
                        placeholder="অটো-ডিসকভার হবে অথবা পেজ ID লিখুন"
                        value={config.pageId}
                        onChange={(e) =>
                          setConfig({ ...config, pageId: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Test Event Code (Events Manager ➔ Test Events)
                      </label>
                      <input
                        type="text"
                        placeholder="TEST..."
                        value={config.testEventCode}
                        onChange={(e) =>
                          setConfig({ ...config, testEventCode: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleSaveConfig()}
                    disabled={savingConfig}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {savingConfig ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    সেভ করুন ও সব অ্যাকাউন্ট লোড করুন
                  </button>

                  <button
                    onClick={handleConnectMetaOAuth}
                    disabled={connectingOAuth}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1877F2] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-50"
                  >
                    <KeyRound className="h-4 w-4" />
                    ১-ক্লিকে Facebook OAuth পপ-আপ খুলুন
                  </button>

                  <button
                    onClick={() => handleSendTestEvent("COUNSELED")}
                    disabled={sendingTestEvent}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Send className="h-3.5 w-3.5 text-blue-600" />
                    টেস্ট CAPI ইভেন্ট পাঠান
                  </button>
                </div>
              </div>

              {/* Right Column: Step-by-Step Guide to Creating a Meta App */}
              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    মেটা অ্যাপ তৈরির সহজ গাইড (৩ মিনিট)
                  </span>
                  <a
                    href="https://developers.facebook.com/apps/create/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-500"
                  >
                    Meta Developers <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <ol className="space-y-3 text-xs text-slate-300 leading-relaxed list-decimal list-inside">
                  <li>
                    <strong className="text-white">Create App:</strong>{" "}
                    <code className="text-blue-300">developers.facebook.com/apps</code>-এ গিয়ে{" "}
                    <strong>Create App ➔ Other ➔ Business</strong> সিলেক্ট করে অ্যাপ তৈরি করুন (যেমন নাম দিন: <em>KNLTC CRM Marketing</em>)।
                  </li>
                  <li>
                    <strong className="text-white">App ID ও App Secret কপি:</strong>{" "}
                    বাম পাশের মেনু থেকে <strong>App settings ➔ Basic</strong>-এ গিয়ে <strong>App ID</strong> এবং <strong>App secret</strong> কপি করে বাম পাশের ঘরে বসান।
                  </li>
                  <li>
                    <strong className="text-white">Redirect URI যুক্ত করা:</strong>{" "}
                    <strong>Facebook Login for Business ➔ Settings</strong>-এ গিয়ে{" "}
                    <strong>Valid OAuth Redirect URIs</strong> ঘরে বাম পাশের ৩টি Callback URL কপি করে পেস্ট করুন এবং <strong>Save changes</strong> দিন।
                  </li>
                  <li>
                    <strong className="text-white">১-ক্লিকে কানেক্ট:</strong>{" "}
                    এবার বাম পাশের নীল রঙের <strong>“Facebook / Meta দিয়ে ১-ক্লিকে লগইন করুন”</strong> বাটনে ক্লিক করলেই আপনার সব অ্যাড অ্যাকাউন্ট, পেজ, লিড ফর্ম এবং Dataset স্বয়ংক্রিয়ভাবে কানেক্ট হয়ে যাবে!
                  </li>
                </ol>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-[11px] text-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-300">
                    প্রো টিপ (Business System User Token):
                  </div>
                  <div>
                    আপনি চাইলে <strong>business.facebook.com ➔ Settings ➔ System users</strong> থেকে একটি টোকেন জেনারেট করে সরাসরি Access Token ঘরে বসিয়ে <strong>“সেভ করুন ও সব অ্যাকাউন্ট লোড করুন”</strong> বাটনে ক্লিক করলেও পপ-আপ ছাড়াই সব ফিচার কাজ করবে!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 2: CAMPAIGNS, AD SETS & ADS CONTROL (ACTIVE/PAUSE)     */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "CAMPAIGNS_ADS" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      রিয়েল-টাইম মেটা ক্যাম্পেইন, অ্যাড সেট ও অ্যাড কন্ট্রোল সেন্টার
                    </h3>
                    <p className="text-xs text-slate-500">
                      ওয়েবসাইটের ড্যাশবোর্ড থেকেই যেকোনো ক্যাম্পেইন বা অ্যাড সরাসরি <strong>Active / Pause</strong> করুন, বাজেট পরিবর্তন করুন এবং কোন অ্যাড থেকে কোন লিড এসেছে তা দেখুন।
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      {
                        id: "CAMPAIGNS",
                        label: `ক্যাম্পেইন (${campaigns.length || derivedCampaignGroups.length})`,
                      },
                      { id: "ADSETS", label: `অ্যাড সেট (${adSets.length})` },
                      { id: "ADS", label: `অ্যাডস ও ক্রিয়েটিভ (${ads.length})` },
                      {
                        id: "ATTRIBUTED_LEADS",
                        label: `মেটা লিড তালিকা (${metaLeads.length})`,
                      },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDrilldownTab(d.id as any)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                          drilldownTab === d.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CAMPAIGNS TABLE WITH ACTIVE/PAUSE & BUDGET CONTROLS */}
                {drilldownTab === "CAMPAIGNS" && (
                  <div className="mt-4 overflow-x-auto">
                    {campaigns.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                            <th className="px-4 py-3">ক্যাম্পেইন নাম ও ID</th>
                            <th className="px-4 py-3">স্ট্যাটাস ও কন্ট্রোল</th>
                            <th className="px-4 py-3">ডেইলি বাজেট</th>
                            <th className="px-4 py-3 text-right">ব্যয় (Spend)</th>
                            <th className="px-4 py-3 text-right">Impr. / Clicks</th>
                            <th className="px-4 py-3 text-right">Meta Leads</th>
                            <th className="px-4 py-3 text-right">CRM লিড</th>
                            <th className="px-4 py-3 text-right">Qualified</th>
                            <th className="px-4 py-3 text-right">ভর্তি (Admitted)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {campaigns.map((c) => {
                            const isActive = c.effectiveStatus === "ACTIVE" || c.status === "ACTIVE";
                            const isUpdating = updatingObjectId === c.id;
                            return (
                              <tr key={c.id} className="hover:bg-slate-50/80">
                                <td className="px-4 py-3">
                                  <div className="font-bold text-slate-900">{c.name}</div>
                                  <div className="font-mono text-[11px] text-slate-400 tabular-nums">
                                    ID: {c.id} • {c.objective}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                        isActive
                                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {c.effectiveStatus}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleUpdateMetaObject({
                                          objectId: c.id,
                                          objectType: "CAMPAIGN",
                                          status: isActive ? "PAUSED" : "ACTIVE",
                                        })
                                      }
                                      disabled={isUpdating}
                                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-bold transition ${
                                        isActive
                                          ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                      }`}
                                      title={isActive ? "Pause Campaign" : "Activate Campaign"}
                                    >
                                      {isUpdating ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : isActive ? (
                                        <>
                                          <Pause className="h-3 w-3" /> Pause
                                        </>
                                      ) : (
                                        <>
                                          <Play className="h-3 w-3" /> Activate
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-mono tabular-nums">
                                  {editingBudgetId === c.id ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        value={budgetDraftValue}
                                        onChange={(e) => setBudgetDraftValue(e.target.value)}
                                        className="w-20 rounded border border-slate-300 px-2 py-1 text-xs font-mono"
                                      />
                                      <button
                                        onClick={() =>
                                          handleUpdateMetaObject({
                                            objectId: c.id,
                                            objectType: "CAMPAIGN",
                                            dailyBudget: Number(budgetDraftValue),
                                          })
                                        }
                                        className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <span>
                                        {c.dailyBudget
                                          ? `${c.dailyBudget.toFixed(2)} ${c.currency}/day`
                                          : "Ad Set Budget"}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setEditingBudgetId(c.id);
                                          setBudgetDraftValue(String(c.dailyBudget || 10));
                                        }}
                                        className="text-[10px] font-sans font-semibold text-blue-600 hover:underline"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                  {c.spend.toFixed(2)} {c.currency}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">
                                  {c.impressions.toLocaleString()} / {c.clicks.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 tabular-nums">
                                  {c.metaReportedLeads}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                  {c.crmMatchedLeadsCount}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                                  {c.crmQualifiedLeadsCount}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-indigo-700 tabular-nums">
                                  {c.crmAdmittedCount}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 sm:flex-row sm:items-center">
                          <div className="text-xs text-blue-900">
                            <strong>লাইভ মেটা অ্যাড অ্যাকাউন্ট সংযোগ:</strong> আপনার CRM-এ বর্তমানে{" "}
                            <strong>{metaLeads.length} জন ফেসবুক/মেটা লিড</strong> রয়েছে। ড্যাশবোর্ড থেকে সরাসরি ক্যাম্পেইন Active/Pause এবং বাজেট কন্ট্রোল করতে{" "}
                            <strong>“১. Meta App ও ১-ক্লিক কানেকশন”</strong> ট্যাবে গিয়ে আপনার অ্যাপ কানেক্ট করুন।
                          </div>
                          <button
                            onClick={() => setMetaSubView("META_APP_CONNECT")}
                            className="shrink-0 rounded-lg bg-[#1877F2] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#166fe5]"
                          >
                            Meta App কানেক্ট করুন
                          </button>
                        </div>

                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                              <th className="px-4 py-3">ক্যাম্পেইন নাম (CRM Attribution)</th>
                              <th className="px-4 py-3">অ্যাড ক্রিয়েটিভ (Ad Name)</th>
                              <th className="px-4 py-3 text-right">মোট লিড (NEW+)</th>
                              <th className="px-4 py-3 text-right">কথা হয়েছে (Contacted)</th>
                              <th className="px-4 py-3 text-right">যোগ্য (QualifiedLead)</th>
                              <th className="px-4 py-3 text-right">ভর্তি (Admitted / Purchase)</th>
                              <th className="px-4 py-3 text-right">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {derivedCampaignGroups.map((grp, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="px-4 py-3 font-bold text-slate-900">
                                  {grp.campaignName}
                                </td>
                                <td className="px-4 py-3 text-slate-600">{grp.adName}</td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                  {grp.totalLeads}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-blue-700 tabular-nums">
                                  {grp.contacted}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                                  {grp.qualified}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-indigo-700 tabular-nums">
                                  {grp.admitted}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => setDrilldownTab("ATTRIBUTED_LEADS")}
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                                  >
                                    লিড দেখুন ({grp.totalLeads})
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* AD SETS TABLE WITH ACTIVE/PAUSE & BUDGET EDIT */}
                {drilldownTab === "ADSETS" && (
                  <div className="mt-4 overflow-x-auto">
                    {adSets.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                            <th className="px-4 py-3">অ্যাড সেট নাম</th>
                            <th className="px-4 py-3">ক্যাম্পেইন</th>
                            <th className="px-4 py-3">স্ট্যাটাস ও কন্ট্রোল</th>
                            <th className="px-4 py-3">ডেইলি বাজেট</th>
                            <th className="px-4 py-3">অপ্টিমাইজেশন গোল</th>
                            <th className="px-4 py-3 text-right">Spend</th>
                            <th className="px-4 py-3 text-right">Clicks</th>
                            <th className="px-4 py-3 text-right">Leads</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adSets.map((as) => {
                            const isActive = as.effectiveStatus === "ACTIVE" || as.status === "ACTIVE";
                            const isUpdating = updatingObjectId === as.id;
                            return (
                              <tr key={as.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-bold text-slate-900">
                                  {as.name}
                                  <div className="font-mono text-[10px] text-slate-400">
                                    ID: {as.id}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{as.campaignName}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                      {as.effectiveStatus}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleUpdateMetaObject({
                                          objectId: as.id,
                                          objectType: "ADSET",
                                          status: isActive ? "PAUSED" : "ACTIVE",
                                        })
                                      }
                                      disabled={isUpdating}
                                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold hover:bg-slate-100"
                                    >
                                      {isUpdating
                                        ? "..."
                                        : isActive
                                          ? "Pause"
                                          : "Activate"}
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-mono tabular-nums">
                                  {editingBudgetId === as.id ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        value={budgetDraftValue}
                                        onChange={(e) => setBudgetDraftValue(e.target.value)}
                                        className="w-20 rounded border border-slate-300 px-2 py-1 text-xs font-mono"
                                      />
                                      <button
                                        onClick={() =>
                                          handleUpdateMetaObject({
                                            objectId: as.id,
                                            objectType: "ADSET",
                                            dailyBudget: Number(budgetDraftValue),
                                          })
                                        }
                                        className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <span>
                                        {as.dailyBudget ? `${as.dailyBudget.toFixed(2)}/day` : "—"}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setEditingBudgetId(as.id);
                                          setBudgetDraftValue(String(as.dailyBudget || 10));
                                        }}
                                        className="text-[10px] font-sans font-semibold text-blue-600 hover:underline"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                                  {as.optimizationGoal || "QUALITY_LEAD"}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                                  {as.spend.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right font-mono tabular-nums">
                                  {as.clicks.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 tabular-nums">
                                  {as.leadsCount}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        লাইভ অ্যাড সেট দেখতে মেটা অ্যাপ কানেক্ট করে “লাইভ ডাটা সিঙ্ক করুন” বাটনে ক্লিক করুন।
                      </div>
                    )}
                  </div>
                )}

                {/* ADS TABLE WITH CREATIVE PREVIEW & ACTIVE/PAUSE */}
                {drilldownTab === "ADS" && (
                  <div className="mt-4 overflow-x-auto">
                    {ads.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                            <th className="px-4 py-3">অ্যাড ক্রিয়েটিভ ও নাম</th>
                            <th className="px-4 py-3">ক্যাম্পেইন ও অ্যাড সেট</th>
                            <th className="px-4 py-3">স্ট্যাটাস ও কন্ট্রোল</th>
                            <th className="px-4 py-3 text-right">Spend</th>
                            <th className="px-4 py-3 text-right">Clicks / CTR</th>
                            <th className="px-4 py-3 text-right">Meta Leads</th>
                            <th className="px-4 py-3 text-right">CRM লিড</th>
                            <th className="px-4 py-3 text-right">Qualified</th>
                            <th className="px-4 py-3 text-right">Admitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {ads.map((ad) => {
                            const isActive = ad.effectiveStatus === "ACTIVE" || ad.status === "ACTIVE";
                            const isUpdating = updatingObjectId === ad.id;
                            return (
                              <tr key={ad.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-start gap-3">
                                    {ad.thumbnailUrl ? (
                                      <img
                                        src={ad.thumbnailUrl}
                                        alt={ad.name}
                                        referrerPolicy="no-referrer"
                                        className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                        <Megaphone className="h-4 w-4" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-bold text-slate-900">{ad.name}</div>
                                      {ad.creativeTitle && (
                                        <div className="text-[11px] font-medium text-slate-600 line-clamp-1">
                                          {ad.creativeTitle}
                                        </div>
                                      )}
                                      <div className="font-mono text-[10px] text-slate-400">
                                        Ad ID: {ad.id}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                  <div className="font-semibold text-slate-800">
                                    {ad.campaignName}
                                  </div>
                                  <div className="text-[11px] text-slate-400">{ad.adSetName}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                        isActive
                                          ? "bg-emerald-50 text-emerald-700"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {ad.effectiveStatus}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleUpdateMetaObject({
                                          objectId: ad.id,
                                          objectType: "AD",
                                          status: isActive ? "PAUSED" : "ACTIVE",
                                        })
                                      }
                                      disabled={isUpdating}
                                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold hover:bg-slate-100"
                                    >
                                      {isUpdating
                                        ? "..."
                                        : isActive
                                          ? "Pause"
                                          : "Activate"}
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                                  {ad.spendBdtOrUsd.toFixed(2)} {ad.currency}
                                </td>
                                <td className="px-4 py-3 text-right font-mono tabular-nums">
                                  {ad.clicks} ({Number(ad.ctr || 0).toFixed(2)}%)
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 tabular-nums">
                                  {ad.metaReportedLeads}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                  {ad.crmMatchedLeadsCount}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                                  {ad.crmQualifiedLeadsCount}
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-indigo-700 tabular-nums">
                                  {ad.crmAdmittedCount}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        লাইভ অ্যাড পারফরম্যান্স ও ক্রিয়েটিভ প্রিভিউ দেখতে মেটা অ্যাপ কানেক্ট করে সিঙ্ক করুন।
                      </div>
                    )}
                  </div>
                )}

                {/* ATTRIBUTED CRM LEADS TABLE */}
                {drilldownTab === "ATTRIBUTED_LEADS" && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                          <th className="px-4 py-3">প্রার্থীর নাম ও ফোন</th>
                          <th className="px-4 py-3">ক্যাম্পেইন ও অ্যাড</th>
                          <th className="px-4 py-3">Meta Lead ID</th>
                          <th className="px-4 py-3">বর্তমান CRM স্টেজ</th>
                          <th className="px-4 py-3">সর্বশেষ CAPI ইভেন্ট</th>
                          <th className="px-4 py-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {metaLeads.slice(0, 50).map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50/80">
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">{lead.name}</div>
                              <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                                {lead.phone} • {lead.city}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-800">
                                {lead.metaCampaignName || "Meta Lead Campaign"}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {lead.metaAdName || "Instant Form / Ad Creative"}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-slate-600 tabular-nums">
                              {lead.metaLeadId || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {lead.lastCapiEventSent ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  <Check className="h-3 w-3" />
                                  {lead.lastCapiEventSent}
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">Auto-Sync Ready</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={async () => {
                                    const res = await fetch("/api/admin/meta-marketing", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        action: "SEND_CRM_EVENT",
                                        leadId: lead.id,
                                        leadName: lead.name,
                                        phone: lead.phone,
                                        email: lead.email,
                                        city: lead.city,
                                        crmStage: lead.status,
                                        interest: lead.interest,
                                        branch: lead.branch,
                                        contractAmountBdt: lead.contractAmountBdt,
                                        metaLeadId: lead.metaLeadId,
                                      }),
                                    });
                                    const j = await res.json();
                                    if (j.ok) {
                                      if (j.capiLogs) setCapiLogs(j.capiLogs);
                                      showToast(
                                        "success",
                                        `${lead.name}-এর "${j.logEntry?.metaEventName}" ইভেন্ট মেটা CAPI-তে পাঠানো হয়েছে!`,
                                      );
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                                >
                                  <Send className="h-3 w-3" />
                                  Send CAPI
                                </button>
                                {onOpenLeadProfile && (
                                  <button
                                    onClick={() => onOpenLeadProfile(lead)}
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                                  >
                                    360° প্রোফাইল
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Tag Existing CRM Lead with Meta Campaign / Ad */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900">
                  বিদ্যমান CRM লিডকে নির্দিষ্ট মেটা ক্যাম্পেইন ও অ্যাডের সাথে যুক্ত করুন (Lead Attribution Tagger)
                </h4>
                <form
                  onSubmit={handleTagExistingLead}
                  className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
                >
                  <select
                    value={tagLeadId}
                    onChange={(e) => setTagLeadId(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="">— CRM লিড নির্বাচন করুন —</option>
                    {crmLeads.slice(0, 100).map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone}) • {l.status}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="ক্যাম্পেইন নাম (যেমন: Student Visa April 2027)"
                    value={tagCampaignName}
                    onChange={(e) => setTagCampaignName(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="অ্যাড নাম (যেমন: Video Ad - Zero Advance)"
                    value={tagAdName}
                    onChange={(e) => setTagAdName(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Meta Lead ID (ঐচ্ছিক 15/16 digit)"
                    value={tagMetaLeadId}
                    onChange={(e) => setTagMetaLeadId(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={taggingLead}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {taggingLead ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Link2 className="h-3.5 w-3.5" />
                    )}
                    অ্যাট্রিবিউট ও CAPI সিঙ্ক করুন
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 3: FACEBOOK PAGE INSTANT LEAD FORMS & 1-CLICK PULL     */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "LEAD_FORMS_PULL" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      ফেসবুক পেজের Instant Lead Forms ও ১-ক্লিক লিড ইমপোর্ট
                    </h3>
                    <p className="text-xs text-slate-500">
                      আপনার ফেসবুক পেজের অধীনে থাকা সব Lead Generation ফর্ম এখানে দেখাবে। ১ ক্লিকে যেকোনো ফর্মের সব লিড সরাসরি আপনার CRM ও গুগল শিটে টেনে আনুন।
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSubscribePageWebhook(config.pageId)}
                      disabled={subscribingPage}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                    >
                      {subscribingPage ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Webhook className="h-3.5 w-3.5" />
                      )}
                      Enable Auto-Webhook (`leadgen`)
                    </button>

                    {leadForms.length > 0 && (
                      <button
                        onClick={() => handlePullLeadsFromForm("ALL")}
                        disabled={pullingFormId === "ALL"}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {pullingFormId === "ALL" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        সব ফর্মের লিড একসাথে CRM-এ আনুন
                      </button>
                    )}
                  </div>
                </div>

                {leadForms.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                          <th className="px-4 py-3">লিড ফর্মের নাম ও ID</th>
                          <th className="px-4 py-3">ফেসবুক পেজ</th>
                          <th className="px-4 py-3">স্ট্যাটাস</th>
                          <th className="px-4 py-3 text-right">মোট লিড সংখ্যা</th>
                          <th className="px-4 py-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leadForms.map((form) => (
                          <tr key={form.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">{form.name}</div>
                              <div className="font-mono text-[10px] text-slate-400">
                                Form ID: {form.id}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{form.pageName}</td>
                            <td className="px-4 py-3">
                              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                {form.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 tabular-nums">
                              {form.leadsCount}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() =>
                                  handlePullLeadsFromForm(form.id, form.pageId)
                                }
                                disabled={pullingFormId === form.id}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                              >
                                {pullingFormId === form.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}
                                লিডগুলো CRM-এ আনুন
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-xs text-slate-600">
                    আপনার ফেসবুক পেজের Instant Lead Form গুলো লোড করতে প্রথমে{" "}
                    <strong>“১. Meta App ও ১-ক্লিক কানেকশন”</strong> ট্যাব থেকে মেটা অ্যাপ কানেক্ট করুন।
                  </div>
                )}
              </div>

              {/* Webhook Details & Manual Lead Entry */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Meta Developer Webhook (`leadgen`) সেটিংস
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-slate-500">
                        Webhook Callback URL
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={webhookCallbackUrl}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800"
                        />
                        <button
                          onClick={() => handleCopy("webhook_url", webhookCallbackUrl)}
                          className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          {copiedKey === "webhook_url" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-slate-500">
                        Verify Token (`hub.verify_token`)
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={config.webhookVerifyToken}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800"
                        />
                        <button
                          onClick={() =>
                            handleCopy("verify_token", config.webhookVerifyToken)
                          }
                          className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          {copiedKey === "verify_token" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      মেটা লিড এন্ট্রি ও Instant CAPI ট্রিগার
                    </h3>
                  </div>
                  <form onSubmit={handleImportMetaLead} className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        placeholder="প্রার্থীর নাম *"
                        value={newMetaLead.name}
                        onChange={(e) =>
                          setNewMetaLead({ ...newMetaLead, name: e.target.value })
                        }
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                      />
                      <input
                        type="text"
                        required
                        placeholder="ফোন নম্বর *"
                        value={newMetaLead.phone}
                        onChange={(e) =>
                          setNewMetaLead({ ...newMetaLead, phone: e.target.value })
                        }
                        className="rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="ক্যাম্পেইন নাম"
                        value={newMetaLead.metaCampaignName}
                        onChange={(e) =>
                          setNewMetaLead({
                            ...newMetaLead,
                            metaCampaignName: e.target.value,
                          })
                        }
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="অ্যাড নাম"
                        value={newMetaLead.metaAdName}
                        onChange={(e) =>
                          setNewMetaLead({
                            ...newMetaLead,
                            metaAdName: e.target.value,
                          })
                        }
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={importingLead}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {importingLead ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      CRM-এ লিড যুক্ত করুন ও মেটায় CAPI সিগন্যাল পাঠান
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 4: FACEBOOK PAGE POSTS & COMMENTS MONITOR              */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "PAGE_POSTS_COMMENTS" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ফেসবুক পেজ পোস্ট, এনগেজমেন্ট ও কমেন্ট মনিটরিং
                  </h3>
                  <p className="text-xs text-slate-500">
                    পেজের প্রকাশিত পোস্ট, লাইক, শেয়ার ও শিক্ষার্থীদের কমেন্ট ড্যাশবোর্ড থেকে দেখুন এবং ১ ক্লিকে কমেন্টকারীকে CRM লিড হিসেবে যুক্ত করুন।
                  </p>
                </div>
                <button
                  onClick={handleSyncPagePosts}
                  disabled={syncingPosts}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {syncingPosts ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  ফেসবুক পেজ পোস্ট ও কমেন্ট লোড করুন
                </button>
              </div>

              {pagePosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center text-xs text-slate-500">
                  এখনও কোনো পেজ পোস্ট লোড করা হয়নি। মেটা অ্যাপ কানেক্ট করে উপরের{" "}
                  <strong>“ফেসবুক পেজ পোস্ট ও কমেন্ট লোড করুন”</strong> বাটনে ক্লিক করুন।
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {pagePosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        {post.fullPicture && (
                          <img
                            src={post.fullPicture}
                            alt="Post media"
                            referrerPolicy="no-referrer"
                            className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">
                              {post.pageName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {new Date(post.createdTime).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-700 line-clamp-3">
                            {post.message}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-[11px] font-semibold text-slate-500 tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3 text-blue-600" />
                              {post.likesCount} Likes
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-emerald-600" />
                              {post.commentsCount} Comments
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Share2 className="h-3 w-3 text-indigo-600" />
                              {post.sharesCount} Shares
                            </span>
                          </div>
                        </div>
                      </div>

                      {post.comments.length > 0 && (
                        <div className="border-t border-slate-200/80 pt-3 space-y-2">
                          <div className="text-[11px] font-bold text-slate-600">
                            সাম্প্রতিক কমেন্টসমূহ:
                          </div>
                          {post.comments.slice(0, 5).map((c) => (
                            <div
                              key={c.id}
                              className="flex items-center justify-between gap-2 rounded-lg bg-white p-2 text-xs border border-slate-100"
                            >
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900">
                                  {c.fromName}:
                                </span>{" "}
                                <span className="text-slate-600">{c.message}</span>
                              </div>
                              <button
                                onClick={() => {
                                  setNewMetaLead({
                                    ...newMetaLead,
                                    name: c.fromName,
                                    metaCampaignName: "Facebook Page Comment",
                                    metaAdName: post.message.slice(0, 40),
                                  });
                                  setMetaSubView("LEAD_FORMS_PULL");
                                  showToast(
                                    "success",
                                    `"${c.fromName}"-এর তথ্য ফর্মে নেওয়া হয়েছে। ফোন নম্বর দিয়ে সেভ করুন।`,
                                  );
                                }}
                                className="shrink-0 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
                              >
                                + CRM Lead
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 5: CRM STAGE -> META EVENT MAPPING                     */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "STAGE_MAPPING" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    KNLTC CRM ফানেল স্টেজ ➔ Meta Conversions API ইভেন্ট ম্যাপিং
                  </h3>
                  <p className="text-xs text-slate-500">
                    আপনার CRM-এর প্রতিটি স্টেজ মেটার স্ট্যান্ডার্ড ইভেন্টের সাথে ম্যাপ করা হয়েছে।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBatchSyncAllLeads}
                    disabled={batchSyncing}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Batch Sync All CRM Leads
                  </button>
                  <button
                    onClick={() => handleSaveConfig()}
                    disabled={savingConfig}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    ম্যাপিং সেভ করুন
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                      <th className="px-4 py-3">CRM Funnel Stage</th>
                      <th className="px-4 py-3">Meta CAPI `event_name`</th>
                      <th className="px-4 py-3">বিবরণ (কখন ট্রিগার হয়)</th>
                      <th className="px-4 py-3 text-center">অটো-ট্রিগার</th>
                      <th className="px-4 py-3 text-right">টেস্ট ট্রিগার</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(config.stageMappings || []).map((m, idx) => (
                      <tr key={m.crmStage} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          {m.crmStage}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={m.metaEventName}
                            onChange={(e) => {
                              const next = [...config.stageMappings];
                              next[idx] = { ...m, metaEventName: e.target.value };
                              setConfig({ ...config, stageMappings: next });
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-xs font-bold text-blue-700"
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="font-medium text-slate-800">{m.descriptionBn}</div>
                          <div className="text-[11px] text-slate-400">{m.descriptionEn}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={m.enabled}
                            onChange={(e) => {
                              const next = [...config.stageMappings];
                              next[idx] = { ...m, enabled: e.target.checked };
                              setConfig({ ...config, stageMappings: next });
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleSendTestEvent(m.crmStage)}
                            disabled={sendingTestEvent}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Play className="h-3 w-3" />
                            Fire `{m.metaEventName}`
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 6: CAPI EVENT DELIVERY LOGS & PAYLOAD INSPECTOR        */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "DELIVERY_LOGS" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Meta Conversions API (CAPI) ইভেন্ট ডেলিভারি লগ
                    </h3>
                    <p className="text-xs text-slate-500">
                      CRM থেকে মেটা Dataset ({config.datasetId})-এ পাঠানো প্রতিটি লিড স্টেজ ইভেন্টের রিয়েল-টাইম স্ট্যাটাস।
                    </p>
                  </div>
                  <button
                    onClick={() => fetchHubData(false)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    রিফ্রেশ
                  </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                  {capiLogs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-500">
                      এখনও কোনো CAPI ইভেন্ট লগ নেই। যেকোনো লিডের স্টেজ পরিবর্তন করুন অথবা টেস্ট ইভেন্ট পাঠান।
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                          <th className="px-3 py-2.5">সময়</th>
                          <th className="px-3 py-2.5">লিড ও ফোন</th>
                          <th className="px-3 py-2.5">CRM স্টেজ ➔ Meta Event</th>
                          <th className="px-3 py-2.5">স্ট্যাটাস</th>
                          <th className="px-3 py-2.5 text-right">পে-লোড</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {capiLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500 tabular-nums">
                              {new Date(log.timestamp).toLocaleTimeString("en-BD", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="font-bold text-slate-900">{log.leadName}</div>
                              <div className="font-mono text-[10px] text-slate-500 tabular-nums">
                                {log.leadPhone}
                              </div>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="font-mono text-[11px] text-slate-600">
                                {log.crmStage}
                              </span>{" "}
                              ➔{" "}
                              <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-blue-700">
                                {log.metaEventName}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  log.status === "DELIVERED"
                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : log.status === "READY_AWAITING_TOKEN"
                                      ? "border border-amber-200 bg-amber-50 text-amber-700"
                                      : "border border-rose-200 bg-rose-50 text-rose-700"
                                }`}
                              >
                                {log.status === "DELIVERED"
                                  ? "DELIVERED (200)"
                                  : log.status === "READY_AWAITING_TOKEN"
                                    ? "QUEUED (ADD TOKEN)"
                                    : "FAILED"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <button
                                onClick={() => setSelectedPayloadLog(log)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                              >
                                JSON দেখুন
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-slate-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  CAPI Event JSON Payload Inspector
                </div>
                {selectedPayloadLog ? (
                  <div className="mt-3 space-y-3">
                    <div className="text-xs text-slate-300">
                      <strong>Lead:</strong> {selectedPayloadLog.leadName} (
                      {selectedPayloadLog.metaEventName})
                    </div>
                    {selectedPayloadLog.errorMessage && (
                      <div className="rounded-lg bg-amber-500/20 p-2.5 text-[11px] text-amber-200">
                        {selectedPayloadLog.errorMessage}
                      </div>
                    )}
                    <pre className="max-h-96 overflow-auto rounded-xl bg-black/60 p-3 font-mono text-[11px] text-emerald-300">
                      {JSON.stringify(selectedPayloadLog.payloadPreview, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="mt-8 text-center text-xs text-slate-400">
                    বাম পাশের তালিকা থেকে যেকোনো ইভেন্টের <strong>“JSON দেখুন”</strong> বাটনে ক্লিক করলে SHA-256 হ্যাশকৃত পে-লোড এখানে দেখা যাবে।
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* PLATFORM 2: GOOGLE ADS & SEARCH CONSOLE HUB                           */}
      {/* ===================================================================== */}
      {activePlatform === "GOOGLE_ADS" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Google Ads & Offline Conversion Tracking (GCLID / Enhanced Conversions)
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Google Ads Customer ID
                </label>
                <input
                  type="text"
                  placeholder="123-456-7890"
                  value={config.googleAdsCustomerId || ""}
                  onChange={(e) =>
                    setConfig({ ...config, googleAdsCustomerId: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Conversion ID (`AW-...`)
                </label>
                <input
                  type="text"
                  placeholder="AW-1122334455"
                  value={config.googleAdsConversionId || ""}
                  onChange={(e) =>
                    setConfig({ ...config, googleAdsConversionId: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Conversion Label
                </label>
                <input
                  type="text"
                  placeholder="AbCdEfGhIjKlMnOp"
                  value={config.googleAdsConversionLabel || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      googleAdsConversionLabel: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
            </div>
            <button
              onClick={() => handleSaveConfig()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              Google Ads কনফিগারেশন সেভ করুন
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              ওয়েবসাইট ও গুগল সার্চ লিড সামারি
            </h4>
            <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-xs tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-600">মোট ওয়েবসাইট পোর্টাল লিড:</span>
                <strong className="text-slate-900">{websiteLeads.length} জন</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">কাউন্সেলিং সম্পন্ন (Qualified):</span>
                <strong className="text-emerald-700">
                  {
                    websiteLeads.filter((l) =>
                      ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(
                        l.status,
                      ),
                    ).length
                  }{" "}
                  জন
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">চূড়ান্ত ভর্তি (Admitted):</span>
                <strong className="text-blue-700">
                  {websiteLeads.filter((l) => l.status === "ADMITTED").length} জন
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PLATFORM 3: YOUTUBE CHANNEL & VIDEO CONTENT MONITOR                   */}
      {/* ===================================================================== */}
      {activePlatform === "YOUTUBE" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">
              YouTube চ্যানেল ও ভিডিও কনটেন্ট মনিটরিং ({config.youtubeChannelHandle || "@knltc"})
            </h3>
          </div>
          <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                YouTube Channel Handle
              </label>
              <input
                type="text"
                value={config.youtubeChannelHandle || "@knltc"}
                onChange={(e) =>
                  setConfig({ ...config, youtubeChannelHandle: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                YouTube Channel ID
              </label>
              <input
                type="text"
                placeholder="UC..."
                value={config.youtubeChannelId || ""}
                onChange={(e) =>
                  setConfig({ ...config, youtubeChannelId: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
              />
            </div>
          </div>
          <button
            onClick={() => handleSaveConfig()}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
          >
            YouTube সেটিংস সংরক্ষণ করুন
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PLATFORM 4: GOOGLE BUSINESS PROFILE (DHAKA HQ & KHULNA BRANCH)        */}
      {/* ===================================================================== */}
      {activePlatform === "GBP" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                ঢাকা হেড অফিস (DHK-HQ)
              </span>
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              KNLTC Dhaka HQ • নয়া পল্টন, ভিআইপি রোড
            </h4>
            <p className="text-xs text-slate-500">
              স্কাই ভিউ ট্রেড ভ্যালি (৮ম তলা), ৬৬/১ ভিআইপি রোড, নয়া পল্টন, ঢাকা-১০০০
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs tabular-nums">
              <span>ঢাকা শাখার মোট CRM লিড:</span>
              <strong className="text-sm text-slate-900">{dhakaLeads.length} জন</strong>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                খুলনা শাখা (KHULNA-01)
              </span>
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              KNLTC Khulna Branch • শিববাড়ি মোড়, খুলনা
            </h4>
            <p className="text-xs text-slate-500">
              কেডিএ এভিনিউ, শিববাড়ি মোড়, সোনাডাঙ্গা, খুলনা
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs tabular-nums">
              <span>খুলনা শাখার মোট CRM লিড:</span>
              <strong className="text-sm text-slate-900">{khulnaLeads.length} জন</strong>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PLATFORM 5: WEBSITE BLOG & SEO CONTENT MONITOR                        */}
      {/* ===================================================================== */}
      {activePlatform === "BLOG_SEO" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ওয়েবসাইট ব্লগ, ল্যান্ডিং পেজ এবং SEO কনটেন্ট মনিটর
              </h3>
              <p className="text-xs text-slate-500">
                ওয়েবসাইটে প্রকাশিত সকল ব্লগ আর্টিকেল ও মূল ল্যান্ডিং পেজগুলোর লাইভ তালিকা।
              </p>
            </div>
            {onSwitchDashboardTab && (
              <button
                onClick={() => onSwitchDashboardTab("store_blog")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <FileText className="h-3.5 w-3.5" />
                নতুন ব্লগ পোস্ট লিখুন / এডিট করুন
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                  <th className="px-4 py-3">ব্লগ শিরোনাম / পেজ</th>
                  <th className="px-4 py-3">ক্যাটাগরি</th>
                  <th className="px-4 py-3">URL Slug</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-blue-50/30">
                  <td className="px-4 py-3 font-bold text-slate-900">
                    JFT-Basic & Irodori Special Course Enrollment Page
                  </td>
                  <td className="px-4 py-3 text-slate-600">Core Conversion Page</td>
                  <td className="px-4 py-3 font-mono text-blue-600">
                    /japanese-language/enroll/jft-irodori
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      LIVE • META PIXEL + CAPI ACTIVE
                    </span>
                  </td>
                </tr>
                {blogPosts.map((post: any, i: number) => (
                  <tr key={post.id || i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {post.title_bn || post.title_en || post.title || "Blog Article"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {post.category || "Study in Japan"}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      /blog/{post.slug || post.id}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        PUBLISHED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
