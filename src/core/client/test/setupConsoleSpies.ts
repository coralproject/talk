/* eslint-disable no-console */

type PatternMap = Record<string, RegExp | string>;

/**
 * We look for these patterns and fail the
 * tests if these patterns show up in the console.
 */
const failPatterns: PatternMap = {
  "Missing act": "not wrapped in act",
  "Act(async () => ...) without await":
    "You called act(async () => ...) without await",
  "OptimisticResponse warnings":
    "`optimisticResponse` to match structure of server response",
};

/**
 * We look for these pattern and mute these
 * messages before they reach the console.
 */
const mutePatterns: PatternMap = {
  "False validateMutation warnings (https://github.com/facebook/relay/pull/2760)": /`optimisticResponse`.*contains an unused field .*\.\d+/g,
};

let matchedFail: string[] = [];
const matchedMute: string[] = [];
const originalError = global.console.error;
const originalWarn = global.console.warn;
const originalLog = global.console.log;

function getMatchingPatterns(patterns: PatternMap, args: any[]) {
  const str = args
    .map(a => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ");
  const matchedPatterns: string[] = [];
  Object.keys(patterns).forEach(k => {
    const matching =
      typeof patterns[k] === "string"
        ? str.includes(patterns[k] as string)
        : str.match(patterns[k]);
    if (matching !== false && matching !== null) {
      matchedPatterns.push(k);
    }
  });
  return matchedPatterns;
}

function createMockImplementation(originalFunction: (...args: any[]) => void) {
  return (...args: any[]) => {
    const muted = getMatchingPatterns(mutePatterns, args);
    if (muted.length) {
      matchedMute.push(...muted);
      return;
    }
    matchedFail.push(...getMatchingPatterns(failPatterns, args));
    originalFunction(...args);
    return;
  };
}

jest
  .spyOn(global.console, "error")
  .mockImplementation(createMockImplementation(originalError));
jest
  .spyOn(global.console, "warn")
  .mockImplementation(createMockImplementation(originalWarn));
jest
  .spyOn(global.console, "log")
  .mockImplementation(createMockImplementation(originalLog));

beforeEach(() => {
  matchedFail = [];
});

afterEach(() => {
  if (matchedFail.length) {
    throw new Error(
      `Found following issues in the console logs: ${Array.from(
        new Set(matchedFail)
      ).join(", ")}`
    );
  }
});

afterAll(() => {
  if (matchedMute.length) {
    originalLog(
      `Muted warnings: ${Array.from(new Set(matchedMute)).join(", ")}`
    );
  }
});
