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
  "en-US": "English",
  "pt-BR": "Português brasileiro",
  es: "Español",
  de: "Deutsch",
  "tr-TR": "Türkçe",
  hu: "Magyar",
  "id-ID": "Indonesian",
  "it-IT": "Italiana",
  "ja-JP": "日本",
  "de-CH": "Deutsch-Schweiz",
  "nl-NL": "Nederlands",
  da: "Dansk",
  "fr-FR": "Francais",
  ro: "Română",
  "fi-FI": "Suomi",
  sv: "Svenska",
  pl: "Polski",
  "sk-SK": "Slovensky",
  ru: "Русский",
  "nb-NO": "Norsk Bokmål",
  "zh-CN": "中国人",
};

/**
 * LOCALES is an array of supported language codes that can be accessed as a
 * value.
 */
export const LOCALES: LanguageCode[] = Object.keys(
  LOCALES_MAP
) as LanguageCode[];
