import { NextResponse } from "next/server";
import { selectRows, upsertRow, insertRow, deleteRow } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      leads,
      applicants,
      lmsBridges,
      b2bAgents,
      partnerSchools,
      transactions,
      staffMembers,
      cmsRoot,
    ] = await Promise.allSettled([
      selectRows("knltc_crm_leads", { order: "created_at.desc", limit: 300 }, true),
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

    const result = {
      crmLeads: knltcLeadsList,
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
    await getAdminSession();
    const body = await request.json();
    const { type, entity, payload } = body as {
      type: "UPSERT" | "INSERT" | "DELETE" | "CMS_UPDATE";
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
      if (type === "DELETE" && payload.id) {
        await deleteRow(entity, String(payload.id));
        return NextResponse.json({ ok: true, deletedId: payload.id });
      } else if (type === "UPSERT") {
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
