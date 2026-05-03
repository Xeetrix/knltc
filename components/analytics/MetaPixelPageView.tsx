"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { fbq } from "@/lib/fbq";

export default function MetaPixelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    fbq("track", "PageView");
  }, [pathname]);

  return null;
}
