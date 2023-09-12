export interface TextMatchOptions {
  exact?: boolean; // defaults to true
  collapseWhitespace?: boolean; // defaults to true
  trim?: boolean; // defaults to true
}

export type TextMatchPattern = string | RegExp;

export default function matchText(
  pattern: TextMatchPattern,
  text: string,
  options: TextMatchOptions = {}
) {
  let a = pattern;
  let b = text;
  if (options.trim || options.trim === undefined) {
    a = typeof a === "string" ? a.trim() : a;
    b = b.trim();
  }
  if (options.collapseWhitespace || options.collapseWhitespace === undefined) {
    a = typeof a === "string" ? a.replace(/\s+/g, " ") : a;
    b = b.replace(/\s+/g, " ");
  }
  if (typeof a === "string") {
    if (options.exact || options.exact === undefined) {
      return a === b;
    }
    return b.toLowerCase().includes(a.toLowerCase());
  }
  return a.test(b);
}
