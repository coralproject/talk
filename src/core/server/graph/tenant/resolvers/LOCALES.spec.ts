import { LanguageCode } from "talk-common/helpers/i18n/locales";

import { GQLLOCALES } from "../schema/__generated__/types";
import { LOCALES } from "./LOCALES";

it("does not contain duplicate entries", () => {
  const seen: Partial<Record<LanguageCode, true>> = {};
  for (const key in LOCALES) {
    if (!LOCALES.hasOwnProperty(key)) {
      continue;
    }

    const value = LOCALES[key as GQLLOCALES];
    expect(value in seen).toBeFalsy();
    seen[value] = true;
  }
});

it("contains the correct mappings to the BCP 47 format", () => {
  for (const key in LOCALES) {
    if (!LOCALES.hasOwnProperty(key)) {
      continue;
    }

    const value = LOCALES[key as GQLLOCALES];
    expect(value).toEqual(key.replace(/_/, "-"));
  }
});
