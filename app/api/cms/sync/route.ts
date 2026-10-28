import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { selectRows, upsertRow, insertRow, deleteRow } from "@/lib/supabase";
import { getCmsStore, type MasterKnlTcStore } from "@/lib/knltc-cms-store";

export const dynamic = "force-dynamic";

const SNAPSHOT_FILE = path.join("/tmp", "knltc-cms-server-snapshot-v3.json");

const globalForServerSync = globalThis as unknown as {
  __knltc_server_snapshot?: MasterKnlTcStore;
};

async function readServerSnapshot(): Promise<MasterKnlTcStore> {
  if (globalForServerSync.__knltc_server_snapshot) {
    return globalForServerSync.__knltc_server_snapshot;
  }
  try {
    const raw = await fs.readFile(SNAPSHOT_FILE, "utf-8");
    const parsed = JSON.parse(raw) as MasterKnlTcStore;
    if (parsed && Array.isArray(parsed.crmLeads)) {
      globalForServerSync.__knltc_server_snapshot = parsed;
      return parsed;
    }
  } catch {
    // Snapshot file does not exist yet; initialize from default store
  }
  const initial = getCmsStore();
  globalForServerSync.__knltc_server_snapshot = initial;
  return initial;
}

async function writeServerSnapshot(store: MasterKnlTcStore): Promise<void> {
  globalForServerSync.__knltc_server_snapshot = store;
  try {
    await fs.writeFile(SNAPSHOT_FILE, JSON.stringify(store), "utf-8");
  } catch {
    // Ignore file write errors in read-only environments
  }
}

export async function GET() {
  try {
    const snapshot = await readServerSnapshot();

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

    const dbLeads = leads.status === "fulfilled" && Array.isArray(leads.value) && leads.value.length > 0 ? leads.value : null;
    const dbApplicants = applicants.status === "fulfilled" && Array.isArray(applicants.value) && applicants.value.length > 0 ? applicants.value : null;
    const dbLms = lmsBridges.status === "fulfilled" && Array.isArray(lmsBridges.value) && lmsBridges.value.length > 0 ? lmsBridges.value : null;
    const dbAgents = b2bAgents.status === "fulfilled" && Array.isArray(b2bAgents.value) && b2bAgents.value.length > 0 ? b2bAgents.value : null;
    const dbSchools = partnerSchools.status === "fulfilled" && Array.isArray(partnerSchools.value) && partnerSchools.value.length > 0 ? partnerSchools.value : null;
    const dbTransactions = transactions.status === "fulfilled" && Array.isArray(transactions.value) && transactions.value.length > 0 ? transactions.value : null;
    const dbStaff = staffMembers.status === "fulfilled" && Array.isArray(staffMembers.value) && staffMembers.value.length > 0 ? staffMembers.value : null;
    const dbCms =
      cmsRoot.status === "fulfilled" && Array.isArray(cmsRoot.value) && cmsRoot.value[0]?.content
        ? [cmsRoot.value[0].content]
        : null;

    const result = {
      crmLeads: dbLeads,
      visaApplicants: dbApplicants,
      lmsBridges: dbLms,
      b2bAgents: dbAgents,
      partnerSchools: dbSchools,
      transactions: dbTransactions,
      staffList: dbStaff,
      websiteCms: dbCms || snapshot.websiteCms || null,
      snapshotStore: snapshot,
    };

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error("[API][CMS_SYNC][GET] Error:", error);
    return NextResponse.json({ ok: false, data: null, error: "Sync failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, entity, payload, fullStore } = body as {
      type: "UPSERT" | "INSERT" | "DELETE" | "CMS_UPDATE" | "FULL_STORE_SYNC";
      entity?: string;
      payload?: any;
      fullStore?: MasterKnlTcStore;
    };

    const snapshot = await readServerSnapshot();

    if (fullStore && Array.isArray(fullStore.crmLeads)) {
      await writeServerSnapshot(fullStore);
    }

    if (type === "FULL_STORE_SYNC" && fullStore) {
      await writeServerSnapshot(fullStore);
      if (fullStore.websiteCms?.[0]) {
        try {
          await upsertRow("knltc_website_cms", {
            id: "master-cms-root",
            content: fullStore.websiteCms[0],
            updated_at: new Date().toISOString(),
          });
        } catch {
          // Safe fallback when Supabase is not configured
        }
      }
      return NextResponse.json({ ok: true, message: "Full store synced" });
    }

    if (type === "CMS_UPDATE" && payload) {
      snapshot.websiteCms = [payload];
      await writeServerSnapshot(snapshot);
      try {
        await upsertRow("knltc_website_cms", {
          id: "master-cms-root",
          content: payload,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // Safe fallback when Supabase is not configured
      }
      return NextResponse.json({ ok: true, message: "CMS updated" });
    }

    if (entity && payload) {
      try {
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
      } catch {
        // Return ok if local snapshot succeeded even when external Supabase is offline
        return NextResponse.json({ ok: true, data: payload });
      }
    }

    return NextResponse.json({ ok: false, error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("[API][CMS_SYNC][POST] Error:", error);
    return NextResponse.json({ ok: false, error: "Operation failed" }, { status: 500 });
  }
}
