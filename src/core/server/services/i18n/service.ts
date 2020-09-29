import { inject, singleton } from "tsyringe";

import { LanguageCode } from "coral-common/helpers";
import { CONFIG, Config } from "coral-server/config";

import { I18n } from "./i18n";

@singleton()
export class I18nService extends I18n {
  constructor(@inject(CONFIG) config: Config) {
    // Get the default locale. This is asserted here because the LanguageCode
    // is verified via Convict, but not typed, so this resolves that.
    const defaultLang = config.get("defaultLocale") as LanguageCode;

    super(defaultLang);
  }
}
