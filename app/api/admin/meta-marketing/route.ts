import { NextRequest, NextResponse } from "next/server";
import {
  loadMetaMarketingStore,
  saveMetaMarketingStore,
  sendMetaCrmConversionEvent,
  syncLiveMetaCampaignsAndAds,
  discoverMetaAssetsWithToken,
  updateMetaObjectStatusAndBudget,
  syncMetaPageLeadForms,
  pullLeadsFromMetaForm,
  subscribeMetaPageToLeadgenWebhook,
  syncMetaPagePostsAndComments,
  DEFAULT_META_STAGE_MAPPINGS,
} from "@/lib/meta-marketing";
import { fetchAllSheetTables, upsertRow } from "@/lib/google-sheets-db";

export const dynamic = "force-dynamic";

function parseLeadRow(raw: Record<string, any>): Record<string, any> {
  let profile: Record<string, any> = {};
  if (raw.profile_json) {
    try {
      profile =
        typeof raw.profile_json === "string"
          ? JSON.parse(raw.profile_json)
          : raw.profile_json;
    } catch {
      profile = {};
    }
  }
  return {
    ...profile,
    ...raw,
    id: String(raw.id || profile.id || ""),
    name: String(raw.name || profile.name || "Candidate"),
    phone: String(raw.phone || profile.phone || ""),
    whatsapp: String(raw.whatsapp || raw.phone || profile.whatsapp || ""),
    email: String(raw.email || profile.email || ""),
    city: String(raw.city || profile.city || "Dhaka"),
    source: String(raw.source || profile.source || "FACEBOOK_META"),
    interest: String(raw.interest || profile.interest || "STUDENT_VISA_REGULAR"),
    status: String(raw.status || profile.status || "NEW"),
    branch: String(raw.branch || profile.branch || "DHK-HQ"),
    notes: String(raw.notes || profile.notes || ""),
    contractAmountBdt: Number(
      raw.contract_amount_bdt ?? profile.contractAmountBdt ?? 0,
    ),
    metaLeadId: String(profile.metaLeadId || raw.meta_lead_id || ""),
    metaCampaignId: String(profile.metaCampaignId || raw.meta_campaign_id || ""),
    metaCampaignName: String(
      profile.metaCampaignName || raw.meta_campaign_name || "",
    ),
    metaAdSetId: String(profile.metaAdSetId || raw.meta_adset_id || ""),
    metaAdSetName: String(profile.metaAdSetName || raw.meta_adset_name || ""),
    metaAdId: String(profile.metaAdId || raw.meta_ad_id || ""),
    metaAdName: String(profile.metaAdName || raw.meta_ad_name || ""),
    lastCapiEventSent: String(profile.lastCapiEventSent || ""),
    lastCapiSyncedAt: String(profile.lastCapiSyncedAt || ""),
    createdAt: String(
      raw.created_at || profile.createdAt || new Date().toISOString(),
    ),
  };
}

