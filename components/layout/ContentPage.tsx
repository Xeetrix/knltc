"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Language } from "@/lib/i18n";

type LocalizedField = Record<Language, string>;

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
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 md:p-12">
          <h1 className="mb-4 text-4xl font-extrabold text-foreground">{title[language]}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{description[language]}</p>
          <ul className="mb-10 space-y-3 text-foreground/90">
            {points.map((point, index) => (
              <li key={index}>• {point[language]}</li>
            ))}
          </ul>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/contact">{language === "bn" ? "অ্যাডভাইজরের সাথে কথা বলুন" : language === "ja" ? "アドバイザーに相談" : "Talk to an Advisor"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
