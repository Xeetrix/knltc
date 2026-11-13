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
  Filter,
  Globe,
  Layers,
  Link2,
  Loader2,
  MapPin,
  Megaphone,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Video,
  Webhook,
  Zap,
  AlertCircle,
  Check,
} from "lucide-react";
import type { CrmLead } from "@/lib/knltc-cms-store";

interface StageMapping {
  crmStage: string;
  metaEventName: string;
  descriptionBn: string;
  descriptionEn: string;
  enabled: boolean;
}

interface MetaConfig {
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
}

interface MarketingOmniChannelHubProps {
  crmLeads: CrmLead[];
  onRefreshStore?: () => void;
  onOpenLeadProfile?: (lead: CrmLead) => void;
  onSwitchDashboardTab?: (tabId: any) => void;
}

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
    "CAMPAIGNS_ADS" | "CAPI_SETUP" | "STAGE_MAPPING" | "WEBHOOK_LEAD_PULL" | "DELIVERY_LOGS"
  >("CAMPAIGNS_ADS");

  const [drilldownTab, setDrilldownTab] = useState<
    "CAMPAIGNS" | "ADSETS" | "ADS" | "ATTRIBUTED_LEADS"
  >("CAMPAIGNS");

  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [syncingGraph, setSyncingGraph] = useState(false);
  const [sendingTestEvent, setSendingTestEvent] = useState(false);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "warn" | "error";
    text: string;
  } | null>(null);

  const [config, setConfig] = useState<MetaConfig>({
    datasetId: "1061685489662581",
    apiVersion: "v22.0",
    businessName: "KNLTC",
    leadEventSource: "KNLTC CRM",
    accessToken: "",
    adAccountId: "",
    pageId: "",
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

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [adSets, setAdSets] = useState<AdSetItem[]>([]);
  const [ads, setAds] = useState<AdItem[]>([]);
  const [capiLogs, setCapiLogs] = useState<CapiLogItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [selectedPayloadLog, setSelectedPayloadLog] = useState<CapiLogItem | null>(null);
  const [lastGraphSyncAt, setLastGraphSyncAt] = useState<string | null>(null);

  // Quick Lead Import / Attribution Form State
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

  const showToast = (type: "success" | "warn" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 5000);
  };

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
        if (Array.isArray(json.campaigns)) setCampaigns(json.campaigns);
        if (Array.isArray(json.adSets)) setAdSets(json.adSets);
        if (Array.isArray(json.ads)) setAds(json.ads);
        if (Array.isArray(json.capiLogs)) setCapiLogs(json.capiLogs);
        if (Array.isArray(json.blogPosts)) setBlogPosts(json.blogPosts);
        if (json.lastGraphSyncAt) setLastGraphSyncAt(json.lastGraphSyncAt);
      }
    } catch (err) {
      console.warn("[MarketingHub] Failed to load hub data:", err);
    } finally {
      setLoading(false);
      setSyncingGraph(false);
    }
  }, []);

  useEffect(() => {
    fetchHubData(false);
    const onCapiEvent = () => fetchHubData(false);
    window.addEventListener("knltc-meta-capi-sent", onCapiEvent);
    return () => window.removeEventListener("knltc-meta-capi-sent", onCapiEvent);
  }, [fetchHubData]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const res = await fetch("/api/admin/meta-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SAVE_CONFIG",
          config,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setConfig(json.config);
        if (json.liveSyncResult?.campaigns) {
          setCampaigns(json.liveSyncResult.campaigns);
          setAdSets(json.liveSyncResult.adSets || []);
          setAds(json.liveSyncResult.ads || []);
        }
        showToast(
          "success",
          "মেটা কনভার্সন এপিআই (Dataset 1061685489662581) ও মার্কেটিং হাব সেটিংস সংরক্ষিত হয়েছে!",
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
            `CAPI পে-লোড প্রস্তুত ও লগ করা হয়েছে (${json.logEntry.metaEventName})। লাইভ পাঠাতে Dataset Access Token যুক্ত করুন।`,
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
      if (json.connectedToGraphApi) {
        setLastGraphSyncAt(new Date().toISOString());
        showToast(
          "success",
          `মেটা অ্যাড অ্যাকাউন্ট থেকে ${json.campaigns?.length || 0}টি ক্যাম্পেইন এবং ${json.ads?.length || 0}টি অ্যাড সিঙ্ক হয়েছে!`,
        );
      } else {
        showToast(
          "warn",
          json.errorMessage ||
            "মেটা অ্যাড অ্যাকাউন্ট থেকে লাইভ ক্যাম্পেইন আনতে Access Token ও Ad Account ID দিন।",
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

  // Compute live attribution metrics from crmLeads prop
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

  // Group CRM leads by campaign / ad name so user sees attribution even before live Graph sync
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

  const capiEndpointUrl = `https://graph.facebook.com/${config.apiVersion || "v22.0"}/${config.datasetId || "1061685489662581"}/events`;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${
            toastMsg.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-200"
              : toastMsg.type === "warn"
                ? "border-amber-500/40 bg-amber-950/90 text-amber-200"
                : "border-rose-500/40 bg-rose-950/90 text-rose-200"
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

      {/* Top Executive Header & Meta Opportunity Score Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                <Megaphone className="h-3.5 w-3.5" />
                OMNI-CHANNEL MARKETING & CRM CAPI HUB
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 tabular-nums">
                <TrendingUp className="h-3.5 w-3.5" />
                Meta Opportunity: -18.4% Cost Per Quality Lead
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 tabular-nums">
                Dataset ID: {config.datasetId || "1061685489662581"}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              মার্কেটিং, মেটা অ্যাডস ও অমনি-চ্যানেল কমান্ড সেন্টার
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              কোন ক্যাম্পেইন ও কোন অ্যাড থেকে কোন লিড আসছে তা রিয়েল-টাইমে ট্র্যাক করুন এবং CRM থেকে লিডের স্টেজ পরিবর্তন হলে স্বয়ংক্রিয়ভাবে মেটা Conversions API-তে সিগন্যাল পাঠিয়ে কোয়ালিটি অডিয়েন্স টার্গেট করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleSendTestEvent("COUNSELED")}
              disabled={sendingTestEvent}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >
              {sendingTestEvent ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Test CRM Event
            </button>
            <button
              onClick={handleSyncLiveCampaigns}
              disabled={syncingGraph}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {syncingGraph ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              মেটা ক্যাম্পেইন ও অ্যাড সিঙ্ক করুন
            </button>
          </div>
        </div>

        {/* 4-Card KPI Strip */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>META DATASET & CAPI ENGINE</span>
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {config.datasetId || "1061685489662581"}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  config.accessToken || config.hasAccessToken
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    config.accessToken || config.hasAccessToken
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                />
                {config.accessToken || config.hasAccessToken
                  ? "Graph API v22.0 Active"
                  : "Payload Ready • Add Token"}
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
              <span>ACTIVE CAMPAIGNS & BLOG SEO</span>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-2xl font-bold text-slate-900">
                {campaigns.length > 0 ? campaigns.length : derivedCampaignGroups.length}
              </span>
              <span className="text-xs text-slate-500">ক্যাম্পেইন গ্রুপ</span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600 tabular-nums">
              ওয়েবসাইট ব্লগ পোস্ট: <strong>{blogPosts.length}টি</strong> • ওয়েব লিড:{" "}
              <strong>{websiteLeads.length}টি</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Omni-Channel Platform Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          {
            id: "META",
            labelBn: "১. Meta Ads & CRM CAPI (Live)",
            badge: "Dataset 1061685489662581",
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
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono tabular-nums ${
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
      {/* PLATFORM 1: META ADS & CRM CONVERSIONS API (CAPI)                     */}
      {/* ===================================================================== */}
      {activePlatform === "META" && (
        <div className="space-y-6">
          {/* Sub-Navigation for Meta Command Center */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                {
                  id: "CAMPAIGNS_ADS",
                  label: "ক্যাম্পেইন ➔ অ্যাড ➔ লিড ট্র্যাকার",
                  icon: Layers,
                },
                {
                  id: "CAPI_SETUP",
                  label: "Meta CAPI সংযোগ ও অ্যাক্সেস টোকেন",
                  icon: Settings,
                },
                {
                  id: "STAGE_MAPPING",
                  label: "CRM স্টেজ ➔ মেটা ইভেন্ট ম্যাপিং",
                  icon: Activity,
                },
                {
                  id: "WEBHOOK_LEAD_PULL",
                  label: "লিড ফর্ম ওয়েবহুক ও লিড ইমপোর্ট",
                  icon: Webhook,
                },
                {
                  id: "DELIVERY_LOGS",
                  label: `CAPI ইভেন্ট লগ (${capiLogs.length})`,
                  icon: Terminal,
                },
              ].map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = metaSubView === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setMetaSubView(sub.id as any)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
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

            <button
              onClick={handleBatchSyncAllLeads}
              disabled={batchSyncing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            >
              {batchSyncing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Zap className="h-3.5 w-3.5" />
              )}
              সকল লিডের স্টেজ মেটায় পাঠান (Batch CAPI)
            </button>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 1: CAMPAIGNS -> AD SETS -> ADS -> CRM LEADS            */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "CAMPAIGNS_ADS" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      রিয়েল-টাইম মেটা ক্যাম্পেইন, অ্যাড সেট, অ্যাড এবং লিড অ্যাট্রিবিউশন
                    </h3>
                    <p className="text-xs text-slate-500">
                      কোন ক্যাম্পেইনের অধীনে কোন অ্যাড চলছে এবং কোন অ্যাড থেকে কতজন লিড এসে যোগ্য (Qualified) বা ভর্তি (Admitted) হয়েছে তার সম্পূর্ণ চিত্র।
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "CAMPAIGNS", label: `ক্যাম্পেইন (${campaigns.length || derivedCampaignGroups.length})` },
                      { id: "ADSETS", label: `অ্যাড সেট (${adSets.length})` },
                      { id: "ADS", label: `অ্যাডস (${ads.length})` },
                      { id: "ATTRIBUTED_LEADS", label: `মেটা লিড তালিকা (${metaLeads.length})` },
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

                {/* Live Graph Campaigns Table OR CRM-Derived Campaign Breakdown */}
                {drilldownTab === "CAMPAIGNS" && (
                  <div className="mt-4 overflow-x-auto">
                    {campaigns.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                            <th className="px-4 py-3">ক্যাম্পেইন নাম ও ID</th>
                            <th className="px-4 py-3">স্ট্যাটাস</th>
                            <th className="px-4 py-3">অবজেক্টিভ</th>
                            <th className="px-4 py-3 text-right">ব্যয় (Spend)</th>
                            <th className="px-4 py-3 text-right">Impr. / Clicks</th>
                            <th className="px-4 py-3 text-right">Meta Leads</th>
                            <th className="px-4 py-3 text-right">CRM লিড</th>
                            <th className="px-4 py-3 text-right">Qualified (CAPI)</th>
                            <th className="px-4 py-3 text-right">ভর্তি (Admitted)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {campaigns.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/80">
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-900">{c.name}</div>
                                <div className="font-mono text-[11px] text-slate-400 tabular-nums">
                                  ID: {c.id}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                    c.effectiveStatus === "ACTIVE"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {c.effectiveStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                                {c.objective}
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
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="space-y-4">
                        {!config.accessToken && !config.hasAccessToken && (
                          <div className="flex flex-col justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 sm:flex-row sm:items-center">
                            <div className="text-xs text-blue-900">
                              <strong>লাইভ মেটা অ্যাড অ্যাকাউন্ট সংযোগ:</strong> আপনার CRM-এ বর্তমানে{" "}
                              <strong>{metaLeads.length} জন ফেসবুক/মেটা লিড</strong> রয়েছে। মেটা অ্যাড ম্যানেজারের লাইভ Spend, Impressions ও Clicks দেখতে{" "}
                              <strong>“Meta CAPI সংযোগ ও অ্যাক্সেস টোকেন”</strong> ট্যাবে গিয়ে আপনার Access Token ও Ad Account ID যুক্ত করুন।
                            </div>
                            <button
                              onClick={() => setMetaSubView("CAPI_SETUP")}
                              className="shrink-0 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                            >
                              Access Token যুক্ত করুন
                            </button>
                          </div>
                        )}

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
                                <td className="px-4 py-3 text-slate-600">
                                  {grp.adName}
                                </td>
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

                {/* AD SETS TABLE */}
                {drilldownTab === "ADSETS" && (
                  <div className="mt-4 overflow-x-auto">
                    {adSets.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                            <th className="px-4 py-3">অ্যাড সেট নাম</th>
                            <th className="px-4 py-3">ক্যাম্পেইন</th>
                            <th className="px-4 py-3">স্ট্যাটাস</th>
                            <th className="px-4 py-3">অপ্টিমাইজেশন গোল</th>
                            <th className="px-4 py-3 text-right">Spend</th>
                            <th className="px-4 py-3 text-right">Impressions</th>
                            <th className="px-4 py-3 text-right">Clicks</th>
                            <th className="px-4 py-3 text-right">Leads</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adSets.map((as) => (
                            <tr key={as.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-bold text-slate-900">
                                {as.name}
                                <div className="font-mono text-[10px] text-slate-400">
                                  ID: {as.id}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">{as.campaignName}</td>
                              <td className="px-4 py-3">
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                  {as.effectiveStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                                {as.optimizationGoal || "QUALITY_LEAD"}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                                {as.spend.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono tabular-nums">
                                {as.impressions.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-mono tabular-nums">
                                {as.clicks.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 tabular-nums">
                                {as.leadsCount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        লাইভ অ্যাড সেট দেখতে মেটা Access Token যুক্ত করে “মেটা ক্যাম্পেইন ও অ্যাড সিঙ্ক করুন” বাটনে ক্লিক করুন।
                      </div>
                    )}
                  </div>
                )}

                {/* ADS TABLE */}
                {drilldownTab === "ADS" && (
                  <div className="mt-4 overflow-x-auto">
                    {ads.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                            <th className="px-4 py-3">অ্যাড নাম (Ad Creative)</th>
                            <th className="px-4 py-3">ক্যাম্পেইন ও অ্যাড সেট</th>
                            <th className="px-4 py-3">স্ট্যাটাস</th>
                            <th className="px-4 py-3 text-right">Spend</th>
                            <th className="px-4 py-3 text-right">Clicks / CTR</th>
                            <th className="px-4 py-3 text-right">Meta Leads</th>
                            <th className="px-4 py-3 text-right">CRM লিড</th>
                            <th className="px-4 py-3 text-right">Qualified</th>
                            <th className="px-4 py-3 text-right">Admitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {ads.map((ad) => (
                            <tr key={ad.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-bold text-slate-900">
                                {ad.name}
                                <div className="font-mono text-[10px] text-slate-400">
                                  Ad ID: {ad.id}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                <div className="font-semibold text-slate-800">{ad.campaignName}</div>
                                <div className="text-[11px] text-slate-400">{ad.adSetName}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                    ad.effectiveStatus === "ACTIVE"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {ad.effectiveStatus}
                                </span>
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
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        লাইভ অ্যাড পারফরম্যান্স দেখতে মেটা Access Token যুক্ত করে সিঙ্ক করুন।
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
                              <span className="inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
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
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900"
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
          {/* SUB-VIEW 2: META CAPI SETUP & CREDENTIALS (`1061685489662581`)   */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "CAPI_SETUP" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Meta Conversions API (CRM) ও Graph API কনফিগারেশন
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    আপনার মেটা ইভেন্টস ম্যানেজারের স্ক্রিনশট অনুযায়ী Dataset ID{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-blue-700">
                      1061685489662581
                    </code>{" "}
                    এবং Graph API{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold">
                      v22.0
                    </code>{" "}
                    প্রি-কনফিগার করা হয়েছে।
                  </p>
                </div>

                {/* Official Meta CAPI Endpoint Preview */}
                <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>OFFICIAL META CAPI ENDPOINT (STEP 3 IN EVENTS MANAGER)</span>
                    <button
                      onClick={() => handleCopy("endpoint", `${capiEndpointUrl}?access_token=ACCESS_TOKEN`)}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      {copiedKey === "endpoint" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      Copy URL
                    </button>
                  </div>
                  <div className="mt-1.5 break-all font-mono text-xs text-emerald-400">
                    POST {capiEndpointUrl}?access_token=ACCESS_TOKEN
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Meta Dataset ID (Pixel / CRM Dataset)
                    </label>
                    <input
                      type="text"
                      value={config.datasetId}
                      onChange={(e) =>
                        setConfig({ ...config, datasetId: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Graph API Version
                    </label>
                    <input
                      type="text"
                      value={config.apiVersion}
                      onChange={(e) =>
                        setConfig({ ...config, apiVersion: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Meta Dataset / System User Access Token (Events Manager ➔ Generate Access Token)
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showToken ? "text" : "password"}
                        placeholder="EAABsbCS1iHgBO..."
                        value={config.accessToken}
                        onChange={(e) =>
                          setConfig({ ...config, accessToken: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 py-2 pl-3.5 pr-10 text-xs font-mono text-slate-900"
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
                    <p className="mt-1 text-[11px] text-slate-500">
                      মেটা ইভেন্টস ম্যানেজারের “3. Create endpoint” অংশে থাকা <strong>Generate Access Token</strong> বাটনে ক্লিক করে টোকেনটি কপি করে এখানে পেস্ট করুন।
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Meta Ad Account ID (লাইভ ক্যাম্পেইন দেখার জন্য)
                    </label>
                    <input
                      type="text"
                      placeholder="act_1234567890 (ফাঁকা রাখলে টোকেন থেকে অটো-ডিসকভার হবে)"
                      value={config.adAccountId}
                      onChange={(e) =>
                        setConfig({ ...config, adAccountId: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Test Event Code (ঐচ্ছিক - যেমন: TEST12345)
                    </label>
                    <input
                      type="text"
                      placeholder="TEST..."
                      value={config.testEventCode}
                      onChange={(e) =>
                        setConfig({ ...config, testEventCode: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Lead Event Source Name (`lead_event_source`)
                    </label>
                    <input
                      type="text"
                      value={config.leadEventSource}
                      onChange={(e) =>
                        setConfig({ ...config, leadEventSource: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <input
                      id="autoSyncStages"
                      type="checkbox"
                      checked={config.autoSyncCrmStages}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          autoSyncCrmStages: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <label
                      htmlFor="autoSyncStages"
                      className="text-xs font-bold text-slate-800"
                    >
                      CRM-এ লিডের স্টেজ পরিবর্তন হলে স্বয়ংক্রিয়ভাবে মেটা CAPI-তে পাঠান
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveConfig}
                    disabled={savingConfig}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {savingConfig ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    কনফিগারেশন সংরক্ষণ ও কানেক্ট করুন
                  </button>
                  <button
                    onClick={() => handleSendTestEvent("COUNSELED")}
                    disabled={sendingTestEvent}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Send className="h-3.5 w-3.5 text-blue-600" />
                    টেস্ট ইভেন্ট পাঠান (Step 4 Verify)
                  </button>
                </div>
              </div>

              {/* Right Column: Official Meta CRM CAPI Payload Specification */}
              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Meta Official CRM Payload Spec
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    SHA-256 Hashed
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  আপনার স্ক্রিনশটে দেখানো মেটার নিয়ম অনুযায়ী প্রতিটি ইভেন্টে নিচের প্যারামিটারগুলো স্বয়ংক্রিয়ভাবে পাঠানো হয়:
                </p>
                <pre className="overflow-x-auto rounded-xl bg-black/50 p-3.5 font-mono text-[11px] leading-relaxed text-emerald-300">
{`{
  "data": [
    {
      "action_source": "system_generated",
      "custom_data": {
        "event_source": "crm",
        "lead_event_source": "${config.leadEventSource || "KNLTC CRM"}"
      },
      "event_name": "QualifiedLead",
      "event_time": ${Math.floor(Date.now() / 1000)},
      "user_data": {
        "em": ["<sha256_hashed_email>"],
        "ph": ["<sha256_hashed_8801...>"],
        "lead_id": 1234567890123456
      }
    }
  ]
}`}
                </pre>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-300 space-y-1.5">
                  <div className="font-bold text-white">কীভাবে কাজ করে?</div>
                  <div>১. লিড ফর্ম বা ওয়েবসাইট থেকে লিড আসলে `Lead` ইভেন্ট যায়।</div>
                  <div>২. কাউন্সেলিং শেষে `COUNSELED` করলে `QualifiedLead` ইভেন্ট যায়।</div>
                  <div>৩. ভর্তি বা ফাইল ওপেন (`ADMITTED`) করলে `Purchase` ইভেন্ট ও চুক্তির টাকা মেটায় যায়।</div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 3: CRM STAGE -> META EVENT MAPPING                     */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "STAGE_MAPPING" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    KNLTC CRM ফানেল স্টেজ ➔ Meta Conversions API ইভেন্ট ম্যাপিং
                  </h3>
                  <p className="text-xs text-slate-500">
                    মেটা যাতে বুঝতে পারে কোন লিডটি প্রকৃত ও যোগ্য (Qualified Lead), সেজন্য আপনার CRM-এর প্রতিটি স্টেজ মেটার স্ট্যান্ডার্ড ইভেন্টের সাথে ম্যাপ করা হয়েছে।
                  </p>
                </div>
                <button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  ম্যাপিং সেভ করুন
                </button>
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
          {/* SUB-VIEW 4: WEBHOOK & DIRECT META LEAD PULL                     */}
          {/* --------------------------------------------------------------- */}
          {metaSubView === "WEBHOOK_LEAD_PULL" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left: Instant Form Webhook Credentials */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Webhook className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Meta Instant Form रीयেল-টাইম ওয়েবহুক (Auto Lead Pull)
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  ফেসবুক ও ইনস্টাগ্রাম লিড অ্যাডের ফর্ম পূরণ করার সাথে সাথে লিড যেন ১ সেকেন্ডে আপনার গুগল শিট ও CRM-এ চলে আসে (কোনো পেইড Zapier ছাড়াই), সেজন্য নিচের Callback URL ও Verify Token ব্যবহার করুন:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Webhook Callback URL (`POST / GET`)
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

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-700 space-y-1.5">
                  <div className="font-bold text-blue-950">
                    মেটায় যুক্ত করার ৩টি সহজ ধাপ:
                  </div>
                  <div>১. Meta Developer App ➔ Webhooks ➔ <strong>Page</strong> সিলেক্ট করুন।</div>
                  <div>২. উপরের Callback URL এবং Verify Token বসিয়ে <strong>Verify and Save</strong> দিন।</div>
                  <div>৩. <strong>`leadgen`</strong> ফিল্ডে Subscribe করুন — এরপর প্রতিটি অ্যাডের লিড সরাসরি CRM-এ চলে আসবে!</div>
                </div>
              </div>

              {/* Right: Manual / Instant Meta Lead Simulator & Importer */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    মেটা লিড এন্ট্রি ও Instant CAPI ট্রিগার (Lead Pull / Test)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  মেটা লিড ফর্মের লিড ম্যানুয়ালি বা টেস্ট হিসেবে এখানে যুক্ত করলে সেটি সাথে সাথে গুগল শিটে (`knltc_crm_leads`) সেভ হবে এবং মেটা Dataset-এ `Lead` ইভেন্ট পাঠাবে।
                </p>

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
                      placeholder="ফোন নম্বর (যেমন: 017...) *"
                      value={newMetaLead.phone}
                      onChange={(e) =>
                        setNewMetaLead({ ...newMetaLead, phone: e.target.value })
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900"
                    />
                    <input
                      type="email"
                      placeholder="ইমেইল (ঐচ্ছিক)"
                      value={newMetaLead.email}
                      onChange={(e) =>
                        setNewMetaLead({ ...newMetaLead, email: e.target.value })
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Meta 15/16-Digit Lead ID (ঐচ্ছিক)"
                      value={newMetaLead.metaLeadId}
                      onChange={(e) =>
                        setNewMetaLead({
                          ...newMetaLead,
                          metaLeadId: e.target.value,
                        })
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900"
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
                      placeholder="অ্যাড নাম (Ad Creative)"
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
          )}

          {/* --------------------------------------------------------------- */}
          {/* SUB-VIEW 5: CAPI EVENT DELIVERY LOGS & PAYLOAD INSPECTOR        */}
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
                      এখনও কোনো CAPI ইভেন্ট লগ নেই। উপরে <strong>“Send Test CRM Event”</strong> বাটনে ক্লিক করুন অথবা যেকোনো লিডের স্টেজ পরিবর্তন করুন।
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
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : log.status === "READY_AWAITING_TOKEN"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
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

              {/* Payload Inspector */}
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
            <p className="text-xs text-slate-600">
              মেটার পর গুগল সার্চ ও ডিসপ্লে অ্যাড সংযুক্ত করার জন্য এখানে আপনার Google Ads Customer ID ও Conversion ID সংরক্ষণ করুন। ওয়েবসাইট ফর্ম থেকে আগত সকল লিড নিচে ট্র্যাক করা হচ্ছে।
            </p>
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
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
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
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
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
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
            <button
              onClick={handleSaveConfig}
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
          <p className="text-xs text-slate-600">
            জাপান স্টুডেন্ট ভিসা, SSW কনস্ট্রাকশন এবং N5/Irodori ভাষা শিক্ষার ভিডিও কনটেন্ট ট্র্যাকিং ও চ্যানেল সেটিংস।
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
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
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
          <button
            onClick={handleSaveConfig}
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
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs tabular-nums">
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
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs tabular-nums">
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
