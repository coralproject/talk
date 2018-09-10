import bowser from "bowser";

export interface BrowserInfo {
  ios: boolean;
}

export function getBrowserInfo(): BrowserInfo {
  return {
    ios: bowser.ios,
  };
}
