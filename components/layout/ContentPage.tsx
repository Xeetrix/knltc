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
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 sm:p-8 md:p-12">
          <h1 className="mb-5 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-[2.65rem]">{title[language]}</h1>
          <p className="mb-8 text-[1.02rem] leading-[1.8] text-muted-foreground sm:text-lg">{description[language]}</p>
          <ul className="mb-9 space-y-3.5 text-sm leading-relaxed text-foreground/90 sm:mb-11 sm:text-base">
            {points.map((point, index) => (
              <li key={index}>• {point[language]}</li>
            ))}
          </ul>
          <Button asChild className="w-full bg-accent text-sm font-semibold tracking-wide text-accent-foreground hover:bg-accent/90 sm:w-auto sm:text-base">
            <Link href="/contact">{language === "bn" ? "অ্যাডভাইজরের সাথে কথা বলুন" : language === "ja" ? "アドバイザーに相談" : "Talk to an Advisor"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
