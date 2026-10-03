"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Languages,
  CheckCircle2,
  Headphones,
  SlidersHorizontal,
  Bookmark,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

type ScriptType = "hiragana" | "katakana" | "phrases";
type SubFilterType = "basic" | "voiced";

interface Phrase {
  category: { bn: string; en: string; ja: string };
  japanese: string;
  romaji: string;
  meaning: { bn: string; en: string; ja: string };
  situation: { bn: string; en: string; ja: string };
}

const ESSENTIAL_PHRASES: Phrase[] = [
  {
    category: { bn: "প্রতিদিনের সম্ভাষণ", en: "Daily Greeting", ja: "日常の挨拶" },
    japanese: "こんにちは",
    romaji: "Konnichiwa",
    meaning: {
      bn: "শুভ দিন / হ্যালো (দিনের বেলার সার্বজনীন সম্ভাষণ)",
      en: "Hello / Good day (Standard daytime greeting)",
      ja: "昼間の代表的な挨拶",
    },
    situation: {
      bn: "সকাল ১১টা থেকে সূর্যাস্ত পর্যন্ত যে কারো সাথে সাক্ষাতে",
      en: "Used when meeting anyone during daytime hours",
      ja: "日中に人と会ったときに使います",
    },
  },
  {
    category: { bn: "আন্তরিক কৃতজ্ঞতা", en: "Gratitude & Thanks", ja: "感謝の表現" },
    japanese: "ありがとうございます",
    romaji: "Arigatou gozaimasu",
    meaning: {
      bn: "আপনাকে অনেক অনেক ধন্যবাদ (ভদ্র ও শ্রদ্ধাশীল রীতি)",
      en: "Thank you very much (Polite & formal expression)",
      ja: "相手に感謝を伝える丁寧な表現",
    },
    situation: {
      bn: "যেকোনো সাহায্য, সেবা বা নির্দেশনা পাওয়ার পর",
      en: "Used whenever receiving assistance, service, or a favor",
      ja: "親切やサービスを受けたときに使います",
    },
  },
  {
    category: { bn: "ইন্টারভিউ ও আত্মপরিচয়", en: "Self Introduction", ja: "自己紹介" },
    japanese: "はじめまして",
    romaji: "Hajimemashite",
    meaning: {
      bn: "আপনার সাথে প্রথমবার পরিচিত হয়ে আনন্দিত (How do you do?)",
      en: "How do you do? / Nice to meet you for the first time",
      ja: "初めて会った人への最初の挨拶",
    },
    situation: {
      bn: "ইন্টারভিউ বা নতুন কারো সাথে পরিচয়ের একদম শুরুতে",
      en: "Opening phrase of interviews and first introductions",
      ja: "面接や初対面の自己紹介の冒頭で使います",
    },
  },
  {
    category: { bn: "সর্বাধিক গুরুত্বপূর্ণ শিষ্টাচার", en: "Courtesy & Respect", ja: "最重要マナー" },
    japanese: "よろしくお願いします",
    romaji: "Yoroshiku onegaishimasu",
    meaning: {
      bn: "দয়া করে আমার প্রতি সদয় দৃষ্টি রাখবেন / আপনার সহযোগিতা কামনা করছি",
      en: "Please treat me favorably / Looking forward to working with you",
      ja: "今後の関係や依頼を表す最重要フレーズ",
    },
    situation: {
      bn: "ইন্টারভিউ শেষ করার সময় বা নতুন কাজ ও ক্লাসে যোগদানে",
      en: "At the conclusion of interviews or joining a team",
      ja: "面接の締めくくりや仕事の依頼時に使います",
    },
  },
  {
    category: { bn: "ভিসা ও অধ্যয়ন উদ্দেশ্য", en: "Visa & Study Motivation", ja: "志望動機" },
    japanese: "日本へ留学したいです",
    romaji: "Nihon e ryuugaku shitai desu",
    meaning: {
      bn: "আমি জাপানে উচ্চশিক্ষা অর্জন করতে চাই",
      en: "I want to study in Japan (Clear study aspiration)",
      ja: "日本留学の希望を伝える表現",
    },
    situation: {
      bn: "এম্বাসির ভিসা অফিসার ও জাপানিজ স্কুল ইন্টারভিউতে",
      en: "Stating your study motivation to visa screening officers",
      ja: "大使館面接や学校選考で志望動機を話すとき",
    },
  },
  {
    category: { bn: "চলমান অগ্রগতি", en: "Ongoing Learning", ja: "学習進捗" },
    japanese: "日本語を勉強しています",
    romaji: "Nihongo o benkyou shite imasu",
    meaning: {
      bn: "আমি আন্তরিকভাবে জাপানি ভাষা শিখছি",
      en: "I am actively studying Japanese language",
      ja: "現在日本語を学んでいることを伝える基本フレーズ",
    },
    situation: {
      bn: "ভিসা ইন্টারভিউয়ারকে নিজের প্রস্তুতি ও একাগ্রতা বোঝাতে",
      en: "Demonstrating study commitment to the screening officer",
      ja: "面接官に学習への真剣さをアピールするとき",
    },
  },
  {
    category: { bn: "নম্র ক্ষমা ও দৃষ্টি আকর্ষণ", en: "Polite Apology & Attention", ja: "配慮・呼びかけ" },
    japanese: "すみません",
    romaji: "Sumimasen",
    meaning: {
      bn: "মাফ করবেন / এক্সকিউজ মি / দুঃখিত",
      en: "Excuse me / Pardon me / I am sorry",
      ja: "呼びかけや軽い謝罪、感謝を兼ねた万能フレーズ",
    },
    situation: {
      bn: "কাউকে ডাকার সময়, পথ চাওয়ার সময় বা সামান্য ভুলের জন্য",
      en: "Calling someone's attention, getting off a train, or minor apologies",
      ja: "店員を呼ぶときや人に声をかけるときに使います",
    },
  },
  {
    category: { bn: "দৃঢ় অঙ্গীকার ও উদ্দীপনা", en: "Determination & Will", ja: "意気込み" },
    japanese: "一生懸命がんばります",
    romaji: "Isshoukenmei ganbarimasu",
    meaning: {
      bn: "আমি আমার সর্বস্ব দিয়ে সর্বোচ্চ চেষ্টা করব",
      en: "I will do my absolute best with full dedication",
      ja: "全力を尽くして努力するという強い決意",
    },
    situation: {
      bn: "জব বা ভিসা ইন্টারভিউতে কাজের দায়িত্ব পাওয়ার নিশ্চয়তা দিতে",
      en: "Expressing maximum dedication during job or visa screening",
      ja: "面接で熱意と誠実さを伝える決定打フレーズ",
    },
  },
  {
    category: { bn: "কক্ষে প্রবেশ ও প্রস্থান", en: "Interview Entry Etiquette", ja: "入室・退室マナー" },
    japanese: "失礼します",
    romaji: "Shitsurei shimasu",
    meaning: {
      bn: "অনুগ্রহ করে আমাকে প্রবেশের অনুমতি দিন / বেয়াদবি মাফ করবেন",
      en: "Excuse me (Said when entering or leaving an office/room)",
      ja: "部屋に入るとき・出るときに使う礼儀作法",
    },
    situation: {
      bn: "ইন্টারভিউ রুমে প্রবেশের সময় নক করার পর এবং বিদায় নেওয়ার সময়",
      en: "Knocking on the interview door and when standing up to leave",
      ja: "面接室に入室する際や退室時に必ず声に出します",
    },
  },
  {
    category: { bn: "স্পষ্ট সম্মতি ও বোধগম্যতা", en: "Understanding Confirmation", ja: "理解・承諾" },
    japanese: "分かりました",
    romaji: "Wakarimashita",
    meaning: {
      bn: "আমি বিষয়টি সম্পূর্ণভাবে বুঝতে পেরেছি (Understood)",
      en: "I understood / Roger that (Polite past form)",
      ja: "相手の話をしっかり理解したことを伝える言葉",
    },
    situation: {
      bn: "শিক্ষক, সিনিয়র বা ইন্টারভিউয়ারের নির্দেশনা শোনার পর",
      en: "Confirming you have understood instructions or feedback",
      ja: "指示や説明を受けたあとの明確な返事として使います",
    },
  },
];

