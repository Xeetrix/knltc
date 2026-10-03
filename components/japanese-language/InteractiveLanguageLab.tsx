"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Languages,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

type ScriptType = "hiragana" | "katakana" | "phrases";

interface Phrase {
  japanese: string;
  romaji: string;
  en: string;
  bn: string;
  ja: string;
  meaning: { bn: string; en: string; ja: string };
  situation: { bn: string; en: string; ja: string };
}

const ESSENTIAL_PHRASES: Phrase[] = [
  {
    japanese: "こんにちは",
    romaji: "Konnichiwa",
    en: "Hello / Good afternoon",
    bn: "হ্যালো / আসসালামু আলাইকুম / শুভ দুপুর",
    ja: "日中の挨拶",
    meaning: {
      bn: "শুভ দিন / হ্যালো (দিনের বেলার সার্বজনীন সম্ভাষণ)",
      en: "Hello / Good day (Standard daytime greeting)",
      ja: "昼間の代表的な挨拶",
    },
    situation: {
      bn: "যে কারো সাথে দিনে সাক্ষাতের সময় ব্যবহৃত হয়",
      en: "Used when meeting anyone during daytime",
      ja: "日中に人と会ったときに使います",
    },
  },
  {
    japanese: "ありがとうございます",
    romaji: "Arigatou gozaimasu",
    en: "Thank you very much (Polite)",
    bn: "আপনাকে অনেক অনেক ধন্যবাদ",
    ja: "感謝の言葉（丁寧）",
    meaning: {
      bn: "আন্তরিক কৃতজ্ঞতা ও ধন্যবাদ প্রকাশ",
      en: "Thank you very much (Formal/Polite)",
      ja: "相手に感謝を伝える丁寧な表現",
    },
    situation: {
      bn: "যেকোনো সাহায্য, সেবা বা উপহার পাওয়ার পর",
      en: "Used whenever receiving help or a service",
      ja: "親切やサービスを受けたときに使います",
    },
  },
  {
    japanese: "はじめまして",
    romaji: "Hajimemashite",
    en: "Nice to meet you (First time)",
    bn: "আপনার সাথে প্রথমবার পরিচিত হয়ে আনন্দিত",
    ja: "初対面の挨拶",
    meaning: {
      bn: "প্রথম দেখা হওয়ার শুভ মুহূর্তের সম্ভাষণ",
      en: "How do you do? / Nice to meet you for the first time",
      ja: "初めて会った人への最初の挨拶",
    },
    situation: {
      bn: "ইন্টারভিউ বা নতুন কারো সাথে পরিচয়ের শুরুতে",
      en: "Beginning of interviews or self-introductions",
      ja: "面接や初対面の自己紹介の冒頭で使います",
    },
  },
  {
    japanese: "よろしくお願いします",
    romaji: "Yoroshiku onegaishimasu",
    en: "Please treat me well / Looking forward to working together",
    bn: "দয়া করে আমার প্রতি সদয় দৃষ্টি রাখবেন / আপনার সহযোগিতা কামনা করছি",
    ja: "今後の関係や依頼を表す最重要フレーズ",
    meaning: {
      bn: "জাপানি সংস্কৃতির সবচেয়ে সম্মানসূচক ও জরুরি শিষ্টাচার বাক্য",
      en: "Essential polite phrase for mutual cooperation & respect",
      ja: "今後の協力を願う日本文化特有の重要表現",
    },
    situation: {
      bn: "ইন্টারভিউ শেষ করার সময় বা নতুন কাজে যোগদানে",
      en: "Ending of job/visa interviews or starting a new job",
      ja: "面接の締めくくりや仕事の依頼時に使います",
    },
  },
  {
    japanese: "日本へ留学したいです",
    romaji: "Nihon e ryuugaku shitai desu",
    en: "I want to study in Japan",
    bn: "আমি জাপানে উচ্চশিক্ষা নিতে যেতে চাই",
    ja: "日本留学の希望を伝える表現",
    meaning: {
      bn: "ভিসা ও স্কুল ইন্টারভিউতে পড়ার উদ্দেশ্য প্রকাশের মূল বাক্য",
      en: "Direct expression of your goal to study in Japan",
      ja: "面接で留学動機を表明する基本文",
    },
    situation: {
      bn: "এম্বাসি বা জাপানিজ ল্যাঙ্গুয়েজ স্কুল ইন্টারভিউতে",
      en: "Used in Embassy and Japanese school admission interviews",
      ja: "大使館面接や学校選考で志望動機を話すとき",
    },
  },
  {
    japanese: "日本語を勉強しています",
    romaji: "Nihongo o benkyou shite imasu",
    en: "I am studying Japanese",
    bn: "আমি বর্তমানে জাপানি ভাষা শিখছি",
    ja: "日本語学習中であることを伝える表現",
    meaning: {
      bn: "নিজের চলমান ভাষা শিক্ষার অগ্রগতি প্রকাশ",
      en: "Stating your ongoing Japanese language learning",
      ja: "現在日本語を学んでいることを伝える基本フレーズ",
    },
    situation: {
      bn: "ভিসা ইন্টারভিউয়ারকে নিজের প্রস্তুতি বোঝাতে",
      en: "Proving your commitment to the visa screening officer",
      ja: "面接官に学習への真剣さをアピールするとき",
    },
  },
];

