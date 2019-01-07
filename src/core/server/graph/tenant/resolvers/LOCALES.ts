import { GQLLOCALES } from "../schema/__generated__/types";

export type LanguageCode = "en-US" | "es" | "de";

export const LOCALES: Record<GQLLOCALES, LanguageCode> = {
  en_US: "en-US",
  es: "es",
  de: "de",
};
