import { LanguageCode } from "coral-common/helpers/i18n/locales";

import { GQLLOCALES } from "../schema/__generated__/types";

export const LOCALES: Record<GQLLOCALES, LanguageCode> = {
  en_US: "en-US",
  pt_BR: "pt-BR",
  es: "es",
  de: "de",
};
