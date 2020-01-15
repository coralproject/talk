import bowser from "bowser";

import polyfillCSSVarsForIE11 from "./polyfillCSSVarsForIE11";

export default async function injectConditionalPolyfills() {
  const pending: Promise<any>[] = [];

  // Polyfill Intl.
  if (typeof Intl === "undefined" || !(Intl as any).PluralRules) {
    pending.push(import("fluent-intl-polyfill"));
  }

  // Polyfill Intersection Observer.
  if (
    !("IntersectionObserver" in window) ||
    !("IntersectionObserverEntry" in window) ||
    !(
      "intersectionRatio" in (window as any).IntersectionObserverEntry.prototype
    )
  ) {
    pending.push(import("intersection-observer"));
  }

  // CSS Vars Polyfill for IE11.
  if (bowser.msie) {
    pending.push(import("whatwg-fetch"));
    pending.push(import("proxy-polyfill"));
    pending.push(polyfillCSSVarsForIE11());
  }
  await Promise.all(pending);
}
