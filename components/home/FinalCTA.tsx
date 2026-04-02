"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

const FinalCTA = () => (
  <section className="section-padding bg-primary">
    <div className="container-narrow text-center">
      <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground md:text-4xl">
        Ready to Start Your Journey to Japan?
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
        Take the first step today. Our team is ready to guide you at every stage.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild size="lg" className="bg-white px-8 text-base font-bold text-primary hover:bg-white/90">
          <Link href="/contact">Apply Now</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-accent px-8 text-base font-semibold text-accent hover:bg-accent/10">
          <Link href="/contact">Book Free Consultation</Link>
        </Button>
        <Button asChild size="lg" className="bg-whatsapp px-8 text-base font-semibold text-whatsapp-foreground hover:bg-whatsapp/90">
          <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp Us
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default FinalCTA;
