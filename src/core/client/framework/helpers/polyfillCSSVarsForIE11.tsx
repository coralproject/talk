import { getBrowserInfo } from "../lib/browserInfo";

export default function polyfillCSSVarsForIE11() {
  if (getBrowserInfo().msie) {
    return import("css-vars-ponyfill").then((module) => module.default());
  }
  return Promise.resolve();
}
