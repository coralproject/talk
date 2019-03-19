import React from "react";
import { ReactTestInstance } from "react-test-renderer";

import findParentsWithType from "./findParentsWithType";
import matchText, { TextMatchOptions, TextMatchPattern } from "./matchText";

const matcher = (pattern: TextMatchPattern, options?: TextMatchOptions) => (
  i: ReactTestInstance
) => {
  // Only look at dom components.
  if (typeof i.type !== "string") {
    return false;
  }
  if (
    i.props.dangerouslySetInnerHTML &&
    matchText(pattern, i.props.dangerouslySetInnerHTML.__html, options)
  ) {
    return true;
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

interface SelectorOptions {
  selector?: string | React.ComponentClass<any> | React.StatelessComponent<any>;
}

export function getByText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions & SelectorOptions
) {
  const results = findParentsWithType(
    container.findAll(matcher(pattern, options)),
    options && options.selector
  );
  if (results.length === 1) {
    return results[0];
  }
  if (results.length === 0) {
    throw new Error(`Could't find element with text ${pattern}`);
  }
  throw new Error(`Found multiple elements with text ${pattern}`);
}

export function getAllByText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions & SelectorOptions
) {
  const results = findParentsWithType(
    container.findAll(matcher(pattern, options)),
    options && options.selector
  );
  if (!results.length) {
    throw new Error(`Couldn't find text ${pattern}`);
  }
  return results;
}

export function queryByText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions & SelectorOptions
) {
  const results = findParentsWithType(
    container.findAll(matcher(pattern, options)),
    options && options.selector
  );
  if (!results.length) {
    return null;
  }
  return results[0];
}

export function queryAllByText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions & SelectorOptions
) {
  return findParentsWithType(
    container.findAll(matcher(pattern, options)),
    options && options.selector
  );
}
