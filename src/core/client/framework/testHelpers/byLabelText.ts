import { ReactTestInstance } from "react-test-renderer";

import { queryAllByText } from "./byText";
import matchText, { TextMatchOptions, TextMatchPattern } from "./matchText";

const ariaLabelMatcher = (
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) => (i: ReactTestInstance) => {
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
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  const results = queryAllByLabelText(container, pattern, options);
  if (results.length === 1) {
    return results[0];
  }
  if (results.length === 0) {
    throw new Error(`Could't find element with label text ${pattern}`);
  }
  throw new Error(`Found multiple elements with label text ${pattern}`);
}

export function getAllByLabelText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  const results = queryAllByLabelText(container, pattern, options);
  if (results.length) {
    return results;
  }
  throw new Error(`Could't find element with label text ${pattern}`);
}

export function queryByLabelText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  const results = queryAllByLabelText(container, pattern, options);
  if (results.length) {
    return results[0];
  }
  return null;
}

export function queryAllByLabelText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions
) {
  const matches = container.findAll(ariaLabelMatcher(pattern, options));
  queryAllByText(container, pattern).forEach(i => {
    if (typeof i.type !== "string") {
      return;
    }
    if (i.props.id) {
      try {
        matches.push(
          container.find(
            x =>
              typeof x.type === "string" &&
              x.props["aria-labelledby"] === i.props.id
          )
        );
      } catch {} // tslint:disable-line:no-empty
    }
    if (i.type === "label" && i.props.for) {
      try {
        matches.push(
          container.find(
            x => typeof x.type === "string" && x.props.id === i.props.for
          )
        );
      } catch {} // tslint:disable-line:no-empty
    }
  });
  return matches;
}