const HIRAGANA_PREVIEW = [
  { char: "あ", ro: "a" },
  { char: "い", ro: "i" },
  { char: "う", ro: "u" },
  { char: "え", ro: "e" },
  { char: "お", ro: "o" },
  { char: "か", ro: "ka" },
  { char: "き", ro: "ki" },
  { char: "く", ro: "ku" },
  { char: "け", ro: "ke" },
  { char: "こ", ro: "ko" },
  { char: "さ", ro: "sa" },
  { char: "し", ro: "shi" },
  { char: "す", ro: "su" },
  { char: "せ", ro: "se" },
  { char: "そ", ro: "so" },
  { char: "た", ro: "ta" },
  { char: "ち", ro: "chi" },
  { char: "つ", ro: "tsu" },
  { char: "て", ro: "te" },
  { char: "と", ro: "to" },
];

const KATAKANA_PREVIEW = [
  { char: "ア", ro: "a" },
  { char: "イ", ro: "i" },
  { char: "ウ", ro: "u" },
  { char: "エ", ro: "e" },
  { char: "オ", ro: "o" },
  { char: "カ", ro: "ka" },
  { char: "キ", ro: "ki" },
  { char: "ク", ro: "ku" },
  { char: "ケ", ro: "ke" },
  { char: "コ", ro: "ko" },
  { char: "サ", ro: "sa" },
  { char: "シ", ro: "shi" },
  { char: "ス", ro: "su" },
  { char: "セ", ro: "se" },
  { char: "ソ", ro: "so" },
  { char: "タ", ro: "ta" },
  { char: "チ", ro: "chi" },
  { char: "ツ", ro: "tsu" },
  { char: "テ", ro: "te" },
  { char: "ト", ro: "to" },
];

