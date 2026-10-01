"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Languages,
  MessageCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function MethodologyInteractiveSection() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("alphabet");
  const [activeScript, setActiveScript] = useState<"hiragana" | "katakana">("hiragana");

  const t = translate(
    {
      en: {
        badge: "Interactive Lesson Preview",
        title: "Experience KNLTC's Teaching Methodology",
        desc: "Step-by-step scientific methods to master Japanese. Click through the tabs below to explore how quickly you can acquire kana scripts, vocabulary, grammar patterns, and real conversational confidence.",
        tabScript: "Alphabet (Script)",
        tabVocab: "Vocabulary (Kotoba)",
        tabGrammar: "Grammar (Bunkei)",
        tabKaiwa: "Conversation (Kaiwa)",
        scriptNote:
          "Two primary Japanese syllabaries: Hiragana (for native Japanese words) and Katakana (for foreign loan words).",
        btnHira: "Hiragana (ひらがな)",
        btnKata: "Katakana (カタカナ)",
        scriptTip:
          "KNLTC Tip: In our first week, students memorize all 46 Hiragana and 46 Katakana characters with mnemonic stroke order animations.",
        vocabHeaderJa: "Word (Kanji/Kana)",
        vocabHeaderRomaji: "Pronunciation (Romaji)",
        vocabHeaderMeaning: "Meaning",
        vocabHeaderNote: "Usage Context",
        vocabFooter:
          "Sample vocabulary from Minna No Nihongo Lessons 1 & 2. Over 800+ essential words covered in our N5 course.",
        grammarTip: "Tip:",
        kaiwaTitle: "自己紹介 (Jikoshoukai) — Self-Introduction & First Greeting",
        kaiwaSub: "Essential etiquette and greeting formula for Japanese school & job interviews.",
        kaiwaBadge: "Spoken Drill",
      },
      bn: {
        badge: "ইন্টারেক্টিভ লেসন প্রিভিউ",
        title: "KNLTC পাঠদান মেথডোলজির বাস্তব অভিজ্ঞতা",
        desc: "বাংলা ব্যাকরণের সাথে মিল রেখে সহজ নিয়মে শেখার কৌশল। নিচের ট্যাবগুলো ক্লিক করে দেখুন কত দ্রুত আপনি জাপানি বর্ণ, শব্দ ও বাক্য আয়ত্ত করতে পারেন।",
        tabScript: "বর্ণমালা (Script)",
        tabVocab: "শব্দার্থ (Kotoba)",
        tabGrammar: "ব্যাকরণ (Bunkei)",
        tabKaiwa: "কথোপকথন (Kaiwa)",
        scriptNote:
          "জাপানিজ লেখার মূল দুটি সিলেবারি: হিরাগানা (মূল জাপানি শব্দের জন্য) ও কাতাকানা (বিদেশি নামের জন্য)।",
        btnHira: "হিরাগানা (Hiragana)",
        btnKata: "কাতাকানা (Katakana)",
        scriptTip:
          "KNLTC টিপ: আমাদের ক্লাসে প্রথম সপ্তাহেই ফনোটিক ম্যাপ ও স্ট্রোক অ্যানিমেশনের মাধ্যমে সম্পূর্ণ ৪৬টি হিরাগানা এবং ৪৬টি কাতাকানা মুখস্থ করিয়ে নেওয়া হয়।",
        vocabHeaderJa: "জাপানি শব্দ (Kanji/Kana)",
        vocabHeaderRomaji: "উচ্চারণ (Romaji)",
        vocabHeaderMeaning: "বাংলা অর্থ",
        vocabHeaderNote: "ব্যবহারের নোট",
        vocabFooter:
          "Minna No Nihongo অধ্যায় ১ ও ২-এর নমুনা শব্দভাণ্ডার। N5 কোর্সে মোট ৮০০+ শব্দ শেখানো হয়।",
        grammarTip: "ব্যাখ্যা:",
        kaiwaTitle: "自己紹介 (Jikoshoukai) — আত্মপরিচয় ও প্রথম সাক্ষাত",
        kaiwaSub: "জাপানে স্কুল ও ইন্টারভিউতে প্রথম পরিচয় দেওয়ার ফর্মুলা।",
        kaiwaBadge: "স্পোকেন ক্লাস ড্রিল",
      },
      ja: {
        badge: "体験型レッスンプレビュー",
        title: "KNLTC独自の実践指導メソッドを体験",
        desc: "母語との比較で直感的に身につく科学的学習法。以下のタブから、文字・語彙・文型・会話の指導内容をプレビューできます。",
        tabScript: "文字（かな）",
        tabVocab: "語彙（ことば）",
        tabGrammar: "文法（文型）",
        tabKaiwa: "会話（かいわ）",
        scriptNote:
          "日本語の基礎2大音節文字：ひらがな（和語用）とカタカナ（外来語・外国地名用）。",
        btnHira: "ひらがな（Hiragana）",
        btnKata: "カタカナ（Katakana）",
        scriptTip:
          "KNLTCの特長：最初の1週間で筆順アニメーションと連想記憶法を用いて、46字のひらがな・カタカナを完全習得します。",
        vocabHeaderJa: "日本語表記",
        vocabHeaderRomaji: "ローマ字発音",
        vocabHeaderMeaning: "意味・対訳",
        vocabHeaderNote: "用法解説",
        vocabFooter:
          "『みんなの日本語』第1課・第2課のサンプル語彙。N5コース全体で800語以上の重要単語を網羅。",
        grammarTip: "ワンポイント解説:",
        kaiwaTitle: "自己紹介（じこしょうかい）— 初対面の挨拶と自己アピール",
        kaiwaSub: "現地留学・就職面接で第一印象を決定づける基本フレーズ。",
        kaiwaBadge: "会話ロールプレイ",
      },
    },
    language,
  );

  const hiraganaVowels = [
    { kana: "あ", romaji: "a", bn: "আ", en: "a" },
    { kana: "い", romaji: "i", bn: "ই", en: "i" },
    { kana: "う", romaji: "u", bn: "উ", en: "u" },
    { kana: "え", romaji: "e", bn: "এ", en: "e" },
    { kana: "お", romaji: "o", bn: "ও", en: "o" },
    { kana: "か", romaji: "ka", bn: "কা", en: "ka" },
    { kana: "き", romaji: "ki", bn: "কি", en: "ki" },
    { kana: "く", romaji: "ku", bn: "কু", en: "ku" },
    { kana: "け", romaji: "ke", bn: "কে", en: "ke" },
    { kana: "こ", romaji: "ko", bn: "কো", en: "ko" },
    { kana: "さ", romaji: "sa", bn: "সা", en: "sa" },
    { kana: "し", romaji: "shi", bn: "শি", en: "shi" },
    { kana: "す", romaji: "su", bn: "সু", en: "su" },
    { kana: "せ", romaji: "se", bn: "সে", en: "se" },
    { kana: "そ", romaji: "so", bn: "সো", en: "so" },
  ];

  const katakanaVowels = [
    { kana: "ア", romaji: "a", bn: "আ", en: "a" },
    { kana: "イ", romaji: "i", bn: "ই", en: "i" },
    { kana: "ウ", romaji: "u", bn: "উ", en: "u" },
    { kana: "エ", romaji: "e", bn: "এ", en: "e" },
    { kana: "オ", romaji: "o", bn: "ও", en: "o" },
    { kana: "カ", romaji: "ka", bn: "কা", en: "ka" },
    { kana: "キ", romaji: "ki", bn: "কি", en: "ki" },
    { kana: "ク", romaji: "ku", bn: "কু", en: "ku" },
    { kana: "ケ", romaji: "ke", bn: "কে", en: "ke" },
    { kana: "コ", romaji: "ko", bn: "কো", en: "ko" },
    { kana: "サ", romaji: "sa", bn: "সা", en: "sa" },
    { kana: "シ", romaji: "shi", bn: "শি", en: "shi" },
    { kana: "ス", romaji: "su", bn: "সু", en: "su" },
    { kana: "セ", romaji: "se", bn: "সে", en: "se" },
    { kana: "ソ", romaji: "so", bn: "সো", en: "so" },
  ];

  const vocabulary = [
    {
      ja: "わたし (私)",
      romaji: "Watashi",
      meaning: { en: "I / Me", bn: "আমি", ja: "私（自分自身）" },
      note: { en: "Used to introduce oneself", bn: "নিজের পরিচয় দিতে ব্যবহৃত", ja: "自己言及の一人称" },
    },
    {
      ja: "あなた",
      romaji: "Anata",
      meaning: { en: "You", bn: "আপনি / তুমি", ja: "あなた（相手）" },
      note: { en: "Second-person pronoun", bn: "দ্বিতীয় পুরুষ সম্বোধন", ja: "二人称代名詞" },
    },
    {
      ja: "せんせい (先生)",
      romaji: "Sensei",
      meaning: { en: "Teacher / Instructor", bn: "শিক্ষক / ওস্তাদ", ja: "教師・先生" },
      note: { en: "Honorific title for teachers", bn: "সম্মানসূচক পেশা", ja: "敬意を込めた呼称" },
    },
    {
      ja: "がくせい (学生)",
      romaji: "Gakusei",
      meaning: { en: "Student", bn: "শিক্ষার্থী / ছাত্র", ja: "学生・生徒" },
      note: { en: "School/university learner", bn: "স্কুল বা বিশ্ববিদ্যালয়ের ছাত্র", ja: "学業を修める人" },
    },
    {
      ja: "かいしゃいん (会社員)",
      romaji: "Kaishain",
      meaning: { en: "Company Employee", bn: "কোম্পানি কর্মী / চাকুরিজীবী", ja: "会社員・サラリーマン" },
      note: { en: "Corporate professional", bn: "জাপানি করপোরেট কর্মী", ja: "企業勤めの社会人" },
    },
    {
      ja: "にほん (日本)",
      romaji: "Nihon / Nippon",
      meaning: { en: "Japan", bn: "জাপান দেশ", ja: "日本国" },
      note: { en: "Land of the Rising Sun", bn: "সূর্যোদয়ের দেশ", ja: "自国の呼称" },
    },
    {
      ja: "バングラデシュ",
      romaji: "Banguradeshu",
      meaning: { en: "Bangladesh", bn: "বাংলাদেশ", ja: "バングラデシュ" },
      note: { en: "Written in Katakana (loanword)", bn: "কাতাকানায় লেখা বিদেশি নাম", ja: "国名（カタカナ表記）" },
    },
  ];

  const grammarPatterns = [
    {
      rule: "[A] は [B] です",
      meaning: { en: "A is B (Affirmative sentence)", bn: "A হলো B (সাধারণ হ্যাঁ-বোধক বাক্য)", ja: "AはBです（肯定文）" },
      example: "わたしは がくせい です。",
      romaji: "Watashi wa gakusei desu.",
      translation: { en: "I am a student.", bn: "আমি একজন শিক্ষার্থী।", ja: "私は学生です。" },
      tip: {
        en: "The topic particle 'は' (Ha) is pronounced as 'Wa' when functioning inside a sentence.",
        bn: "বাক্যের বিষয় নির্দেশক পার্টিকেল 'は' (Ha) বাক্যের ভেতর বসলে এর উচ্চারণ হয় 'ওয়া' (Wa)।",
        ja: "主題提示の助詞「は」は、発音上「わ（wa）」と読みます。",
      },
    },
    {
      rule: "[A] は [B] じゃありません",
      meaning: { en: "A is not B (Negative sentence)", bn: "A, B নয় (না-বোধক রূপ)", ja: "AはBではありません（否定文）" },
      example: "わたしは せんせい じゃありません。",
      romaji: "Watashi wa sensei jaarimasen.",
      translation: { en: "I am not a teacher.", bn: "আমি শিক্ষক নই।", ja: "私は先生ではありません。" },
      tip: {
        en: "In casual spoken Japanese, 'Ja arimasen' is commonly preferred over 'Dewa arimasen'.",
        bn: "কথোপকথনে 'Dewa arimasen'-এর জায়গায় সহজ 'Ja arimasen' বলা হয়।",
        ja: "日常会話では「ではありません」より「じゃありません」が多く使われます。",
      },
    },
    {
      rule: "[A] は [B] ですか",
      meaning: { en: "Is A, B? (Question form)", bn: "A কি B? (প্রশ্নবোধক বাক্য)", ja: "AはBですか（疑問文）" },
      example: "あなたは エンジニア ですか。",
      romaji: "Anata wa enjinia desuka.",
      translation: { en: "Are you an engineer?", bn: "আপনি কি প্রকৌশলী (Engineer)?", ja: "あなたはエンジニアですか？" },
      tip: {
        en: "In Japanese, simply attach 'Ka' (か) at the end of the sentence to form a question.",
        bn: "জাপানি ভাষায় প্রশ্ন করতে বাক্যের শেষে শুধু 'か' (Ka) যোগ করতে হয়, প্রশ্নচিহ্নের প্রয়োজন হয় না।",
        ja: "文末に終助詞「か」を付加するだけで疑問文が完成します。",
      },
    },
  ];

  const dialogues = [
    {
      speaker: { en: "Rahim", bn: "রহিম", ja: "ラヒム" },
      role: { en: "Student", bn: "বাংলাদেশি শিক্ষার্থী", ja: "留学生" },
      color: "text-[#b91c1c]",
      japanese: "はじめまして。わたしは ラヒム です。",
      romaji: "Hajimemashite. Watashi wa Rahimu desu.",
      translation: {
        en: "Nice to meet you. I am Rahim.",
        bn: "প্রথম সাক্ষাতে শুভেচ্ছা। আমি রহিম।",
        ja: "はじめまして。私はラヒムです。",
      },
    },
    {
      speaker: { en: "Rahim", bn: "রহিম", ja: "ラヒム" },
      role: { en: "Student", bn: "বাংলাদেশি শিক্ষার্থী", ja: "留学生" },
      color: "text-[#b91c1c]",
      japanese: "バングラデシュ から きました。どうぞ よろしく おねがいします。",
      romaji: "Banguradeshu kara kimashita. Douzo yoroshiku onegaishimasu.",
      translation: {
        en: "I came from Bangladesh. It is a pleasure to meet you.",
        bn: "আমি বাংলাদেশ থেকে এসেছি। আপনার সাথে পরিচিত হতে পেরে আনন্দিত।",
        ja: "バングラデシュから来ました。どうぞよろしくお願いします。",
      },
    },
    {
      speaker: { en: "Tanaka Sensei", bn: "তানাকা সেনসেই", ja: "田中先生" },
      role: { en: "Instructor", bn: "জাপানি ইন্সট্রাক্টর", ja: "日本語講師" },
      color: "text-[#15803d]",
      japanese: "はじめまして。たなか です。こちらこそ どうぞ よろしく。",
      romaji: "Hajimemashite. Tanaka desu. Kochira koso douzo yoroshiku.",
      translation: {
        en: "Nice to meet you. I am Tanaka. Pleased to meet you too.",
        bn: "শুভদিন। আমি তানাকা। আমার পক্ষ থেকেও আন্তরিক শুভেচ্ছা রইল।",
        ja: "はじめまして。田中です。こちらこそどうぞよろしく。",
      },
    },
  ];

  return (
    <section className="bg-[#fcfaf7] py-16 md:py-24 border-b border-stone-200">
      <div className="container-narrow">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="border-red-200 bg-red-50 text-[#b91c1c] text-xs font-semibold px-3 py-1">
            {t.badge}
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
          <Tabs defaultValue="alphabet" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-stone-100 p-1.5 rounded-2xl h-auto gap-1">
              <TabsTrigger
                value="alphabet"
                className="rounded-xl py-3 text-xs sm:text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#b91c1c] data-[state=active]:shadow-xs"
              >
                <Languages className="mr-1.5 h-4 w-4" /> {t.tabScript}
              </TabsTrigger>
              <TabsTrigger
                value="vocabulary"
                className="rounded-xl py-3 text-xs sm:text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#b91c1c] data-[state=active]:shadow-xs"
              >
                <BookOpen className="mr-1.5 h-4 w-4" /> {t.tabVocab}
              </TabsTrigger>
              <TabsTrigger
                value="grammar"
                className="rounded-xl py-3 text-xs sm:text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#b91c1c] data-[state=active]:shadow-xs"
              >
                <FileText className="mr-1.5 h-4 w-4" /> {t.tabGrammar}
              </TabsTrigger>
              <TabsTrigger
                value="kaiwa"
                className="rounded-xl py-3 text-xs sm:text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#b91c1c] data-[state=active]:shadow-xs"
              >
                <MessageCircle className="mr-1.5 h-4 w-4" /> {t.tabKaiwa}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Alphabet */}
            <TabsContent value="alphabet" className="mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-stone-50 p-4 border border-stone-200">
                <div className="text-xs sm:text-sm text-slate-700">
                  {t.scriptNote}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveScript("hiragana")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      activeScript === "hiragana"
                        ? "bg-[#b91c1c] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-stone-200"
                    }`}
                  >
                    {t.btnHira}
                  </button>
                  <button
                    onClick={() => setActiveScript("katakana")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      activeScript === "katakana"
                        ? "bg-[#b91c1c] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-stone-200"
                    }`}
                  >
                    {t.btnKata}
                  </button>
                </div>
              </div>

              {/* Characters Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {(activeScript === "hiragana" ? hiraganaVowels : katakanaVowels).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-4 shadow-xs transition hover:border-red-300 hover:shadow-md"
                  >
                    <span className="text-3xl font-extrabold text-[#b91c1c]">{item.kana}</span>
                    <span className="mt-1 text-xs font-semibold text-slate-700">{item.romaji}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({language === "bn" ? item.bn : item.en})
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50/70 p-4 text-xs text-green-900 leading-relaxed">
                💡 {t.scriptTip}
              </div>
            </TabsContent>

            {/* Tab 2: Vocabulary */}
            <TabsContent value="vocabulary" className="mt-8 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-stone-200">
                <div className="grid grid-cols-12 bg-stone-100 p-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <div className="col-span-4 sm:col-span-3">{t.vocabHeaderJa}</div>
                  <div className="col-span-3 sm:col-span-3">{t.vocabHeaderRomaji}</div>
                  <div className="col-span-5 sm:col-span-3">{t.vocabHeaderMeaning}</div>
                  <div className="hidden sm:block sm:col-span-3">{t.vocabHeaderNote}</div>
                </div>

                <div className="divide-y divide-stone-100 bg-white">
                  {vocabulary.map((v, vi) => (
                    <div
                      key={vi}
                      className="grid grid-cols-12 items-center p-3.5 text-xs sm:text-sm hover:bg-stone-50/80 transition"
                    >
                      <div className="col-span-4 sm:col-span-3 font-bold text-[#b91c1c] text-base sm:text-lg">
                        {v.ja}
                      </div>
                      <div className="col-span-3 sm:col-span-3 font-semibold text-slate-700">{v.romaji}</div>
                      <div className="col-span-5 sm:col-span-3 font-medium text-[#15803d]">
                        {translate(v.meaning, language)}
                      </div>
                      <div className="hidden sm:block sm:col-span-3 text-xs text-slate-500">
                        {translate(v.note, language)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                {t.vocabFooter}
              </p>
            </TabsContent>

            {/* Tab 3: Grammar */}
            <TabsContent value="grammar" className="mt-8 space-y-4">
              {grammarPatterns.map((g, gi) => (
                <div key={gi} className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#b91c1c] font-mono">{g.rule}</span>
                    <Badge variant="outline" className="border-stone-300 text-xs">
                      Lesson {gi + 1}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{translate(g.meaning, language)}</p>
                  <div className="rounded-xl bg-white p-3.5 border border-stone-200 text-xs sm:text-sm space-y-1">
                    <p className="font-bold text-slate-900">{g.example}</p>
                    <p className="text-xs text-slate-500 italic">{g.romaji}</p>
                    <p className="text-xs font-semibold text-[#15803d]">➔ {translate(g.translation, language)}</p>
                  </div>
                  <div className="text-xs text-amber-800 bg-amber-50 rounded-xl p-2.5 border border-amber-200">
                    💡 <strong>{t.grammarTip}</strong> {translate(g.tip, language)}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Tab 4: Kaiwa */}
            <TabsContent value="kaiwa" className="mt-8 space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t.kaiwaTitle}
                    </h4>
                    <p className="text-xs text-slate-500">{t.kaiwaSub}</p>
                  </div>
                  <Badge className="bg-green-100 text-[#15803d] border-green-200 text-xs">
                    {t.kaiwaBadge}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {dialogues.map((d, di) => (
                    <div key={di} className="rounded-2xl bg-white p-4 border border-stone-200 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${d.color}`}>{translate(d.speaker, language)}</span>
                        <span className="text-[11px] text-slate-400">({translate(d.role, language)})</span>
                      </div>
                      <p className="mt-2 text-base font-bold text-slate-900">{d.japanese}</p>
                      <p className="text-xs text-slate-500 italic">{d.romaji}</p>
                      <p className="mt-1 text-xs font-medium text-slate-700 bg-stone-50 p-2 rounded-xl border border-stone-100">
                        {translate(d.translation, language)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