// Complete 46 Gojuon Characters for Hiragana
const HIRAGANA_GOJUON = [
  // A row (Vowels)
  { char: "あ", ro: "a", row: "A" },
  { char: "い", ro: "i", row: "A" },
  { char: "う", ro: "u", row: "A" },
  { char: "え", ro: "e", row: "A" },
  { char: "お", ro: "o", row: "A" },
  // Ka row
  { char: "か", ro: "ka", row: "Ka" },
  { char: "き", ro: "ki", row: "Ka" },
  { char: "く", ro: "ku", row: "Ka" },
  { char: "け", ro: "ke", row: "Ka" },
  { char: "こ", ro: "ko", row: "Ka" },
  // Sa row
  { char: "さ", ro: "sa", row: "Sa" },
  { char: "し", ro: "shi", row: "Sa" },
  { char: "す", ro: "su", row: "Sa" },
  { char: "せ", ro: "se", row: "Sa" },
  { char: "そ", ro: "so", row: "Sa" },
  // Ta row
  { char: "た", ro: "ta", row: "Ta" },
  { char: "ち", ro: "chi", row: "Ta" },
  { char: "つ", ro: "tsu", row: "Ta" },
  { char: "て", ro: "te", row: "Ta" },
  { char: "と", ro: "to", row: "Ta" },
  // Na row
  { char: "な", ro: "na", row: "Na" },
  { char: "に", ro: "ni", row: "Na" },
  { char: "ぬ", ro: "nu", row: "Na" },
  { char: "ね", ro: "ne", row: "Na" },
  { char: "の", ro: "no", row: "Na" },
  // Ha row
  { char: "は", ro: "ha", row: "Ha" },
  { char: "ひ", ro: "hi", row: "Ha" },
  { char: "ふ", ro: "fu", row: "Ha" },
  { char: "へ", ro: "he", row: "Ha" },
  { char: "ほ", ro: "ho", row: "Ha" },
  // Ma row
  { char: "ま", ro: "ma", row: "Ma" },
  { char: "み", ro: "mi", row: "Ma" },
  { char: "む", ro: "mu", row: "Ma" },
  { char: "め", ro: "me", row: "Ma" },
  { char: "も", ro: "mo", row: "Ma" },
  // Ya row
  { char: "や", ro: "ya", row: "Ya" },
  { char: "ゆ", ro: "yu", row: "Ya" },
  { char: "よ", ro: "yo", row: "Ya" },
  // Ra row
  { char: "ら", ro: "ra", row: "Ra" },
  { char: "り", ro: "ri", row: "Ra" },
  { char: "る", ro: "ru", row: "Ra" },
  { char: "れ", ro: "re", row: "Ra" },
  { char: "ろ", ro: "ro", row: "Ra" },
  // Wa row & N
  { char: "わ", ro: "wa", row: "Wa" },
  { char: "を", ro: "wo (o)", row: "Wa" },
  { char: "ん", ro: "n", row: "N" },
];

