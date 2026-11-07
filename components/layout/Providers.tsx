"use client";

import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import InteractiveCursor from "@/components/layout/InteractiveCursor";
import { fetchLiveStoreFromServer } from "@/lib/knltc-cms-store";

function GlobalLiveCmsSync() {
  useEffect(() => {
    void fetchLiveStoreFromServer();

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        void fetchLiveStoreFromServer();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <TooltipProvider>
        <GlobalLiveCmsSync />
        <InteractiveCursor />
        {children}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </LanguageProvider>
  );
}


