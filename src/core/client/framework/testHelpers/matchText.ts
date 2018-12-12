export interface TextMatchOptions {
  exact?: boolean; // defaults to true
  collapseWhitespace?: boolean; // defaults to true
  trim?: boolean; // defaults to true
}

export default function matchText(
  pattern: string | RegExp,
  text: string,
  options: TextMatchOptions = {}
) {
  if (typeof pattern === "string") {
    let a = text;
    let b = pattern;
    if (options.trim || options.trim === undefined) {
      a = a.trim();
      b = b.trim();
    }
    if (
      options.collapseWhitespace ||
      options.collapseWhitespace === undefined
    ) {
      a = a.replace(/\s+/g, " ");
      b = b.replace(/\s+/g, " ");
    }
    if (options.exact || options.exact === undefined) {
      return a === b;
    }
    return text.toLowerCase().includes(pattern.toLowerCase());
  }
  return pattern.test(text);
}
