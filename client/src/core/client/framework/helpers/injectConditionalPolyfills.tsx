/* eslint-disable no-restricted-globals */
import { BrowserInfo } from "../lib/browserInfo";

export default async function injectConditionalPolyfills(
  window: Window,
  browser: BrowserInfo
) {
  const pending: Promise<any>[] = [];

  // Polyfill Intl.
  let intlPromise = Promise.resolve();
  if (!browser.supports.intl) {
    intlPromise = (async () => {
      const IntlPolyfill = (await import("intl")).default;
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
      return;
    })();
  }
  pending.push(
    intlPromise.then(() => {
      if (!browser.supports.intlPluralRules) {
        return import("fluent-intl-polyfill");
      }
      return;
    })
  );
  // Polyfill Intersection Observer.
  if (!browser.supports.intersectionObserver) {
    pending.push(import("intersection-observer"));
  }

  // Polyfill Resize Observer.
  if (!browser.supports.resizeObserver) {
    pending.push(import("./polyfillResizeObserver"));
  }

  if (!browser.supports.fetch) {
    pending.push(import("whatwg-fetch"));
  }

  await Promise.all(pending);
}
