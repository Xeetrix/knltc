import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { CheckCircle2, FileCheck2, GraduationCap, Languages, MessageCircle, Plane, BriefcaseBusiness, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";
export const metadata: Metadata = {
  title: "Services",
  description: "KNLTC service hub for Japanese language training, study/work pathways, and complete guidance support.",
};

type ServiceCard = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: string[];
};

const serviceCards: ServiceCard[] = [
  {
    title: "Japanese Language Training",
    icon: Languages,
    items: ["JLPT N5 to N1", "Spoken Japanese", "Hiragana, Katakana, Kanji", "Grammar, vocabulary, listening, reading", "Interview communication practice"],
  },
  {
    title: "Study in Japan",
    icon: GraduationCap,
    items: ["School/program guidance", "Application support", "Document preparation", "Interview preparation", "Student visa guidance", "Pre-departure preparation"],
  },
  {
    title: "Work in Japan",
    icon: BriefcaseBusiness,
    items: ["Eligibility/profile assessment", "Career pathway guidance", "Japanese workplace culture", "Interview preparation", "Documentation support", "Pre-departure guidance"],
  },
  {
    title: "Visa & Documentation Support",
    icon: FileCheck2,
    items: ["Document checklist", "File preparation", "Review and correction", "Submission guidance"],
  },
  {
    title: "Interview & Career Preparation",
    icon: BadgeCheck,
    items: ["Mock interview", "CV/profile preparation", "Communication coaching", "Confidence building"],
  },
  {
    title: "Pre-Departure & Japan Life Guidance",
    icon: Plane,
    items: ["Travel preparation", "Accommodation/basic living guidance", "Culture and rules", "Arrival and settlement guidance"],
  },
];

export default function ServicesPage() {
  return (
    <section className="section-padding bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container-narrow space-y-10 md:space-y-14">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-card/90 p-6 text-center shadow-sm backdrop-blur sm:p-8 md:p-12">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            <CheckCircle2 className="h-4 w-4" />
            KNLTC Service Hub
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">Services Designed for Your Japan Journey</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base md:text-lg">
            From language mastery to admission, career, visa, and settlement support, KNLTC provides structured and reliable guidance at every stage.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/contact">Free Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Now
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="h-full border-border/80 bg-card/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="space-y-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl leading-tight">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground/85">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
