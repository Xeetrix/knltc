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
        {
          q: "আপনারা কী ধরনের সার্ভিস দেন?",
          a: `আমরা বাংলাদেশ থেকে জাপানে Work Visa এবং Student Visa—এই দুই ধরনের প্রসেসে সম্পূর্ণ সহায়তা করি।
• জাপানিজ ভাষা শেখানো
• জাপানের কোম্পানির চাহিদা অনুযায়ী ট্রেনিং
• জাপানিজ কোম্পানির সাথে ইন্টারভিউ সেটআপ
• ভিসা প্রসেসিং গাইডলাইন
• জাপানে যাওয়ার পর প্রয়োজনীয় সাপোর্ট
অর্থাৎ, শুরু থেকে জাপানে পৌঁছানো পর্যন্ত পুরো প্রসেসে আমরা পাশে থাকি।`,
        },
        {
          q: "জাপানে যাওয়ার জন্য কী কী যোগ্যতা প্রয়োজন?",
          a: `Student Visa এর জন্য সাধারণত লাগে:
• অন্তত SSC / HSC বা সমমানের শিক্ষা
• পড়াশোনা করার আগ্রহ
• জাপানিজ ভাষা শেখার ইচ্ছা

Work Visa এর জন্য সাধারণত লাগে:
• কাজ শেখার আগ্রহ
• শারীরিকভাবে কাজ করার সক্ষমতা
• জাপানিজ ভাষা শেখার ইচ্ছা

ভয় পাওয়ার কিছু নেই — আমরা ভাষা ও কাজের জন্য প্রস্তুত করিয়ে দিই।`,
        },
        {
          q: "জাপানিজ ভাষা কি আগে থেকেই জানতে হবে?",
          a: "না, আগে থেকেই জানার প্রয়োজন নেই। আমাদের মাধ্যমে আবেদন করলে আমরা আপনাকে জাপানিজ ভাষা শেখানো থেকে শুরু করে ইন্টারভিউ প্রস্তুতি পর্যন্ত সম্পূর্ণ গাইড করি।",
        },
        {
          q: "জাপানে গেলে কী ধরনের কাজ পাওয়া যায়?",
          a: `জাপানে সাধারণত নিচের ধরনের কাজ পাওয়া যায়:
• ফ্যাক্টরি / ম্যানুফ্যাকচারিং
• ফুড প্রসেসিং
• কেয়ারগিভার
• কৃষি কাজ
• হোটেল / রেস্টুরেন্ট
কাজের ধরন নির্ভর করে কোম্পানির চাহিদা এবং আপনার দক্ষতার উপর।`,
        },
        {
          q: "জাপানে গেলে মাসে কত টাকা আয় করা যায়?",
          a: "জাপানে কাজ করলে সাধারণত মাসে প্রায় 💴 ১,৫০,০০০ – ২,৫০,০০০ ইয়েন বা তার বেশি আয় করা সম্ভব। অভিজ্ঞতা বাড়লে আয় আরও বাড়তে পারে।",
        },
        {
          q: "পুরো প্রসেস করতে কত সময় লাগে?",
          a: `সাধারণত পুরো প্রসেস সম্পন্ন হতে সময় লাগে প্রায় ⏳ ৬ মাস থেকে ১২ মাস।
তবে এটা নির্ভর করে ভাষা শেখা, ইন্টারভিউ, কোম্পানির অনুমোদন এবং ভিসা প্রসেসের উপর।`,
        },
        {
          q: "জাপানে যাওয়ার পর কি কোনো সাপোর্ট পাব?",
          a: `হ্যাঁ, অবশ্যই। জাপানে যাওয়ার পরও আমরা চেষ্টা করি যেন আপনি:
• কোম্পানিতে যোগ দিতে পারেন সহজে
• নতুন পরিবেশে মানিয়ে নিতে পারেন
• প্রয়োজন হলে গাইডলাইন পান`,
        },
        {
          q: "জাপানে পড়াশোনা করার সুযোগ আছে কি?",
          a: `হ্যাঁ, Student Visa এর মাধ্যমে জাপানে গিয়ে:
• ভাষা স্কুলে পড়াশোনা করা যায়
• পাশাপাশি পার্ট‑টাইম কাজ করা যায়
এর মাধ্যমে অনেকেই পরে ভালো ক্যারিয়ার তৈরি করতে পারে।`,
        },
        {
          q: "আবেদন করার প্রসেস কী?",
          a: `প্রসেস সাধারণত এমন হয়:
1️⃣ প্রাথমিক কনসালটেশন
2️⃣ জাপানিজ ভাষা ট্রেনিং
3️⃣ ডকুমেন্ট প্রস্তুতি
4️⃣ কোম্পানি ইন্টারভিউ
5️⃣ ভিসা প্রসেস
6️⃣ জাপানে যাত্রা`,
        },
        {
          q: "কিভাবে আবেদন করবো?",
          a: "আপনি চাইলে আমাদের সাথে যোগাযোগ করে ফ্রি কনসালটেশন নিতে পারেন। আমাদের টিম আপনাকে পুরো প্রসেস সম্পর্কে বিস্তারিত বুঝিয়ে দেবে এবং আপনার জন্য কোন পথটি সবচেয়ে ভালো হবে তা জানাবে।",
        },
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
    <section className="section-padding bg-surface"><div className="container-narrow max-w-3xl"><div className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">{content.title}</h2><p className="text-muted-foreground">{content.desc}</p></div><Accordion type="single" collapsible className="space-y-3">{content.faqs.map((faq, i) => (<AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-6 data-[state=open]:shadow-sm"><AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">{faq.q}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line pb-5">{faq.a}</AccordionContent></AccordionItem>))}</Accordion></div></section>
  );
};

export default FAQSection;
