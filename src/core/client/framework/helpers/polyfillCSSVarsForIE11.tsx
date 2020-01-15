import bowser from "bowser";

export default function polyfillCSSVarsForIE11() {
  if (bowser.msie) {
    return import("css-vars-ponyfill").then(module => module.default());
  }
  return Promise.resolve();
}
