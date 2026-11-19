/**
 * List of primary language subtags (ISO 639-1 / BCP 47) that use Right-to-Left script.
 */
export const RTL_LANGUAGES = [
  "ar", // Arabic
  "he", // Hebrew
  "fa", // Persian
  "ur", // Urdu
  "ps", // Pashto
  "yi", // Yiddish
  "arc", // Aramaic
  "dv", // Divehi
  "ha", // Hausa (Arabic script)
  "khw", // Khowar
  "ks", // Kashmiri
  "ku", // Kurdish (Sorani)
  "sd", // Sindhi
  "ug", // Uighur
];

/**
 * Checks if a given locale string (e.g. "ar-AE", "he", "en-US") is Right-to-Left.
 */
export function isRTL(locale?: string | null): boolean {
  if (!locale) {
    return false;
  }
  const lang = locale.split("-")[0].toLowerCase();
  return RTL_LANGUAGES.includes(lang);
}

/**
 * Returns the layout direction ("rtl" or "ltr") for a given locale.
 */
export function getLanguageDirection(locale?: string | null): "rtl" | "ltr" {
  return isRTL(locale) ? "rtl" : "ltr";
}
