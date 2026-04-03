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
        {
          q: "What kind of services do you provide?",
          a: `We provide complete support from Bangladesh to Japan for both Work Visa and Student Visa processes.
• Japanese language training
• Skill training based on Japanese company requirements
• Interview setup with Japanese companies
• Visa processing guidance
• Necessary support after arriving in Japan
In short, we support you from the beginning until you settle in Japan.`,
        },
        {
          q: "What qualifications are needed to go to Japan?",
          a: `For a Student Visa, you generally need:
• At least SSC/HSC or equivalent education
• Interest in studying
• Willingness to learn Japanese

For a Work Visa, you generally need:
• Interest in learning the job
• Physical ability to work
• Willingness to learn Japanese

No need to worry — we prepare you for both language and work requirements.`,
        },
        {
          q: "Do I need to know Japanese beforehand?",
          a: "No, prior knowledge is not required. If you apply through us, we guide you from Japanese language learning to full interview preparation.",
        },
        {
          q: "What types of jobs are available in Japan?",
          a: `Common job sectors in Japan include:
• Factory / Manufacturing
• Food processing
• Caregiver
• Agriculture
• Hotel / Restaurant
Job placement depends on company demand and your skills.`,
        },
        {
          q: "How much can I earn per month in Japan?",
          a: "In many roles, monthly income is around 💴 150,000 – 250,000 yen or more. Earnings can increase with experience.",
        },
        {
          q: "How long does the full process take?",
          a: `Usually, the complete process takes about ⏳ 6 to 12 months.
However, timeline depends on language progress, interviews, company approval, and visa processing.`,
        },
        {
          q: "Will I get support after arriving in Japan?",
          a: `Yes, absolutely. Even after arrival, we try to support you so that you can:
• Join your company smoothly
• Adjust to the new environment
• Receive guidance whenever needed`,
        },
        {
          q: "Is there an opportunity to study in Japan?",
          a: `Yes. Through a Student Visa, you can:
• Study at a language school
• Work part-time at the same time
Many students later build strong careers through this path.`,
        },
        {
          q: "What is the application process?",
          a: `The process is usually:
1️⃣ Initial consultation
2️⃣ Japanese language training
3️⃣ Document preparation
4️⃣ Company interview
5️⃣ Visa process
6️⃣ Travel to Japan`,
        },
        {
          q: "How can I apply?",
          a: "You can contact us for a free consultation. Our team will explain the full process and suggest the best path for your goals.",
        },
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
        {
          q: "どのようなサービスを提供していますか？",
          a: `当社は、バングラデシュから日本への Work Visa・Student Visa の両方で、全体を通してサポートします。
• 日本語学習サポート
• 日本企業の要件に合わせたトレーニング
• 日本企業との面接設定
• ビザ申請のガイダンス
• 渡日後の必要サポート
つまり、準備開始から日本到着後まで一貫して支援します。`,
        },
        {
          q: "日本へ行くために必要な条件は？",
          a: `Student Visa の一般的な条件:
• SSC / HSC または同等の学歴
• 学習意欲
• 日本語を学ぶ意思

Work Visa の一般的な条件:
• 仕事を学ぶ意欲
• 身体的に働けること
• 日本語を学ぶ意思

心配はいりません。言語面・就業面の準備を私たちがサポートします。`,
        },
        {
          q: "事前に日本語が必要ですか？",
          a: "いいえ、事前知識は必須ではありません。当社経由で応募した場合、日本語学習から面接準備まで丁寧に案内します。",
        },
        {
          q: "日本ではどんな仕事がありますか？",
          a: `日本で多い職種:
• 工場・製造
• 食品加工
• 介護
• 農業
• ホテル・レストラン
配属は企業ニーズとご本人のスキルによって決まります。`,
        },
        {
          q: "日本での月収はどのくらいですか？",
          a: "多くの場合、月収はおよそ 💴 150,000～250,000 円以上です。経験によりさらに増える可能性があります。",
        },
        {
          q: "手続き全体にはどれくらい時間がかかりますか？",
          a: `通常、全体の期間は約 ⏳ 6～12か月です。
ただし、日本語学習の進度、面接、企業承認、ビザ手続きによって変動します。`,
        },
        {
          q: "日本到着後もサポートはありますか？",
          a: `はい、あります。到着後も次の点を中心にサポートします:
• 会社へスムーズに入社できること
• 新しい生活環境に適応できること
• 必要時にガイダンスを受けられること`,
        },
        {
          q: "日本で勉強するチャンスはありますか？",
          a: `はい。Student Visa で渡日すると:
• 日本語学校で学習できる
• 同時にアルバイトができる
このルートで将来のキャリアを築く方も多くいます。`,
        },
        {
          q: "応募の流れを教えてください。",
          a: `一般的な流れ:
1️⃣ 初回カウンセリング
2️⃣ 日本語トレーニング
3️⃣ 書類準備
4️⃣ 企業面接
5️⃣ ビザ手続き
6️⃣ 渡日`,
        },
        {
          q: "どうやって申し込めますか？",
          a: "無料相談にご連絡ください。担当チームが全体の流れを説明し、あなたに最適な進路をご提案します。",
        },
      ],
    },
  }[language];

  return (
    <section className="section-padding bg-surface"><div className="container-narrow max-w-3xl"><div className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">{content.title}</h2><p className="text-muted-foreground">{content.desc}</p></div><Accordion type="single" collapsible className="space-y-3">{content.faqs.map((faq, i) => (<AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-6 data-[state=open]:shadow-sm"><AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">{faq.q}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line pb-5">{faq.a}</AccordionContent></AccordionItem>))}</Accordion></div></section>
  );
};

export default FAQSection;
