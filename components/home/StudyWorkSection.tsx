"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const blocks = [
  {
    icon: GraduationCap,
    title: "Study in Japan",
    desc: "Get step-by-step help with admissions planning, documentation, and student visa preparation.",
    cta: "Learn More",
    href: "/study-in-japan",
  },
  {
    icon: Briefcase,
    title: "Work in Japan",
    desc: "Prepare for Japan-focused careers with language practice, interview readiness, and application support.",
    cta: "Apply Now",
    href: "/work-in-japan",
  },
];

const StudyWorkSection = () => (
  <section id="study-work" className="section-padding bg-surface">
    <div className="container-narrow">
      <div className="grid gap-8 md:grid-cols-2">
        {blocks.map((block, i) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="rounded-lg border bg-card p-8 transition-shadow hover:shadow-md md:p-10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <block.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-extrabold text-foreground">{block.title}</h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">{block.desc}</p>
            <Button asChild className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
              <Link href={block.href}>
                {block.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StudyWorkSection;
