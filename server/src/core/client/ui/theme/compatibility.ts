/**
 * compat is used to set the value of a css variable while allowing
 * it to be overridden by an older css variable if it's set.
 */
export function compat(value: string, previousVariable: string) {
  return `var(--${previousVariable}, ${value})`;
}
