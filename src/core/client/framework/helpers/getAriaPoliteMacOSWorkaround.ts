import { getBrowserInfo } from "coral-framework/lib/browserInfo";

/**
 * TODO: This is a workaround for the bug https://github.com/phetsims/a11y-research/issues/132,
 * on MacOSX where `aria-live="polite"` will get read twice when content is in an iframe.
 * As a workaround we use "assertive" for MacOSX instead.
 */
function getAriaPoliteMacOSWorkaround(window: Window) {
  const browserInfo = getBrowserInfo(window);
  if (browserInfo.macos) {
    return "assertive";
  }
  return "polite";
}

export default getAriaPoliteMacOSWorkaround;
