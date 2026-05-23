export type Language = "bn" | "en" | "ja" | "zh" | "ru" | "ms";

export const languageOptions: Array<{ value: Language; label: string; short: string }> = [
  { value: "bn", label: "বাংলা", short: "BN" },
  { value: "en", label: "English", short: "EN" },
  { value: "ja", label: "日本語", short: "JA" },
  { value: "zh", label: "中文", short: "ZH" },
  { value: "ru", label: "Русский", short: "RU" },
  { value: "ms", label: "Bahasa Melayu", short: "MS" },
];

export const defaultLanguage: Language = "bn";

export const languageStorageKey = "knltc-language";

export type TranslationDict<T> = Partial<Record<Language, T>> & { bn: T; en: T };

export function translate<T>(dictionary: TranslationDict<T>, language: Language): T {
  return dictionary[language] ?? dictionary.en ?? dictionary[defaultLanguage];
}


export type LocalizedField = Record<Language, string>;

type PartialLocalizedFieldInput = {
  en: string;
  bn: string;
  ja: string;
  zh?: string;
  ru?: string;
  ms?: string;
};

export function fallbackLocalizedField(field: PartialLocalizedFieldInput): LocalizedField {
  const fallback = field.en;

  return {
    en: field.en,
    bn: field.bn,
    ja: field.ja,
    zh: field.zh ?? fallback,
    ru: field.ru ?? fallback,
    ms: field.ms ?? fallback,
  };
}
