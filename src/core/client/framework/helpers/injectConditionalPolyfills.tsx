/* eslint-disable no-restricted-globals */
import { BrowserInfo } from "../lib/browserInfo";

export interface PolyfillConfig {
  intl?: boolean;
  intersectionObserver?: boolean;
  resizeObserver?: boolean;
  fetch?: boolean;
}

export default async function injectConditionalPolyfills(
  window: Window,
  browser: BrowserInfo,
  config: PolyfillConfig = {}
) {
  const pending: Promise<any>[] = [];

  // Polyfill Intl.
  let intlPromise = Promise.resolve();
  if (!browser.supports.intl && config.intl !== false) {
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
  if (
    !browser.supports.intersectionObserver &&
    config.intersectionObserver !== false
  ) {
    pending.push(import("intersection-observer"));
  }

  // Polyfill Resize Observer.
  if (!browser.supports.resizeObserver && config.resizeObserver !== false) {
    pending.push(import("./polyfillResizeObserver"));
  }

  if (!browser.supports.fetch && config.fetch !== false) {
    pending.push(import("whatwg-fetch"));
  }

  await Promise.all(pending);
}
