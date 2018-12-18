import { ReactTestInstance } from "react-test-renderer";

import matchText, { TextMatchOptions, TextMatchPattern } from "./matchText";

const matcher = (pattern: TextMatchPattern, options?: TextMatchOptions) => (
  i: ReactTestInstance
) => {
  // Only look at dom components.
  if (typeof i.type !== "string" || !i.props["data-testid"]) {
    return false;
  }
  return matchText(pattern, i.props["data-testid"], {
    collapseWhitespace: false,
    ...options,
  });
};

export function getByTestID(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  return container.find(matcher(pattern, options));
}

export function queryByTestID(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  try {
    return container.findAll(matcher(pattern, options))[0];
  } catch {
    return null;
  }
}

export function queryAllByTestID(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  try {
    return container.findAll(matcher(pattern, options));
  } catch {
    return [];
  }
}

export function getAllByTestID(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  return container.findAll(matcher(pattern, options));
}
