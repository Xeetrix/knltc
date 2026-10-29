import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { selectRows, upsertRow, insertRow, deleteRow } from "@/lib/supabase";
import { bulkSyncMasterStoreToSheets } from "@/lib/google-sheets-db";
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
      selectRows<any>("knltc_crm_leads", { order: "created_at.desc", limit: 300 }, true),
      selectRows<any>("knltc_visa_applicants", { order: "created_at.desc", limit: 200 }, true),
      selectRows<any>("knltc_lms_bridges", { order: "created_at.desc", limit: 200 }, true),
      selectRows<any>("knltc_b2b_agents", { order: "created_at.desc", limit: 100 }, true),
      selectRows<any>("knltc_partner_schools", { order: "created_at.desc", limit: 100 }, true),
      selectRows<any>("knltc_finance_transactions", { order: "created_at.desc", limit: 200 }, true),
      selectRows<any>("knltc_staff_members", { order: "created_at.desc", limit: 100 }, true),
      selectRows<any>("knltc_website_cms", "", true),
    ]);

    const dbLeads =
      leads.status === "fulfilled" && Array.isArray(leads.value) && leads.value.length > 0
        ? leads.value
        : null;
    const dbApplicants =
      applicants.status === "fulfilled" &&
      Array.isArray(applicants.value) &&
      applicants.value.length > 0
        ? applicants.value
        : null;
    const dbLms =
      lmsBridges.status === "fulfilled" &&
      Array.isArray(lmsBridges.value) &&
      lmsBridges.value.length > 0
        ? lmsBridges.value
        : null;
    const dbAgents =
      b2bAgents.status === "fulfilled" &&
      Array.isArray(b2bAgents.value) &&
      b2bAgents.value.length > 0
        ? b2bAgents.value
        : null;
    const dbSchools =
      partnerSchools.status === "fulfilled" &&
      Array.isArray(partnerSchools.value) &&
      partnerSchools.value.length > 0
        ? partnerSchools.value
        : null;
    const dbTransactions =
      transactions.status === "fulfilled" &&
      Array.isArray(transactions.value) &&
      transactions.value.length > 0
        ? transactions.value
        : null;
    const dbStaff =
      staffMembers.status === "fulfilled" &&
      Array.isArray(staffMembers.value) &&
      staffMembers.value.length > 0
        ? staffMembers.value
        : null;

    let dbCms = null;
    if (cmsRoot.status === "fulfilled" && Array.isArray(cmsRoot.value) && cmsRoot.value.length > 0) {
      const firstRow = cmsRoot.value[0];
      const rawCms = firstRow?.data ?? firstRow?.content ?? null;
      if (rawCms) {
        dbCms = [typeof rawCms === "string" ? JSON.parse(rawCms) : rawCms];
      }
    }

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
      await bulkSyncMasterStoreToSheets(fullStore, false);
      return NextResponse.json({ ok: true, message: "Full store synced to Google Sheets" });
    }

    if ((type as string) === "PURGE_ALL_DUMMY" || entity === "PURGE_ALL_DUMMY") {
      snapshot.crmLeads = [];
      snapshot.visaApplicants = [];
      snapshot.lmsBridges = [];
      snapshot.b2bAgents = [];
      snapshot.partnerSchools = [];
      snapshot.staffList = [];
      snapshot.transactions = [];
      if (snapshot.websiteCms?.[0]) {
        snapshot.websiteCms[0].customerOrders = [];
        snapshot.websiteCms[0].testimonials = [];
      }
      await writeServerSnapshot(snapshot);
      return NextResponse.json({ ok: true, message: "Server snapshot purged of dummy data" });
    }

    if (type === "CMS_UPDATE" && payload) {
      snapshot.websiteCms = [payload];
      await writeServerSnapshot(snapshot);
      await upsertRow(
        "knltc_website_cms",
        {
          id: "cms-master-01",
          section_key: "master_cms",
          data: payload,
          updated_at: new Date().toISOString(),
        },
        "section_key",
      );
      return NextResponse.json({ ok: true, message: "CMS updated in Google Sheets" });
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
