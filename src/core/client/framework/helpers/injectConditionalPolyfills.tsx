import { getBrowserInfo } from "../lib/browserInfo";
import polyfillCSSVars from "./polyfillCSSVars";

export default async function injectConditionalPolyfills() {
  const browser = getBrowserInfo();
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
    pending.push(import("proxy-polyfill"));
  }
  if (!browser.supports.fetch) {
    pending.push(import("whatwg-fetch"));
  }
  if (!browser.supports.cssVariables) {
    pending.push(polyfillCSSVars());
  }
  if (!browser.supports.scrollTo) {
    // TODO: This is only needed for live chat and most probably only IE11.
    // Could improve this by polyfilling only when loading live chat instead of
    // always.
    const scrollPromise = (async () => {
      const smoothScroll = (await import("smoothscroll-polyfill")).default;
      smoothScroll.polyfill();
      return;
    })();
    pending.push(scrollPromise);
  }

  await Promise.all(pending);
}
