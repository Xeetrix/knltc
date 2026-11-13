"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  Sparkles,
  ArrowRight,
  Languages,
  Headphones,
  Bookmark,
  Play,
  RotateCcw,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

type ScriptType = "hiragana" | "katakana" | "kotoba" | "grammar" | "phrases";
type SubFilterType = "basic" | "voiced" | "yoon";

interface Phrase {
  category: { bn: string; en: string; ja: string };
  japanese: string;
  romaji: string;
  meaning: { bn: string; en: string; ja: string };
  situation: { bn: string; en: string; ja: string };
}

interface CharacterItem {
  char: string;
  ro: string;
  bn: string;
}

interface ChartRow {
  rowId: string;
  labelEn: string;
  labelBn: string;
  labelJa: string;
  descBn: string;
  chars: (CharacterItem | null)[];
}

interface YoonRow {
  rowId: string;
  labelEn: string;
  labelBn: string;
  labelJa: string;
  baseChar: string;
  chars: CharacterItem[];
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

// 10 Strictly Arranged Lines for Hiragana Gojuon (あ行 〜 わ行)
const HIRAGANA_GOJUON_ROWS: ChartRow[] = [
  {
    rowId: "a",
    labelEn: "A-line",
    labelBn: "আ-লাইন",
    labelJa: "あ行",
    descBn: "মৌলিক স্বরধ্বনি (Vowels)",
    chars: [
      { char: "あ", ro: "a", bn: "আ" },
      { char: "い", ro: "i", bn: "ই" },
      { char: "う", ro: "u", bn: "উ" },
      { char: "え", ro: "e", bn: "এ" },
      { char: "お", ro: "o", bn: "ও" },
    ],
  },
  {
    rowId: "ka",
    labelEn: "Ka-line",
    labelBn: "কা-লাইন",
    labelJa: "か行",
    descBn: "ক-বর্গীয় ব্যঞ্জনধ্বনি",
    chars: [
      { char: "か", ro: "ka", bn: "কা" },
      { char: "き", ro: "ki", bn: "কি" },
      { char: "く", ro: "ku", bn: "কু" },
      { char: "け", ro: "ke", bn: "কে" },
      { char: "こ", ro: "ko", bn: "কো" },
    ],
  },
  {
    rowId: "sa",
    labelEn: "Sa-line",
    labelBn: "সা-লাইন",
    labelJa: "さ行",
    descBn: "দন্ত্য-স ও তালব্য-শি",
    chars: [
      { char: "さ", ro: "sa", bn: "সা" },
      { char: "し", ro: "shi", bn: "শি" },
      { char: "す", ro: "su", bn: "সু" },
      { char: "せ", ro: "se", bn: "সে" },
      { char: "そ", ro: "so", bn: "সো" },
    ],
  },
  {
    rowId: "ta",
    labelEn: "Ta-line",
    labelBn: "তা-লাইন",
    labelJa: "た行",
    descBn: "তা, চি ও ৎসু ধ্বনি",
    chars: [
      { char: "た", ro: "ta", bn: "তা" },
      { char: "ち", ro: "chi", bn: "চি" },
      { char: "つ", ro: "tsu", bn: "ৎসু" },
      { char: "て", ro: "te", bn: "তে" },
      { char: "と", ro: "to", bn: "তো" },
    ],
  },
  {
    rowId: "na",
    labelEn: "Na-line",
    labelBn: "না-লাইন",
    labelJa: "な行",
    descBn: "দন্ত্য-ন নাসিক্য ধ্বনি",
    chars: [
      { char: "な", ro: "na", bn: "না" },
      { char: "に", ro: "ni", bn: "নি" },
      { char: "ぬ", ro: "nu", bn: "নু" },
      { char: "ね", ro: "ne", bn: "নে" },
      { char: "の", ro: "no", bn: "নো" },
    ],
  },
  {
    rowId: "ha",
    labelEn: "Ha-line",
    labelBn: "হা-লাইন",
    labelJa: "は行",
    descBn: "হ ও ফুঁ-ধ্বনি (ফু)",
    chars: [
      { char: "は", ro: "ha", bn: "হা" },
      { char: "ひ", ro: "hi", bn: "হি" },
      { char: "ふ", ro: "fu", bn: "ফু" },
      { char: "へ", ro: "he", bn: "হে" },
      { char: "ほ", ro: "ho", bn: "হো" },
    ],
  },
  {
    rowId: "ma",
    labelEn: "Ma-line",
    labelBn: "মা-লাইন",
    labelJa: "ま行",
    descBn: "ওষ্ঠ্য-ম নাসিক্য ধ্বনি",
    chars: [
      { char: "ま", ro: "ma", bn: "মা" },
      { char: "み", ro: "mi", bn: "মি" },
      { char: "む", ro: "mu", bn: "মু" },
      { char: "め", ro: "me", bn: "মে" },
      { char: "も", ro: "mo", bn: "মো" },
    ],
  },
  {
    rowId: "ya",
    labelEn: "Ya-line",
    labelBn: "ইয়া-লাইন",
    labelJa: "や行",
    descBn: "অর্ধস্বর (৩টি বর্ণ: Ya, Yu, Yo)",
    chars: [
      { char: "や", ro: "ya", bn: "ইয়া" },
      null,
      { char: "ゆ", ro: "yu", bn: "ইউ" },
      null,
      { char: "よ", ro: "yo", bn: "ইয়ো" },
    ],
  },
  {
    rowId: "ra",
    labelEn: "Ra-line",
    labelBn: "রা-লাইন",
    labelJa: "ら行",
    descBn: "তারণজাত র-ধ্বনি (R/L)",
    chars: [
      { char: "ら", ro: "ra", bn: "রা" },
      { char: "り", ro: "ri", bn: "রি" },
      { char: "る", ro: "ru", bn: "রু" },
      { char: "れ", ro: "re", bn: "রে" },
      { char: "ろ", ro: "ro", bn: "রো" },
    ],
  },
  {
    rowId: "wa",
    labelEn: "Wa-line",
    labelBn: "ওয়া-লাইন",
    labelJa: "わ行",
    descBn: "ওয়া এবং বিভক্তি 'ও' (Wo)",
    chars: [
      { char: "わ", ro: "wa", bn: "ওয়া" },
      null,
      null,
      null,
      { char: "を", ro: "wo (o)", bn: "ও / ওঅ" },
    ],
  },
];

// 5 Structured Rows for Hiragana Dakuten & Handakuten (が行 〜 ぱ行)
const HIRAGANA_DAKUTEN_ROWS: ChartRow[] = [
  {
    rowId: "ga",
    labelEn: "Ga-line",
    labelBn: "গা-লাইন",
    labelJa: "が行",
    descBn: "ক-বর্গের ভয়েসড ধ্বনি (দাকুতেন ゛)",
    chars: [
      { char: "が", ro: "ga", bn: "গা" },
      { char: "ぎ", ro: "gi", bn: "গি" },
      { char: "ぐ", ro: "gu", bn: "গু" },
      { char: "げ", ro: "ge", bn: "গে" },
      { char: "ご", ro: "go", bn: "গো" },
    ],
  },
  {
    rowId: "za",
    labelEn: "Za-line",
    labelBn: "জা/যা-লাইন",
    labelJa: "ざ行",
    descBn: "স-বর্গের ভয়েসড ধ্বনি (জা, জি, জু)",
    chars: [
      { char: "ざ", ro: "za", bn: "যা / জা" },
      { char: "じ", ro: "ji", bn: "জি" },
      { char: "ず", ro: "zu", bn: "যু / জু" },
      { char: "ぜ", ro: "ze", bn: "যে / জে" },
      { char: "ぞ", ro: "zo", bn: "যো / জো" },
    ],
  },
  {
    rowId: "da",
    labelEn: "Da-line",
    labelBn: "দা-লাইন",
    labelJa: "だ行",
    descBn: "ত-বর্গের ভয়েসড ধ্বনি (দা, দে, দো)",
    chars: [
      { char: "だ", ro: "da", bn: "দা" },
      { char: "ぢ", ro: "ji", bn: "জি (চি+゛)" },
      { char: "づ", ro: "dzu", bn: "জু (ৎসু+゛)" },
      { char: "で", ro: "de", bn: "দে" },
      { char: "ど", ro: "do", bn: "দো" },
    ],
  },
  {
    rowId: "ba",
    labelEn: "Ba-line",
    labelBn: "বা-লাইন",
    labelJa: "ば行",
    descBn: "হ-বর্গের ভয়েসড ধ্বনি (দাকুতেন ゛)",
    chars: [
      { char: "ば", ro: "ba", bn: "বা" },
      { char: "び", ro: "bi", bn: "বি" },
      { char: "ぶ", ro: "bu", bn: "বু" },
      { char: "べ", ro: "be", bn: "বে" },
      { char: "ぼ", ro: "bo", bn: "বো" },
    ],
  },
  {
    rowId: "pa",
    labelEn: "Pa-line",
    labelBn: "পা-লাইন",
    labelJa: "ぱ行",
    descBn: "অর্ধ-ভয়েসড বৃত্ত ধ্বনি (হানদাকুতেন ゜)",
    chars: [
      { char: "ぱ", ro: "pa", bn: "পা" },
      { char: "ぴ", ro: "pi", bn: "পি" },
      { char: "ぷ", ro: "pu", bn: "পু" },
      { char: "ぺ", ro: "pe", bn: "পে" },
      { char: "ぽ", ro: "po", bn: "পো" },
    ],
  },
];

// Hiragana Yoon (拗音 - 11 Combined Rows)
const HIRAGANA_YOON_ROWS: YoonRow[] = [
  {
    rowId: "kya",
    labelEn: "Kya-line",
    labelBn: "ক্যা-লাইন",
    labelJa: "きゃ行",
    baseChar: "き",
    chars: [
      { char: "きゃ", ro: "kya", bn: "ক্যা" },
      { char: "きゅ", ro: "kyu", bn: "কিউ" },
      { char: "きょ", ro: "kyo", bn: "কিয়ো" },
    ],
  },
  {
    rowId: "sha",
    labelEn: "Sha-line",
    labelBn: "শা-লাইন",
    labelJa: "しゃ行",
    baseChar: "し",
    chars: [
      { char: "しゃ", ro: "sha", bn: "শা" },
      { char: "しゅ", ro: "shu", bn: "শু" },
      { char: "しょ", ro: "sho", bn: "শো" },
    ],
  },
  {
    rowId: "cha",
    labelEn: "Cha-line",
    labelBn: "চা-লাইন",
    labelJa: "ちゃ行",
    baseChar: "ち",
    chars: [
      { char: "ちゃ", ro: "cha", bn: "চা" },
      { char: "ちゅ", ro: "chu", bn: "চু" },
      { char: "ちょ", ro: "cho", bn: "চো" },
    ],
  },
  {
    rowId: "nya",
    labelEn: "Nya-line",
    labelBn: "নিয়া-লাইন",
    labelJa: "にゃ行",
    baseChar: "に",
    chars: [
      { char: "にゃ", ro: "nya", bn: "নিয়া" },
      { char: "にゅ", ro: "nyu", bn: "নিউ" },
      { char: "にょ", ro: "nyo", bn: "নিয়ো" },
    ],
  },
  {
    rowId: "hya",
    labelEn: "Hya-line",
    labelBn: "হিয়া-লাইন",
    labelJa: "ひゃ行",
    baseChar: "ひ",
    chars: [
      { char: "ひゃ", ro: "hya", bn: "হিয়া" },
      { char: "ひゅ", ro: "hyu", bn: "হিউ" },
      { char: "ひょ", ro: "hyo", bn: "হিয়ো" },
    ],
  },
  {
    rowId: "mya",
    labelEn: "Mya-line",
    labelBn: "মিয়া-লাইন",
    labelJa: "みゃ行",
    baseChar: "み",
    chars: [
      { char: "みゃ", ro: "mya", bn: "মিয়া" },
      { char: "みゅ", ro: "myu", bn: "মিউ" },
      { char: "みょ", ro: "myo", bn: "মিয়ো" },
    ],
  },
  {
    rowId: "rya",
    labelEn: "Rya-line",
    labelBn: "রিয়া-লাইন",
    labelJa: "りゃ行",
    baseChar: "り",
    chars: [
      { char: "りゃ", ro: "rya", bn: "রিয়া" },
      { char: "りゅ", ro: "ryu", bn: "রিউ" },
      { char: "りょ", ro: "ryo", bn: "রিয়ো" },
    ],
  },
  {
    rowId: "gya",
    labelEn: "Gya-line",
    labelBn: "গ্যা-লাইন",
    labelJa: "ぎゃ行",
    baseChar: "ぎ",
    chars: [
      { char: "ぎゃ", ro: "gya", bn: "গ্যা" },
      { char: "ぎゅ", ro: "gyu", bn: "গিউ" },
      { char: "ぎょ", ro: "gyo", bn: "গিয়ো" },
    ],
  },
  {
    rowId: "ja",
    labelEn: "Ja-line",
    labelBn: "জা-লাইন",
    labelJa: "じゃ行",
    baseChar: "じ",
    chars: [
      { char: "じゃ", ro: "ja", bn: "জা" },
      { char: "じゅ", ro: "ju", bn: "জু" },
      { char: "じょ", ro: "jo", bn: "জো" },
    ],
  },
  {
    rowId: "bya",
    labelEn: "Bya-line",
    labelBn: "ব্যা-লাইন",
    labelJa: "びゃ行",
    baseChar: "び",
    chars: [
      { char: "びゃ", ro: "bya", bn: "ব্যা" },
      { char: "びゅ", ro: "byu", bn: "বিউ" },
      { char: "びょ", ro: "byo", bn: "বিয়ো" },
    ],
  },
  {
    rowId: "pya",
    labelEn: "Pya-line",
    labelBn: "প্যা-লাইন",
    labelJa: "ぴゃ行",
    baseChar: "ぴ",
    chars: [
      { char: "ぴゃ", ro: "pya", bn: "প্যা" },
      { char: "ぴゅ", ro: "pyu", bn: "পিউ" },
      { char: "ぴょ", ro: "pyo", bn: "পিয়ো" },
    ],
  },
];

// 10 Strictly Arranged Lines for Katakana Gojuon (ア行 〜 ワ行)
const KATAKANA_GOJUON_ROWS: ChartRow[] = [
  {
    rowId: "a",
    labelEn: "A-line",
    labelBn: "আ-লাইন",
    labelJa: "ア行",
    descBn: "মৌলিক স্বরধ্বনি (Vowels)",
    chars: [
      { char: "ア", ro: "a", bn: "আ" },
      { char: "イ", ro: "i", bn: "ই" },
      { char: "ウ", ro: "u", bn: "উ" },
      { char: "エ", ro: "e", bn: "এ" },
      { char: "オ", ro: "o", bn: "ও" },
    ],
  },
  {
    rowId: "ka",
    labelEn: "Ka-line",
    labelBn: "কা-লাইন",
    labelJa: "カ行",
    descBn: "ক-বর্গীয় ব্যঞ্জনধ্বনি",
    chars: [
      { char: "カ", ro: "ka", bn: "কা" },
      { char: "キ", ro: "ki", bn: "কি" },
      { char: "ク", ro: "ku", bn: "কু" },
      { char: "ケ", ro: "ke", bn: "কে" },
      { char: "コ", ro: "ko", bn: "কো" },
    ],
  },
  {
    rowId: "sa",
    labelEn: "Sa-line",
    labelBn: "সা-লাইন",
    labelJa: "サ行",
    descBn: "দন্ত্য-স ও তালব্য-শি",
    chars: [
      { char: "サ", ro: "sa", bn: "সা" },
      { char: "シ", ro: "shi", bn: "শি" },
      { char: "ス", ro: "su", bn: "সু" },
      { char: "セ", ro: "se", bn: "সে" },
      { char: "ソ", ro: "so", bn: "সো" },
    ],
  },
  {
    rowId: "ta",
    labelEn: "Ta-line",
    labelBn: "তা-লাইন",
    labelJa: "タ行",
    descBn: "তা, চি ও ৎসু ধ্বনি",
    chars: [
      { char: "タ", ro: "ta", bn: "তা" },
      { char: "チ", ro: "chi", bn: "চি" },
      { char: "ツ", ro: "tsu", bn: "ৎসু" },
      { char: "テ", ro: "te", bn: "তে" },
      { char: "ト", ro: "to", bn: "তো" },
    ],
  },
  {
    rowId: "na",
    labelEn: "Na-line",
    labelBn: "না-লাইন",
    labelJa: "ナ行",
    descBn: "দন্ত্য-ন নাসিক্য ধ্বনি",
    chars: [
      { char: "ナ", ro: "na", bn: "না" },
      { char: "ニ", ro: "ni", bn: "নি" },
      { char: "ヌ", ro: "nu", bn: "নু" },
      { char: "ネ", ro: "ne", bn: "নে" },
      { char: "ノ", ro: "no", bn: "নো" },
    ],
  },
  {
    rowId: "ha",
    labelEn: "Ha-line",
    labelBn: "হা-লাইন",
    labelJa: "ハ行",
    descBn: "হ ও ফুঁ-ধ্বনি (ফু)",
    chars: [
      { char: "ハ", ro: "ha", bn: "হা" },
      { char: "ヒ", ro: "hi", bn: "হি" },
      { char: "フ", ro: "fu", bn: "ফু" },
      { char: "ヘ", ro: "he", bn: "হে" },
      { char: "ホ", ro: "ho", bn: "হো" },
    ],
  },
  {
    rowId: "ma",
    labelEn: "Ma-line",
    labelBn: "মা-লাইন",
    labelJa: "マ行",
    descBn: "ওষ্ঠ্য-ম নাসিক্য ধ্বনি",
    chars: [
      { char: "マ", ro: "ma", bn: "মা" },
      { char: "ミ", ro: "mi", bn: "মি" },
      { char: "ム", ro: "mu", bn: "মু" },
      { char: "メ", ro: "me", bn: "মে" },
      { char: "モ", ro: "mo", bn: "মো" },
    ],
  },
  {
    rowId: "ya",
    labelEn: "Ya-line",
    labelBn: "ইয়া-লাইন",
    labelJa: "ヤ行",
    descBn: "অর্ধস্বর (৩টি বর্ণ: Ya, Yu, Yo)",
    chars: [
      { char: "ヤ", ro: "ya", bn: "ইয়া" },
      null,
      { char: "ユ", ro: "yu", bn: "ইউ" },
      null,
      { char: "ヨ", ro: "yo", bn: "ইয়ো" },
    ],
  },
  {
    rowId: "ra",
    labelEn: "Ra-line",
    labelBn: "রা-লাইন",
    labelJa: "ラ行",
    descBn: "তারণজাত র-ধ্বনি (R/L)",
    chars: [
      { char: "ラ", ro: "ra", bn: "রা" },
      { char: "リ", ro: "ri", bn: "রি" },
      { char: "ル", ro: "ru", bn: "রু" },
      { char: "レ", ro: "re", bn: "রে" },
      { char: "ロ", ro: "ro", bn: "রো" },
    ],
  },
  {
    rowId: "wa",
    labelEn: "Wa-line",
    labelBn: "ওয়া-লাইন",
    labelJa: "ワ行",
    descBn: "ওয়া এবং পার্টিকল 'ও' (Wo)",
    chars: [
      { char: "ワ", ro: "wa", bn: "ওয়া" },
      null,
      null,
      null,
      { char: "ヲ", ro: "wo (o)", bn: "ও / ওঅ" },
    ],
  },
];

// 5 Structured Rows for Katakana Dakuten & Handakuten (ガ行 〜 パ行)
const KATAKANA_DAKUTEN_ROWS: ChartRow[] = [
  {
    rowId: "ga",
    labelEn: "Ga-line",
    labelBn: "গা-লাইন",
    labelJa: "ガ行",
    descBn: "ক-বর্গের ভয়েসড ধ্বনি (দাকুতেন ゛)",
    chars: [
      { char: "ガ", ro: "ga", bn: "গা" },
      { char: "ギ", ro: "gi", bn: "গি" },
      { char: "グ", ro: "gu", bn: "গু" },
      { char: "ゲ", ro: "ge", bn: "গে" },
      { char: "ゴ", ro: "go", bn: "গো" },
    ],
  },
  {
    rowId: "za",
    labelEn: "Za-line",
    labelBn: "জা/যা-লাইন",
    labelJa: "ザ行",
    descBn: "স-বর্গের ভয়েসড ধ্বনি (জা, জি, জু)",
    chars: [
      { char: "ザ", ro: "za", bn: "যা / জা" },
      { char: "ジ", ro: "ji", bn: "জি" },
      { char: "ズ", ro: "zu", bn: "যু / জু" },
      { char: "ゼ", ro: "ze", bn: "যে / জে" },
      { char: "ゾ", ro: "zo", bn: "যো / জো" },
    ],
  },
  {
    rowId: "da",
    labelEn: "Da-line",
    labelBn: "দা-লাইন",
    labelJa: "ダ行",
    descBn: "ত-বর্গের ভয়েসড ধ্বনি (দা, দে, দো)",
    chars: [
      { char: "ダ", ro: "da", bn: "দা" },
      { char: "ヂ", ro: "ji", bn: "জি (チ+゛)" },
      { char: "ヅ", ro: "dzu", bn: "জু (ツ+゛)" },
      { char: "デ", ro: "de", bn: "দে" },
      { char: "ド", ro: "do", bn: "দো" },
    ],
  },
  {
    rowId: "ba",
    labelEn: "Ba-line",
    labelBn: "বা-লাইন",
    labelJa: "バ行",
    descBn: "হ-বর্গের ভয়েসড ধ্বনি (দাকুতেন ゛)",
    chars: [
      { char: "バ", ro: "ba", bn: "বা" },
      { char: "ビ", ro: "bi", bn: "বি" },
      { char: "ブ", ro: "bu", bn: "বু" },
      { char: "ベ", ro: "be", bn: "বে" },
      { char: "ボ", ro: "bo", bn: "বো" },
    ],
  },
  {
    rowId: "pa",
    labelEn: "Pa-line",
    labelBn: "পা-লাইন",
    labelJa: "パ行",
    descBn: "অর্ধ-ভয়েসড বৃত্ত ধ্বনি (হানদাকুতেন ゜)",
    chars: [
      { char: "パ", ro: "pa", bn: "পা" },
      { char: "ピ", ro: "pi", bn: "পি" },
      { char: "プ", ro: "pu", bn: "পু" },
      { char: "ペ", ro: "pe", bn: "পে" },
      { char: "ポ", ro: "po", bn: "পো" },
    ],
  },
];

// Katakana Yoon (拗音 - 11 Combined Rows)
const KATAKANA_YOON_ROWS: YoonRow[] = [
  {
    rowId: "kya",
    labelEn: "Kya-line",
    labelBn: "ক্যা-লাইন",
    labelJa: "キャ行",
    baseChar: "キ",
    chars: [
      { char: "キャ", ro: "kya", bn: "ক্যা" },
      { char: "キュ", ro: "kyu", bn: "কিউ" },
      { char: "キョ", ro: "kyo", bn: "কিয়ো" },
    ],
  },
  {
    rowId: "sha",
    labelEn: "Sha-line",
    labelBn: "শা-লাইন",
    labelJa: "シャ行",
    baseChar: "シ",
    chars: [
      { char: "シャ", ro: "sha", bn: "শা" },
      { char: "シュ", ro: "shu", bn: "শু" },
      { char: "ショ", ro: "sho", bn: "শো" },
    ],
  },
  {
    rowId: "cha",
    labelEn: "Cha-line",
    labelBn: "চা-লাইন",
    labelJa: "チャ行",
    baseChar: "チ",
    chars: [
      { char: "チャ", ro: "cha", bn: "চা" },
      { char: "チュ", ro: "chu", bn: "চু" },
      { char: "チョ", ro: "cho", bn: "চো" },
    ],
  },
  {
    rowId: "nya",
    labelEn: "Nya-line",
    labelBn: "নিয়া-লাইন",
    labelJa: "ニャ行",
    baseChar: "ニ",
    chars: [
      { char: "ニャ", ro: "nya", bn: "নিয়া" },
      { char: "ニュ", ro: "nyu", bn: "নিউ" },
      { char: "ニョ", ro: "nyo", bn: "নিয়ো" },
    ],
  },
  {
    rowId: "hya",
    labelEn: "Hya-line",
    labelBn: "হিয়া-লাইন",
    labelJa: "ヒャ行",
    baseChar: "ヒ",
    chars: [
      { char: "ヒャ", ro: "hya", bn: "হিয়া" },
      { char: "ヒュ", ro: "hyu", bn: "হিউ" },
      { char: "ヒョ", ro: "hyo", bn: "হিয়ো" },
    ],
  },
  {
    rowId: "mya",
    labelEn: "Mya-line",
    labelBn: "মিয়া-লাইন",
    labelJa: "ミャ行",
    baseChar: "ミ",
    chars: [
      { char: "ミャ", ro: "mya", bn: "মিয়া" },
      { char: "ミュ", ro: "myu", bn: "মিউ" },
      { char: "ミョ", ro: "myo", bn: "মিয়ো" },
    ],
  },
  {
    rowId: "rya",
    labelEn: "Rya-line",
    labelBn: "রিয়া-লাইন",
    labelJa: "リャ行",
    baseChar: "リ",
    chars: [
      { char: "リャ", ro: "rya", bn: "রিয়া" },
      { char: "リュ", ro: "ryu", bn: "রিউ" },
      { char: "リョ", ro: "ryo", bn: "রিয়ো" },
    ],
  },
  {
    rowId: "gya",
    labelEn: "Gya-line",
    labelBn: "গ্যা-লাইন",
    labelJa: "ギャ行",
    baseChar: "ギ",
    chars: [
      { char: "ギャ", ro: "gya", bn: "গ্যা" },
      { char: "ギュ", ro: "gyu", bn: "গিউ" },
      { char: "ギョ", ro: "gyo", bn: "গিয়ো" },
    ],
  },
  {
    rowId: "ja",
    labelEn: "Ja-line",
    labelBn: "জা-লাইন",
    labelJa: "ジャ行",
    baseChar: "ジ",
    chars: [
      { char: "ジャ", ro: "ja", bn: "জা" },
      { char: "ジュ", ro: "ju", bn: "জু" },
      { char: "ジョ", ro: "jo", bn: "জো" },
    ],
  },
  {
    rowId: "bya",
    labelEn: "Bya-line",
    labelBn: "ব্যা-লাইন",
    labelJa: "ビャ行",
    baseChar: "ビ",
    chars: [
      { char: "ビャ", ro: "bya", bn: "ব্যা" },
      { char: "ビュ", ro: "byu", bn: "বিউ" },
      { char: "ビョ", ro: "byo", bn: "বিয়ো" },
    ],
  },
  {
    rowId: "pya",
    labelEn: "Pya-line",
    labelBn: "প্যা-লাইন",
    labelJa: "ピャ行",
    baseChar: "ピ",
    chars: [
      { char: "ピャ", ro: "pya", bn: "প্যা" },
      { char: "ピュ", ro: "pyu", bn: "পিউ" },
      { char: "ピョ", ro: "pyo", bn: "পিয়ো" },
    ],
  },
];

const MINNA_KOTOBA_L1 = [
  {
    jp: "わたし (私)",
    speech: "わたし",
    bnPron: "ওয়াতাশি (Watashi)",
    enMeaning: "I / Me",
    bnMeaning: "আমি",
  },
  {
    jp: "あなた",
    speech: "あなた",
    bnPron: "আনাতা (Anata)",
    enMeaning: "You",
    bnMeaning: "আপনি / তুমি",
  },
  {
    jp: "あのひと (あの人)",
    speech: "あのひと",
    bnPron: "আনো হিতো (Ano hito)",
    enMeaning: "That person / He / She",
    bnMeaning: "ঐ ব্যক্তি / উনি",
  },
  {
    jp: "せんせい (先生)",
    speech: "せんせい",
    bnPron: "সেন্সেই (Sensei)",
    enMeaning: "Teacher / Instructor",
    bnMeaning: "শিক্ষক / প্রশিক্ষক",
  },
  {
    jp: "がくせい (学生)",
    speech: "がくせい",
    bnPron: "গাকুসেই (Gakusei)",
    enMeaning: "Student",
    bnMeaning: "ছাত্র / শিক্ষার্থী",
  },
  {
    jp: "かいしゃいん (会社員)",
    speech: "かいしゃいん",
    bnPron: "কাইশাইন (Kaishain)",
    enMeaning: "Company Employee",
    bnMeaning: "কোম্পানির কর্মী / চাকরিজীবী",
  },
  {
    jp: "ぎんこういん (銀行員)",
    speech: "ぎんこういん",
    bnPron: "গিংকোইন (Ginkōin)",
    enMeaning: "Bank Employee",
    bnMeaning: "ব্যাংক কর্মকর্তা",
  },
  {
    jp: "いしゃ (医者)",
    speech: "いしゃ",
    bnPron: "ইশা (Isha)",
    enMeaning: "Medical Doctor",
    bnMeaning: "ডাক্তার / চিকিৎসক",
  },
  {
    jp: "けんきゅうしゃ (研究者)",
    speech: "けんきゅうしゃ",
    bnPron: "কেনকিউশা (Kenkyūsha)",
    enMeaning: "Researcher / Scholar",
    bnMeaning: "গবেষক",
  },
  {
    jp: "だいがく (大学)",
    speech: "だいがく",
    bnPron: "দাইগাকু (Daigaku)",
    enMeaning: "University",
    bnMeaning: "বিশ্ববিদ্যালয়",
  },
  {
    jp: "びょういん (病院)",
    speech: "びょういん",
    bnPron: "বিয়োইন (Byōin)",
    enMeaning: "Hospital",
    bnMeaning: "হাসপাতাল",
  },
  {
    jp: "～さん",
    speech: "さん",
    bnPron: "~সান (~San)",
    enMeaning: "Mr. / Ms. (Polite Suffix)",
    bnMeaning: "জনাব / জনাবা (সম্মানসূচক পদবি)",
  },
];

const N5_GRAMMAR_PARTICLES = [
  {
    particle: "は",
    romaji: "wa (ওয়া)",
    role: {
      en: "Topic Marker Particle",
      bn: "বাক্যের মূল উদ্দেশ্য বা টপিক নির্দেশক",
      ja: "主題を示す助詞",
    },
    rule: {
      en: "Written as 'ha' (は) in Hiragana, but always pronounced 'wa' when used as a particle.",
      bn: "লেখার সময় হিরাগানার 'হা' (は) লেখা হয়, কিন্তু পার্টিকেল হিসেবে উচ্চারণ সবসময় 'ওয়া' (wa) হবে।",
      ja: "文字は「は」と書きますが、助詞としては「わ (wa)」と発音します。",
    },
    exampleJp: "わたし は がくせい です。",
    exampleRo: "Watashi wa gakusei desu.",
    exampleMeaning: {
      en: "I am a student.",
      bn: "আমি একজন শিক্ষার্থী।",
      ja: "私は学生です。",
    },
  },
  {
    particle: "が",
    romaji: "ga (গা)",
    role: {
      en: "Subject / Existence / Ability Marker",
      bn: "কর্তা, অস্তিত্ব বা দক্ষতা নির্দেশক",
      ja: "主語・対象・能力を示す助詞",
    },
    rule: {
      en: "Marks the specific subject, likes/dislikes (suki/kirai), or language ability (wakaru/dekiru).",
      bn: "পছন্দ-অপছন্দ (すき), বোঝা বা পারা (わかります) এবং নির্দিষ্ট কর্তা বোঝাতে 'গা' (が) ব্যবহৃত হয়।",
      ja: "好き・嫌い、分かる・できるの対象や、疑問詞が主語になるときに使います。",
    },
    exampleJp: "にほんご が わかります。",
    exampleRo: "Nihongo ga wakarimasu.",
    exampleMeaning: {
      en: "I understand Japanese.",
      bn: "আমি জাপানি ভাষা বুঝি।",
      ja: "日本語がわかります。",
    },
  },
  {
    particle: "を",
    romaji: "o (ও)",
    role: {
      en: "Direct Object Marker",
      bn: "কর্ম (Direct Object) নির্দেশক পার্টিকেল",
      ja: "動作の対象（目的語）を示す助詞",
    },
    rule: {
      en: "Placed immediately after the noun that receives the action of a transitive verb.",
      bn: "ক্রিয়ার কাজটি যে বস্তুর ওপর সরাসরি প্রযুক্ত হয় (যেমন: ভাত খাওয়া, বই পড়া), তার পরে 'ও' (を) বসে।",
      ja: "他動詞の前に置き、動作の対象となる名詞を示します。",
    },
    exampleJp: "にほんご を べんきょうします。",
    exampleRo: "Nihongo o benkyō shimasu.",
    exampleMeaning: {
      en: "I study Japanese.",
      bn: "আমি জাপানি ভাষা অধ্যয়ন করি।",
      ja: "日本語を勉強します。",
    },
  },
  {
    particle: "に",
    romaji: "ni (নি)",
    role: {
      en: "Time / Destination / Location of Existence",
      bn: "নির্দিষ্ট সময়, গন্তব্য বা অবস্থান নির্দেশক",
      ja: "時間・目的地・存在場所を示す助詞",
    },
    rule: {
      en: "Used after clock time (6-ji ni), destination with ikimasu/kimasu, or location with imasu/arimasu.",
      bn: "নির্দিষ্ট ঘড়ির সময় (৬টায়), কোথাও যাওয়া (ইকিমাসু) এবং কোনো স্থানে থাকা বোঝাতে 'নি' (に) বসে।",
      ja: "具体的な時刻、移動の到着点（〜に行きます）、存在の場所（〜にいます）を示します。",
    },
    exampleJp: "らいげつ にほん に いきます。",
    exampleRo: "Raigetsu Nihon ni ikimasu.",
    exampleMeaning: {
      en: "I will go to Japan next month.",
      bn: "আগামী মাসে আমি জাপানে যাব।",
      ja: "来月日本に行きます。",
    },
  },
  {
    particle: "で",
    romaji: "de (দে)",
    role: {
      en: "Place of Action / Means & Transport",
      bn: "কাজের স্থান অথবা যানবাহন/মাধ্যম নির্দেশক",
      ja: "動作の場所・手段（乗り物・道具）を示す助詞",
    },
    rule: {
      en: "Indicates WHERE an active action happens (at school) or BY WHAT means (by train / in Japanese).",
      bn: "কোথায় কাজটি ঘটছে (স্কুলে পড়া) অথবা কী মাধ্যমে কাজটি হচ্ছে (ট্রেনে যাওয়া / জাপানি ভাষায় কথা বলা) বোঝাতে 'দে' (で) বসে।",
      ja: "動作が行われる場所や、交通手段・道具・言語などを表します。",
    },
    exampleJp: "でんしゃ で がっこう へ いきます。",
    exampleRo: "Densha de gakkō e ikimasu.",
    exampleMeaning: {
      en: "I go to school by train.",
      bn: "আমি ট্রেনে করে স্কুলে যাই।",
      ja: "電車で学校へ行きます。",
    },
  },
];

const KAIWA_L1_DIALOGUE = [
  {
    speaker: "Rahim (রহিম)",
    role: "Student / Applicant",
    jp: "はじめまして。わたしは ラヒムです。",
    ro: "Hajimemashite. Watashi wa Rahimu desu.",
    bn: "প্রথম পরিচয়ে আনন্দিত। আমি রহিম।",
    en: "Nice to meet you. I am Rahim.",
  },
  {
    speaker: "Rahim (রহিম)",
    role: "Student / Applicant",
    jp: "ダッカから きました。どうぞ よろしく おねがいします。",
    ro: "Dakka kara kimashita. Dōzo yoroshiku onegaishimasu.",
    bn: "আমি ঢাকা থেকে এসেছি। অনুগ্রহ করে আমার প্রতি সুদৃষ্টি রাখবেন।",
    en: "I came from Dhaka. Pleased to meet you.",
  },
  {
    speaker: "Sensei Sato (সাতো সেন্সি)",
    role: "Japanese Instructor",
    jp: "さとうです。こちらこそ よろしく おねがいします。",
    ro: "Satō desu. Kochirakoso yoroshiku onegaishimasu.",
    bn: "আমি সাতো। আপনার সাথেও পরিচিত হয়ে আনন্দিত।",
    en: "I am Sato. The pleasure is mine.",
  },
  {
    speaker: "Sensei Sato (সাতো সেন্সি)",
    role: "Japanese Instructor",
    jp: "ラヒムさんは がくせいですか。",
    ro: "Rahimu-san wa gakusei desu ka.",
    bn: "রহিম সাহেব কি একজন শিক্ষার্থী?",
    en: "Are you a student, Mr. Rahim?",
  },
  {
    speaker: "Rahim (রহিম)",
    role: "Student / Applicant",
    jp: "はい、KNLTCの にほんごの がくせいです。",
    ro: "Hai, KNLTC no Nihongo no gakusei desu.",
    bn: "হ্যাঁ, আমি KNLTC-এর জাপানি ভাষার শিক্ষার্থী।",
    en: "Yes, I am a Japanese language student at KNLTC.",
  },
];

export default function InteractiveLanguageLab() {
  const { language } = useLanguage();
  const [activeScript, setActiveScript] = useState<ScriptType>("hiragana");
  const [subFilter, setSubFilter] = useState<SubFilterType>("basic");
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const cancelPlayingRef = useRef<boolean>(false);

  const t = translate(
    {
      bn: {
        badge: "অফিশিয়াল মিন্না নো নিহোঙ্গো ও ইরোদেরি লার্নিং হাব",
        title: "মিন্না নো নিহোঙ্গো N5 ও অ্যালফাবেট সাউন্ড ল্যাব",
        subtitle:
          "হিরাগানা ও কাতাকানা ৫০ ধ্বনি, লেসন ১ শব্দভাণ্ডার (Kotoba), N5 পার্টিকেল ব্যাকরণ (Bunkei) এবং বাস্তব কথোপকথন (Kaiwa)—অডিও উচ্চারণসহ প্র্যাকটিস করুন।",
        tabHiragana: "১. হিরাগানা (Hiragana)",
        tabKatakana: "২. কাতাকানা (Katakana)",
        tabKotoba: "৩. শব্দভাণ্ডার (Kotoba)",
        tabGrammar: "৪. ব্যাকরণ (Bunkei)",
        tabPhrases: "৫. কথোপকথন (Kaiwa)",
        filterBasic: "মৌলিক ১০ লাইন (৫০ সাউন্ডস - 五十音)",
        filterVoiced: "৫টি ভয়েসড লাইন (দাকুতেন ও হানদাকুতেন - 濁音/半濁音)",
        filterYoon: "১১টি কম্বিনেশন লাইন (ইয়ো-অন - 拗音)",
        clickListen: "যেকোনো শব্দে বা বর্ণে ক্লিক করে অডিও উচ্চারণ শুনুন",
        playRow: "পুরো লাইন শুনুন",
        playingRow: "বাজছে...",
        speedNote: "লার্নারদের সুবিধার্থে ০.৮৫x স্পষ্ট গতিতে সাউন্ড প্লে হয়",
        enrollBanner: "প্রথম দিন থেকেই জাপানি ভাষায় সাবলীল হতে আমাদের ১৫০ ঘণ্টার কোর্সে যোগ দিন",
        enrollSub: "মিন্না নো নিহোঙ্গো ১ ও ২ বই, ইরোদেরি শিট, অডিও ড্রিল এবং ১৫,০০০ টাকার ৩টি স্পেশাল ইন্টারভিউ কোর্স ১০০% ফ্রি।",
        btnEnroll: "কোর্সে ভর্তি আবেদন",
        btnBookStore: "বুক স্টোর (/store) থেকে বই অর্ডার করুন",
        storeBannerTitle: "বাসায় বসে প্র্যাকটিস করার জন্য হার্ডকপি বই ও কাঞ্জি ওয়ার্কবুক প্রয়োজন?",
        storeBannerSub: "KNLTC অফিশিয়াল বুক স্টোর (/store) থেকে মিন্না নো নিহোঙ্গো, ইরোদেরি, কাঞ্জি শিট ও SSW গাইড সারা বাংলাদেশে ক্যাশ-অন-ডেলিভারিতে অর্ডার করুন।",
        pedagogicalHiragana:
          "হিরাগানা চার্টের প্রতিটি লাইন (行 - Gyou) ৫টি স্বরধ্বনি (A, I, U, E, O) অনুযায়ী জাপানি ব্যাকরণের নিয়মে ১০০% সুনির্দিষ্টভাবে সাজানো।",
        pedagogicalKatakana:
          "কাতাকানা চার্টেও প্রতিটি লাইন (行 - Gyou) একই নিয়মে সাজানো। বিদেশি শব্দ, নিজের নাম ও আন্তর্জাতিক ব্র্যান্ড লেখার ক্ষেত্রে এটি ব্যবহৃত হয়।",
        vowels: [
          { v: "A (あ段)", bn: "আ-কলাম" },
          { v: "I (い段)", bn: "ই-কলাম" },
          { v: "U (う段)", bn: "উ-কলাম" },
          { v: "E (え段)", bn: "এ-কলাম" },
          { v: "O (お段)", bn: "ও-কলাম" },
        ],
        yoonCols: [
          { v: "-ya (ゃ)", bn: "ইয়া-কলাম" },
          { v: "-yu (ゅ)", bn: "ইউ-কলাম" },
          { v: "-yo (ょ)", bn: "ইয়ো-কলাম" },
        ],
        lineColLabel: "লাইন (行)",
        hatsuonTitle: "撥音 (Hatsuon) — একক নাসিক্য ধ্বনি",
        hatsuonDesc:
          "জাপানি বর্ণমালার একমাত্র স্বরহীন ব্যঞ্জনবর্ণ। এটি কোনো স্বরবর্ণের সাথে যুক্ত নয়, বরং শব্দের শেষে বা মাঝে নাসিক্য 'ন' বা অনুস্বার 'ং' হিসেবে ধ্বনিত হয়।",
        hatsuonExamplesLabel: "বাস্তব উদাহরণ (ক্লিক করে শুনুন):",
      },
      en: {
        badge: "Official Minna No Nihongo & Irodori Learning Hub",
        title: "Interactive Minna No Nihongo N5 & Sound Matrix Lab",
        subtitle:
          "Master all 4 core pillars of Japanese: Hiragana & Katakana 50-sound matrix, Lesson 1 Vocabulary (Kotoba), N5 Particle Grammar (Bunkei), and Spoken Conversation (Kaiwa) with native audio.",
        tabHiragana: "1. Hiragana (ひらがな)",
        tabKatakana: "2. Katakana (カタカナ)",
        tabKotoba: "3. Vocabulary (Kotoba)",
        tabGrammar: "4. Grammar (Bunkei)",
        tabPhrases: "5. Conversation (Kaiwa)",
        filterBasic: "10 Core Lines (Gojuon - 50 Sounds)",
        filterVoiced: "5 Voiced Lines (Dakuten / Handakuten)",
        filterYoon: "11 Contracted Lines (Yoon - 拗音)",
        clickListen: "Click on any character or sentence to hear native pronunciation",
        playRow: "Play Line",
        playingRow: "Playing...",
        speedNote: "Native speech tuned to 0.85x speed for clear learner comprehension",
        enrollBanner: "Master JFT (Irodori) & JLPT N5/N4 in our 150-Hour Certified Batch",
        enrollSub: "Includes Minna No Nihongo I & II books, Irodori handouts, audio drills, and 3 free bonus courses worth ৳15,000.",
        btnEnroll: "Apply for Admission",
        btnBookStore: "Order Physical Books (/store)",
        storeBannerTitle: "Want physical Minna No Nihongo books, Kanji workbooks & SSW guides delivered home?",
        storeBannerSub: "Order authentic textbooks, Kanji practice sheets, and JFT/JLPT question banks from the official KNLTC Book Store with nationwide delivery.",
        pedagogicalHiragana:
          "Every row (Gyō - 行) of the Hiragana chart is systematically aligned across the 5 Japanese vowels (A, I, U, E, O).",
        pedagogicalKatakana:
          "Every row (Gyō - 行) of the Katakana chart follows the exact same 5-vowel phonetic structure and is used for foreign names, loanwords, and brands.",
        vowels: [
          { v: "A (あ)", bn: "Column A" },
          { v: "I (い)", bn: "Column I" },
          { v: "U (う)", bn: "Column U" },
          { v: "E (え)", bn: "Column E" },
          { v: "O (お)", bn: "Column O" },
        ],
        yoonCols: [
          { v: "-ya (ゃ)", bn: "Column Ya" },
          { v: "-yu (ゅ)", bn: "Column Yu" },
          { v: "-yo (ょ)", bn: "Column Yo" },
        ],
        lineColLabel: "Line (Gyō)",
        hatsuonTitle: "Hatsuon (撥音) — Standalone Nasal Coda",
        hatsuonDesc:
          "The only consonant character without an inherent vowel. It represents a syllabic nasal sound (n / m / ng) depending on context.",
        hatsuonExamplesLabel: "Real-world Examples (Click to listen):",
      },
      ja: {
        badge: "公式『みんなの日本語』＆『いろどり』総合学習ラボ",
        title: "五十音図・語彙（ことば）・文法（文型）・会話（かいわ）体験ラボ",
        subtitle:
          "ひらがな・カタカナ五十音図に加え、『みんなの日本語』第1課の基本語彙、N5重要助詞、実践会話フレーズをネイティブ音声付きで体験できます。",
        tabHiragana: "1. ひらがな",
        tabKatakana: "2. カタカナ",
        tabKotoba: "3. 語彙 (Kotoba)",
        tabGrammar: "4. 文法 (Bunkei)",
        tabPhrases: "5. 会話 (Kaiwa)",
        filterBasic: "基本10行（清音・五十音）",
        filterVoiced: "濁音・半濁音（5行）",
        filterYoon: "拗音（11行）",
        clickListen: "文字や例文をクリックして正しい発音を再生",
        playRow: "行を再生",
        playingRow: "再生中...",
        speedNote: "学習者に聞き取りやすい適正速度（0.85倍速）で再生されます",
        enrollBanner: "入管基準150時間認定のJFT（いろどり）・JLPT N5/N4コース受講生募集中",
        enrollSub: "『みんなの日本語』第1・2巻、いろどり教材、15,000タカ相当の面接・履歴書3大特典講座が100%無料。",
        btnEnroll: "受講申込みへ",
        btnBookStore: "公式ブックストア (/store)",
        storeBannerTitle: "紙の『みんなの日本語』教科書・漢字ドリル・特定技能テキストをご希望ですか？",
        storeBannerSub: "KNLTC公式ブックストア（/store）より、バングラデシュ全国へ教材を配送いたします。",
        pedagogicalHiragana:
          "ひらがな五十音図の各行（あ行〜わ行）は、5つの母音（あ・い・う・え・お）に沿って体系的に配置されています。",
        pedagogicalKatakana:
          "カタカナ五十音図も同じく5母音体系で構成され、外来語や外国人名・企業名の表記に用いられます。",
        vowels: [
          { v: "あ段 (A)", bn: "A列" },
          { v: "い段 (I)", bn: "I列" },
          { v: "う段 (U)", bn: "U列" },
          { v: "え段 (E)", bn: "E列" },
          { v: "お段 (O)", bn: "O列" },
        ],
        yoonCols: [
          { v: "ゃ段 (-ya)", bn: "ゃ列" },
          { v: "ゅ段 (-yu)", bn: "ゅ列" },
          { v: "ょ段 (-yo)", bn: "ょ列" },
        ],
        lineColLabel: "行 (Row)",
        hatsuonTitle: "撥音（ん）— 独立鼻音",
        hatsuonDesc:
          "日本語唯一の母音を持たない独立子音。前後の音に応じて「ん/m/ng」と自然に変化する重要な文字です。",
        hatsuonExamplesLabel: "代表的な単語（クリックして再生）:",
      },
    },
    language,
  );

  const playSpeech = (text: string, key: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      cancelPlayingRef.current = true;
      window.speechSynthesis.cancel();
      cancelPlayingRef.current = false;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;

      setPlayingKey(key);
      utterance.onend = () => setPlayingKey(null);
      utterance.onerror = () => setPlayingKey(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const playLineSequence = async (chars: (CharacterItem | null)[], lineKey: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (playingKey === lineKey) {
      cancelPlayingRef.current = true;
      window.speechSynthesis.cancel();
      setPlayingKey(null);
      return;
    }

    cancelPlayingRef.current = true;
    window.speechSynthesis.cancel();
    cancelPlayingRef.current = false;
    setPlayingKey(lineKey);

    const validChars = chars.filter((c): c is CharacterItem => c !== null);

    for (let i = 0; i < validChars.length; i++) {
      if (cancelPlayingRef.current) break;
      const item = validChars[i];

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(item.char);
        utterance.lang = "ja-JP";
        utterance.rate = 0.85;

        utterance.onend = () => {
          setTimeout(resolve, 200);
        };
        utterance.onerror = () => {
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    }

    if (!cancelPlayingRef.current) {
      setPlayingKey(null);
    }
  };

  const currentStandardRows: ChartRow[] =
    activeScript === "hiragana"
      ? subFilter === "basic"
        ? HIRAGANA_GOJUON_ROWS
        : HIRAGANA_DAKUTEN_ROWS
      : subFilter === "basic"
      ? KATAKANA_GOJUON_ROWS
      : KATAKANA_DAKUTEN_ROWS;

  const currentYoonRows: YoonRow[] =
    activeScript === "hiragana" ? HIRAGANA_YOON_ROWS : KATAKANA_YOON_ROWS;

  const hatsuonChar = activeScript === "hiragana" ? "ん" : "ン";
  const hatsuonRomaji = "n";
  const hatsuonBn = "ং / ন";
  const hatsuonExamples =
    activeScript === "hiragana"
      ? [
          { jp: "にほん", ro: "Nihon", bn: "জাপান (দেশ)" },
          { jp: "せんせい", ro: "Sensei", bn: "শিক্ষক" },
          { jp: "ほん", ro: "Hon", bn: "বই" },
          { jp: "かんぱい", ro: "Kanpai", bn: "চিয়ার্স / অভিবাদন" },
        ]
      : [
          { jp: "ラーメン", ro: "Rāmen", bn: "রামেন নুডলস" },
          { jp: "パン", ro: "Pan", bn: "পাউরুটি" },
          { jp: "ペン", ro: "Pen", bn: "কলম" },
          { jp: "オンライン", ro: "Onrain", bn: "অনলাইন" },
        ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] border-y border-stone-200">
      <div className="container-narrow">
        {/* Section Header */}
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

        {/* Primary Navigation Tabs (Complete Minna No Nihongo Pillars) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-2xl bg-stone-200/80 p-1.5 border border-stone-300/80 shadow-2xs max-w-full overflow-x-auto gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveScript("hiragana");
                setSubFilter("basic");
              }}
              className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeScript === "hiragana"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>あ</span>
              <span>{t.tabHiragana}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveScript("katakana");
                setSubFilter("basic");
              }}
              className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeScript === "katakana"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>ア</span>
              <span>{t.tabKatakana}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScript("kotoba")}
              className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeScript === "kotoba"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-[#1E5631]" />
              <span>{t.tabKotoba}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScript("grammar")}
              className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeScript === "grammar"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#b91c1c]" />
              <span>{t.tabGrammar}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScript("phrases")}
              className={`px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeScript === "phrases"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Volume2 className="h-4 w-4 text-[#b91c1c]" />
              <span>{t.tabPhrases}</span>
            </button>
          </div>
        </div>

        {/* Script Content Area */}
        <AnimatePresence mode="wait">
          {activeScript === "kotoba" ? (
            <motion.div
              key="kotoba-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl mx-auto"
            >
              {/* 2-Column Layout: Left (70% / 8 cols) 4-Column Vocabulary Table & Right (30% / 4 cols) Grammar Tip Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 70% (8 cols): 4-Column Vocabulary Table */}
                <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs">
                  <div className="bg-stone-100/90 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {language === "bn"
                        ? "মিন্না নো নিহোঙ্গো লেসন ১ — মূল শব্দভাণ্ডার (Kotoba)"
                        : language === "ja"
                          ? "『みんなの日本語』第1課 — 基本語彙（ことば）"
                          : "Minna No Nihongo Lesson 1 — Core Vocabulary (Kotoba)"}
                    </span>
                    <span className="text-[11px] font-semibold text-[#b91c1c] flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Audio</span>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#fcfaf7] border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          <th className="py-3 px-4">Japanese</th>
                          <th className="py-3 px-4">Pronunciation in Bengali</th>
                          <th className="py-3 px-4">English Meaning</th>
                          <th className="py-3 px-4">Bengali Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {MINNA_KOTOBA_L1.map((item, idx) => {
                          const kKey = `kotoba-${idx}`;
                          const isPlaying = playingKey === kKey;
                          return (
                            <tr
                              key={idx}
                              onClick={() => playSpeech(item.speech, kKey)}
                              className={`transition-colors cursor-pointer ${
                                isPlaying ? "bg-red-50/70" : "hover:bg-stone-50"
                              }`}
                            >
                              <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className="h-6 w-6 rounded-md bg-stone-100 text-[#b91c1c] inline-flex items-center justify-center shrink-0">
                                    <Volume2 className="h-3.5 w-3.5" />
                                  </span>
                                  <span className="text-sm sm:text-base">{item.jp}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium text-slate-700 leading-relaxed">
                                {item.bnPron}
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-800">
                                {item.enMeaning}
                              </td>
                              <td className="py-3 px-4 font-bold text-[#1E5631] leading-relaxed">
                                {item.bnMeaning}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right 30% (4 cols): Neat 'Grammar Tip' Box in #1E5631 (Forest Green) & #C8102E (Crimson Red) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="rounded-2xl border-2 border-[#1E5631] bg-white p-5 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1E5631] px-2.5 py-1 text-xs font-bold text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Grammar Tip • Lesson 1</span>
                      </span>
                      <span className="text-xs font-bold text-[#C8102E]">N1 は N2 です</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                      <p className="font-bold text-slate-900">
                        {language === "bn"
                          ? "১. আত্মপরিচয়ের মূল সূত্র (～は ～です):"
                          : language === "ja"
                            ? "1. 基本文型「N1 は N2 です」:"
                            : "1. Core Identity Rule (~wa ~desu):"}
                      </p>
                      <p>
                        {language === "bn"
                          ? "জাপানি ভাষায় নিজের নাম বা পেশা বলার সময় কর্তার পরে 「は (ওয়া)」 এবং বাক্যের শেষে বিনীত সমাপিকা ক্রিয়া হিসেবে 「です (দেস)」 বসে।"
                          : language === "ja"
                            ? "助詞「は（わ）」は主題を示し、文末の「です」は丁寧な断定を表します。"
                            : "Particle 'は (pronounced wa)' marks the topic, and 'です (desu)' at the end makes the sentence polite (am / is / are)."}
                      </p>
                    </div>

                    <div className="rounded-xl bg-red-50/70 border border-[#C8102E]/30 p-3.5 text-xs space-y-1.5">
                      <span className="font-extrabold text-[#C8102E] block">
                        {language === "bn"
                          ? "⚠️ গুরুত্বপূর্ণ নিয়ম (～さん কখনো নিজের নামে বসে না!):"
                          : language === "ja"
                            ? "⚠️ 注意：自分の名前に「さん」はつけません！"
                            : "⚠️ Golden Rule: Never attach '~san' to your own name!"}
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {language === "bn"
                          ? "অন্যের নামের শেষে সম্মান জানাতে 「～さん (সান)」 বসে (যেমন: সাতো-সান)। কিন্তু নিজের নাম বলার সময় কখনোই সান বলা যাবে না—শুধু নাম বলতে হবে!"
                          : language === "ja"
                            ? "他人の名前には敬称「〜さん」をつけますが、自分の名前には絶対につけません。"
                            : "Use '~san' (Mr./Ms.) only for other people. When introducing yourself, state your name without '~san'."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        playSpeech("わたしは ラヒムです。がくせいです。", "kotoba-tip-sample")
                      }
                      className="w-full rounded-xl bg-[#1E5631] hover:bg-emerald-900 text-white py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>わたしは ラヒムです (Listen)</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeScript === "grammar" ? (
            <motion.div
              key="grammar-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              {/* N5 Core Particles Grid — Mobile-safe non-breaking particle badges */}
              <div className="grid gap-4 md:grid-cols-2">
                {N5_GRAMMAR_PARTICLES.map((g, idx) => {
                  const gKey = `grammar-p-${idx}`;
                  const isPlaying = playingKey === gKey;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                          <div className="inline-flex items-center gap-2 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center rounded-xl bg-[#1E5631] text-white px-3 py-1 text-base font-black whitespace-nowrap">
                              {g.particle}
                            </span>
                            <span className="inline-flex items-center rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-[#C8102E] whitespace-nowrap">
                              [{g.romaji}]
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {g.role[language]}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {g.rule[language]}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#fcfaf7] border border-stone-200/80 p-3.5 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-sm sm:text-base font-black text-slate-900">
                            {g.exampleJp}
                          </p>
                          <p className="text-[11px] font-mono font-bold text-[#C8102E]">
                            {g.exampleRo}
                          </p>
                          <p className="text-xs font-semibold text-[#1E5631] leading-relaxed">
                            {g.exampleMeaning[language]}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => playSpeech(g.exampleJp, gKey)}
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition cursor-pointer ${
                            isPlaying
                              ? "bg-[#C8102E] text-white"
                              : "bg-stone-100 text-slate-700 hover:bg-red-50 hover:text-[#C8102E]"
                          }`}
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : activeScript === "phrases" ? (
            <motion.div
              key="phrases-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Kaiwa Dialogue Box: Minna No Nihongo Lesson 1 — Hajimemashite */}
              <div className="max-w-5xl mx-auto rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-[#1E5631] text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                        {language === "bn"
                          ? "কাইওয়া (Kaiwa - 会話): লেসন ১ — হাজিমেমাশিতে (প্রথম সাক্ষাৎ সংলাপ)"
                          : language === "ja"
                            ? "第1課 会話（かいわ）：はじめまして"
                            : "Kaiwa (会話) Lesson 1 Dialogue: Hajimemashite (First Introduction)"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t.clickListen}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {KAIWA_L1_DIALOGUE.map((line, lIdx) => {
                    const lKey = `kaiwa-line-${lIdx}`;
                    const isPlaying = playingKey === lKey;
                    return (
                      <div
                        key={lIdx}
                        onClick={() => playSpeech(line.jp, lKey)}
                        className={`rounded-xl border p-3.5 transition cursor-pointer flex items-center justify-between gap-3 ${
                          isPlaying
                            ? "border-[#C8102E] bg-red-50/40"
                            : "border-stone-200/80 bg-[#fcfaf7] hover:bg-stone-50"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-extrabold text-[#1E5631]">
                              {line.speaker}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">{line.role}</span>
                          </div>
                          <p className="text-sm sm:text-base font-black text-slate-900">
                            {line.jp}
                          </p>
                          <p className="text-xs font-mono text-[#C8102E]">{line.ro}</p>
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                            {language === "bn" ? line.bn : line.en}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSpeech(line.jp, lKey);
                          }}
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isPlaying
                              ? "bg-[#C8102E] text-white"
                              : "bg-white border border-stone-200 text-slate-700 hover:text-[#C8102E]"
                          }`}
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
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

              {/* 10 Spoken Phrases Grid */}
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
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 cursor-pointer ${
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
              {/* Secondary Sub-Filter: Core Gojuon vs Voiced Sounds vs Yoon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
                <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200/90 overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => setSubFilter("basic")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      subFilter === "basic"
                        ? "bg-white text-slate-900 shadow-2xs border border-stone-200/80"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.filterBasic}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubFilter("voiced")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      subFilter === "voiced"
                        ? "bg-white text-slate-900 shadow-2xs border border-stone-200/80"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.filterVoiced}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubFilter("yoon")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      subFilter === "yoon"
                        ? "bg-white text-slate-900 shadow-2xs border border-stone-200/80"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.filterYoon}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-[#b91c1c]" />
                    <span>{t.clickListen}</span>
                  </span>
                  <span className="hidden sm:inline text-stone-300">•</span>
                  <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
                    {t.speedNote}
                  </span>
                </div>
              </div>

              {/* Standard 5-Column Line Matrix (Basic or Voiced) */}
              {subFilter !== "yoon" ? (
                <div className="space-y-4">
                  {/* Table Column Headers (Desktop / Tablet view) */}
                  <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-stone-100/80 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 text-center items-center">
                    <div className="col-span-3 text-left pl-2 font-mono uppercase tracking-wider text-slate-500">
                      {t.lineColLabel}
                    </div>
                    <div className="col-span-9 grid grid-cols-5 gap-2.5 sm:gap-3 text-center">
                      {t.vowels.map((vCol, vIdx) => (
                        <div
                          key={vIdx}
                          className="bg-white/90 py-1.5 rounded-lg border border-stone-200 shadow-2xs"
                        >
                          <span className="font-extrabold text-slate-800">{vCol.v}</span>
                          <span className="block text-[10px] font-medium text-slate-500">
                            {vCol.bn}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strictly Maintained Row-by-Row Line Cards */}
                  <div className="space-y-3">
                    {currentStandardRows.map((row) => {
                      const rowLineKey = `row-${activeScript}-${row.rowId}`;
                      const isLinePlaying = playingKey === rowLineKey;

                      return (
                        <div
                          key={row.rowId}
                          className={`rounded-2xl border bg-white p-3 sm:p-4 transition-all shadow-2xs hover:shadow-xs ${
                            isLinePlaying
                              ? "border-[#b91c1c] ring-2 ring-red-100 bg-red-50/10"
                              : "border-stone-200/90 hover:border-red-200"
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            {/* Left Header: Line Badge & Full Line Play Button */}
                            <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between gap-2 border-b md:border-b-0 pb-2 md:pb-0 border-stone-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="inline-block text-base sm:text-lg font-black text-slate-900 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200">
                                    {row.labelJa}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {language === "ja" ? (row.labelJa || row.labelEn) : language === "bn" ? row.labelBn : row.labelEn}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1 hidden md:block">
                                  {row.descBn}
                                </p>
                              </div>

                              {/* Play entire line button */}
                              <button
                                type="button"
                                onClick={() => playLineSequence(row.chars, rowLineKey)}
                                aria-label={`Play entire ${row.labelEn}`}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  isLinePlaying
                                    ? "bg-[#b91c1c] text-white shadow-xs animate-pulse"
                                    : "bg-red-50 text-[#b91c1c] hover:bg-red-100 border border-red-200/60"
                                }`}
                              >
                                {isLinePlaying ? (
                                  <>
                                    <RotateCcw className="h-3 w-3 animate-spin" />
                                    <span>{t.playingRow}</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 fill-current" />
                                    <span>{t.playRow}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Right Grid: Exactly 5 Slots Aligned with Vowels */}
                            <div className="md:col-span-9 grid grid-cols-5 gap-1.5 sm:gap-2.5 md:gap-3">
                              {row.chars.map((charItem, cIdx) => {
                                if (!charItem) {
                                  return (
                                    <div
                                      key={cIdx}
                                      className="rounded-xl border border-dashed border-stone-200 bg-stone-50/60 min-h-[72px] sm:min-h-[82px] flex flex-col items-center justify-center text-stone-300 text-xs font-mono select-none"
                                    >
                                      <span className="text-base">—</span>
                                      <span className="text-[10px] text-stone-300 mt-0.5">
                                        {cIdx === 1 ? "(い)" : cIdx === 2 ? "(う)" : "(え)"}
                                      </span>
                                    </div>
                                  );
                                }

                                const cKey = `${activeScript}-${charItem.char}-${row.rowId}-${cIdx}`;
                                const isCharPlaying = playingKey === cKey;

                                return (
                                  <button
                                    key={cIdx}
                                    type="button"
                                    onClick={() => playSpeech(charItem.char, cKey)}
                                    aria-label={`Pronounce ${charItem.char} (${charItem.ro})`}
                                    className={`group relative rounded-xl border p-2 text-center transition-all flex flex-col items-center justify-between min-h-[72px] sm:min-h-[82px] active:scale-95 cursor-pointer ${
                                      isCharPlaying
                                        ? "border-[#b91c1c] bg-red-50 text-[#b91c1c] shadow-xs scale-105 ring-2 ring-red-200"
                                        : "border-stone-200 bg-white hover:border-[#b91c1c] hover:bg-stone-50/90 shadow-2xs"
                                    }`}
                                  >
                                    {/* Big Character Glyph */}
                                    <span className="block text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-[#b91c1c] transition-colors font-sans leading-none mt-1">
                                      {charItem.char}
                                    </span>

                                    {/* Sub-labels: Romaji and Bengali Pronunciation */}
                                    <div className="flex flex-col items-center w-full mt-1.5 space-y-0.5">
                                      <span className="text-[11px] font-mono font-bold text-[#b91c1c]">
                                        {charItem.ro}
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-500 bg-stone-100 px-1 py-0.2 rounded w-full truncate">
                                        {charItem.bn}
                                      </span>
                                    </div>

                                    {isCharPlaying && (
                                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#b91c1c] animate-ping" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Special Standalone Spotlight for Hatsuon (ん / ン) in Basic Gojuon */}
                  {subFilter === "basic" && (
                    <div className="mt-6 rounded-2xl border-2 border-amber-300/80 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/40 p-5 sm:p-6 shadow-xs">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                        <div className="flex items-center gap-4 text-center md:text-left">
                          <button
                            type="button"
                            onClick={() =>
                              playSpeech(
                                hatsuonChar,
                                `hatsuon-${activeScript}-${hatsuonChar}`,
                              )
                            }
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white border-2 border-amber-400 hover:border-[#b91c1c] flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer group shrink-0"
                            aria-label={`Play audio for ${hatsuonChar}`}
                          >
                            <span className="text-4xl sm:text-5xl font-black text-slate-900 group-hover:text-[#b91c1c] font-sans leading-none">
                              {hatsuonChar}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#b91c1c] mt-1">
                              <span>{hatsuonRomaji}</span>
                              <Volume2 className="h-3 w-3" />
                            </div>
                          </button>

                          <div>
                            <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 text-amber-900 px-2.5 py-0.5 text-xs font-extrabold mb-1">
                              <span>{t.hatsuonTitle}</span>
                              <span className="text-[11px] font-mono">({hatsuonBn})</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl">
                              {t.hatsuonDesc}
                            </p>
                          </div>
                        </div>

                        {/* Quick Real Words with Hatsuon */}
                        <div className="w-full md:w-auto shrink-0 bg-white/90 p-3.5 rounded-xl border border-amber-200/80 shadow-2xs">
                          <p className="text-[11px] font-bold text-slate-600 mb-2">
                            {t.hatsuonExamplesLabel}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {hatsuonExamples.map((ex, exIdx) => {
                              const exKey = `ex-${exIdx}-${ex.jp}`;
                              const isExPlaying = playingKey === exKey;
                              return (
                                <button
                                  key={exIdx}
                                  type="button"
                                  onClick={() => playSpeech(ex.jp, exKey)}
                                  className={`px-3 py-1.5 rounded-lg border text-left transition-all text-xs flex items-center justify-between gap-2 cursor-pointer ${
                                    isExPlaying
                                      ? "border-[#b91c1c] bg-red-50 text-[#b91c1c]"
                                      : "border-stone-200 bg-stone-50/60 hover:bg-stone-100 hover:border-stone-300"
                                  }`}
                                >
                                  <div>
                                    <span className="font-black text-slate-900 block leading-tight font-sans">
                                      {ex.jp}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono block">
                                      {ex.ro} • {ex.bn}
                                    </span>
                                  </div>
                                  <Volume2 className="h-3 w-3 text-slate-400 shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Yoon (拗音 - 11 Combined Rows: kya, kyu, kyo) */
                <div className="space-y-4">
                  {/* Table Column Headers for Yoon (3 Columns: -ya, -yu, -yo) */}
                  <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-stone-100/80 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 text-center items-center">
                    <div className="col-span-3 text-left pl-2 font-mono uppercase tracking-wider text-slate-500">
                      {t.lineColLabel}
                    </div>
                    <div className="col-span-9 grid grid-cols-3 gap-3 text-center">
                      {t.yoonCols.map((yCol, yIdx) => (
                        <div
                          key={yIdx}
                          className="bg-white/90 py-1.5 rounded-lg border border-stone-200 shadow-2xs"
                        >
                          <span className="font-extrabold text-slate-800">{yCol.v}</span>
                          <span className="block text-[10px] font-medium text-slate-500">
                            {yCol.bn}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 11 Maintained Yoon Rows */}
                  <div className="space-y-3">
                    {currentYoonRows.map((row) => {
                      const rowLineKey = `yoon-row-${activeScript}-${row.rowId}`;
                      const isLinePlaying = playingKey === rowLineKey;

                      return (
                        <div
                          key={row.rowId}
                          className={`rounded-2xl border bg-white p-3 sm:p-4 transition-all shadow-2xs hover:shadow-xs ${
                            isLinePlaying
                              ? "border-[#b91c1c] ring-2 ring-red-100 bg-red-50/10"
                              : "border-stone-200/90 hover:border-red-200"
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            {/* Left Header */}
                            <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between gap-2 border-b md:border-b-0 pb-2 md:pb-0 border-stone-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="inline-block text-base sm:text-lg font-black text-slate-900 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200">
                                    {row.labelJa}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {language === "ja" ? (row.labelJa || row.labelEn) : language === "bn" ? row.labelBn : row.labelEn}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1 hidden md:block">
                                  {row.baseChar} + ゃ/ゅ/ょ
                                </p>
                              </div>

                              {/* Play Yoon Line */}
                              <button
                                type="button"
                                onClick={() => playLineSequence(row.chars, rowLineKey)}
                                aria-label={`Play ${row.labelEn}`}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  isLinePlaying
                                    ? "bg-[#b91c1c] text-white shadow-xs animate-pulse"
                                    : "bg-red-50 text-[#b91c1c] hover:bg-red-100 border border-red-200/60"
                                }`}
                              >
                                {isLinePlaying ? (
                                  <>
                                    <RotateCcw className="h-3 w-3 animate-spin" />
                                    <span>{t.playingRow}</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 fill-current" />
                                    <span>{t.playRow}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Right Grid: 3 Yoon Columns */}
                            <div className="md:col-span-9 grid grid-cols-3 gap-2 sm:gap-3">
                              {row.chars.map((charItem, cIdx) => {
                                const cKey = `${activeScript}-yoon-${charItem.char}-${row.rowId}-${cIdx}`;
                                const isCharPlaying = playingKey === cKey;

                                return (
                                  <button
                                    key={cIdx}
                                    type="button"
                                    onClick={() => playSpeech(charItem.char, cKey)}
                                    aria-label={`Pronounce ${charItem.char} (${charItem.ro})`}
                                    className={`group relative rounded-xl border p-2.5 text-center transition-all flex flex-col items-center justify-between min-h-[76px] sm:min-h-[86px] active:scale-95 cursor-pointer ${
                                      isCharPlaying
                                        ? "border-[#b91c1c] bg-red-50 text-[#b91c1c] shadow-xs scale-105 ring-2 ring-red-200"
                                        : "border-stone-200 bg-white hover:border-[#b91c1c] hover:bg-stone-50/90 shadow-2xs"
                                    }`}
                                  >
                                    {/* Big Glyph */}
                                    <span className="block text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-[#b91c1c] transition-colors font-sans leading-none mt-1">
                                      {charItem.char}
                                    </span>

                                    <div className="flex flex-col items-center w-full mt-1.5 space-y-0.5">
                                      <span className="text-[11px] font-mono font-bold text-[#b91c1c]">
                                        {charItem.ro}
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-500 bg-stone-100 px-1 py-0.2 rounded w-full truncate">
                                        {charItem.bn}
                                      </span>
                                    </div>

                                    {isCharPlaying && (
                                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#b91c1c] animate-ping" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pedagogical Note (Localized in EN, BN, JA) */}
              <div className="text-center text-xs text-slate-500 pt-2 border-t border-stone-200/80 leading-relaxed">
                {activeScript === "hiragana"
                  ? t.pedagogicalHiragana
                  : t.pedagogicalKatakana}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book Store (/store) Cross-Sell Banner */}
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1E5631] flex items-center justify-center shrink-0 mt-0.5">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {t.storeBannerTitle}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-2xl">
                {t.storeBannerSub}
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-[#1E5631] text-[#1E5631] hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl py-5 px-5 shrink-0"
          >
            <Link href="/store" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>{t.btnBookStore}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Motivational Institutional Footer Strip with Free Irodori Demo + Enroll CTA */}
        <div className="mt-6 rounded-2xl border border-slate-900 bg-slate-950 text-white p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-[#b91c1c] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {t.enrollBanner}
              </p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t.enrollSub}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              asChild
              className="bg-[#b91c1c] hover:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-bold py-5 px-6 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <a href="#course-options" className="flex items-center gap-2">
                <span>{t.btnEnroll}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