// Complete 25 Voiced Sounds (Dakuten & Handakuten) for Hiragana
const HIRAGANA_DAKUTEN = [
  { char: "が", ro: "ga", row: "Ga" },
  { char: "ぎ", ro: "gi", row: "Ga" },
  { char: "ぐ", ro: "gu", row: "Ga" },
  { char: "げ", ro: "ge", row: "Ga" },
  { char: "ご", ro: "go", row: "Ga" },
  { char: "ざ", ro: "za", row: "Za" },
  { char: "じ", ro: "ji", row: "Za" },
  { char: "ず", ro: "zu", row: "Za" },
  { char: "ぜ", ro: "ze", row: "Za" },
  { char: "ぞ", ro: "zo", row: "Za" },
  { char: "だ", ro: "da", row: "Da" },
  { char: "ぢ", ro: "ji", row: "Da" },
  { char: "づ", ro: "dzu", row: "Da" },
  { char: "で", ro: "de", row: "Da" },
  { char: "ど", ro: "do", row: "Da" },
  { char: "ば", ro: "ba", row: "Ba" },
  { char: "び", ro: "bi", row: "Ba" },
  { char: "ぶ", ro: "bu", row: "Ba" },
  { char: "べ", ro: "be", row: "Ba" },
  { char: "ぼ", ro: "bo", row: "Ba" },
  { char: "ぱ", ro: "pa", row: "Pa" },
  { char: "ぴ", ro: "pi", row: "Pa" },
  { char: "ぷ", ro: "pu", row: "Pa" },
  { char: "ぺ", ro: "pe", row: "Pa" },
  { char: "ぽ", ro: "po", row: "Pa" },
];

