"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __knltcTrackedPageViews?: Set<string>;
    __knltcRecentEvents?: Map<string, number>;
  }
}

function canTrack() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function shouldSendDedupedEvent(key: string, ttlMs = 1200) {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  if (!window.__knltcRecentEvents) {
    window.__knltcRecentEvents = new Map<string, number>();
  }

  const lastSentAt = window.__knltcRecentEvents.get(key);
  if (typeof lastSentAt === "number" && now - lastSentAt < ttlMs) {
    return false;
  }

  window.__knltcRecentEvents.set(key, now);
  return true;
}

export function trackPageView(pathWithQuery: string) {
  if (!canTrack()) return;

  if (!window.__knltcTrackedPageViews) {
    window.__knltcTrackedPageViews = new Set<string>();
  }

  if (window.__knltcTrackedPageViews.has(pathWithQuery)) return;

  window.fbq?.("track", "PageView");
  window.__knltcTrackedPageViews.add(pathWithQuery);
}

export function trackLead() {
  if (!canTrack()) return;

  window.fbq?.("track", "Lead");
}

export function trackWhatsAppClick(source: string) {
  if (!canTrack()) return;

  const key = `whatsapp:${source}`;
  if (!shouldSendDedupedEvent(key)) return;

  window.fbq?.("trackCustom", "WhatsAppClick", { source });
}

export function trackApplyNowClick(source: string) {
  if (!canTrack()) return;

  const key = `apply:${source}`;
  if (!shouldSendDedupedEvent(key)) return;

  window.fbq?.("trackCustom", "ApplyNowClick", { source });
}
