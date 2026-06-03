import { LanguageCode as LC } from "coral-config/i18n/locales";

/**
 * LanguageCode is the type represented by the internally identifiable types for
 * the different languages that can be supported in the BCP 47 format.
 */
export type LanguageCode = LC;

/**
 * LOCALES_MAP contains a map of language codes associated with their
 * name in native language.
 */
export const LOCALES_MAP: Record<LanguageCode, string> = {
  "af-ZA": "Afrikaans",
  "ar-AE": "عربى",
  da: "Dansk",
  de: "Deutsch",
  "de-CH": "Deutsch-Schweiz",
  "en-US": "English",
  es: "Español",
  "fi-FI": "Suomi",
  "fr-FR": "Francais",
  hu: "Magyar",
  "id-ID": "Indonesian",
  "it-IT": "Italiana",
  "ja-JP": "日本",
  "nb-NO": "Norsk Bokmål",
  "nl-NL": "Nederlands",
  pl: "Polski",
  "pt-PT": "Português",
  "pt-BR": "Português brasileiro",
  ro: "Română",
  ru: "Русский",
  "sk-SK": "Slovensky",
  sv: "Svenska",
  "tr-TR": "Türkçe",
  "zh-CN": "中国人",
};

/**
 * LOCALES is an array of supported language codes that can be accessed as a
 * value.
 */
export const LOCALES: LanguageCode[] = Object.keys(
  LOCALES_MAP
) as LanguageCode[];
