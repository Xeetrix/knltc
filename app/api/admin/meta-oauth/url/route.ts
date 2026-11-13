import { NextRequest, NextResponse } from "next/server";
import {
  loadMetaMarketingStore,
  saveMetaMarketingStore,
} from "@/lib/meta-marketing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const store = loadMetaMarketingStore();

    if (body.appId !== undefined) {
      store.config.appId = String(body.appId).trim();
    }
    if (body.appSecret !== undefined) {
      store.config.appSecret = String(body.appSecret).trim();
    }
    saveMetaMarketingStore(store);

    const appId = (
      store.config.appId ||
      process.env.META_APP_ID ||
      process.env.FACEBOOK_APP_ID ||
      ""
    ).trim();

    if (!appId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "অনুগ্রহ করে প্রথমে আপনার Meta App ID এবং App Secret ঘরে মান বসিয়ে নিন।",
        },
        { status: 400 },
      );
    }

    const origin = String(
      body.origin || process.env.APP_URL || req.nextUrl.origin,
    ).replace(/\/$/, "");
    const redirectUri = `${origin}/api/admin/meta-oauth/callback`;
    const apiVersion = (store.config.apiVersion || "v22.0").trim();

    const scopes = [
      "ads_management",
      "ads_read",
      "business_management",
      "leads_retrieval",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_ads",
      "pages_manage_metadata",
    ].join(",");

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      state: `knltc_meta_${Date.now()}`,
    });

    const authUrl = `https://www.facebook.com/${apiVersion}/dialog/oauth?${params.toString()}`;

    return NextResponse.json({
      ok: true,
      url: authUrl,
      redirectUri,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to construct Meta OAuth URL" },
      { status: 500 },
    );
  }
}
