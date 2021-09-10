/* eslint-disable no-restricted-globals */
import { BrowserInfo } from "../lib/browserInfo";

/**
 * Returns true, when proxy poyfill has been injected.
 */
export function hasProxyPolyfill() {
  return Boolean((window.Proxy as any).isPolyfill);
}

/**
 * Polyfills CSS Variables.
 * This needs to be called whenenver new css variables are introduced
 * through new CSS.
 */
export default async function polyfillProxy(browser: BrowserInfo) {
  if (!browser.supports.proxyObject) {
    await import("proxy-polyfill");
    (window.Proxy as any).isPolyfill = true;
  }
  return;
}
