# কোর্স পেজ আলট্রা-মিনিমাল রিডিজাইন, আলাদা অ্যাড-ক্যাম্পেইন এনরোলমেন্ট পেজ, ডামি ডাটা ক্লিনআপ ও `Code.gs` আপডেট প্ল্যান

আপনার নতুন নির্দেশনা ও স্ক্রিনশট অনুযায়ী পুরো জাপানি ভাষা কোর্স সিস্টেমকে **অনেক বেশি মিনিমাল, এলিগ্যান্ট, প্রফেশনাল এবং অ্যাড-ক্যাম্পেইন ফ্রেন্ডলি** করার পূর্ণাঙ্গ প্ল্যান নিচে সাজানো হলো।

---

## ইউজার রিভিউ ও চূড়ান্ত সিদ্ধান্তসমূহ (Confirmed Decisions)

> [!IMPORTANT]
> আপনার দেওয়া সবগুলো ফিডব্যাক ও স্ক্রিনশট অনুযায়ী নিচের ৪টি মূল পরিবর্তন চূড়ান্ত করা হয়েছে:

1. **ড্যাশবোর্ডের বাড়তি সবুজ বার ও ডামি ডাটা সম্পূর্ণ অপসারণ (স্ক্রিনশট ১ ও ২ সমাধান):**
   - ওয়েবসাইট সিএমএস (`Website CMS`) ট্যাবের ভেতর থাকা অপ্রয়োজনীয় সবুজ রঙের **"KNLTC মাস্টার গুগল শিট ডাটাবেজ"** বারটি সম্পূর্ণ সরিয়ে ফেলা হবে।
   - প্রোমো কোড প্যানেল (`KNLTC10`, `KHULNA1000`) এবং জব সার্কুলার সেকশনের (`SSW কনস্ট্রাকশন`, `SSW নার্সিং`, `SSW এগ্রিকালচার`) সব ডিফল্ট **ডামি ডাটা মুছে ফেলা হবে**, যাতে আপনি নিজে যুক্ত না করা পর্যন্ত কোনো ডামি ডাটা না দেখায় (এবং যেকোনো সার্কুলার ডিলিট করার বাটনও যুক্ত থাকবে)।
2. **প্রতিটি কোর্সের জন্য আলাদা ডেডিকেটেড এনরোলমেন্ট ও অ্যাড-ক্যাম্পেইন পেজ (`/japanese-language/enroll/[courseSlug]`):**
   - মেইন `/japanese-language` পেজের নিচে বিশাল ফর্ম বসিয়ে পেজ ভারী না রেখে, প্রতিটি কোর্সে ক্লিক করলে শিক্ষার্থীকে সেই কোর্সের **ডেডিকেটেড, প্রফেশনাল ও মিনিমাল এনরোলমেন্ট পেজে** নিয়ে যাবে।
   - চারটি কোর্সের জন্য ৪টি সরাসরি ক্যাম্পেইন লিংক তৈরি হবে, যেগুলো দিয়ে আপনি সরাসরি Facebook / Google Ads রান করতে পারবেন:
     - `/japanese-language/enroll/jft-irodori` — **JFT (Irodori) Course (3 Months • 150 Hours)** *(Student + SSW Visa Priority)*
     - `/japanese-language/enroll/jlpt-n5` — **JLPT N5 Foundation (3 Months • 150 Hours)**
     - `/japanese-language/enroll/jlpt-n4` — **JLPT N4 Intermediate (3 Months • 150 Hours)**
     - `/japanese-language/enroll/n5-n4-combo` — **JLPT N5 + N4 Together Combo (6 Months • 300 Hours)**
   - ড্যাশবোর্ডের সিএমএস-এ প্রতিটি কোর্সের পাশে **1-Click "ক্যাম্পেইন লিংক কপি করুন"** বাটন থাকবে।
