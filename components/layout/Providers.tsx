"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import InteractiveCursor from "@/components/layout/InteractiveCursor";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <TooltipProvider>
        <InteractiveCursor />
        {children}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </LanguageProvider>
  );
}

