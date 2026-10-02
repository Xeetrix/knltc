"use client";

import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function CurriculumFaqSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        faqBadge: "Frequently Asked Questions",
        faqTitle: "Common Inquiries & Answers (FAQ)",
        faqSub:
          "Clear answers regarding course enrollment, installment fee options, online LMS access, and visa processing.",
        helpTitle: "Have any other questions?",
        helpSub: "Speak directly with our senior admission counseling team on WhatsApp.",
        btnHelp: "Ask on WhatsApp",
        faqs: [
          {
            q: "Is it possible to pay the course fee in installments?",
            a: "Yes! At KNLTC, students can pay in 2 easy installments. You can book your seat with a 50% deposit and pay the remaining 50% thirty days after classes commence.",
          },
          {
            q: "I have no prior Japanese knowledge. Can I start from scratch?",
            a: "Absolutely! The N5 course is designed from ground zero. Starting from proper stroke orders of Hiragana and Katakana alphabets and native pronunciation, no prior experience is required.",
          },
          {
            q: "How does the online LMS classroom work and how do I log in?",
            a: "All online courses, live Zoom classes, and recorded lectures are hosted on our dedicated platform: https://npw.bd/knltc. After submitting your enrollment form, our team verifies your payment and delivers your LMS username and password directly via WhatsApp. You can log in anytime from phone or PC.",
          },
          {
            q: "Are there any separate or hidden charges for textbooks and worksheets?",
            a: "No, there are zero hidden fees. Upon enrollment, Minna No Nihongo textbooks, Kanji practice workbooks, grammar note handouts, and audio files are provided 100% free of charge.",
          },
          {
            q: "Are the 15-Day Embassy Interview & CV courses truly free?",
            a: "Yes! All regularly enrolled N5 students receive our 3 exclusive specialized bonus courses (Embassy Interview, Japanese Resume Writing, and Part-time Job Interview Training worth ৳15,000) completely free.",
          },
          {
            q: "Will class recordings be provided for online batches?",
            a: "Yes! Every single live interactive class is recorded in HD and archived inside your KNLTC LMS student account. If you miss a class or want to revise, you can watch it anytime.",
          },
          {
            q: "Does KNLTC assist with official JLPT and JFT-Basic exam registrations?",
            a: "Yes! Our admission wing assists students from exam registration announcements, filling out online applications, fee payments, and downloading admit cards for official Japan Foundation exams.",
          },
          {
            q: "How does KNLTC assist with visa processing after language completion?",
            a: "KNLTC is a complete Japan Gateway. After your language certification, we connect you with recognized Japanese schools, colleges, and employers, handling Certificate of Eligibility (COE) filing and visa stamping.",
          },
        ],
      },
      bn: {
        faqBadge: "সাধারণ জিজ্ঞাসা ও উত্তর",
        faqTitle: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলি (FAQ)",
        faqSub:
          "কোর্স ফি, কিস্তির সুবিধা, অনলাইন LMS এক্সেস এবং ভিসা প্রসেসিং সংক্রান্ত স্পষ্ট উত্তর।",
        helpTitle: "আপনার কি আরো কিছু জানার আছে?",
        helpSub: "আমাদের সিনিয়র এডমিশন কাউন্সেলিং টিমের সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলুন।",
        btnHelp: "WhatsApp-এ জিজ্ঞাসা করুন",
        faqs: [
          {
            q: "কোর্স ফি কি কিস্তিতে পরিশোধ করা সম্ভব?",
            a: "হ্যাঁ! KNLTC-তে শিক্ষার্থীদের সুবিধার জন্য ২টি সহজ কিস্তিতে কোর্স ফি পরিশোধের ব্যবস্থা রয়েছে। ভর্তির সময় ৫০% ফি দিয়ে সিট নিশ্চিত করা যায় এবং ক্লাস শুরুর ৩০ দিন পর বাকি ৫০% পরিশোধ করা যাবে।",
          },
          {
            q: "আমার আগে কোনো জাপানিজ ভাষা জানা নেই, আমি কি শুরু করতে পারব?",
            a: "অবশ্যই! আমাদের N5 কোর্সটি সম্পূর্ণ শূন্য (Zero Level) থেকে ডিজাইন করা হয়েছে। একদম প্রথম ক্লাসে হিরাগানা ও কাতাকানা বর্ণমালার সঠিক স্ট্রোক অর্ডার ও ধ্বনি দিয়ে ক্লাস শুরু হয়। সুতরাং পূর্ব অভিজ্ঞতার কোনো প্রয়োজন নেই।",
          },
          {
            q: "অনলাইন লার্নিং প্ল্যাটফর্ম (LMS) কীভাবে কাজ করে এবং ক্লাসে কীভাবে যুক্ত হব?",
            a: "KNLTC-এর সমস্ত অনলাইন কোর্স, লাইভ জুম সেশন ও রিসোর্স সরাসরি https://npw.bd/knltc পোর্টালে হোস্ট করা। নিচের ফর্মে আবেদন করার পর আমাদের টিম আপনার তথ্য ও পেমেন্ট ভেরিফাই করে সরাসরি আপনার হোয়াটসঅ্যাপে LMS আইডি ও পাসওয়ার্ড পাঠিয়ে দেবে। লিংকে গিয়ে ইউজারনেম ও পাসওয়ার্ড দিয়ে খুব সহজেই ক্লাসরুমে প্রবেশ করতে পারবেন।",
          },
          {
            q: "বই এবং লেকচার শিটের জন্য আলাদা কোনো খরচ আছে কি?",
            a: "না, কোনো লুকানো বা অতিরিক্ত খরচ নেই। ভর্তির সাথে সাথেই মিন্না নো নিহোঙ্গো ১ ও ২ পাঠ্যবই, কাঞ্জি প্র্যাকটিস শিট, শব্দার্থ ও ব্যাকরণ নোট এবং অডিও ড্রিলস সম্পূর্ণ বিনামূল্যে সরবরাহ করা হয়।",
          },
          {
            q: "১৫ দিনের এম্বাসি ইন্টারভিউ ও সিভি বোনাস কোর্সগুলো কি সত্যিই ফ্রি?",
            a: "হ্যাঁ, N5 কোর্সের নিয়মিত শিক্ষার্থীদের জন্য ১৫,০০০ টাকা সমমূল্যের ৩টি স্পেশাল কোর্স (এম্বাসি ইন্টারভিউ, জাপানি রিজিউমি/সিভি রাইটিং এবং পার্ট-টাইম জব ইন্টারভিউ) সম্পূর্ণ বিনামূল্যে উপহার দেওয়া হয়।",
          },
          {
            q: "অনলাইন ব্যাচে ক্লাস করলে কি রেকর্ডিং পাওয়া যাবে?",
            a: "হ্যাঁ, প্রতিটি লাইভ ক্লাসের হাই-ডেফিনিশন রেকর্ডিং এবং লেকচার স্লাইড সরাসরি আপনার KNLTC শিক্ষার্থী অ্যাকাউন্টে সংরক্ষিত থাকে। কোনো কারণে ক্লাস মিস হলে আপনি যেকোনো সময় রেকর্ডিং দেখে রিভিশন দিতে পারবেন।",
          },
          {
            q: "JLPT ও JFT-Basic পরীক্ষার রেজিস্ট্রেশনে কি সহায়তা করা হয়?",
            a: "হ্যাঁ, জাপান ফাউন্ডেশন কর্তৃক আয়োজিত অফিসিয়াল JLPT ও JFT-Basic পরীক্ষার আবেদনের তারিখ ঘোষণা থেকে শুরু করে ফর্ম ফিলাপ, পরীক্ষার ফি জমা এবং এডমিট কার্ড ডাউনলোড পর্যন্ত সার্বিক সাপোর্ট আমাদের এডমিশন উইং প্রদান করে।",
          },
          {
            q: "ভাষা কোর্স শেষ করার পর ভিসা প্রসেসিংয়ে KNLTC কীভাবে সাহায্য করে?",
            a: "KNLTC শুধুমাত্র একটি ল্যাঙ্গুয়েজ স্কুল নয়, এটি পূর্ণাঙ্গ জাপান গেটওয়ে। ভাষা সফলভাবে শেষ করার পর আমরা শিক্ষার্থী ও চাকরিপ্রার্থীদের জন্য জাপানের স্বীকৃত স্কুল ও কোম্পানিতে স্পনসরশিপ ডকুমেন্টেশন, COE ফাইল সাবমিশন এবং এম্বাসি ফেস করার সম্পূর্ণ গাইডলাইন দিয়ে থাকি।",
          },
        ],
      },
      ja: {
        faqBadge: "よくあるご質問",
        faqTitle: "受講検討時のFAQ（よくある質問と回答）",
        faqSub:
          "受講料の分割払い、LMSログイン、教材手配、ビザ申請支援に関する疑問を解消いたします。",
        helpTitle: "その他にご不明点はございますか？",
        helpSub: "専任カウンセラーがWhatsAppにて直接ご相談を承ります。",
        btnHelp: "WhatsAppで質問する",
        faqs: [
          {
            q: "受講料の分割払いは可能ですか？",
            a: "はい、2回の分割払いが可能です。申込時に50%をお支払いいただき、開講30日後に残りの50%をお支払いいただけます。",
          },
          {
            q: "日本語の学習経験が全くありませんが、受講できますか？",
            a: "はい、完全な初心者向けに設計されています。ひらがな・カタカナの正確な書き順や発音指導から丁寧にスタートしますので、事前知識は一切不要です。",
          },
          {
            q: "オンラインLMS教室のログイン方法はどのようになりますか？",
            a: "受講講座およびオンライン授業は https://npw.bd/knltc にて提供されます。受講申請完了後、事務局より確認の上、WhatsAppにてログイン用IDとパスワードをお送りします。スマートフォンやPCからいつでもアクセス可能です。",
          },
          {
            q: "教材代やテキスト代は別途必要ですか？",
            a: "いいえ、別途料金は一切かかりません。『みんなの日本語』教科書、漢字ワークブック、文法プリント、音声教材はすべて受講料に含まれています。",
          },
          {
            q: "15日間の大使館面接対策や履歴書作成講座は本当に無料ですか？",
            a: "はい、N5通常受講生には、15,000タカ相当の大使館面接・履歴書作成・アルバイト面接の3大特典講座が全額無料で付帯します。",
          },
          {
            q: "オンライン受講の場合、授業の録画は視聴できますか？",
            a: "はい、すべてのライブ授業はハイビジョン録画され、公式LMS（https://npw.bd/knltc）にていつでも復習視聴が可能です。",
          },
          {
            q: "JLPTやJFT-Basicの本番申し込みもサポートしてもらえますか？",
            a: "はい、国際交流基金の公式試験日程の告知から願書記入、受験料納付、受験票受取までスタッフが全面的に代行・支援します。",
          },
          {
            q: "語学修了後のビザ申請手続きも支援してくれますか？",
            a: "はい、KNLTCは日本渡航総合機関として、語学修了後に提携する日本語学校・専門学校・受入れ企業へのCOE申請やビザ取得までワンストップでサポートします。",
          },
        ],
      },
    },
    language,
  );

  return (
    <section className="bg-[#fcfaf7]/50 py-16 md:py-24 border-b border-stone-200">
      <div className="container-narrow max-w-3xl">
        {/* Centered Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] mb-2">
            {t.faqBadge}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            {t.faqSub}
          </p>
        </div>

        {/* Clean, Centered FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {t.faqs.map((faq, fi) => (
            <AccordionItem
              key={fi}
              value={`faq-${fi}`}
              className="rounded-2xl border border-stone-200 bg-white px-5 py-1 shadow-xs data-[state=open]:border-red-200 transition"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base font-bold text-slate-900 hover:no-underline hover:text-[#b91c1c] py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed pb-4 pt-1 border-t border-stone-100 mt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Helpline Callout Box */}
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">{t.helpTitle}</h4>
            <p className="text-xs text-slate-600 mt-0.5">{t.helpSub}</p>
          </div>
          <Button
            asChild
            className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shrink-0 px-4 py-2"
          >
            <a
              href="https://wa.me/8801805013633?text=Hello%20KNLTC,%20I%20have%20questions%20about%20the%20Japanese%20Language%20Course."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t.btnHelp}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
