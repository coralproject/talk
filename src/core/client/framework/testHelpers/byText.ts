import React from "react";
import { ReactTestInstance } from "react-test-renderer";

import matchText, { TextMatchOptions, TextMatchPattern } from "./matchText";

const matcher = (pattern: TextMatchPattern, options?: TextMatchOptions) => (
  i: ReactTestInstance
) => {
  // Only look at dom components.
  if (typeof i.type !== "string") {
    return false;
  }
  if (!i.props.children) {
    return false;
  }
  const children = React.Children.toArray(i.props.children);
  for (const c of children) {
    if (typeof c === "string" && matchText(pattern, c, options)) {
      return true;
    }
  }
  return false;
};

export function getByText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  return container.find(matcher(pattern, options));
}

export function getAllByText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  const results = container.findAll(matcher(pattern, options));
  if (!results.length) {
    throw new Error(`Couldn't find text ${pattern}`);
  }
  return results;
}

export function queryByText(
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

export function queryAllByText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  return container.findAll(matcher(pattern, options));
}
