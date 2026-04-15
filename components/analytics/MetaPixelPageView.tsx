"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/meta-pixel";

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();

  const pathWithQuery = useMemo(() => (queryString ? `${pathname}?${queryString}` : pathname), [pathname, queryString]);

  useEffect(() => {
    trackPageView(pathWithQuery);
  }, [pathWithQuery]);

  return null;
}
