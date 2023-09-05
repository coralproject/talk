import { ReactTestInstance } from "react-test-renderer";

import matchText, { TextMatchOptions, TextMatchPattern } from "./matchText";

const matcher =
  (pattern: TextMatchPattern, options?: TextMatchOptions) =>
  (i: ReactTestInstance) => {
    // Only look at dom components.
    if (typeof i.type !== "string" || !i.props.id) {
      return false;
    }
    return matchText(pattern, i.props.id, {
      collapseWhitespace: false,
      ...options,
    });
  };

export function getByID(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  return container.find(matcher(pattern, options));
}

export function queryByID(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  const results = container.findAll(matcher(pattern, options));
  if (!results.length) {
    return null;
  }
  return results[0];
}
