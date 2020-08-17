import { getBrowserInfo } from "../lib/browserInfo";

/**
 * Polyfills CSS Variables.
 * This needs to be called whenenver new css variables are introduced
 * through new CSS.
 */
export default function polyfillCSSVars() {
  if (!getBrowserInfo().supports.cssVariables) {
    return import("css-vars-ponyfill").then((module) => module.default());
  }
  return Promise.resolve();
}
