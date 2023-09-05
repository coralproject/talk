import breakpoints from "coral-ui/theme/breakpoints";

/**
 * Return classNames that represents current breakpoint status
 * on the width. E.g. it returns classes like:
 *   - `coral-width-gt-<breakpoint>`
 *   - `coral-width-gte-<breakpoint>`
 *   - `coral-width-lt-<breakpoint>`
 *   - `coral-width-lte-<breakpoint>`
 */
function convWidth2ClassName(width: number | null) {
  if (width === null) {
    return "";
  }
  // Not yet fully loaded.
  if (width < 10) {
    return "";
  }
  const result: string[] = [];
  const keys = Object.keys(breakpoints);
  keys.forEach((key: keyof typeof breakpoints) => {
    const bpWidth = breakpoints[key];
    if (width > bpWidth) {
      result.push(`coral-width-gt-${key}`);
    }
    if (width >= bpWidth) {
      result.push(`coral-width-gte-${key}`);
    }
    if (width < bpWidth) {
      result.push(`coral-width-lt-${key}`);
    }
    if (width <= bpWidth) {
      result.push(`coral-width-lte-${key}`);
    }
  });
  return result.join(" ");
}

export default convWidth2ClassName;
