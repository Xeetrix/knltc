import { NextResponse } from "next/server";
import { getMediaFileById } from "@/lib/google-sheets-db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await context.params;
    const fileId = resolvedParams.id || "";
    const { searchParams } = new URL(request.url);
    const forceDownload = searchParams.get("download") === "1";

    const { meta, buffer } = getMediaFileById(fileId);

    if (buffer) {
      const mimeType = meta?.mimeType || "application/octet-stream";
      const fileName = meta?.safeFileName || `${fileId}.bin`;
      const dispositionType = forceDownload ? "attachment" : "inline";

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": String(buffer.byteLength),
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Disposition": `${dispositionType}; filename="${fileName.replace(/"/g, "")}"`,
        },
      });
    }

    if (meta?.driveUrl) {
      return NextResponse.redirect(meta.driveUrl, 302);
    }

    return NextResponse.json(
      { ok: false, error: "Media file not found in persistent vault" },
      { status: 404 },
    );
  } catch (error) {
    console.error("[API][/api/media/file/[id]][GET]", error);
    return NextResponse.json(
      { ok: false, error: "Failed to serve media file" },
      { status: 500 },
    );
  }
}
