"use client";

import { canUseFbq, fbq } from "./fbq";

declare global {
  interface Window {
    __knltcTrackedPageViews?: Set<string>;
    __knltcRecentEvents?: Map<string, number>;
  }
}

function canTrack() {
  return canUseFbq();
}

function shouldSendDedupedEvent(key: string, ttlMs = 1200) {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  if (!window.__knltcRecentEvents) window.__knltcRecentEvents = new Map<string, number>();
  const lastSentAt = window.__knltcRecentEvents.get(key);
  if (typeof lastSentAt === "number" && now - lastSentAt < ttlMs) return false;
  window.__knltcRecentEvents.set(key, now);
  return true;
}

export function trackPageView(pathWithQuery: string) {
  if (!canTrack()) return;
  if (!window.__knltcTrackedPageViews) window.__knltcTrackedPageViews = new Set<string>();
  if (window.__knltcTrackedPageViews.has(pathWithQuery)) return;
  fbq("track", "PageView");
  window.__knltcTrackedPageViews.add(pathWithQuery);
}

export function trackViewContent(payload: { content_name: string; content_category: string }) {
  if (!canTrack()) return;
  fbq("track", "ViewContent", payload);
}

export function trackLead(payload?: { content_name: string; content_category: string }) {
  if (!canTrack()) return;
  fbq("track", "Lead", payload);
}

export function trackWhatsAppClick(source: string) {
  if (!canTrack()) return;
  if (!shouldSendDedupedEvent(`whatsapp:${source}`)) return;
  fbq("trackCustom", "WhatsAppClick", { source });
}

export function trackApplyNowClick(source: string) {
  if (!canTrack()) return;
  if (!shouldSendDedupedEvent(`apply:${source}`)) return;
  fbq("trackCustom", "ApplyNowClick", { source });
}