// Complete 46 Gojuon Characters for Katakana
const KATAKANA_GOJUON = [
  // A row
  { char: "ア", ro: "a", row: "A" },
  { char: "イ", ro: "i", row: "A" },
  { char: "ウ", ro: "u", row: "A" },
  { char: "エ", ro: "e", row: "A" },
  { char: "オ", ro: "o", row: "A" },
  // Ka row
  { char: "カ", ro: "ka", row: "Ka" },
  { char: "キ", ro: "ki", row: "Ka" },
  { char: "ク", ro: "ku", row: "Ka" },
  { char: "ケ", ro: "ke", row: "Ka" },
  { char: "コ", ro: "ko", row: "Ka" },
  // Sa row
  { char: "サ", ro: "sa", row: "Sa" },
  { char: "シ", ro: "shi", row: "Sa" },
  { char: "ス", ro: "su", row: "Sa" },
  { char: "セ", ro: "se", row: "Sa" },
  { char: "ソ", ro: "so", row: "Sa" },
  // Ta row
  { char: "タ", ro: "ta", row: "Ta" },
  { char: "チ", ro: "chi", row: "Ta" },
  { char: "ツ", ro: "tsu", row: "Ta" },
  { char: "テ", ro: "te", row: "Ta" },
  { char: "ト", ro: "to", row: "Ta" },
  // Na row
  { char: "ナ", ro: "na", row: "Na" },
  { char: "ニ", ro: "ni", row: "Na" },
  { char: "ヌ", ro: "nu", row: "Na" },
  { char: "ネ", ro: "ne", row: "Na" },
  { char: "ノ", ro: "no", row: "Na" },
  // Ha row
  { char: "ハ", ro: "ha", row: "Ha" },
  { char: "ヒ", ro: "hi", row: "Ha" },
  { char: "フ", ro: "fu", row: "Ha" },
  { char: "ヘ", ro: "he", row: "Ha" },
  { char: "ホ", ro: "ho", row: "Ha" },
  // Ma row
  { char: "マ", ro: "ma", row: "Ma" },
  { char: "ミ", ro: "mi", row: "Ma" },
  { char: "ム", ro: "mu", row: "Ma" },
  { char: "メ", ro: "me", row: "Ma" },
  { char: "モ", ro: "mo", row: "Ma" },
  // Ya row
  { char: "ヤ", ro: "ya", row: "Ya" },
  { char: "ユ", ro: "yu", row: "Ya" },
  { char: "ヨ", ro: "yo", row: "Ya" },
  // Ra row
  { char: "ラ", ro: "ra", row: "Ra" },
  { char: "リ", ro: "ri", row: "Ra" },
  { char: "ル", ro: "ru", row: "Ra" },
  { char: "レ", ro: "re", row: "Ra" },
  { char: "ロ", ro: "ro", row: "Ra" },
  // Wa row & N
  { char: "ワ", ro: "wa", row: "Wa" },
  { char: "ヲ", ro: "wo (o)", row: "Wa" },
  { char: "ン", ro: "n", row: "N" },
];

