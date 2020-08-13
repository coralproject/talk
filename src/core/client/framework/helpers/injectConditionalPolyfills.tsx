import { getBrowserInfo } from "../lib/browserInfo";
import polyfillCSSVars from "./polyfillCSSVars";

export default async function injectConditionalPolyfills() {
  const browser = getBrowserInfo();
  const pending: Promise<any>[] = [];

  // Polyfill Intl.
  let intlPromise = Promise.resolve();
  if (!browser.supportsIntl) {
    intlPromise = (async () => {
      const IntlPolyfill = (await import("intl")).default;
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
      return;
    })();
  }
  pending.push(
    intlPromise.then(() => {
      if (!browser.supportsIntlPluralRules) {
        return import("fluent-intl-polyfill");
      }
      return;
    })
  );
  // Polyfill Intersection Observer.
  if (!browser.supportsIntersectionObserver) {
    pending.push(import("intersection-observer"));
  }

  if (!browser.supportsProxyObject) {
    pending.push(import("proxy-polyfill"));
  }
  if (!browser.supportsFetch) {
    pending.push(import("whatwg-fetch"));
  }
  if (!browser.supportsCSSVariables) {
    pending.push(polyfillCSSVars());
  }
  await Promise.all(pending);
}
