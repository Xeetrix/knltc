import { NextRequest, NextResponse } from "next/server";
import {
  loadMetaMarketingStore,
  sendMetaCrmConversionEvent,
} from "@/lib/meta-marketing";
import { upsertRow } from "@/lib/google-sheets-db";

export const dynamic = "force-dynamic";

/**
 * Meta Graph API Webhook Verification Endpoint (`GET /api/webhooks/meta-leads`)
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const store = loadMetaMarketingStore();
  const expectedToken =
    store.config.webhookVerifyToken ||
    process.env.META_WEBHOOK_VERIFY_TOKEN ||
    "knltc_meta_crm_webhook_2026";

  if (mode === "subscribe" && token === expectedToken) {
    return new NextResponse(challenge || "OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json(
    {
      ok: true,
      endpoint: "/api/webhooks/meta-leads",
      status: "ACTIVE",
      verifyTokenHint: expectedToken,
      datasetId: store.config.datasetId || "1061685489662581",
      message:
        "Meta Lead Ads & Instant Form Webhook is active. Configure this URL in Meta Developer Portal -> Webhooks -> Page -> leadgen.",
    },
    { status: 200 },
  );
}

/**
 * Meta Lead Ads Instant Form Webhook Receiver (`POST /api/webhooks/meta-leads`)
 * Supports both native Meta Graph `entry[].changes[].value.leadgen_id` payloads
 * and direct field JSON payloads.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = loadMetaMarketingStore();
    const accessToken = (
      store.config.accessToken ||
      process.env.META_ACCESS_TOKEN ||
      process.env.FACEBOOK_ACCESS_TOKEN ||
      ""
    ).trim();
    const apiVersion = store.config.apiVersion || "v22.0";

    const importedLeads: Record<string, any>[] = [];

    // 1. Standard Meta Graph Webhook format: { object: "page", entry: [{ changes: [{ field: "leadgen", value: { leadgen_id, ad_id, form_id, ... } }] }] }
    if (Array.isArray(body?.entry)) {
      for (const entry of body.entry) {
        const changes = Array.isArray(entry?.changes) ? entry.changes : [];
        for (const change of changes) {
          const val = change?.value || {};
          const leadgenId = String(val.leadgen_id || val.id || "").trim();
          let fullName = "Meta Lead Candidate";
          let phone = "";
          let email = "";
          let city = "Dhaka";
          let education = "HSC / Alim";
          let adId = String(val.ad_id || "");
          let adName = String(val.ad_name || "Meta Instant Form Ad");
          let adSetId = String(val.adset_id || "");
          let adSetName = String(val.adset_name || "");
          let campaignId = String(val.campaign_id || "");
          let campaignName = String(val.campaign_name || "Meta Lead Campaign");

          // If Access Token is available, fetch full field_data & campaign names from Graph API
          if (leadgenId && accessToken) {
            try {
              const graphRes = await fetch(
                `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(leadgenId)}?fields=created_time,id,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,field_data&access_token=${encodeURIComponent(accessToken)}`,
                { cache: "no-store" },
              );
              const graphLead = await graphRes.json().catch(() => ({}));
              if (graphRes.ok && graphLead) {
                adId = String(graphLead.ad_id || adId);
                adName = String(graphLead.ad_name || adName);
                adSetId = String(graphLead.adset_id || adSetId);
                adSetName = String(graphLead.adset_name || adSetName);
                campaignId = String(graphLead.campaign_id || campaignId);
                campaignName = String(graphLead.campaign_name || campaignName);

                const fieldData = Array.isArray(graphLead.field_data)
                  ? graphLead.field_data
                  : [];
                for (const f of fieldData) {
                  const key = String(f?.name || "").toLowerCase();
                  const firstVal = Array.isArray(f?.values) ? String(f.values[0] || "") : "";
                  if (!firstVal) continue;
                  if (key.includes("name") || key === "full_name") fullName = firstVal;
                  else if (key.includes("phone") || key.includes("mobile") || key.includes("whatsapp"))
                    phone = firstVal;
                  else if (key.includes("email")) email = firstVal;
                  else if (key.includes("city") || key.includes("district") || key.includes("location"))
                    city = firstVal;
                  else if (key.includes("education") || key.includes("qualification"))
                    education = firstVal;
                }
              }
            } catch (err) {
              console.warn("[MetaLeads Webhook] Graph API lead fetch warning:", err);
            }
          }

          const nowIso = new Date().toISOString();
          const crmId = leadgenId ? `lead-meta-${leadgenId}` : `lead-meta-${Date.now()}`;
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
            notes: `[Meta Lead Form • ${campaignName} • ${adName}] Lead ID: ${leadgenId}`,
            followUpDate: nowIso.slice(0, 10),
            lastContactedAt: nowIso,
            createdAt: nowIso,
            metaLeadId: leadgenId,
            metaCampaignId: campaignId,
            metaCampaignName: campaignName,
            metaAdSetId: adSetId,
            metaAdSetName: adSetName,
            metaAdId: adId,
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
            profile_json: JSON.stringify(leadRecord),
          });

          if (store.config.autoSyncCrmStages) {
            await sendMetaCrmConversionEvent({
              leadId: crmId,
              leadName: leadRecord.name,
              phone: leadRecord.phone,
              email: leadRecord.email,
              city: leadRecord.city,
              crmStage: "NEW",
              interest: leadRecord.interest,
              branch: leadRecord.branch,
              metaLeadId: leadgenId || undefined,
            });
          }

          importedLeads.push(leadRecord);
        }
      }
    } else if (body?.phone || body?.full_name || body?.name) {
      // 2. Direct JSON webhook payload (e.g., from Meta Instant Form Bridge / Zapier / Make)
      const nowIso = new Date().toISOString();
      const metaLeadId = String(body.lead_id || body.leadgen_id || "").replace(/\D/g, "");
      const crmId = metaLeadId ? `lead-meta-${metaLeadId}` : `lead-meta-${Date.now()}`;
      const name = String(body.full_name || body.name || "Meta Ad Candidate").trim();
      const phone = String(body.phone_number || body.phone || "").trim();
      const email = String(body.email || "").trim();
      const city = String(body.city || "Dhaka").trim();
      const campaignName = String(body.campaign_name || "Japan Visa Meta Campaign").trim();
      const adSetName = String(body.adset_name || "").trim();
      const adName = String(body.ad_name || "Meta Lead Ad").trim();

      const leadRecord = {
        id: crmId,
        name,
        phone,
        whatsapp: phone,
        email,
        city,
        source: "FACEBOOK_META",
        interest: String(body.interest || "STUDENT_VISA_REGULAR"),
        status: "NEW",
        priority: "HOT",
        education: String(body.education || "HSC / Alim"),
        japaneseProficiency: "NONE",
        studyGapYears: 0,
        assignedTo: "Sales & Marketing Team",
        branch: city.toLowerCase().includes("khulna") ? "KHULNA-01" : "DHK-HQ",
        notes: `[Meta Lead Form • ${campaignName} • ${adName}] ${body.notes || ""}`.trim(),
        followUpDate: nowIso.slice(0, 10),
        lastContactedAt: nowIso,
        createdAt: nowIso,
        metaLeadId,
        metaCampaignId: String(body.campaign_id || ""),
        metaCampaignName: campaignName,
        metaAdSetId: String(body.adset_id || ""),
        metaAdSetName: adSetName,
        metaAdId: String(body.ad_id || ""),
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
        profile_json: JSON.stringify(leadRecord),
      });

      if (store.config.autoSyncCrmStages) {
        await sendMetaCrmConversionEvent({
          leadId: crmId,
          leadName: leadRecord.name,
          phone: leadRecord.phone,
          email: leadRecord.email,
          city: leadRecord.city,
          crmStage: "NEW",
          interest: leadRecord.interest,
          branch: leadRecord.branch,
          metaLeadId: metaLeadId || undefined,
        });
      }

      importedLeads.push(leadRecord);
    }

    return NextResponse.json({
      ok: true,
      importedCount: importedLeads.length,
      importedLeads,
    });
  } catch (error: any) {
    console.error("[MetaLeads Webhook POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Webhook processing failed" },
      { status: 500 },
    );
  }
}
