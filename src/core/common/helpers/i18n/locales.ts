/**
 * LanguageCode is the type represented by the internally identifiable types for
 * the different languages that can be supported.
 */
export type LanguageCode = "en-US" | "pt-BR" | "es" | "de" | "nl-NL" | "da";

/**
 * LOCALES_MAP contains a map of language codes associated with their
 * name in native language.
 */
export const LOCALES_MAP: Record<LanguageCode, string> = {
  "en-US": "English",
  "pt-BR": "Português brasileiro",
  es: "Español",
  de: "Deutsch",
  "nl-NL": "Nederlands",
  da: "Dansk",
};

/**
 * LOCALES is an array of supported language codes that can be accessed as a
 * value.
 */
export const LOCALES: LanguageCode[] = Object.keys(
  LOCALES_MAP
) as LanguageCode[];
