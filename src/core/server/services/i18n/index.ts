import { FluentBundle } from "fluent/compat";
import fs from "fs-extra";
import path from "path";

import { LanguageCode, LOCALES } from "talk-common/helpers/i18n/locales";
import config from "talk-server/config";

/**
 * isLanguageCode will return true if the string is a `LanguageCode`.
 *
 * @param locale the string that is being tested if it's a `LanguageCode`
 */
function isLanguageCode(locale: string): locale is LanguageCode {
  return LOCALES.some(code => code === locale);
}

// pathToLocales is the path where the server stores the locales.
const pathToLocales = path.join(__dirname, "..", "..", "locales");

export class I18n {
  private bundles: Partial<Record<LanguageCode, FluentBundle>> = {};
  private defaultLang: LanguageCode;

  constructor(defaultLocale: LanguageCode) {
    this.defaultLang = defaultLocale;
  }

  /**
   * load will read all the translations located in the server locales folder.
   */
  public async load() {
    // Load all the locales from the server locales folder.

    // Load all the locales from the locales folders.
    const folders = await fs.readdir(pathToLocales);

    // Load all the translation files for each of the folders.
    for (const folder of folders) {
      // Parse out the language code.
      const locale = path.basename(folder);
      if (!isLanguageCode(locale)) {
        throw new Error(`invalid language code: ${locale}`);
      }

      // Now we have a language code.
      const bundle = new FluentBundle(locale);

      // Load all the translations in the folder.
      const files = await fs.readdir(path.join(pathToLocales, folder));

      for (const file of files) {
        const messages = await fs.readFile(
          path.join(pathToLocales, folder, file),
          "utf8"
        );

        bundle.addMessages(messages);
      }

      this.bundles[locale] = bundle;
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
   * getDefaultLang will return the default language.
   */
  public getDefaultLang(): Readonly<LanguageCode> {
    return this.defaultLang;
  }

  /**
   * getDefaultBundle will return the default bundle to use.
   */
  public getDefaultBundle(): FluentBundle {
    return this.getBundle(this.getDefaultLang());
  }
}

/**
 * translate will attempt a translation but fallback to the defaultValue if it
 * can't be translated.
 *
 * @param bundle the bundle to use for translations
 * @param defaultValue the default value if the message or translation isn't
 * available
 * @param id the ID for the translation
 * @param args the args to be used in the translation
 * @param errors the errors to for the translation bundle
 */
export function translate(
  bundle: FluentBundle,
  defaultValue: string,
  id: string,
  args?: object,
  errors?: string[]
): string {
  const message = bundle.getMessage(id);
  if (!message) {
    if (config.get("env") === "testing") {
      throw new Error(`the message for ${id} is missing`);
    }

    return defaultValue;
  }

  const value = bundle.format(message, args, errors);
  if (!value) {
    return defaultValue;
  }

  return value;
}
