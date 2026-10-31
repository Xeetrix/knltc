import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { selectRows, upsertRow, insertRow, deleteRow } from "@/lib/supabase";
import {
  bulkSyncMasterStoreToSheets,
  getPersistentDataDir,
  offloadEmbeddedBase64Strings,
  purgeFallbackTables,
} from "@/lib/google-sheets-db";
import { getCmsStore, type MasterKnlTcStore } from "@/lib/knltc-cms-store";

export const dynamic = "force-dynamic";

function getSnapshotFilePath(): string {
  return path.join(getPersistentDataDir(), "knltc-cms-server-snapshot-v4.json");
}

const LEGACY_TMP_SNAPSHOT = path.join("/tmp", "knltc-cms-server-snapshot-v3.json");

const globalForServerSync = globalThis as unknown as {
  __knltc_server_snapshot?: MasterKnlTcStore;
};

async function readServerSnapshot(): Promise<MasterKnlTcStore> {
  if (globalForServerSync.__knltc_server_snapshot) {
    return globalForServerSync.__knltc_server_snapshot;
  }
  const primaryPath = getSnapshotFilePath();
  for (const candidatePath of [primaryPath, LEGACY_TMP_SNAPSHOT]) {
    try {
      const raw = await fs.readFile(candidatePath, "utf-8");
      const parsed = JSON.parse(raw) as MasterKnlTcStore;
      if (parsed && Array.isArray(parsed.crmLeads)) {
        const cleaned = offloadEmbeddedBase64Strings(parsed, "KNLTC_Snapshot", "snapshot").value;
        globalForServerSync.__knltc_server_snapshot = cleaned;
        return cleaned;
      }
    } catch {
      // Try next candidate
    }
  }
  const initial = getCmsStore();
  globalForServerSync.__knltc_server_snapshot = initial;
  return initial;
}

async function writeServerSnapshot(store: MasterKnlTcStore): Promise<MasterKnlTcStore> {
  const cleaned = offloadEmbeddedBase64Strings(store, "KNLTC_Snapshot", "snapshot").value;
  globalForServerSync.__knltc_server_snapshot = cleaned;
  try {
    await fs.writeFile(getSnapshotFilePath(), JSON.stringify(cleaned), "utf-8");
  } catch {
    // Ignore file write errors in read-only environments
  }
  return cleaned;
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
      selectRows<any>("knltc_crm_leads", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_visa_applicants", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_lms_bridges", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_b2b_agents", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_partner_schools", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_finance_transactions", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_staff_members", { order: "created_at.desc" }, true),
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
      const cleanedStore = await writeServerSnapshot(fullStore);
      await bulkSyncMasterStoreToSheets(cleanedStore, false);
      return NextResponse.json({
        ok: true,
        message: "Full store synced to Google Sheets & Persistent Disk",
        store: cleanedStore,
      });
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
        snapshot.websiteCms[0].storeProducts = [];
      }
      purgeFallbackTables();
      await writeServerSnapshot(snapshot);
      return NextResponse.json({ ok: true, message: "Server snapshot purged of dummy data" });
    }

    if (type === "CMS_UPDATE" && payload) {
      const cleanedCms = offloadEmbeddedBase64Strings(payload, "KNLTC_Website_CMS", "cms").value;
      snapshot.websiteCms = [cleanedCms];
      await writeServerSnapshot(snapshot);
      await upsertRow(
        "knltc_website_cms",
        {
          id: "cms-master-01",
          section_key: "master_cms",
          data: cleanedCms,
          updated_at: new Date().toISOString(),
        },
        "section_key",
      );
      return NextResponse.json({
        ok: true,
        message: "CMS updated in Google Sheets & Persistent Disk",
        data: cleanedCms,
      });
    }

    if (entity && payload) {
      const cleanedPayload = offloadEmbeddedBase64Strings(
        payload,
        `KNLTC_${entity}`,
        entity,
      ).value;

      if (type === "DELETE" && cleanedPayload.id) {
        await deleteRow(entity, String(cleanedPayload.id));
        return NextResponse.json({ ok: true, deletedId: cleanedPayload.id });
      } else if (type === "UPSERT") {
        const saved = await upsertRow(entity, cleanedPayload);
        return NextResponse.json({ ok: true, data: saved });
      } else {
        const saved = await insertRow(entity, cleanedPayload);
        return NextResponse.json({ ok: true, data: saved });
      }
    }

    return NextResponse.json({ ok: false, error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("[API][CMS_SYNC][POST] Error:", error);
    return NextResponse.json({ ok: false, error: "Operation failed" }, { status: 500 });
  }
}
