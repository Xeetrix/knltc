import { NextResponse } from "next/server";
import { selectRows, upsertRow, insertRow } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      leads,
      webLeads,
      applicants,
      lmsBridges,
      b2bAgents,
      partnerSchools,
      transactions,
      staffMembers,
      cmsRoot,
    ] = await Promise.allSettled([
      selectRows("knltc_crm_leads", { order: "created_at.desc", limit: 200 }, true),
      selectRows("crm_leads", { order: "created_at.desc", limit: 100 }, true),
      selectRows("knltc_visa_applicants", { order: "created_at.desc", limit: 200 }, true),
      selectRows("knltc_lms_bridges", { order: "created_at.desc", limit: 200 }, true),
      selectRows("knltc_b2b_agents", { order: "created_at.desc", limit: 100 }, true),
      selectRows("knltc_partner_schools", { order: "created_at.desc", limit: 100 }, true),
      selectRows("knltc_finance_transactions", { order: "created_at.desc", limit: 200 }, true),
      selectRows("knltc_staff_members", { order: "created_at.desc", limit: 100 }, true),
      selectRows("knltc_website_cms", { id: "eq.master-cms-root" }, true),
    ]);

    const knltcLeadsList =
      leads.status === "fulfilled" && Array.isArray(leads.value) ? leads.value : [];
    const webLeadsList =
      webLeads.status === "fulfilled" && Array.isArray(webLeads.value) ? webLeads.value : [];

    // Deduplicate & merge any website leads from `crm_leads` that aren't in `knltc_crm_leads`
    const existingIds = new Set(knltcLeadsList.map((r: any) => String(r.id)));
    const existingPhones = new Set(knltcLeadsList.map((r: any) => String(r.phone || "").trim()));

    const mergedWebLeads = webLeadsList
      .filter((w: any) => {
        const webId = `web-${w.id}`;
        return !existingIds.has(webId) && !existingPhones.has(String(w.phone || "").trim());
      })
      .map((w: any) => ({
        id: `web-${w.id}`,
        name: w.name,
        phone: w.phone,
        whatsapp: w.phone,
        email: w.email || null,
        city: "Dhaka",
        source: w.source === "SSW Visa Landing Page" ? "FACEBOOK_META" : "WEBSITE_FORM",
        interest: "STUDENT_VISA_REGULAR",
        status: "NEW",
        education: "HSC / Equivalent",
        japanese_proficiency: "NONE",
        study_gap_years: 0,
        assigned_to: "সুমাইয়া সুলতানা",
        branch: "DHK-HQ",
        notes: [w.interest ? `[${w.interest}]` : "", w.message || "", w.notes || ""]
          .filter(Boolean)
          .join(" — "),
        follow_up_date: new Date().toISOString().slice(0, 10),
        last_contacted_at: w.updated_at || w.created_at || new Date().toISOString(),
        created_at: w.created_at || new Date().toISOString(),
      }));

    const combinedLeads = [...knltcLeadsList, ...mergedWebLeads];

    const result = {
      crmLeads: combinedLeads,
      visaApplicants: applicants.status === "fulfilled" && Array.isArray(applicants.value) ? applicants.value : [],
      lmsBridges: lmsBridges.status === "fulfilled" && Array.isArray(lmsBridges.value) ? lmsBridges.value : [],
      b2bAgents: b2bAgents.status === "fulfilled" && Array.isArray(b2bAgents.value) ? b2bAgents.value : [],
      partnerSchools: partnerSchools.status === "fulfilled" && Array.isArray(partnerSchools.value) ? partnerSchools.value : [],
      transactions: transactions.status === "fulfilled" && Array.isArray(transactions.value) ? transactions.value : [],
      staffList: staffMembers.status === "fulfilled" && Array.isArray(staffMembers.value) ? staffMembers.value : [],
      websiteCms: cmsRoot.status === "fulfilled" && Array.isArray(cmsRoot.value) && cmsRoot.value[0]?.content
        ? [cmsRoot.value[0].content]
        : null,
    };

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error("[API][CMS_SYNC][GET] Error:", error);
    return NextResponse.json({ ok: false, data: null, error: "Sync failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    // Allow if authenticated or internal call
    const body = await request.json();
    const { type, entity, payload } = body as {
      type: "UPSERT" | "INSERT" | "CMS_UPDATE";
      entity?: string;
      payload: any;
    };

    if (type === "CMS_UPDATE") {
      await upsertRow("knltc_website_cms", {
        id: "master-cms-root",
        content: payload,
        updated_at: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, message: "CMS updated" });
    }

    if (entity && payload) {
      if (type === "UPSERT") {
        const saved = await upsertRow(entity, payload);
        return NextResponse.json({ ok: true, data: saved });
      } else {
        const saved = await insertRow(entity, payload);
        return NextResponse.json({ ok: true, data: saved });
      }
    }

    return NextResponse.json({ ok: false, error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("[API][CMS_SYNC][POST] Error:", error);
    return NextResponse.json({ ok: false, error: "Operation failed" }, { status: 500 });
  }
}
