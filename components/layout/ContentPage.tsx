"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { LocalizedField } from "@/lib/i18n";

type ContentPageProps = {
  title: LocalizedField;
  description: LocalizedField;
  points: Array<LocalizedField>;
};

export default function ContentPage({ title, description, points }: ContentPageProps) {
  const { language } = useLanguage();

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-5 sm:p-7 md:p-12">
          <h1 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{title[language]}</h1>
          <p className="mb-7 text-base text-muted-foreground sm:text-lg">{description[language]}</p>
          <ul className="mb-8 space-y-3 text-sm text-foreground/90 sm:mb-10 sm:text-base">
            {points.map((point, index) => (
              <li key={index}>• {point[language]}</li>
            ))}
          </ul>
          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
            <Link href="/contact">{language === "bn" ? "অ্যাডভাইজরের সাথে কথা বলুন" : language === "ja" ? "アドバイザーに相談" : "Talk to an Advisor"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
