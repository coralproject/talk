import { uniq } from "lodash";
import { ReactTestInstance } from "react-test-renderer";

import { queryAllByText } from "./byText";
import matchText, { TextMatchOptions, TextMatchPattern } from "./matchText";

const ariaLabelMatcher =
  (pattern: TextMatchPattern, options?: TextMatchOptions) =>
  (i: ReactTestInstance) => {
    // Only look at dom components.
    if (typeof i.type !== "string" || !i.props["aria-label"]) {
      return false;
    }
    return matchText(pattern, i.props["aria-label"], {
      collapseWhitespace: false,
      ...options,
    });
  };
interface SelectorOptions {
  selector?: string;
}

export function getByLabelText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions & SelectorOptions
) {
  const results = queryAllByLabelText(container, pattern, options);
  if (results.length === 1) {
    return results[0];
  }
  if (results.length === 0) {
    throw new Error(`Couldn't find element with label text ${pattern}`);
  }
  throw new Error(`Found multiple elements with label text ${pattern}`);
}

export function getAllByLabelText(
  container: ReactTestInstance,
  pattern: TextMatchPattern,
  options?: TextMatchOptions & SelectorOptions
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
  options?: TextMatchOptions & SelectorOptions
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
  options?: TextMatchOptions & SelectorOptions
) {
  let matches = container.findAll(ariaLabelMatcher(pattern, options));
  // Find matching aria-labelledby and id pairs.
  queryAllByText(container, pattern, options).forEach((i) => {
    if (typeof i.type !== "string") {
      return;
    }
    if (i.props.id) {
      try {
        matches.push(
          container.find(
            (x) =>
              typeof x.type === "string" &&
              x.props["aria-labelledby"] === i.props.id
          )
        );
      } catch {} // eslint-disable-line no-empty
    }
  });
  // Find matching labels.
  queryAllByText(container, pattern, { ...options, selector: "label" }).forEach(
    (i) => {
      if (i.props.htmlFor) {
        try {
          matches.push(
            container.find(
              (x) =>
                typeof x.type === "string" && x.props.id === i.props.htmlFor
            )
          );
        } catch {} // eslint-disable-line no-empty
      }
    }
  );
  if (options && options.selector) {
    matches = matches.filter((m) => m.type === options.selector);
  }
  return uniq(matches);
}
