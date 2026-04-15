"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function BenefitsSection() {
  const { language } = useLanguage();
  const t = translate(
    {
      en: {
        title: "Benefits You Get with KNLTC",
        desc: "Everything designed to improve your chances for study or work in Japan.",
        items: [
          "Personalized roadmap based on your profile",
          "Guided document preparation and review",
          "Interview coaching with practical mock sessions",
          "Visa-focused support with clear checklist",
          "Pre-departure and settlement guidance",
          "Friendly support team via phone and WhatsApp",
        ],
      },
      bn: {
        title: "KNLTC-এর সাথে যেসব সুবিধা পাবেন",
        desc: "জাপানে পড়াশোনা বা কাজের সম্ভাবনা বাড়াতে সম্পূর্ণ পরিকল্পিত সহায়তা।",
        items: [
          "আপনার প্রোফাইল অনুযায়ী ব্যক্তিগত রোডম্যাপ",
          "ডকুমেন্ট প্রস্তুতি ও রিভিউ সাপোর্ট",
          "প্র্যাকটিক্যাল মকসহ ইন্টারভিউ কোচিং",
          "ভিসা ফোকাসড পরিষ্কার চেকলিস্ট সাপোর্ট",
          "যাত্রার আগে ও জাপানে সেটেলমেন্ট গাইডলাইন",
          "ফোন ও হোয়াটসঅ্যাপে ফ্রেন্ডলি সাপোর্ট টিম",
        ],
      },
      ja: {
        title: "KNLTCで得られるメリット",
        desc: "日本での進学・就職の可能性を高めるための実践サポート。",
        items: [
          "プロフィールに合わせた個別ロードマップ",
          "書類準備とレビュー支援",
          "実践的な模擬面接を含む面接対策",
          "ビザ申請に特化した明確なチェックリスト",
          "渡航前・定着までの生活ガイダンス",
          "電話とWhatsAppでの迅速サポート",
        ],
      },
    },
    language,
  );

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{t.title}</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">{t.desc}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {t.items.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border bg-card p-4 sm:p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-foreground sm:text-base">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
