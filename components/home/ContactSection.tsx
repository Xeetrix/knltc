"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding">
      <div className="container-narrow">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">Contact Us</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have questions? Reach out through any channel — we&apos;re here to help.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Phone</h4>
                <a href={siteConfig.phoneHref} className="text-muted-foreground hover:underline">
                  {siteConfig.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-whatsapp/10">
                <MessageCircle className="h-5 w-5 text-whatsapp" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">WhatsApp</h4>
                <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-whatsapp hover:underline">
                  {siteConfig.whatsappDisplay}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Email</h4>
                <a href={`mailto:${siteConfig.email}`} className="text-muted-foreground hover:underline">
                  {siteConfig.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Office Address</h4>
                <p className="text-muted-foreground">{siteConfig.location}</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
