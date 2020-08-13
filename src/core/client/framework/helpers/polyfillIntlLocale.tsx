import { getBrowserInfo } from "../lib/browserInfo";

/**
 * Polyfills Intl Locale Data.
 * This is only needed when we use the Intl Polyfill.
 */
export default async function polyfillIntlLocale(locales: string[]) {
  if (!getBrowserInfo().supports.intl) {
    await Promise.all(
      locales.map((locale) =>
        import("intl/locale-data/jsonp/" + locale + ".js")
      )
    );
  }
  return Promise.resolve();
}
