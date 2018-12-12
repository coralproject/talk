import { ReactTestInstance } from "react-test-renderer";

import matchText from "./matchText";

const matcher = (pattern: string | RegExp) => (i: ReactTestInstance) => {
  // Only look at dom components.
  if (typeof i.type !== "string" || !i.props["aria-label"]) {
    return false;
  }
  return matchText(pattern, i.props["aria-label"]);
};

export function getByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  return container.find(matcher(pattern));
}

export function queryByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  try {
    return container.find(matcher(pattern));
  } catch {
    return null;
  }
}

export function queryAllByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  try {
    return container.findAll(matcher(pattern));
  } catch {
    return [];
  }
}

export function getAllByLabelText(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  return container.findAll(matcher(pattern));
}
