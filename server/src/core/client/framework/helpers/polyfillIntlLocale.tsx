/* eslint-disable no-restricted-globals */
import { BrowserInfo } from "../lib/browserInfo";

/**
 * Polyfills Intl Locale Data.
 * This is only needed when we use the Intl Polyfill.
 */
export default async function polyfillIntlLocale(
  locales: string[],
  browser: BrowserInfo
) {
  if (!browser.supports.intl) {
    await Promise.all(
      locales.map(
        (locale) => import("intl/locale-data/jsonp/" + locale + ".js")
      )
    );
  }
  return Promise.resolve();
}