// Complete 25 Voiced Sounds (Dakuten & Handakuten) for Katakana
const KATAKANA_DAKUTEN = [
  { char: "ガ", ro: "ga", row: "Ga" },
  { char: "ギ", ro: "gi", row: "Ga" },
  { char: "グ", ro: "gu", row: "Ga" },
  { char: "ゲ", ro: "ge", row: "Ga" },
  { char: "ゴ", ro: "go", row: "Ga" },
  { char: "ザ", ro: "za", row: "Za" },
  { char: "ジ", ro: "ji", row: "Za" },
  { char: "ズ", ro: "zu", row: "Za" },
  { char: "ゼ", ro: "ze", row: "Za" },
  { char: "ゾ", ro: "zo", row: "Za" },
  { char: "ダ", ro: "da", row: "Da" },
  { char: "ヂ", ro: "ji", row: "Da" },
  { char: "ヅ", ro: "dzu", row: "Da" },
  { char: "デ", ro: "de", row: "Da" },
  { char: "ド", ro: "do", row: "Da" },
  { char: "バ", ro: "ba", row: "Ba" },
  { char: "ビ", ro: "bi", row: "Ba" },
  { char: "ブ", ro: "bu", row: "Ba" },
  { char: "ベ", ro: "be", row: "Ba" },
  { char: "ボ", ro: "bo", row: "Ba" },
  { char: "パ", ro: "pa", row: "Pa" },
  { char: "ピ", ro: "pi", row: "Pa" },
  { char: "プ", ro: "pu", row: "Pa" },
  { char: "ペ", ro: "pe", row: "Pa" },
  { char: "ポ", ro: "po", row: "Pa" },
];

