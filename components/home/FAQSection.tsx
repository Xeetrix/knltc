"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/components/layout/LanguageProvider";

const FAQSection = () => {
  const { language } = useLanguage();
  const content = {
    en: {
      title: "Frequently Asked Questions",
      desc: "Everything you need to know before starting your Japan journey.",
      faqs: [
        { q: "How much Japanese language is required?", a: "For most opportunities, JLPT N4 or N3 is required. KNLTC offers structured courses to help you reach the required level before application." },
        { q: "Can I study and work part-time in Japan?", a: "Yes! Students in Japan can legally work up to 28 hours per week. We'll guide you on how to manage your schedule effectively." },
        { q: "What services does KNLTC provide?", a: "We provide Japanese language training, job preparation, interview coaching, visa processing, pre-departure guidance, and Japan arrival support." },
      ],
    },
    bn: {
      title: "সাধারণ জিজ্ঞাসা",
      desc: "জাপান যাত্রা শুরু করার আগে যা জানা জরুরি।",
      faqs: [
        { q: "কতটুকু জাপানি ভাষা লাগবে?", a: "বেশিরভাগ সুযোগে JLPT N4 বা N3 লাগে। KNLTC কোর্সের মাধ্যমে আপনাকে প্রস্তুত করে।" },
        { q: "জাপানে পড়াশোনার সাথে পার্টটাইম কাজ করা যাবে?", a: "হ্যাঁ, শিক্ষার্থীরা আইনি ভাবে সপ্তাহে ২৮ ঘণ্টা পর্যন্ত কাজ করতে পারে।" },
        { q: "KNLTC কী কী সেবা দেয়?", a: "ভাষা প্রশিক্ষণ, চাকরি প্রস্তুতি, ইন্টারভিউ কোচিং, ভিসা প্রসেসিং, প্রি-ডিপার্চার ও আগমনের পর সাপোর্ট।" },
      ],
    },
    ja: {
      title: "よくある質問",
      desc: "日本への準備前に知っておきたいポイントです。",
      faqs: [
        { q: "どの程度の日本語力が必要ですか？", a: "多くの場合、JLPT N4またはN3が必要です。KNLTCが到達まで支援します。" },
        { q: "留学しながらアルバイトできますか？", a: "はい。学生は週28時間まで合法的に働けます。" },
        { q: "KNLTCのサービス内容は？", a: "日本語学習、就職準備、面接対策、ビザ、渡航前後サポートを提供します。" },
      ],
    },
  }[language];

  return (
    <section className="section-padding bg-surface"><div className="container-narrow max-w-3xl"><div className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">{content.title}</h2><p className="text-muted-foreground">{content.desc}</p></div><Accordion type="single" collapsible className="space-y-3">{content.faqs.map((faq, i) => (<AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-6 data-[state=open]:shadow-sm"><AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">{faq.q}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.a}</AccordionContent></AccordionItem>))}</Accordion></div></section>
  );
};

export default FAQSection;
