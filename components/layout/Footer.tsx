import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-foreground py-12 text-white/80">
      <div className="container-narrow">
        <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 rounded bg-white p-3 w-fit">
              <BrandLogo compact />
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted partner for Japan recruitment and training from Bangladesh.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="transition-colors hover:text-primary">Services</Link></li>
              <li><Link href="/study-in-japan" className="transition-colors hover:text-primary">Study in Japan</Link></li>
              <li><Link href="/work-in-japan" className="transition-colors hover:text-primary">Work in Japan</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">Core Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Japanese Language Training</li>
              <li>Job Placement Support</li>
              <li>Visa Documentation Guidance</li>
              <li>Interview Preparation</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> <a href={siteConfig.phoneHref} className="hover:text-primary">{siteConfig.phoneDisplay}</a></li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-accent" /> <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">{siteConfig.email}</a></li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {siteConfig.location}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-sm">© {new Date().getFullYear()} KNLTC. All rights reserved.</div>
      </div>
    </footer>
  );
}
