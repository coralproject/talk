/**
 * getCurrentScriptOrigin will try to find the script origin.
 * For legacy browsers a fallbackIdentifier is required.
 *
 * @argument fallbackID id attached to a script tag to get its origin from for legacy browsrs.
 */
function getCurrentScriptOrigin(fallbackID?: string) {
  // Find current script (modern browsers).
  let script = document.currentScript as HTMLScriptElement | null;

  if (!script && fallbackID) {
    // Find script tag with `fallbackIdentifier` as its id.
    script = document.getElementById(fallbackID) as HTMLScriptElement | null;
    if (!script) {
      // Find script tag with `fallbackIdentifier` as its className.
      script = document.querySelector(
        `.${fallbackID}`
      ) as HTMLScriptElement | null;
    }
  }
  if (!script) {
    throw new Error("Current script not found");
  }
  return new URL(script.src).origin;
}

export default getCurrentScriptOrigin;
