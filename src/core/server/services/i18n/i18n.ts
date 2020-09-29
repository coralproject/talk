import { FluentBundle, FluentResource } from "@fluent/bundle/compat";
import fs from "fs-extra";
import path from "path";

import { LanguageCode, LOCALES } from "coral-common/helpers/i18n/locales";
import logger from "coral-server/logger";

/**
 * isLanguageCode will return true if the string is a `LanguageCode`.
 *
 * @param locale the string that is being tested if it's a `LanguageCode`
 */
function isLanguageCode(locale: string): locale is LanguageCode {
  return LOCALES.some((code) => code === locale);
}

// pathsToLocales is the paths where to find the locales.
const pathsToLocales = [
  // Client locales.
  path.join(__dirname, "..", "..", "..", "..", "locales"),
  // Server locales.
  path.join(__dirname, "..", "..", "locales"),
];

export class I18n {
  public readonly defaultLang: LanguageCode;
  private readonly bundles: Partial<Record<LanguageCode, FluentBundle>> = {};

  constructor(defaultLocale: LanguageCode) {
    this.defaultLang = defaultLocale;
  }

  /**
   * load will read all the translations located in the server locales folder.
   */
  public async load() {
    // Load all the locales from the locales folders.
    for (const localesFolder of pathsToLocales) {
      const folders = await fs.readdir(localesFolder);

      // Load all the translation files for each of the folders.
      for (const folder of folders) {
        // Parse out the language code.
        const locale = path.basename(folder);
        if (!isLanguageCode(locale)) {
          throw new Error(`invalid language code: ${locale}`);
        }

        // Now we have a language code.
        const bundle: FluentBundle =
          // `useIsolating: false` will remove bidi characters.
          // https://github.com/projectfluent/fluent.js/wiki/Unicode-Isolation
          // We should be able to use `<bdi>` tags instead to support rtl languages.
          this.bundles[locale] ||
          new FluentBundle(locale, { useIsolating: false });

        // Load all the translations in the folder.
        const files = await fs.readdir(path.join(localesFolder, folder));

        for (const file of files) {
          const filePath = path.join(localesFolder, folder, file);
          logger.debug({ locale, filePath }, "loading messages for locale");

          const messages = await fs.readFile(filePath, "utf8");

          bundle.addResource(new FluentResource(messages));
        }

        this.bundles[locale] = bundle;
      }
    }
  }

  /**
   * getBundle will return a bundle keyed on the language.
   *
   * @param lang the locale to get the bundle for
   */
  public getBundle(lang: LanguageCode): FluentBundle {
    const bundle = this.bundles[lang];
    if (!bundle) {
      throw new Error(`bundle for language "${lang}" not found`);
    }

    return bundle;
  }

  /**
   * getDefaultBundle will return the default bundle to use.
   */
  public getDefaultBundle(): FluentBundle {
    return this.getBundle(this.defaultLang);
  }
}
