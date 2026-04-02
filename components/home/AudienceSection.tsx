"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

const segments = [
  {
    icon: Briefcase,
    title: "For Job Seekers",
    description: "Prepare for opportunities in Japan with practical training and clear guidance.",
    cta: "Explore Jobs",
    href: "/work-in-japan",
  },
  {
    icon: GraduationCap,
    title: "For Students",
    description: "Get support for admissions, language preparation, and your study plan in Japan.",
    cta: "Study in Japan",
    href: "/study-in-japan",
  },
  {
    icon: Languages,
    title: "Learn Japanese",
    description: "Build confidence in Japanese from beginner to advanced levels with structured courses.",
    cta: "Start Learning",
    href: "/japanese-language",
  },
];

const AudienceSection = () => (
  <section className="section-padding bg-surface">
    <div className="container-narrow">
      <div className="mb-14 text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">How Can We Help You?</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Whether you want to work, study, or learn Japanese — KNLTC has a clear path for you.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="rounded-lg border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <seg.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-foreground">{seg.title}</h3>
            <p className="mb-5 leading-relaxed text-muted-foreground">{seg.description}</p>
            <Button asChild variant="outline" size="sm" className="font-semibold">
              <Link href={seg.href}>{seg.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceSection;
