const rawMetaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const hasValidMetaPixelId =
  Boolean(rawMetaPixelId) && rawMetaPixelId !== "YOUR_PIXEL_ID" && rawMetaPixelId?.toLowerCase() !== "null";

export const META_PIXEL_ID = hasValidMetaPixelId ? rawMetaPixelId : null;
