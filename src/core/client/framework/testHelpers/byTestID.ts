import { ReactTestInstance } from "react-test-renderer";

import matchText from "./matchText";

const matcher = (pattern: string | RegExp) => (i: ReactTestInstance) => {
  // Only look at dom components.
  if (typeof i.type !== "string" || !i.props["data-test"]) {
    return false;
  }
  return matchText(pattern, i.props["data-test"]);
};

export function getByTestID(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  return container.find(matcher(pattern));
}

export function queryByTestID(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  try {
    return container.find(matcher(pattern));
  } catch {
    return null;
  }
}

export function queryAllByTestID(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  try {
    return container.findAll(matcher(pattern));
  } catch {
    return [];
  }
}

export function getAllByTestID(
  container: ReactTestInstance,
  pattern: string | RegExp
) {
  return container.findAll(matcher(pattern));
}