export default function InteractiveLanguageLab() {
  const { language } = useLanguage();
  const [activeScript, setActiveScript] = useState<ScriptType>("phrases");
  const [subFilter, setSubFilter] = useState<SubFilterType>("basic");
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const t = translate(
    {
      bn: {
        badge: "ইন্টারেক্টিভ স্পোকেন ও সাউন্ড ল্যাব",
        title: "জাপানি বর্ণমালা ও প্রয়োজনীয় স্পোকেন অডিও ল্যাব",
        subtitle:
          "ন্যাচারাল জাপানিজ উচ্চারণ শুনুন। হিরাগানা ও কাতাকানার সম্পূর্ণ বর্ণমালা এবং ইন্টারভিউয়ের গুরুত্বপূর্ণ ১০টি বাক্য অনুশীলন করুন।",
        tabPhrases: "১০টি গুরুত্বপূর্ণ কথ্য বাক্য (Audio)",
        tabHiragana: "সম্পূর্ণ হিরাগানা (Hiragana)",
        tabKatakana: "সম্পূর্ণ কাতাকানা (Katakana)",
        filterBasic: "মৌলিক ৪৬টি বর্ণ (৫০ সাউন্ডস)",
        filterVoiced: "২৫টি যুক্তবর্ণ ও ভয়েসড সাউন্ড (দাকুতেন)",
        clickListen: "সঠিক জাপানি উচ্চারণ শুনতে যেকোনো বর্ণে ক্লিক করুন",
        speedNote: "লার্নারদের সুবিধার্থে ০.৮৫x পরিষ্কার গতিতে অডিও প্লে হয়",
        enrollBanner: "প্রথম দিন থেকেই জাপানি ভাষায় সাবলীল হতে আমাদের N5 ব্যাচে যোগ দিন",
        btnEnroll: "N5 কোর্সে ভর্তি আবেদন",
      },
      en: {
        badge: "Interactive Audio Pronunciation Lab",
        title: "Japanese Alphabet & Spoken Audio Masterclass",
        subtitle:
          "Listen to authentic native speech synthesis. Master all 46 core characters for Hiragana & Katakana plus 10 vital visa & job interview phrases.",
        tabPhrases: "10 Essential Spoken Phrases",
        tabHiragana: "Complete Hiragana Chart",
        tabKatakana: "Complete Katakana Chart",
        filterBasic: "46 Core Characters (Gojuon)",
        filterVoiced: "25 Voiced Sounds (Dakuten)",
        clickListen: "Click on any character to hear authentic native pronunciation",
        speedNote: "Native speech tuned to 0.85x speed for clear learner comprehension",
        enrollBanner: "Master Hiragana, Katakana, and real conversation in our upcoming N5 batch",
        btnEnroll: "Apply for N5 Comprehensive",
      },
      ja: {
        badge: "体験型日本語発音・音声ラボ",
        title: "五十音図・実践スピーキング音声体験",
        subtitle:
          "ネイティブ発音を耳で聴き、ひらがな・カタカナの全46文字および面接必須10フレーズを実践的に学びます。",
        tabPhrases: "最重要 実践10フレーズ（音声再生）",
        tabHiragana: "ひらがな 全46文字（五十音）",
        tabKatakana: "カタカナ 全46文字（五十音）",
        filterBasic: "基本46音（五十音図）",
        filterVoiced: "濁音・半濁音（25文字）",
        clickListen: "文字をクリックして正しい発音を再生",
        speedNote: "学習者に聞き取りやすい適正速度（0.85倍速）で再生されます",
        enrollBanner: "文字の筆順から日常会話まで、基礎から着実に身につけましょう",
        btnEnroll: "N5基礎コースへ申し込む",
      },
    },
    language,
  );

  const playSpeech = (text: string, key: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85; // Calibrated speed for language learners

      setPlayingKey(key);
      utterance.onend = () => setPlayingKey(null);
      utterance.onerror = () => setPlayingKey(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const currentChars =
    activeScript === "hiragana"
      ? subFilter === "basic"
        ? HIRAGANA_GOJUON
        : HIRAGANA_DAKUTEN
      : subFilter === "basic"
      ? KATAKANA_GOJUON
      : KATAKANA_DAKUTEN;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] border-y border-stone-200">
      <div className="container-narrow">
        {/* Section Header - Executive Institutional Tone */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3.5 py-1 text-xs font-bold text-[#b91c1c] mb-3 shadow-2xs">
            <Headphones className="h-3.5 w-3.5 text-[#b91c1c]" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-2xl bg-stone-200/80 p-1.5 border border-stone-300/80 shadow-2xs max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveScript("phrases")}
              className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeScript === "phrases"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Volume2 className="h-4 w-4 text-[#b91c1c]" />
              <span>{t.tabPhrases}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScript("hiragana")}
              className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeScript === "hiragana"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{t.tabHiragana}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScript("katakana")}
              className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeScript === "katakana"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{t.tabKatakana}</span>
            </button>
          </div>
        </div>

        {/* Script Content Area */}
        <AnimatePresence mode="wait">
          {activeScript === "phrases" ? (
            <motion.div
              key="phrases-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Context Notice */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 max-w-5xl mx-auto px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-[#b91c1c]" />
                  <span>{t.clickListen}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200">
                  {t.speedNote}
                </span>
              </div>

              {/* 10 Curated High-Yield Japanese Phrases Grid */}
              <div className="grid gap-3.5 sm:grid-cols-2 max-w-5xl mx-auto">
                {ESSENTIAL_PHRASES.map((phrase, idx) => {
                  const pKey = `phrase-${idx}`;
                  const isPlaying = playingKey === pKey;
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl border bg-white p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between ${
                        isPlaying
                          ? "border-[#b91c1c] ring-2 ring-red-100 bg-red-50/20"
                          : "border-stone-200/90 hover:border-stone-300"
                      }`}
                    >
                      {/* Top Row: Category Tag & Audio Trigger */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-stone-200/80">
                          <Bookmark className="h-3 w-3 text-[#b91c1c]" />
                          <span>{phrase.category[language]}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => playSpeech(phrase.japanese, pKey)}
                          aria-label={`Play audio for ${phrase.romaji}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${
                            isPlaying
                              ? "bg-[#b91c1c] text-white shadow-xs animate-pulse"
                              : "bg-stone-100 text-slate-700 hover:bg-red-50 hover:text-[#b91c1c]"
                          }`}
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Japanese Glyphs & Romaji */}
                      <div className="space-y-1 mb-3">
                        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans leading-tight">
                          {phrase.japanese}
                        </p>
                        <p className="text-xs font-mono font-bold text-[#b91c1c]">
                          {phrase.romaji}
                        </p>
                      </div>

                      {/* Meaning & Usage Context */}
                      <div className="border-t border-stone-100 pt-3 space-y-1.5">
                        <p className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                          {phrase.meaning[language]}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1">
                          <span className="text-slate-400 font-bold shrink-0">📍</span>
                          <span>{phrase.situation[language]}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeScript}-${subFilter}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-5xl mx-auto"
            >
              {/* Secondary Sub-Filter: Core Gojuon vs Voiced Sounds */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
                <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setSubFilter("basic")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      subFilter === "basic"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.filterBasic}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubFilter("voiced")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      subFilter === "voiced"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.filterVoiced}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Volume2 className="h-3.5 w-3.5 text-[#b91c1c]" />
                  <span>{t.clickListen}</span>
                </div>
              </div>

              {/* Complete Japanese Alphabet Grid (Standard 5-Vowel Flow: A, I, U, E, O) */}
              <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
                {currentChars.map((item, idx) => {
                  const cKey = `${activeScript}-${item.char}-${idx}`;
                  const isPlaying = playingKey === cKey;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => playSpeech(item.char, cKey)}
                      aria-label={`Pronounce ${item.char} (${item.ro})`}
                      className={`group relative rounded-xl border p-2.5 sm:p-3 text-center transition-all flex flex-col items-center justify-between min-h-[72px] sm:min-h-[82px] active:scale-95 ${
                        isPlaying
                          ? "border-[#b91c1c] bg-red-50 text-[#b91c1c] shadow-xs scale-105 ring-2 ring-red-200"
                          : "border-stone-200 bg-white hover:border-[#b91c1c] hover:bg-stone-50/80 shadow-2xs"
                      }`}
                    >
                      <span className="block text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-[#b91c1c] transition-colors font-sans">
                        {item.char}
                      </span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="block text-[11px] font-mono font-bold text-slate-500">
                          {item.ro}
                        </span>
                        {isPlaying && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b91c1c] animate-ping" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Educational Note */}
              <div className="text-center text-[11px] text-slate-500 pt-2">
                {activeScript === "hiragana"
                  ? "হিরাগানা হলো জাপানি ভাষার প্রধান মৌলিক বর্ণমালা, যা ব্যাকরণ ও দেশীয় শব্দের ক্ষেত্রে ব্যবহৃত হয়।"
                  : "কাতাকানা হলো বিদেশি শব্দ, আন্তর্জাতিক নাম এবং আধুনিক টেকনিক্যাল পরিভাষার জন্য নির্ধারিত বিশেষ বর্ণমালা।"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motivational Institutional Footer Strip */}
        <div className="mt-12 rounded-2xl border border-slate-900 bg-slate-950 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-[#b91c1c] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white">
                {t.enrollBanner}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                মিন্না নো নিহোঙ্গো ১ ও ২ বই, অডিও ড্রিল এবং ১৫,০০০ টাকার ৩টি স্পেশাল ইন্টারভিউ কোর্স ১০০% ফ্রি।
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-[#b91c1c] hover:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-bold py-5 px-6 shrink-0 active:scale-95 transition-all shadow-md"
          >
            <a href="#course-options" className="flex items-center gap-2">
              <span>{t.btnEnroll}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
