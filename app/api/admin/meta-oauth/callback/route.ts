import { NextRequest, NextResponse } from "next/server";
import { exchangeMetaOAuthCodeForLongLivedToken } from "@/lib/meta-marketing";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error =
    searchParams.get("error_description") ||
    searchParams.get("error_message") ||
    searchParams.get("error");

  // Reconstruct the exact redirect_uri used during authorization
  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
  const forwardedHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host");
  const baseOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : (process.env.APP_URL || req.nextUrl.origin).replace(/\/$/, "");
  const redirectUri = `${baseOrigin}/api/admin/meta-oauth/callback`;

  if (error || !code) {
    const errMsg = error || "Authorization cancelled or no code returned from Meta.";
    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Meta Connection Error</title>
  </head>
  <body style="font-family: system-ui, sans-serif; padding: 32px; text-align: center; background: #0f172a; color: #f8fafc;">
    <h2 style="color: #fb7185;">মেটা সংযোগ সম্পন্ন হয়নি</h2>
    <p style="color: #cbd5e1; font-size: 14px;">${errMsg.replace(/</g, "&lt;")}</p>
    <script>
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errMsg)} }, '*');
        setTimeout(() => window.close(), 2500);
      }
    </script>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  const result = await exchangeMetaOAuthCodeForLongLivedToken({
    code,
    redirectUri,
  });

  if (!result.ok) {
    const errMsg = result.errorMessage || "Token exchange failed";
    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Meta Token Exchange Error</title>
  </head>
  <body style="font-family: system-ui, sans-serif; padding: 32px; text-align: center; background: #0f172a; color: #f8fafc;">
    <h2 style="color: #fb7185;">টোকেন এক্সচেঞ্জ ত্রুটি</h2>
    <p style="color: #cbd5e1; font-size: 14px;">${errMsg.replace(/</g, "&lt;")}</p>
    <script>
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errMsg)} }, '*');
        setTimeout(() => window.close(), 3000);
      }
    </script>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Meta Connected Successfully</title>
  </head>
  <body style="font-family: system-ui, sans-serif; padding: 36px; text-align: center; background: #0f172a; color: #f8fafc;">
    <div style="display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:9999px; background:#10b981; color:#fff; font-size:24px; font-weight:bold; margin-bottom:12px;">✓</div>
    <h2 style="color: #34d399; margin: 0 0 8px;">মেটা অ্যাকাউন্ট সফলভাবে সংযুক্ত হয়েছে!</h2>
    <p style="color: #cbd5e1; font-size: 14px;">Connected as: <strong>${(result.connectedUserName || "Meta Business").replace(/</g, "&lt;")}</strong>. এই উইন্ডোটি স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে...</p>
    <script>
      if (window.opener) {
        window.opener.postMessage({
          type: 'OAUTH_AUTH_SUCCESS',
          provider: 'meta',
          connectedUserName: ${JSON.stringify(result.connectedUserName || "Meta Business")}
        }, '*');
        window.close();
      } else {
        window.location.href = '/dashboard?tab=marketing_hub';
      }
    </script>
  </body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}