export default function InteractiveLanguageLab() {
  const { language } = useLanguage();
  const [activeScript, setActiveScript] = useState<ScriptType>("phrases");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const t = translate(
    {
      bn: {
        badge: "ইন্টারেক্টিভ স্পোকেন ল্যাব • KNLTC একাডেমি",
        title: "জাপানি বর্ণমালা ও প্রয়োজনীয় কথ্য ভাষা শুনুন",
        subtitle: "হাতে-কলমে জাপানি উচ্চারণ শুনুন এবং প্রথম দিন থেকেই আত্মবিশ্বাসের সাথে বলতে শুরু করুন।",
        tabPhrases: "প্রয়োজনীয় ৬টি স্পোকেন বাক্য (Audio)",
        tabHiragana: "হিরাগানা বেসিক বর্ণ (Hiragana)",
        tabKatakana: "কাতাকানা বেসিক বর্ণ (Katakana)",
        clickListen: "উচ্চারণ শুনতে ক্লিক করুন",
        speakNote: "ন্যাচারাল জাপানি উচ্চারণ শুনতে যেকোনো বাক্যের স্পিকারে চাপুন",
        enrollBanner: "প্রথম দিন থেকেই জাপানি ভাষায় সাবলীল হতে আমাদের N5 ব্যাচে যোগ দিন",
        btnEnroll: "N5 বিগিনার কোর্সে ভর্তি হন",
      },
      en: {
        badge: "Interactive Spoken Lab • KNLTC Academy",
        title: "Experience Japanese Pronunciation & Essential Phrases",
        subtitle: "Listen to authentic native speech synthesis and start speaking from Day One.",
        tabPhrases: "6 Essential Everyday Phrases (Audio)",
        tabHiragana: "Basic Hiragana Characters",
        tabKatakana: "Basic Katakana Characters",
        clickListen: "Click to hear native pronunciation",
        speakNote: "Tap the audio speaker on any phrase to hear real Japanese pronunciation",
        enrollBanner: "Master Hiragana, Katakana, and real conversation in our upcoming N5 batch",
        btnEnroll: "Join N5 Comprehensive Batch",
      },
      ja: {
        badge: "体験型日本語発音ラボ • KNLTCアカデミー",
        title: "日本語の文字と実践会話フレーズを体験",
        subtitle: "正しい発音を耳で聴き、初日から自信を持って使える重要表現を学びます。",
        tabPhrases: "最重要 実践6フレーズ（音声再生）",
        tabHiragana: "ひらがな基本文字",
        tabKatakana: "カタカナ基本文字",
        clickListen: "クリックしてネイティブ音声を再生",
        speakNote: "スピーカーアイコンを押すと日本語の正しい発音を再生します",
        enrollBanner: "文字の書き順から日常会話まで、基礎から着実に身につけましょう",
        btnEnroll: "N5基礎コースへ申し込む",
      },
    },
    language,
  );

  const playSpeech = (text: string, index: number) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85; // Slightly slower for language learners

      setPlayingIndex(index);
      utterance.onend = () => setPlayingIndex(null);
      utterance.onerror = () => setPlayingIndex(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="py-14 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] border-y border-stone-200/80">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b91c1c] mb-2">
            <Headphones className="h-3.5 w-3.5 text-[#b91c1c]" />
            <span>{t.badge}</span>
          </div>
          <h2 className="section-title text-center text-slate-950">{t.title}</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-stone-200/70 p-1 border border-stone-300/80">
            <button
              type="button"
              onClick={() => setActiveScript("phrases")}
              className={`px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${
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
              className={`px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeScript === "hiragana"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.tabHiragana}
            </button>
            <button
              type="button"
              onClick={() => setActiveScript("katakana")}
              className={`px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeScript === "katakana"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.tabKatakana}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeScript === "phrases" ? (
            <motion.div
              key="phrases"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>{t.speakNote}</span>
                <span className="hidden sm:inline font-mono">Audio Supported: ja-JP</span>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {ESSENTIAL_PHRASES.map((phrase, idx) => {
                  const isPlaying = playingIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl border bg-white p-4.5 shadow-2xs transition-all flex flex-col justify-between ${
                        isPlaying
                          ? "border-[#b91c1c] shadow-md ring-2 ring-red-100"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div>
                        {/* Audio Trigger & Japanese Text */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-xl sm:text-2xl font-black text-slate-900 font-sans tracking-wide">
                              {phrase.japanese}
                            </span>
                            <p className="text-xs font-mono font-bold text-[#b91c1c] mt-0.5">
                              {phrase.romaji}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => playSpeech(phrase.japanese, idx)}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                              isPlaying
                                ? "bg-[#b91c1c] text-white scale-110 shadow-sm"
                                : "bg-stone-100 text-slate-700 hover:bg-red-50 hover:text-[#b91c1c] active:scale-95"
                            }`}
                            title={t.clickListen}
                            aria-label={`Play audio for ${phrase.japanese}`}
                          >
                            <Volume2 className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
                          </button>
                        </div>

                        {/* Meaning & Situation in User Language */}
                        <p className="text-xs font-bold text-slate-800 border-t border-stone-100 pt-2">
                          {phrase.meaning[language]}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          📍 {phrase.situation[language]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeScript}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <p className="text-xs text-slate-500 text-center">{t.clickListen}</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5 max-w-4xl mx-auto">
                {(activeScript === "hiragana" ? HIRAGANA_PREVIEW : KATAKANA_PREVIEW).map((item, idx) => {
                  const isPlaying = playingIndex === idx + 100;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => playSpeech(item.char, idx + 100)}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        isPlaying
                          ? "border-[#b91c1c] bg-red-50 text-[#b91c1c] shadow-xs scale-105"
                          : "border-stone-200 bg-white hover:border-[#b91c1c] hover:bg-stone-50"
                      }`}
                    >
                      <span className="block text-2xl font-black text-slate-900 font-sans">
                        {item.char}
                      </span>
                      <span className="block text-[11px] font-mono font-bold text-slate-500 mt-0.5">
                        {item.ro}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motivational Banner */}
        <div className="mt-8 rounded-2xl bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">{t.enrollBanner}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                মিন্না নো নিহোঙ্গো ১ ও ২ বই, অডিও ড্রিল ও ৩টি ক্যারিয়ার কোর্স সম্পূর্ণ ফ্রি
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-[#b91c1c] hover:bg-red-800 text-white rounded-xl text-xs font-bold py-5 px-5 shrink-0 shadow-sm"
          >
            <a href="#enrollment-form" className="flex items-center gap-1.5">
              <span>{t.btnEnroll}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
