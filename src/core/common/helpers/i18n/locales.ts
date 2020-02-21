/**
 * LanguageCode is the type represented by the internally identifiable types for
 * the different languages that can be supported in the BCP 47 format.
 */
export type LanguageCode =
  | "en-US"
  | "pt-BR"
  | "es"
  | "de"
  | "nl-NL"
  | "da"
  | "fr-FR"
  | "ro"
  | "fi-FI"
  | "sv"
  | "pl";

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
  "fr-FR": "Francais",
  ro: "Română",
  "fi-FI": "Suomi",
  sv: "Svenska",
  pl: "Polski",
};

/**
 * LOCALES is an array of supported language codes that can be accessed as a
 * value.
 */
export const LOCALES: LanguageCode[] = Object.keys(
  LOCALES_MAP
) as LanguageCode[];
