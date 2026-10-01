"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function RbacArchitecturePreview() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        badge: "Enterprise Grade RBAC System",
        title: "Four-Tier Role-Based Access Control Architecture",
        desc: "KNLTC Language Platform operates with 4 dedicated, secure role-specific dashboards ensuring seamless administrative, academic, and student collaboration across Bangladesh.",
        ctaExplore: "Explore Live RBAC Portal",
        viewDashboard: "Explore this dashboard",
        tierLabel: "Tier",
        roles: [
          {
            role: "Main Admin (Super Admin)",
            sub: "Central Executive Console",
            color: "text-[#b91c1c]",
            border: "border-red-200",
            bg: "bg-red-50/50",
            icon: ShieldCheck,
            desc: "Central oversight of all campus branches, revenue audit, and embassy visa files.",
            features: [
              "Central admissions, branch revenue & financial audit",
              "Appoint Branch Admins and delegate branch duties",
              "Master course catalog and fee tier configuration",
              "National Japan visa & COE progress monitoring",
            ],
            roleParam: "MAIN_ADMIN",
          },
          {
            role: "Branch Admin",
            sub: "Local Campus Administrator",
            color: "text-[#15803d]",
            border: "border-green-200",
            bg: "bg-green-50/50",
            icon: Building,
            desc: "Campus batch scheduling, payment verification, and classroom coordination.",
            features: [
              "Local applicant admission approval & seat allocation",
              "Offline cash, bKash & bank payment verification",
              "Campus batch calendar & classroom room logistics",
              "Student academic & financial document audit",
            ],
            roleParam: "BRANCH_ADMIN",
          },
          {
            role: "Teacher (Instructor)",
            sub: "Japanese Language Sensei",
            color: "text-blue-700",
            border: "border-blue-200",
            bg: "bg-blue-50/50",
            icon: GraduationCap,
            desc: "Classroom teaching, live Zoom links, lecture materials, and digital attendance.",
            features: [
              "Start today's live Zoom/Meet class with 1 click",
              "Upload Minna No Nihongo lecture slides & audio",
              "Mark daily student attendance records digitally",
              "Weekly quiz grading & JLPT mock exam evaluation",
            ],
            roleParam: "TEACHER",
          },
          {
            role: "Student",
            sub: "Enrolled Course Learner",
            color: "text-amber-700",
            border: "border-amber-200",
            bg: "bg-amber-50/50",
            icon: UserCheck,
            desc: "Personalized portal, class schedule, resource downloads, and visa roadmap tracker.",
            features: [
              "1-Click join enrolled batch live classes",
              "Download textbooks, Kanji notes, and audio files",
              "Payment receipt slip and fee balance breakdown",
              "5-Stage Japan Visa milestone progress tracker",
            ],
            roleParam: "STUDENT",
          },
        ],
      },
      bn: {
        badge: "Enterprise Grade RBAC System",
        title: "৪-টিয়ার রোল-বেইজড এক্সেস কন্ট্রোল (RBAC) আর্কিটেকচার",
        desc: "KNLTC ল্যাঙ্গুয়েজ কোর্স প্ল্যাটফর্মটি কেন্দ্রীয় সুপার এডমিন, ক্যাম্পাস এডমিন, শিক্ষক এবং শিক্ষার্থীর জন্য স্বতন্ত্র ও সুরক্ষিত ডেডিকেটেড ড্যাশবোর্ড দ্বারা পরিচালিত।",
        ctaExplore: "লাইভ RBAC পোর্টাল এক্সপ্লোর করুন",
        viewDashboard: "এই ড্যাশবোর্ড দেখুন",
        tierLabel: "টিয়ার",
        roles: [
          {
            role: "Main Admin (Super Admin)",
            sub: "সেন্ট্রাল সুপার এডমিন",
            color: "text-[#b91c1c]",
            border: "border-red-200",
            bg: "bg-red-50/50",
            icon: ShieldCheck,
            desc: "সারা দেশের সব ক্যাম্পাস, আর্থিক লেনদেন ও এম্বাসি ফাইলিংয়ের সেন্ট্রাল নিয়ন্ত্রণ।",
            features: [
              "সব ব্রাঞ্চের মোট ভর্তি, আয় ও আর্থিক অডিট বিশ্লেষণ",
              "ব্রাঞ্চ এডমিন নিয়োগ এবং দায়িত্ব বণ্টন",
              "সেন্ট্রাল কোর্স ক্যাটালগ ও ফি ম্যানেজমেন্ট",
              "জাপান ভিসা ও COE স্ট্যাটাসের সামগ্রিক ড্যাশবোর্ড",
            ],
            roleParam: "MAIN_ADMIN",
          },
          {
            role: "Branch Admin",
            sub: "লোকাল ক্যাম্পাস এডমিন",
            color: "text-[#15803d]",
            border: "border-green-200",
            bg: "bg-green-50/50",
            icon: Building,
            desc: "নির্দিষ্ট ক্যাম্পাসের ব্যাচ শিডিউল, ফি ভেরিফিকেশন এবং ক্লাসরুম মনিটরিং।",
            features: [
              "ক্যাম্পাসের শিক্ষার্থী ভর্তি অনুমোদন ও সিট বরাদ্দ",
              "অফলাইন/অনলাইন কোর্স ফি পেমেন্ট ভেরিফিকেশন",
              "ব্রাঞ্চ ব্যাচ ক্যালেন্ডার ও ক্লাসরুম রুটিন পরিচালনা",
              "শিক্ষার্থীর একাডেমিক ও ভিসা ডকুমেন্টস যাচাই",
            ],
            roleParam: "BRANCH_ADMIN",
          },
          {
            role: "Teacher (Instructor)",
            sub: "জাপানিজ শিক্ষক ও প্রশিক্ষক",
            color: "text-blue-700",
            border: "border-blue-200",
            bg: "bg-blue-50/50",
            icon: GraduationCap,
            desc: "লাইভ ক্লাস লিংক, লেকচার শিট আপলোড, হাজিরা ও মক টেস্ট মূল্যায়ন।",
            features: [
              "অ্যাসাইন্ড ব্যাচের লাইভ জুম/মিট ক্লাস লিংক পরিচালনা",
              "মিন্না নো নিহোঙ্গো লেকচার শিট ও অডিও ফাইল আপলোড",
              "দৈনিক ক্লাসের ডিজিটাল উপস্থিতি (Attendance) মার্কিং",
              "সাপ্তাহিক কুইজ ও JLPT মক টেস্টের খাতা মূল্যায়ন",
            ],
            roleParam: "TEACHER",
          },
          {
            role: "Student",
            sub: "কোর্স শিক্ষার্থী ও শিক্ষার্থী",
            color: "text-amber-700",
            border: "border-amber-200",
            bg: "bg-amber-50/50",
            icon: UserCheck,
            desc: "ব্যক্তিগত স্টুডেন্ট পোর্টাল, ক্লাস রুটিন, শিট ডাউনলোড ও ভিসা অগ্রগতি ট্র্যাকার।",
            features: [
              "এনরোল্ড ব্যাচের লাইভ ক্লাসে ১-ক্লিকে যোগদানের সুবিধা",
              "বই, ব্যাকরণ নোট, অডিও ট্র‍্যাক ও টেস্ট পেপার ডাউনলোড",
              "পেমেন্ট রশিদ ও বাকি ফি সংক্রান্ত স্বচ্ছ হিসাব বিবরণী",
              "ভাষা কোর্স থেকে শুরু করে ভিসা স্ট্যাম্পিং পর্যন্ত ৫টি মাইলস্টোন ট্র্যাকার",
            ],
            roleParam: "STUDENT",
          },
        ],
      },
      ja: {
        badge: "エンタープライズRBACアーキテクチャ",
        title: "4層構造ロールベースアクセス制御（RBAC）システム",
        desc: "統括管理者（本部）、各拠点管理者、担当講師、受講生の4者をつなぐ高度なマルチテナント管理体制。",
        ctaExplore: "ライブRBACポータルを体験する",
        viewDashboard: "この権限の画面を見る",
        tierLabel: "階層",
        roles: [
          {
            role: "統括管理者（Main Admin）",
            sub: "KNLTC本部エグゼクティブ",
            color: "text-[#b91c1c]",
            border: "border-red-200",
            bg: "bg-red-50/50",
            icon: ShieldCheck,
            desc: "全拠点キャンパスの統括、財務分析、ビザ申請状況の総合監査。",
            features: [
              "全校舎の受講生数・収益推移・財務分析",
              "拠点管理者の任命および権限付与",
              "全社共通講座カタログと受講料設定",
              "COE申請・大使館ビザ交付進捗の一括追跡",
            ],
            roleParam: "MAIN_ADMIN",
          },
          {
            role: "拠点管理者（Branch Admin）",
            sub: "キャンパス校舎運営責任者",
            color: "text-[#15803d]",
            border: "border-green-200",
            bg: "bg-green-50/50",
            icon: Building,
            desc: "校舎でのクラス時間割編成、学費受領照合、教室手配を管理。",
            features: [
              "受講希望者の受付審査および座席確定",
              "銀行振込・bKash・現金領収の消込照合",
              "キャンパスクラス時間割と教室配当管理",
              "受講生の学歴・経費支弁書類の一次審査",
            ],
            roleParam: "BRANCH_ADMIN",
          },
          {
            role: "講師（Teacher）",
            sub: "日本語指導インストラクター",
            color: "text-blue-700",
            border: "border-blue-200",
            bg: "bg-blue-50/50",
            icon: GraduationCap,
            desc: "生講義の配信、教材配布、出欠管理、模擬テスト採点。",
            features: [
              "担当クラスのZoom/Meet授業を1クリック開講",
              "『みんなの日本語』解説資料や音声のアップロード",
              "毎回の出席・欠席をデジタル点呼記録",
              "小テストおよびJLPT模擬試験の採点と評価",
            ],
            roleParam: "TEACHER",
          },
          {
            role: "受講生（Student）",
            sub: "講座受講生マイページ",
            color: "text-amber-700",
            border: "border-amber-200",
            bg: "bg-amber-50/50",
            icon: UserCheck,
            desc: "授業参加、オリジナル教材のダウンロード、ビザ進捗ロードマップ確認。",
            features: [
              "登録クラスのオンライン授業へワンクリック参加",
              "教科書・漢字帳・音声トラックの随時ダウンロード",
              "受講料支払い領収証および残高明細の確認",
              "語学学習から日本出国までの5段階進捗トラッカー",
            ],
            roleParam: "STUDENT",
          },
        ],
      },
    },
    language,
  );

  return (
    <section className="bg-[#fcfaf7] py-16 md:py-24 border-b border-stone-200">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge className="border-red-200 bg-red-50 text-[#b91c1c] text-xs font-semibold px-3 py-1">
              {t.badge}
            </Badge>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              {t.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.desc}
            </p>
          </div>

          <Button
            asChild
            className="bg-[#b91c1c] hover:bg-red-800 text-white font-semibold rounded-xl px-6 py-5 shrink-0 shadow-md"
          >
            <Link href="/portal">
              <LayoutDashboard className="mr-2 h-4 w-4" /> {t.ctaExplore}
            </Link>
          </Button>
        </div>

        {/* 4 Role Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.roles.map((r, ri) => {
            const Icon = r.icon;
            return (
              <div
                key={ri}
                className={`flex flex-col justify-between rounded-3xl border ${r.border} bg-white p-6 shadow-xs transition hover:shadow-md hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-2xl ${r.bg} ${r.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t.tierLabel} 0{ri + 1}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 leading-snug">{r.role}</h3>
                  <p className="text-xs font-medium text-slate-500">{r.sub}</p>

                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{r.desc}</p>

                  <div className="mt-5 space-y-2 border-t border-stone-100 pt-4">
                    {r.features.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${r.color}`} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100">
                  <Link
                    href={`/portal?role=${r.roleParam}`}
                    className={`inline-flex items-center text-xs font-bold ${r.color} hover:underline`}
                  >
                    {t.viewDashboard} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