3. **মিনিমাল, ক্লিন এবং এলিগ্যান্ট ইউজার ইন্টারফেস (Minimal & Cool Aesthetic):**
   - মেইন `/japanese-language` পেজ থেকে অপ্রয়োজনীয় ব্যাজ, অতিরিক্ত টেক্সট ব্লক এবং নিচের দীর্ঘ ফর্ম সরিয়ে ক্লিন কার্ড, পর্যাপ্ত হোয়াইটস্পেস (`60-30-10` কালার রুল: `#FCFAF7` ক্যানভাস, `#FFFFFF` সারফেস, `#133E29` ও `#B91C1C` অ্যাকসেন্ট) এবং স্মুথ টাইপোগ্রাফি দেওয়া হবে।
4. **গুগল শিটে আলাদা `knltc_course_enrollments` ট্যাব ও `Code.gs` আপডেট:**
   - আলাদা এনরোলমেন্ট পেজ থেকে ফর্ম সাবমিট করলেই গুগল শিটের নতুন **`knltc_course_enrollments`** ট্যাবে কোর্স, ব্রাঞ্চ, প্রোমো কোড, ডিসকাউন্ট, বিকাশ সেন্ডার নম্বর এবং `TrxID` সংরক্ষিত হবে।

---

## ১. ওভারভিউ ও ইউজার এক্সপেরিয়েন্স (User Experience & Minimal Design)

### ক. মেইন `/japanese-language` শোকেস পেজ (Minimal & Elegant)
- **ক্লিন হিরো ও ৪টি কোর্স কার্ড:** মেইন পেজে শিক্ষার্থী খুব সহজে ৪টি কোর্সের (`JFT Irodori`, `JLPT N5`, `JLPT N4`, `N5+N4 Combo`) সময়কাল (`১৫০ ঘণ্টা` / `৩০০ ঘণ্টা`), মূল ফি, ২০% ফুল-পেমেন্ট ছাড় এবং ৫০% কিস্তির হিসাব এক নজরে দেখতে পাবে।
- **ডিরেক্ট এনরোলমেন্ট নেভিগেশন:** যেকোনো কোর্সের **"ভর্তি হোন (২০% ছাড়)"** বা **"৫০% কিস্তিতে সিট বুক করুন"** বাটনে ক্লিক করলেই সরাসরি `/japanese-language/enroll/[courseSlug]?plan=full` (অথবা `installment`) পেজে চলে যাবে।
- **৪-পিলার মিন্না নো নিহোঙ্গো ল্যাব ও সেনসেই প্রোফাইল:** হিরাগানা/কাতাকানা অডিও ল্যাব, শব্দভাণ্ডার (`Kotoba`), ব্যাকরণ (`Bunkei`), এবং কথোপকথন (`Kaiwa`) আরও ছিমছাম ও প্রফেশনাল কার্ডে সাজানো থাকবে।

### খ. ডেডিকেটেড ক্যাম্পেইন ও চেকআউট পেজ (`/japanese-language/enroll/[courseSlug]`)
- **অ্যাড ক্যাম্পেইনের জন্য ল্যান্ডিং + চেকআউট:** আপনি যখন কোনো নির্দিষ্ট কোর্সের (যেমন শুধু `JFT Irodori` বা শুধু `JLPT N5`) বিজ্ঞাপন চালাবেন, তখন সরাসরি সেই লিংকে ট্রাফিক পাঠাতে পারবেন।
- **বাম পাশে (Course Summary & Highlights):** নির্বাচিত কোর্সের নাম, ১৫০/৩০০ ঘণ্টা সার্টিফিকেশন, মূল সুবিধাসমূহ, আমির হোসেন সেনসেইয়ের মেন্টরশিপ নোট, এবং ক্লাস মোড (`Online Live`, `Paltan`, `Khulna`) ও ভিসা ট্র্যাক (`Student Visa` / `SSW Job Visa`) সিলেকশন। চাইলে উপরের স্লিক ট্যাব থেকে অন্য কোর্সেও সুইচ করা যাবে।
- **ডান পাশে (Minimal Fee Calculator + Bangla QR + TrxID Verification):**
  - `Full Payment (Extra 20% Off)` বনাম `50% 1st Installment` টগল।
  - প্রোমো কোড ইনপুট ও অটো-ডিসকাউন্ট ক্যালকুলেশন।
  - **bKash / Bangla QR** পেমেন্ট কার্ড (QR জুম ও মার্চেন্ট নম্বর কপি) + `Sender Number`, `Paid Amount`, ও `TrxID` ভেরিফিকেশন বক্স।
  - সাবমিট করলেই সাথে সাথে **অফিসিয়াল ডিজিটাল ভর্তি রিসিট (Print/PDF)** এবং **১-ক্লিকে WhatsApp ভেরিফিকেশন** বাটন।

