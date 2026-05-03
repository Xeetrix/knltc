"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/meta-pixel";

export default function SswViewContentTracker() {
  useEffect(() => {
    trackViewContent({
      content_name: "SSW Visa Campaign",
    });
  }, []);

  return null;
}
