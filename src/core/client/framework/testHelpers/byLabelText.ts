import { ReactTestInstance } from "react-test-renderer";

import matchText, { TextMatchOptions } from "./matchText";

const matcher = (pattern: string | RegExp, options?: TextMatchOptions) => (
  i: ReactTestInstance
) => {
  // Only look at dom components.
  if (typeof i.type !== "string" || !i.props["aria-label"]) {
    return false;
  }
  return matchText(pattern, i.props["aria-label"], {
    collapseWhitespace: false,
    ...options,
  });
};

export function getByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp,
  options?: TextMatchOptions
) {
  return container.find(matcher(pattern, options));
}

export function queryByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp,
  options?: TextMatchOptions
) {
  try {
    return container.find(matcher(pattern, options));
  } catch {
    return null;
  }
}

export function queryAllByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp,
  options?: TextMatchOptions
) {
  try {
    return container.findAll(matcher(pattern, options));
  } catch {
    return [];
  }
}

export function getAllByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp,
  options?: TextMatchOptions
) {
  return container.findAll(matcher(pattern, options));
}
