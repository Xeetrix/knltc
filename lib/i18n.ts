export type Language = "en" | "bn" | "ja";

export const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
  { value: "ja", label: "日本語" },
];

export const defaultLanguage: Language = "en";

export const languageStorageKey = "knltc-language";

export function translate<T>(dictionary: Record<Language, T>, language: Language): T {
  return dictionary[language] ?? dictionary[defaultLanguage];
}
