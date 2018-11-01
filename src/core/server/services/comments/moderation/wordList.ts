import { memoize } from "lodash";

// TODO: reintroduce this when we have https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30035 merged
// // Replace `memoize.Cache`.
// memoize.Cache = WeakMap;

/**
 * Escape string for special regular expression characters.
 */
export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * Generate a regular expression that catches the `phrases`.
 */
export function generateRegExp(phrases: string[]) {
  const inner = phrases
    .map(phrase =>
      phrase
        .split(/\s+/)
        .map(word => escapeRegExp(word))
        .join('[\\s"?!.]+')
    )
    .join("|");

  return new RegExp(`(^|[^\\w])(${inner})(?=[^\\w]|$)`, "iu");
}

export const generateRegExpMemoized = memoize(generateRegExp);

export const containsMatchingPhrase = (phrases: string[], testString: string) =>
  phrases.length > 0 ? generateRegExp(phrases).test(testString) : false;

export const containsMatchingPhraseMemoized = (
  phrases: string[],
  testString: string
) =>
  phrases.length > 0 ? generateRegExpMemoized(phrases).test(testString) : false;
