/* eslint-disable no-restricted-globals */
import getOrigin from "coral-common/utils/getOrigin";
import { ORIGIN_FALLBACK_ID } from "coral-framework/constants";

/**
 * getCurrentScriptOrigin will try to find the script origin.
 * For legacy browsers a fallbackIdentifier is required.
 *
 * @param fallbackID id attached to a script tag to get its origin from for legacy browsrs.
 */
function getCurrentScriptOrigin(fallbackID: string = ORIGIN_FALLBACK_ID) {
  // Find current script (modern browsers).
  let script = document.currentScript as HTMLScriptElement | null;

  if (!script && fallbackID) {
    // Find script tag with `fallbackIdentifier` as its id.
    script = document.getElementById(fallbackID) as HTMLScriptElement | null;
    if (!script) {
      // Find script tag with `fallbackIdentifier` as its className.
      script = document.querySelector(`.${fallbackID}`);
    }
  }
  if (!script || !script.src) {
    if (process.env.NODE_ENV !== "production") {
      // In development just return top level origin.
      return window.location.origin;
    }
    throw new Error("Current script not found");
  }
  // Get origin.
  return getOrigin(script.src);
}

export default getCurrentScriptOrigin;
