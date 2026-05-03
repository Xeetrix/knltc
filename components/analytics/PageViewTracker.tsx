"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { fbq } from "@/lib/fbq";

export default function PageViewTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!pathname) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    fbq("track", "PageView");
  }, [pathname]);

  return null;
}
