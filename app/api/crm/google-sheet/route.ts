import { NextRequest, NextResponse } from "next/server";

/**
 * Extracts Google Spreadsheet ID and optional GID from any Google Sheets URL
 * and fetches the public CSV export stream.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = String(body?.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: "Please provide a valid Google Sheets URL." },
        { status: 400 },
      );
    }

    let fetchUrl = rawUrl;

    // Match standard Google Sheets URL: https://docs.google.com/spreadsheets/d/{ID}/...
    const sheetIdMatch = rawUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    const gidMatch = rawUrl.match(/[#&?]gid=([0-9]+)/);

    if (sheetIdMatch && sheetIdMatch[1]) {
      const spreadsheetId = sheetIdMatch[1];
      const gid = gidMatch && gidMatch[1] ? gidMatch[1] : "0";
      fetchUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    }

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Accept: "text/csv,text/plain,*/*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Could not fetch Google Sheet. Make sure the sheet sharing permission is set to 'Anyone with the link can view', or copy-paste the rows directly.",
        },
        { status: 422 },
      );
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().startsWith("<!DOCTYPE html>")) {
      return NextResponse.json(
        {
          error:
            "This Google Sheet requires sign-in. Please set Share -> 'Anyone with the link can view' or copy-paste rows (Ctrl+C / Ctrl+V) directly.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ csvText });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Google Sheet data.",
      },
      { status: 500 },
    );
  }
}
