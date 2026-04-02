"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Study in Japan", href: "/study-in-japan" },
  { label: "Work in Japan", href: "/work-in-japan" },
  { label: "Japanese Language", href: "/japanese-language" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="bg-foreground py-2 text-sm text-white">
        <div className="container-narrow flex items-center justify-between gap-3">
          <a href={siteConfig.phoneHref} className="flex items-center gap-1.5 font-medium hover:text-primary">
            <Phone className="h-3.5 w-3.5" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
          <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-medium text-primary-foreground hover:text-primary">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            <span>WhatsApp: {siteConfig.whatsappDisplay}</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container-narrow flex h-20 items-center justify-between">
          <BrandLogo />

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={`text-sm font-medium transition-colors ${pathname === link.href ? "text-accent" : "text-foreground/80 hover:text-accent"}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden bg-primary font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex">
              <Link href="/contact">Apply Now</Link>
            </Button>
            <button className="p-2 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="space-y-3 border-t bg-background px-4 py-4 lg:hidden">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="block text-sm font-medium text-foreground/80 hover:text-accent" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
