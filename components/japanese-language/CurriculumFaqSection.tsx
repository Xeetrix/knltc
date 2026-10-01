"use client";

import {
  MessageCircle,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function CurriculumFaqSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        syllabusBadge: "Curriculum Roadmap",
        syllabusTitle: "N5 Course Week-by-Week Syllabus",
        syllabusSub:
          "Structured 12-week roadmap ensuring every student masters the syllabus and mock revisions before official exams.",
        hoursLabel: "10 Hours Lecture + Practice",
        faqBadge: "Frequently Asked Questions",
        faqTitle: "Common Inquiries & Answers (FAQ)",
        faqSub:
          "Clear answers regarding course enrollment, installment fee options, class recordings, and visa milestones.",
        helpTitle: "Have any other questions?",
        helpSub: "Speak directly with our senior admission counseling team.",
        btnHelp: "Ask on WhatsApp",
        weeks: [
          {
            w: "Weeks 1 - 2",
            t: "Alphabet & Phonetic Accuracy (Script Mastery)",
            d: "All 92 Hiragana and Katakana characters, Dakuon, Handakuon, long vowels, and standard Romaji pronunciation.",
          },
          {
            w: "Weeks 3 - 4",
            t: "Minna No Nihongo Lessons 1 to 6",
            d: "Self-introductions, question formation (Ka), demonstrative pronouns (Kore/Sore/Are), location, and daily activities.",
          },
          {
            w: "Weeks 5 - 6",
            t: "Minna No Nihongo Lessons 7 to 12 + Kanji 01",
            d: "Tools & instruments (De particle), transactions (Ageru/Morau), adjectives (I/Na-adjectives), and first 50 basic Kanji.",
          },
          {
            w: "Weeks 7 - 8",
            t: "Minna No Nihongo Lessons 13 to 18 + Kanji 02",
            d: "Desires (Tai-form), directional verbs, polite requests (Te-kudasai), prohibitions, and continuous states (Te-iru).",
          },
          {
            w: "Weeks 9 - 10",
            t: "Minna No Nihongo Lessons 19 to 25",
            d: "Past experiences (Ta-form koto ga aru), casual speech (Futsuukei), opinions (To omoimasu), and conditional (Tara-form).",
          },
          {
            w: "Weeks 11 - 12",
            t: "5 Full-Length Mock Tests & Embassy Interview Drills",
            d: "JLPT N5 and JFT-Basic simulation questions, listening speed reflexes, and embassy visa officer mock simulations.",
          },
        ],
        faqs: [
          {
            q: "Can the course fee be paid in installments?",
            a: "Yes! At KNLTC, students can conveniently pay their course fee in 2 equal installments. Confirm your seat with 50% at admission, and clear the remaining 50% after 30 days of classes.",
          },
          {
            q: "I have zero prior knowledge of Japanese. Can I start this course?",
            a: "Absolutely! Our N5 course is built from the ground up for complete beginners. Class 1 starts with basic Hiragana and Katakana stroke orders and phonetic pronunciation. No prior knowledge is needed.",
          },
          {
            q: "Are there any separate or hidden charges for textbooks and worksheets?",
            a: "No, there are zero hidden fees. Upon enrollment, Minna No Nihongo Part 1 & 2 textbooks, Kanji practice workbooks, grammar note handouts, and audio files are provided 100% free of charge.",
          },
          {
            q: "Are the 15-Day Embassy Interview & CV courses truly free?",
            a: "Yes! All regularly enrolled N5 students receive our 3 exclusive specialized bonus courses (Embassy Interview, Japanese Resume Writing, and Part-time Job Interview Training worth ৳15,000) completely free.",
          },
          {
            q: "How does the online LMS classroom work and how do I log in?",
            a: "All online courses, live Zoom classes, and recorded lectures are hosted on our dedicated platform: https://npw.bd/knltc. After submitting your enrollment form, our team verifies your payment and delivers your LMS username and password directly via WhatsApp. You can log in anytime from phone or PC.",
          },
          {
            q: "Will class recordings be provided for online batches?",
            a: "Yes! Every single live interactive class is recorded in HD and archived inside your https://npw.bd/knltc student account. If you miss a class or want to revise, you can watch it anytime.",
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
        syllabusBadge: "সিলেবাস রোডম্যাপ",
        syllabusTitle: "N5 কোর্সের সপ্তাহভিত্তিক সিলেবাস",
        syllabusSub:
          "১২ সপ্তাহের সুনির্দিষ্ট পরিকল্পনা, যাতে প্রতিটি শিক্ষার্থী পরীক্ষার আগেই সিলেবাস ও রিভিশন শেষ করতে পারেন।",
        hoursLabel: "১০ ঘণ্টা লেকচার + প্র্যাকটিস",
        faqBadge: "সাধারণ জিজ্ঞাসা ও উত্তর",
        faqTitle: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলি (FAQ)",
        faqSub:
          "ভর্তি প্রক্রিয়া, ফি এবং ক্লাস সম্পর্কিত আপনার প্রয়োজনীয় সব উত্তর এখানে দেওয়া হয়েছে।",
        helpTitle: "অন্য কোনো প্রশ্ন আছে?",
        helpSub: "আমাদের সিনিয়র কাউন্সিলরদের সাথে সরাসরি কথা বলুন।",
        btnHelp: "হোয়াটসঅ্যাপে প্রশ্ন করুন",
        weeks: [
          {
            w: "সপ্তাহ ১ - ২",
            t: "বর্ণমালা ও প্রমিত উচ্চারণ (Script Mastery)",
            d: "হিরাগানা ও কাতাকানার ৯২টি ক্যারেক্টার, ডাকুঅন, হান্দাকুঅন, দীর্ঘস্বর এবং রোমাজি উচ্চারণ নিয়মাবলি।",
          },
          {
            w: "সপ্তাহ ৩ - ৪",
            t: "Minna No Nihongo অধ্যায় ১ থেকে ৬",
            d: "আত্মপরিচয়, প্রশ্ন গঠন (Ka), নির্দেশক সর্বনাম (Kore/Sore/Are), স্থান ও অবস্থান এবং প্রতিদিনের কাজ।",
          },
          {
            w: "সপ্তাহ ৫ - ৬",
            t: "Minna No Nihongo অধ্যায় ৭ থেকে ১২ + কাঞ্জি ০১",
            d: "টুল ও মাধ্যম (De particle), লেনদেন (Ageru/Morau), বিশেষণ (I/Na-adjective) এবং ৫০টি মৌলিক কাঞ্জি।",
          },
          {
            w: "সপ্তাহ ৭ - ৮",
            t: "Minna No Nihongo অধ্যায় ১৩ থেকে ১৮ + কাঞ্জি ০২",
            d: "ইচ্ছা প্রকাশ (Tai), স্থান পরিবর্তন, অনুরোধ (Te-form kudasai), নিষেধ ও বর্তমান অবস্থা (Te-iru)।",
          },
          {
            w: "সপ্তাহ ৯ - ১০",
            t: "Minna No Nihongo অধ্যায় ১৯ থেকে ২৫",
            d: "অভিজ্ঞতা (Ta-form koto ga aru), সাধারণ ভঙ্গি (Futsuukei), মতামত (To omoimasu), শর্ত (Tara-form)।",
          },
          {
            w: "সপ্তাহ ১১ - ১২",
            t: "পূর্ণাঙ্গ ৫টি মক টেস্ট ও ইন্টারভিউ ড্রিল",
            d: "JLPT N5 ও JFT-Basic অনুরূপ প্রশ্নব্যাংক সমাধান, লিসেনিং স্পিড টেস্ট এবং এম্বাসি ইন্টারভিউ ওয়ার্কশপ।",
          },
        ],
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
            q: "বই এবং লেকচার শিটের জন্য আলাদা কোনো খরচ আছে কি?",
            a: "না, কোনো লুকানো বা অতিরিক্ত খরচ নেই। ভর্তির সাথে সাথেই মিন্না নো নিহোঙ্গো ১ ও ২ পাঠ্যবই, কাঞ্জি প্র্যাকটিস শিট, শব্দার্থ ও ব্যাকরণ নোট এবং অডিও ড্রিলস সম্পূর্ণ বিনামূল্যে সরবরাহ করা হয়।",
          },
          {
            q: "১৫ দিনের এম্বাসি ইন্টারভিউ ও সিভি বোনাস কোর্সগুলো কি সত্যিই ফ্রি?",
            a: "হ্যাঁ, N5 কোর্সের নিয়মিত শিক্ষার্থীদের জন্য ১৫,০০০ টাকা সমমূল্যের ৩টি স্পেশাল কোর্স (এম্বাসি ইন্টারভিউ, জাপানি রিজিউমি/সিভি রাইটিং এবং পার্ট-টাইম জব ইন্টারভিউ) সম্পূর্ণ বিনামূল্যে উপহার দেওয়া হয়।",
          },
          {
            q: "অনলাইন লার্নিং প্ল্যাটফর্ম (LMS) কীভাবে কাজ করে এবং ক্লাসে কীভাবে যুক্ত হব?",
            a: "KNLTC-এর সমস্ত অনলাইন কোর্স, লাইভ জুম সেশন ও রিসোর্স সরাসরি https://npw.bd/knltc পোর্টালে হোস্ট করা। নিচের ফর্মে আবেদন করার পর আমাদের টিম আপনার তথ্য ও পেমেন্ট ভেরিফাই করে সরাসরি আপনার হোয়াটসঅ্যাপে LMS আইডি ও পাসওয়ার্ড পাঠিয়ে দেবে। লিংকে গিয়ে ইউজারনেম ও পাসওয়ার্ড দিয়ে খুব সহজেই ক্লাসরুমে প্রবেশ করতে পারবেন।",
          },
          {
            q: "অনলাইন ব্যাচে ক্লাস করলে কি রেকর্ডিং পাওয়া যাবে?",
            a: "হ্যাঁ, প্রতিটি লাইভ ক্লাসের হাই-ডেফিনিশন রেকর্ডিং এবং লেকচার স্লাইড সরাসরি আপনার https://npw.bd/knltc একাউন্টে সংরক্ষিত থাকে। কোনো কারণে ক্লাস মিস হলে আপনি যেকোনো সময় রেকর্ডিং দেখে রিভিশন দিতে পারবেন।",
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
        syllabusBadge: "カリキュラム工程表",
        syllabusTitle: "N5コース 週次詳細シラバス",
        syllabusSub:
          "本番試験前の復習と模擬演習を完全網羅した12週間の体系的学習計画。",
        hoursLabel: "週10時間 講義＆実践演習",
        faqBadge: "よくあるご質問",
        faqTitle: "受講検討時のFAQ（よくある質問と回答）",
        faqSub:
          "受講料の分割払い、教材手配、ビザ申請支援に関する疑問を解消いたします。",
        helpTitle: "その他にご不明点はございますか？",
        helpSub: "専任カウンセラーがWhatsAppにて直接ご相談を承ります。",
        btnHelp: "WhatsAppで質問する",
        weeks: [
          {
            w: "第1〜2週",
            t: "文字・発音の完全習得（ひらがな・カタカナ）",
            d: "清音・濁音・半濁音・拗音・長音・促音の書き順と正確な日本語標準発音。",
          },
          {
            w: "第3〜4週",
            t: "『みんなの日本語』第1課〜第6課",
            d: "自己紹介文、助詞（は・の・を・で）、指示代名詞（これ・それ・あれ）、日常行動表現。",
          },
          {
            w: "第5〜6週",
            t: "『みんなの日本語』第7課〜第12課 ＋ 漢字基礎",
            d: "授受表現（あげます・もらいます）、イ形容詞・ナ形容詞、比較表現、基本漢字50字。",
          },
          {
            w: "第7〜8週",
            t: "『みんなの日本語』第13課〜第18課 ＋ 漢字応用",
            d: "希望表現（たい）、て形（依頼・許可・禁止・現在進行形）、動詞辞書形。",
          },
          {
            w: "第9〜10週",
            t: "『みんなの日本語』第19課〜第25課",
            d: "経験（たことがある）、普通体会話（友達ことば）、推量・意見（と思います）、条件（たら形）。",
          },
          {
            w: "第11〜12週",
            t: "JLPT本番形式フル模擬テスト（5回）＆面接演習",
            d: "過去問分析、リスニング反射神経特訓、大使館ビザ面接シミュレーション演習。",
          },
        ],
        faqs: [
          {
            q: "受講料の分割払いは可能ですか？",
            a: "はい、可能です。KNLTCでは受講生の負担を軽減するため、2回の分割払いに対応しています。お申込み時に50%、開講30日後に残り50%をお支払いいただけます。",
          },
          {
            q: "日本語の学習経験が全くありませんが、受講できますか？",
            a: "全く問題ありません。当校のN5コースは完全な初学者向けに設計されており、ひらがなの1画目から日本人講師が丁寧に発音と筆順を教えます。",
          },
          {
            q: "教科書代やプリント代は別途かかりますか？",
            a: "追加費用は一切かかりません。『みんなの日本語』テキスト、オリジナル漢字テキスト、文法プリント、音声音源はすべて受講料に含まれています。",
          },
          {
            q: "面接対策講座や履歴書講座は本当に無料ですか？",
            a: "はい、N5通常受講生には、15,000タカ相当の大使館面接・履歴書作成・アルバイト面接の3大特典講座が全額無料で付帯します。",
          },
          {
            q: "オンラインLMS教室のログイン方法はどのようになりますか？",
            a: "受講講座およびオンライン授業は https://npw.bd/knltc にて提供されます。受講申請完了後、事務局より確認の上、WhatsAppにてログイン用IDとパスワードをお送りします。スマートフォンやPCからいつでもアクセス可能です。",
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
    <section className="bg-white py-16 md:py-24 border-b border-stone-200">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Syllabus Breakdown */}
          <div>
            <Badge className="border-red-200 bg-red-50 text-[#b91c1c] text-xs font-semibold px-3 py-1">
              {t.syllabusBadge}
            </Badge>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {t.syllabusTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {t.syllabusSub}
            </p>

            <div className="space-y-3">
              {t.weeks.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4 transition hover:border-red-200 hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#b91c1c] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                      {item.w}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{t.hoursLabel}</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-slate-900">{item.t}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div>
            <Badge className="border-green-200 bg-green-50 text-[#15803d] text-xs font-semibold px-3 py-1">
              {t.faqBadge}
            </Badge>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {t.faqTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {t.faqSub}
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              {t.faqs.map((faq, fi) => (
                <AccordionItem
                  key={fi}
                  value={`faq-${fi}`}
                  className="rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 py-1 shadow-xs data-[state=open]:border-red-200 data-[state=open]:bg-white"
                >
                  <AccordionTrigger className="text-left text-sm font-bold text-slate-900 hover:no-underline hover:text-[#b91c1c] py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed pb-4 pt-1 border-t border-stone-100 mt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Helpline Box */}
            <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.helpTitle}</h4>
                <p className="text-xs text-slate-600">{t.helpSub}</p>
              </div>
              <Button
                asChild
                className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shrink-0"
              >
                <a
                  href="https://wa.me/8801805013633?text=Hello%20KNLTC,%20I%20have%20questions%20about%20the%20Japanese%20Language%20Course."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1.5 h-4 w-4" /> {t.btnHelp}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
