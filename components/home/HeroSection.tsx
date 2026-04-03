"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

const HeroSection = () => (
  <section className="relative flex min-h-[600px] items-center overflow-hidden md:min-h-[700px]">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-bg.jpg)" }} />
    <div className="absolute inset-0 bg-primary/75" />

    <div className="container-narrow relative z-10 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <span className="mb-6 inline-block rounded-full border border-accent-foreground/20 bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground">
          🇯🇵 Trusted Japan Guidance Agency
        </span>
        <h1 className="mb-6 text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Your Trusted Path from Bangladesh to Japan
        </h1>
        <p className="mb-8 max-w-xl text-lg text-primary-foreground/85 md:text-xl">
          Japanese language training, job preparation, interview support, visa guidance, and step-by-step assistance.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90">
            <Link href="/contact">Apply Now</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-whatsapp px-8 text-base font-semibold text-whatsapp-foreground hover:bg-whatsapp/90"
          >
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Us
            </a>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-primary-foreground/80">
          <span>✓ Clear process guidance</span>
          <span>✓ Transparent communication</span>
          <span>✓ Ongoing support</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
