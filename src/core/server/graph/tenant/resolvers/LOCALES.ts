import { LanguageCode } from "talk-common/helpers/i18n/locales";

import { GQLLOCALES } from "../schema/__generated__/types";

export const LOCALES: Record<GQLLOCALES, LanguageCode> = {
  en_US: "en-US",
  es: "es",
  de: "de",
};
