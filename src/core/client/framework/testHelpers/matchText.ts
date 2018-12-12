export default function matchText(
  pattern: string | RegExp,
  text: string,
  options: { loose?: boolean } = {}
) {
  if (typeof pattern === "string") {
    if (options.loose) {
      return text.toLowerCase().includes(pattern.toLowerCase());
    }
    return text === pattern;
  }
  return pattern.test(text);
}
