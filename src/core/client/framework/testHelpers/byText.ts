import React from "react";
import { ReactTestInstance } from "react-test-renderer";

import matchText from "./matchText";

const matcher = (pattern: string | RegExp) => (i: ReactTestInstance) => {
  // Only look at dom components.
  if (typeof i.type !== "string") {
    return false;
  }
  if (!i.props.children) {
    return false;
  }
  const children = React.Children.toArray(i.props.children);
  for (const c of children) {
    if (typeof c === "string" && matchText(pattern, c, { loose: true })) {
      return true;
    }
  }
  return false;
};

export function getByText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  return container.find(matcher(pattern));
}

export function queryByText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  try {
    return container.find(matcher(pattern));
  } catch {
    return null;
  }
}

export function queryAllByText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  try {
    return container.findAll(matcher(pattern));
  } catch {
    return [];
  }
}

export function getAllByText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  return container.findAll(matcher(pattern));
}