export async function GET(req: NextRequest) {
  try {
    const store = loadMetaMarketingStore();
    const allTables = await fetchAllSheetTables();
    const rawLeads = Array.isArray(allTables.knltc_crm_leads)
      ? allTables.knltc_crm_leads
      : [];
    const crmLeads = rawLeads.map(parseLeadRow);

    const forceLive = req.nextUrl.searchParams.get("liveSync") === "1";
    let graphSyncStatus = {
      connectedToGraphApi: Boolean(store.config.accessToken),
      errorMessage: undefined as string | undefined,
    };

    if (forceLive && store.config.accessToken) {
      await discoverMetaAssetsWithToken();
      const syncResult = await syncLiveMetaCampaignsAndAds(crmLeads);
      graphSyncStatus = {
        connectedToGraphApi: syncResult.connectedToGraphApi,
        errorMessage: syncResult.errorMessage,
      };
    }

    const campaigns = (store.cachedCampaigns || []).map((c) => {
      const matched = crmLeads.filter(
        (l) =>
          l.metaCampaignId === c.id ||
          (l.metaCampaignName &&
            l.metaCampaignName.toLowerCase() === c.name.toLowerCase()) ||
          (l.notes && l.notes.toLowerCase().includes(c.name.toLowerCase())),
      );
      return {
        ...c,
        crmMatchedLeadsCount: matched.length,
        crmQualifiedLeadsCount: matched.filter((l) =>
          ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(
            String(l.status).toUpperCase(),
          ),
        ).length,
        crmAdmittedCount: matched.filter(
          (l) => String(l.status).toUpperCase() === "ADMITTED",
        ).length,
      };
    });

    const ads = (store.cachedAds || []).map((ad) => {
      const matched = crmLeads.filter(
        (l) =>
          l.metaAdId === ad.id ||
          (l.metaAdName &&
            l.metaAdName.toLowerCase() === ad.name.toLowerCase()) ||
          (l.notes && l.notes.toLowerCase().includes(ad.name.toLowerCase())),
      );
      return {
        ...ad,
        crmMatchedLeadsCount: matched.length,
        crmQualifiedLeadsCount: matched.filter((l) =>
          ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(
            String(l.status).toUpperCase(),
          ),
        ).length,
        crmAdmittedCount: matched.filter(
          (l) => String(l.status).toUpperCase() === "ADMITTED",
        ).length,
      };
    });

    const metaSourcedLeads = crmLeads.filter(
      (l) =>
        String(l.source).toUpperCase().includes("FACEBOOK") ||
        String(l.source).toUpperCase().includes("META") ||
        Boolean(l.metaCampaignName) ||
        Boolean(l.metaAdName) ||
        Boolean(l.metaLeadId),
    );

    const qualifiedMetaLeads = metaSourcedLeads.filter((l) =>
      ["COUNSELED", "OFFICE_VISIT_BOOKED", "ADMITTED"].includes(
        String(l.status).toUpperCase(),
      ),
    );
    const admittedMetaLeads = metaSourcedLeads.filter(
      (l) => String(l.status).toUpperCase() === "ADMITTED",
    );

    const blogPosts = Array.isArray(allTables.blog_posts)
      ? allTables.blog_posts
      : [];

    const deliveredLogsCount = store.capiLogs.filter(
      (l) => l.status === "DELIVERED",
    ).length;
    const queuedLogsCount = store.capiLogs.filter(
      (l) => l.status === "READY_AWAITING_TOKEN",
    ).length;
    const failedLogsCount = store.capiLogs.filter(
      (l) => l.status === "FAILED",
    ).length;

    return NextResponse.json({
      ok: true,
      config: {
        ...store.config,
        hasAccessToken: Boolean(
          store.config.accessToken ||
            process.env.META_ACCESS_TOKEN ||
            process.env.FACEBOOK_ACCESS_TOKEN,
        ),
      },
      graphSyncStatus,
      lastGraphSyncAt: store.lastGraphSyncAt || null,
      adAccounts: store.adAccounts || [],
      pages: store.pages || [],
      leadForms: store.leadForms || [],
      pagePosts: store.pagePosts || [],
      campaigns,
      adSets: store.cachedAdSets || [],
      ads,
      capiLogs: store.capiLogs.slice(0, 100),
      summary: {
        totalCrmLeads: crmLeads.length,
        metaLeadsCount: metaSourcedLeads.length,
        qualifiedMetaLeadsCount: qualifiedMetaLeads.length,
        admittedMetaLeadsCount: admittedMetaLeads.length,
        deliveredLogsCount,
        queuedLogsCount,
        failedLogsCount,
        blogPostsCount: blogPosts.length,
        websiteLeadsCount: crmLeads.filter((l) =>
          String(l.source).toUpperCase().includes("WEBSITE"),
        ).length,
        walkinLeadsCount: crmLeads.filter((l) =>
          String(l.source).toUpperCase().includes("WALK"),
        ).length,
        whatsappLeadsCount: crmLeads.filter((l) =>
          String(l.source).toUpperCase().includes("WHATSAPP"),
        ).length,
      },
      blogPosts: blogPosts.slice(0, 30),
      crmLeadsSample: crmLeads.slice(0, 150),
    });
  } catch (error: any) {
    console.error("[MetaMarketing API GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to load Meta Marketing data" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body.action || "").toUpperCase();
    const store = loadMetaMarketingStore();

    if (action === "SAVE_CONFIG") {
      const updates = body.config || {};
      const selectedPage = (store.pages || []).find(
        (p) => p.id === String(updates.pageId || store.config.pageId || ""),
      );
      store.config = {
        ...store.config,
        appId:
          updates.appId !== undefined
            ? String(updates.appId).trim()
            : store.config.appId || "",
        appSecret:
          updates.appSecret !== undefined
            ? String(updates.appSecret).trim()
            : store.config.appSecret || "",
        datasetId: String(
          updates.datasetId || store.config.datasetId || "1061685489662581",
        ).trim(),
        apiVersion: String(
          updates.apiVersion || store.config.apiVersion || "v22.0",
        ).trim(),
        businessName: String(
          updates.businessName || store.config.businessName || "KNLTC",
        ).trim(),
        leadEventSource: String(
          updates.leadEventSource || store.config.leadEventSource || "KNLTC CRM",
        ).trim(),
        accessToken:
          updates.accessToken !== undefined
            ? String(updates.accessToken).trim()
            : store.config.accessToken,
        adAccountId:
          updates.adAccountId !== undefined
            ? String(updates.adAccountId).trim()
            : store.config.adAccountId,
        pageId:
          updates.pageId !== undefined
            ? String(updates.pageId).trim()
            : store.config.pageId,
        pageAccessToken:
          selectedPage?.accessToken ||
          updates.pageAccessToken ||
          store.config.pageAccessToken,
        testEventCode:
          updates.testEventCode !== undefined
            ? String(updates.testEventCode).trim()
            : store.config.testEventCode,
        webhookVerifyToken:
          updates.webhookVerifyToken !== undefined
            ? String(updates.webhookVerifyToken).trim()
            : store.config.webhookVerifyToken,
        autoSyncCrmStages:
          updates.autoSyncCrmStages !== undefined
            ? Boolean(updates.autoSyncCrmStages)
            : store.config.autoSyncCrmStages,
        stageMappings:
          Array.isArray(updates.stageMappings) && updates.stageMappings.length > 0
            ? updates.stageMappings
            : store.config.stageMappings || DEFAULT_META_STAGE_MAPPINGS,
        googleAdsCustomerId:
          updates.googleAdsCustomerId ?? store.config.googleAdsCustomerId,
        googleAdsConversionId:
          updates.googleAdsConversionId ?? store.config.googleAdsConversionId,
        googleAdsConversionLabel:
          updates.googleAdsConversionLabel ?? store.config.googleAdsConversionLabel,
        youtubeChannelId:
          updates.youtubeChannelId ?? store.config.youtubeChannelId,
        youtubeChannelHandle:
          updates.youtubeChannelHandle ?? store.config.youtubeChannelHandle,
        gbpDhakaLocationId:
          updates.gbpDhakaLocationId ?? store.config.gbpDhakaLocationId,
        gbpKhulnaLocationId:
          updates.gbpKhulnaLocationId ?? store.config.gbpKhulnaLocationId,
        updatedAt: new Date().toISOString(),
      };
      saveMetaMarketingStore(store);

      let liveSyncResult = null;
      let discoveredAssets = null;
      if (store.config.accessToken) {
        discoveredAssets = await discoverMetaAssetsWithToken(store.config.accessToken);
        const allTables = await fetchAllSheetTables();
        const crmLeads = (allTables.knltc_crm_leads || []).map(parseLeadRow);
        liveSyncResult = await syncLiveMetaCampaignsAndAds(crmLeads);
      }

      const freshStore = loadMetaMarketingStore();
      return NextResponse.json({
        ok: true,
        config: freshStore.config,
        adAccounts: freshStore.adAccounts,
        pages: freshStore.pages,
        leadForms: freshStore.leadForms,
        liveSyncResult,
        discoveredAssets,
      });
    }

    if (action === "DISCOVER_ASSETS") {
      const discovered = await discoverMetaAssetsWithToken();
      const allTables = await fetchAllSheetTables();
      const crmLeads = (allTables.knltc_crm_leads || []).map(parseLeadRow);
      const syncResult = await syncLiveMetaCampaignsAndAds(crmLeads);
      const fresh = loadMetaMarketingStore();
      return NextResponse.json({
        ok: discovered.ok,
        errorMessage: discovered.errorMessage || syncResult.errorMessage,
        config: fresh.config,
        adAccounts: fresh.adAccounts,
        pages: fresh.pages,
        leadForms: fresh.leadForms,
        campaigns: syncResult.campaigns,
        adSets: syncResult.adSets,
        ads: syncResult.ads,
      });
    }

    if (action === "UPDATE_META_OBJECT") {
      const objectId = String(body.objectId || "").trim();
      const objectType = String(body.objectType || "CAMPAIGN").toUpperCase() as
        | "CAMPAIGN"
        | "ADSET"
        | "AD";
      const status = body.status
        ? (String(body.status).toUpperCase() as "ACTIVE" | "PAUSED")
        : undefined;
      const dailyBudget =
        body.dailyBudget !== undefined ? Number(body.dailyBudget) : undefined;

      const res = await updateMetaObjectStatusAndBudget({
        objectId,
        objectType,
        status,
        dailyBudget,
      });
      const fresh = loadMetaMarketingStore();
      return NextResponse.json({
        ok: res.ok,
        errorMessage: res.errorMessage,
        campaigns: fresh.cachedCampaigns,
        adSets: fresh.cachedAdSets,
        ads: fresh.cachedAds,
      });
    }

    if (action === "SYNC_LEAD_FORMS") {
      const res = await syncMetaPageLeadForms();
      return NextResponse.json({
        ok: res.ok,
        leadForms: res.leadForms,
        errorMessage: res.errorMessage,
      });
    }

    if (action === "PULL_FORM_LEADS") {
      const formId = String(body.formId || "").trim();
      const pageId = body.pageId ? String(body.pageId).trim() : undefined;
      const allTables = await fetchAllSheetTables();
      const existingLeads = (allTables.knltc_crm_leads || []).map(parseLeadRow);

      if (formId === "ALL") {
        let totalPulled = 0;
        let totalNew = 0;
        const forms = store.leadForms || [];
        for (const f of forms) {
          const r = await pullLeadsFromMetaForm({
            formId: f.id,
            pageId: f.pageId,
            existingLeads,
          });
          totalPulled += r.pulledCount;
          totalNew += r.newLeadsCount;
        }
        return NextResponse.json({
          ok: true,
          pulledCount: totalPulled,
          newLeadsCount: totalNew,
        });
      }

      const res = await pullLeadsFromMetaForm({
        formId,
        pageId,
        existingLeads,
      });
      return NextResponse.json(res);
    }

    if (action === "SUBSCRIBE_PAGE_WEBHOOK") {
      const pageId = body.pageId ? String(body.pageId).trim() : undefined;
      const res = await subscribeMetaPageToLeadgenWebhook(pageId);
      const fresh = loadMetaMarketingStore();
      return NextResponse.json({
        ok: res.ok,
        errorMessage: res.errorMessage,
        pages: fresh.pages,
      });
    }

    if (action === "SYNC_PAGE_POSTS") {
      const pageId = body.pageId ? String(body.pageId).trim() : undefined;
      const res = await syncMetaPagePostsAndComments(pageId);
      return NextResponse.json({
        ok: res.ok,
        pagePosts: res.pagePosts,
        errorMessage: res.errorMessage,
      });
    }

    if (action === "SEND_CRM_EVENT" || action === "SEND_TEST_EVENT") {
      const isTest = action === "SEND_TEST_EVENT" || Boolean(body.isTestEvent);
      const logEntry = await sendMetaCrmConversionEvent({
        leadId: String(body.leadId || `test-lead-${Date.now()}`),
        leadName: String(body.leadName || "Test Candidate (KNLTC CRM)"),
        phone: String(body.phone || "+8801805013633"),
        email: body.email ? String(body.email) : "candidate@knltc.com",
        city: String(body.city || "Dhaka"),
        crmStage: String(body.crmStage || "COUNSELED"),
        customEventName: body.customEventName ? String(body.customEventName) : undefined,
        interest: String(body.interest || "STUDENT_VISA_REGULAR"),
        branch: String(body.branch || "DHK-HQ"),
        contractAmountBdt: body.contractAmountBdt ? Number(body.contractAmountBdt) : undefined,
        metaLeadId: body.metaLeadId ? String(body.metaLeadId) : undefined,
        isTestEvent: isTest,
        overrideTestEventCode: body.testEventCode ? String(body.testEventCode) : undefined,
      });

      return NextResponse.json({
        ok: true,
        logEntry,
        capiLogs: loadMetaMarketingStore().capiLogs.slice(0, 100),
      });
    }

    if (action === "SYNC_META_CAMPAIGNS") {
      const allTables = await fetchAllSheetTables();
      const crmLeads = (allTables.knltc_crm_leads || []).map(parseLeadRow);
      await discoverMetaAssetsWithToken();
      const syncResult = await syncLiveMetaCampaignsAndAds(crmLeads);
      const fresh = loadMetaMarketingStore();
      return NextResponse.json({
        ok: syncResult.ok,
        ...syncResult,
        adAccounts: fresh.adAccounts,
        pages: fresh.pages,
        leadForms: fresh.leadForms,
      });
    }

    if (action === "BATCH_SYNC_CRM_LEADS") {
      const allTables = await fetchAllSheetTables();
      const rawLeads = Array.isArray(allTables.knltc_crm_leads)
        ? allTables.knltc_crm_leads
        : [];
      const crmLeads = rawLeads.map(parseLeadRow);
      const stageFilter = body.stageFilter ? String(body.stageFilter).toUpperCase() : "ALL";

      const targetLeads = crmLeads
        .filter((l) => stageFilter === "ALL" || String(l.status).toUpperCase() === stageFilter)
        .slice(0, 20);

      const results = [];
      for (const lead of targetLeads) {
        const log = await sendMetaCrmConversionEvent({
          leadId: lead.id,
          leadName: lead.name,
          phone: lead.phone,
          email: lead.email,
          city: lead.city,
          crmStage: lead.status || "NEW",
          interest: lead.interest,
          branch: lead.branch,
          contractAmountBdt: lead.contractAmountBdt,
          metaLeadId: lead.metaLeadId || undefined,
        });
        results.push(log);
      }

      return NextResponse.json({
        ok: true,
        processedCount: results.length,
        results,
        capiLogs: loadMetaMarketingStore().capiLogs.slice(0, 100),
      });
    }

    if (action === "TAG_LEAD_CAMPAIGN") {
      const leadId = String(body.leadId || "");
      if (!leadId) {
        return NextResponse.json({ ok: false, error: "Missing leadId" }, { status: 400 });
      }
      const allTables = await fetchAllSheetTables();
      const rawLeads = Array.isArray(allTables.knltc_crm_leads)
        ? allTables.knltc_crm_leads
        : [];
      const foundRaw = rawLeads.find((r) => String(r.id) === leadId);
      if (!foundRaw) {
        return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
      }

      const parsed = parseLeadRow(foundRaw);
      const updatedProfile: Record<string, any> = {
        ...parsed,
        source: "FACEBOOK_META",
        metaLeadId: body.metaLeadId ?? parsed.metaLeadId ?? "",
        metaCampaignId: body.metaCampaignId ?? parsed.metaCampaignId ?? "",
        metaCampaignName: body.metaCampaignName ?? parsed.metaCampaignName ?? "",
        metaAdSetId: body.metaAdSetId ?? parsed.metaAdSetId ?? "",
        metaAdSetName: body.metaAdSetName ?? parsed.metaAdSetName ?? "",
        metaAdId: body.metaAdId ?? parsed.metaAdId ?? "",
        metaAdName: body.metaAdName ?? parsed.metaAdName ?? "",
      };

      const updatedRow = {
        ...foundRaw,
        source: "FACEBOOK_META",
        profile_json: JSON.stringify(updatedProfile),
      };

      await upsertRow("knltc_crm_leads", updatedRow);

      let capiLog = null;
      if (body.sendCapiNow) {
        capiLog = await sendMetaCrmConversionEvent({
          leadId: updatedProfile.id,
          leadName: updatedProfile.name,
          phone: updatedProfile.phone,
          email: updatedProfile.email,
          city: updatedProfile.city,
          crmStage: updatedProfile.status || "NEW",
          interest: updatedProfile.interest,
          branch: updatedProfile.branch,
          contractAmountBdt: updatedProfile.contractAmountBdt,
          metaLeadId: updatedProfile.metaLeadId || undefined,
        });
      }

      return NextResponse.json({
        ok: true,
        lead: updatedProfile,
        capiLog,
      });
    }

    if (action === "IMPORT_META_LEAD") {
      const nowIso = new Date().toISOString();
      const leadId = String(body.id || `lead-meta-${Date.now()}`);
      const name = String(body.name || "Meta Ad Candidate").trim();
      const phone = String(body.phone || "").trim();
      const email = String(body.email || "").trim();
      const city = String(body.city || "Dhaka").trim();
      const interest = String(body.interest || "STUDENT_VISA_REGULAR").trim();
      const branch = String(body.branch || "DHK-HQ").trim();
      const metaLeadId = String(body.metaLeadId || "").replace(/\D/g, "");
      const metaCampaignId = String(body.metaCampaignId || "").trim();
      const metaCampaignName = String(
        body.metaCampaignName || "Japan Student Visa 2027 Lead Ad",
      ).trim();
      const metaAdSetName = String(
        body.metaAdSetName || "Dhaka & Khulna HSC/Diploma Audience",
      ).trim();
      const metaAdName = String(
        body.metaAdName || "Zero Advance Fee Student Visa Video Ad",
      ).trim();

      const fullLeadObj = {
        id: leadId,
        name,
        phone,
        whatsapp: phone,
        email,
        city,
        source: "FACEBOOK_META",
        interest,
        status: "NEW",
        priority: "HOT",
        education: String(body.education || "HSC / Alim"),
        japaneseProficiency: "NONE",
        studyGapYears: 0,
        assignedTo: "Sales & Marketing Team",
        branch,
        notes: `[Meta Lead Ad: ${metaCampaignName} • ${metaAdName}] ${body.notes || ""}`.trim(),
        followUpDate: nowIso.slice(0, 10),
        lastContactedAt: nowIso,
        createdAt: nowIso,
        metaLeadId,
        metaCampaignId,
        metaCampaignName,
        metaAdSetName,
        metaAdName,
      };

      const sheetRow = {
        id: leadId,
        name,
        phone,
        whatsapp: phone,
        email,
        city,
        source: "FACEBOOK_META",
        interest,
        status: "NEW",
        education: fullLeadObj.education,
        ssc_gpa: "",
        hsc_gpa: "",
        japanese_proficiency: "NONE",
        study_gap_years: 0,
        assigned_to: "Sales & Marketing Team",
        branch,
        notes: fullLeadObj.notes,
        follow_up_date: nowIso.slice(0, 10),
        last_contacted_at: nowIso,
        created_at: nowIso,
        priority: "HOT",
        passport_no: "",
        target_school: "",
        b2b_agent_name: "",
        contract_amount_bdt: 0,
        paid_amount_bdt: 0,
        due_amount_bdt: 0,
        avatar_url: "",
        documents_urls: "",
        profile_json: JSON.stringify(fullLeadObj),
      };

      await upsertRow("knltc_crm_leads", sheetRow);

      const capiLog = await sendMetaCrmConversionEvent({
        leadId,
        leadName: name,
        phone,
        email,
        city,
        crmStage: "NEW",
        interest,
        branch,
        metaLeadId: metaLeadId || undefined,
      });

      return NextResponse.json({
        ok: true,
        lead: fullLeadObj,
        capiLog,
      });
    }

    return NextResponse.json(
      { ok: false, error: `Unknown action: ${action}` },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("[MetaMarketing API POST] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to process Meta Marketing request",
      },
      { status: 500 },
    );
  }
}
