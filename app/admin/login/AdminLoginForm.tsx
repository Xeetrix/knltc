"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, UserCheck, Lock, ArrowRight, Sparkles, Building2, PhoneCall, GraduationCap, DollarSign, Users, Award } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    roleName: "শেখ বাসেত (ম্যানেজিং ডিরেক্টর / Super Admin)",
    email: "baset@knltc.com",
    role: "MAIN_ADMIN",
    badge: "Super Admin",
    badgeColor: "bg-red-100 text-red-800 border-red-300",
    icon: ShieldCheck,
  },
  {
    roleName: "তানভীর আহমেদ (ঢাকা শাখা প্রধান)",
    email: "dhaka@knltc.com",
    role: "BRANCH_ADMIN",
    badge: "Dhaka HQ",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: Building2,
  },
  {
    roleName: "মুসা ইব্রাহিম (খুলনা শাখা ব্যবস্থাপক)",
    email: "khulna@knltc.com",
    role: "BRANCH_ADMIN",
    badge: "Khulna Branch",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: Building2,
  },
  {
    roleName: "নাসরিন সুলতানা (টেলি-কাউন্সেলর)",
    email: "counselor@knltc.com",
    role: "TELE_COUNSELOR",
    badge: "CRM & Calls",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    icon: PhoneCall,
  },
  {
    roleName: "আমির হোসেন (সিনিয়র সেন্সি / শিক্ষক)",
    email: "sensei@knltc.com",
    role: "TEACHER",
    badge: "LMS & Courses",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    icon: GraduationCap,
  },
  {
    roleName: "নেক্সাস গ্লোবাল (B2B এজেন্ট / অ্যাম্বাসেডর)",
    email: "b2b@knltc.com",
    role: "B2B_AGENT",
    badge: "B2B Agent",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    icon: Users,
  },
  {
    roleName: "ইমরান হাসেম (১০ লক্ষ টাকার বিনিয়োগকারী)",
    email: "investor@knltc.com",
    role: "INVESTOR",
    badge: "Investor Open-Book",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    icon: DollarSign,
  },
  {
    roleName: "রাকিবুল ইসলাম (ভিসা প্রার্থী / শিক্ষার্থী)",
    email: "student@knltc.com",
    role: "STUDENT",
    badge: "Visa Tracker",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: Award,
  },
];

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("baset@knltc.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "লগইন তথ্য সঠিক নয় (Invalid credentials)");
        return;
      }

      const destination =
        nextPath && (nextPath.startsWith("/dashboard") || nextPath.startsWith("/admin") || nextPath.startsWith("/portal"))
          ? nextPath
          : "/dashboard";

      router.push(destination);
      router.refresh();
    } catch {
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await performLogin(email, password);
  };

  const handleQuickSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin123");
    performLogin(demoEmail, "admin123");
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Login Form */}
        <div className="md:col-span-6 bg-white p-8 rounded-2xl border border-stone-200 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#b91c1c] text-white flex items-center justify-center font-black text-xl shadow-md">
              KN
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">KNLTC Command Center</h1>
              <p className="text-xs text-slate-500">সুরক্ষিত রোল-ভিত্তিক প্রবেশদ্বার (Enterprise Login)</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                অফিসিয়াল ইমেইল (Official Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-[#b91c1c] focus:outline-hidden focus:ring-1 focus:ring-[#b91c1c]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@knltc.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-[#b91c1c] focus:outline-hidden focus:ring-1 focus:ring-[#b91c1c]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 font-semibold leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] py-3 text-sm font-bold text-white shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>যাচাই করা হচ্ছে...</>
              ) : (
                <>
                  লগইন করুন <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
            <span>ডিফল্ট মাস্টার পাসওয়ার্ড: <code className="bg-stone-100 px-1 py-0.5 rounded text-slate-700 font-mono">admin123</code></span>
            <span className="text-emerald-700 font-medium">SSL Encrypted</span>
          </div>
        </div>

        {/* Right Side: 1-Click Role Switcher */}
        <div className="md:col-span-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-stone-200 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">১-ক্লিক রোল টেস্ট ও সিলেক্টর</h2>
              <p className="text-[11px] text-slate-500">যেকোনো রোলে ক্লিক করে সরাসরি ড্যাশবোর্ডে প্রবেশ করুন</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {DEMO_ACCOUNTS.map((acc) => {
              const IconComp = acc.icon;
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickSelect(acc.email)}
                  disabled={isSubmitting}
                  className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-[#b91c1c] bg-stone-50/60 hover:bg-red-50/40 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-slate-700 group-hover:text-[#b91c1c]">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#b91c1c] leading-tight">
                        {acc.roleName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">{acc.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                    {acc.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
