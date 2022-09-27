import React from "react";
import { ReactTestInstance } from "react-test-renderer";

import findParentsWithType from "./findParentsWithType";
import matchText, { TextMatchOptions, TextMatchPattern } from "./matchText";

/**
 * Turns list of children of a dom element into a string.
 * This will also handle React Fragments.
 *
 * @param children list of children
 */
const childrenToString = (children: ReactTestInstance["children"]) => {
  let result = "";
  for (const c of children) {
    if (typeof c === "string") {
      result += ` ${c}`;
    } else {
      // If we hit another dom element, stop here.
      if (typeof c.type === "string") {
        continue;
      }
      // It's a React Component recurse into it to find fragments.
      result += childrenToString(c.children);
    }
  }
  return result;
};

const matcher =
  (pattern: TextMatchPattern, options?: TextMatchOptions) =>
  (i: ReactTestInstance) => {
    // Only look at dom components.
    if (typeof i.type !== "string") {
      return false;
    }
    const content = i.props.dangerouslySetInnerHTML
      ? i.props.dangerouslySetInnerHTML.__html
      : childrenToString(i.children);
    return matchText(pattern, content, options);
  };

interface SelectorOptions {
  selector?: string | React.ComponentClass<any> | React.FunctionComponent<any>;
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