---

## ২. সিস্টেম আর্কিটেকচার ও ক্যাম্পেইন ফ্লো (Architecture & Campaign Routing)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. Direct Ad Traffic (FB / Google Ads)   OR   2. /japanese-language Page   │
│    /japanese-language/enroll/jft-irodori         (Minimal 4-Course Cards)  │
│    /japanese-language/enroll/jlpt-n5                       │               │
│    /japanese-language/enroll/jlpt-n4                       │               │
│    /japanese-language/enroll/n5-n4-combo                   ▼               │
└──────────────────────┬─────────────────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│       Dedicated Minimal Course Enrollment Page (/enroll/[courseSlug])      │
│  ┌──────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │ Left: Course Value & Student Info│  │ Right: Live Fee, Promo Code,   │  │
│  │ • 150/300 Hrs Certification      │  │   Bangla QR & bKash TrxID      │  │
│  │ • Online / Paltan / Khulna Mode  │  │ • 20% Full Pay vs 50% Booking  │  │
│  │ • Student Visa & SSW Priority    │  │ • Instant Digital Receipt      │  │
│  └──────────────────────────────────┘  └────────────────────────────────┘  │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ POST /api/enroll
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│             Google Apps Script (Code.gs) & Google Sheets Sync              │
│  • knltc_course_enrollments (NEW 25-Column Dedicated Sheet Tab)            │
│  • knltc_finance_transactions + knltc_lms_bridges + knltc_crm_leads        │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## ৩. ড্যাশবোর্ড ক্লিনআপ ও গুগল শিট স্কিমা (Technical Reference)

1. **ড্যাশবোর্ড ক্লিনআপ (`app/dashboard/page.tsx` ও `lib/knltc-cms-store.ts`):**
   - `Website CMS` ট্যাব থেকে সবুজ গুগল শিট স্ট্যাটাস বারটি সরানো হবে।
   - `DEFAULT_WEBSITE_CMS`-এ ডিফল্ট প্রোমো কোড (`promoCodes: []`) এবং ডিফল্ট জব সার্কুলার (`jobCirculars: []`) খালি করে দেওয়া হবে, যাতে কোনো ডামি ডাটা না থাকে।
   - সিএমএস-এর ৪টি কোর্সের সেটিংস কার্ডে প্রতিটি কোর্সের সরাসরি অ্যাড লিংক কপি করার বাটন (`Copy Ad Link`) যুক্ত করা হবে।
2. **`google-apps-script/Code.gs` আপডেট:**
   - `TABLE_SCHEMAS`-এ নতুন **`knltc_course_enrollments`** ট্যাব যুক্ত করা হবে (`id, enrollment_no, applicant_name, phone, whatsapp, email, course_id, course_title, delivery_mode, branch, visa_category, highest_degree, payment_plan, payment_method, base_fee_bdt, discount_bdt, promo_code, net_course_fee_bdt, paid_amount_bdt, due_amount_bdt, sender_number, trx_id, payment_status, notes, created_at`)।
   - `knltc_finance_transactions`-এর সব কলামের সাথে মিল রেখে পেমেন্ট ডাটা সংরক্ষণ করা হবে।
