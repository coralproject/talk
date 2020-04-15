import Bowser from "bowser";

export interface BrowserInfo {
  ios: boolean;
  msie: boolean;
  mobile: boolean;
}

let browserInfo: BrowserInfo | null = null;

export function getBrowserInfo(): BrowserInfo {
  if (!browserInfo) {
    const browser = Bowser.getParser(window.navigator.userAgent);
    browserInfo = {
      ios: browser.is(Bowser.OS_MAP.iOS),
      msie: browser.is(Bowser.BROWSER_MAP.ie),
      mobile: browser.is(Bowser.PLATFORMS_MAP.mobile),
    };
  }
  return browserInfo;
}
