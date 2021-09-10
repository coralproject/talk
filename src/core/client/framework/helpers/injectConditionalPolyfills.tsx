/* eslint-disable no-restricted-globals */
import { BrowserInfo } from "../lib/browserInfo";
import polyfillCSSVars from "./polyfillCSSVars";
import polyfillProxy from "./polyfillProxy";

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

  if (!browser.supports.proxyObject) {
    pending.push(polyfillProxy(browser));
  }
  if (!browser.supports.fetch) {
    pending.push(import("whatwg-fetch"));
  }
  if (!browser.supports.cssVariables) {
    pending.push(polyfillCSSVars(window));
  }

  await Promise.all(pending);
}
