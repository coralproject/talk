import Bowser from "bowser";

export interface BrowserInfo {
  version: number;
  ios: boolean;
  msie: boolean;
  mobile: boolean;
  supportsCSSVariables: boolean;
  supportsFetch: boolean;
  supportsProxyObject: boolean;
  supportsIntl: boolean;
  supportsIntlPluralRules: boolean;
  supportsIntersectionObserver: boolean;
}

let browserInfo: BrowserInfo | null = null;

export function getBrowserInfo(): BrowserInfo {
  if (!browserInfo) {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const ios = browser.is(Bowser.OS_MAP.iOS);
    const msie = browser.is(Bowser.BROWSER_MAP.ie);
    const mobile = browser.is(Bowser.PLATFORMS_MAP.mobile);
    const version = Number.parseFloat(browser.getBrowserVersion());
    browserInfo = {
      version,
      supportsIntl: typeof Intl !== "undefined",
      supportsIntlPluralRules:
        typeof Intl !== "undefined" && Boolean(Intl.PluralRules),
      supportsProxyObject: Boolean(window.Proxy),
      supportsCSSVariables:
        window.CSS && CSS.supports("color", "var(--fake-var)"),
      supportsFetch: Boolean(window.fetch),
      supportsIntersectionObserver:
        "IntersectionObserver" in window &&
        "IntersectionObserverEntry" in window &&
        "intersectionRatio" in
          (window as any).IntersectionObserverEntry.prototype,
      ios,
      msie,
      mobile,
    };
  }
  return browserInfo;
}
