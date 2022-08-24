/* eslint-disable no-console */
import stackTrace from "stack-trace";

type PatternMap = Record<string, RegExp | string>;

interface MatchedItem {
  patternName: string;
  match: string;
}

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
  "Missing translation": "en-US translation for key",
};

/**
 * We look for these pattern and mute these
 * messages before they reach the console.
 */
const mutePatterns: PatternMap = {
  "ReactFinalForm - Update a component while rendering another":
    /Cannot update a component.*while rendering a different component.*Field/,
  "ReactFinalForm - Update a component from inside the function body (https://github.com/final-form/react-final-form/issues/751)":
    /Warning: Cannot update a component from inside the function body/g,
  "Recompose - React.createFactory() is deprecated (https://github.com/acdlite/recompose/pull/795)":
    /React.createFactory\(\) is deprecated/g,
  "RTE - ComponentWillReceiveProps has been renamed, and is not recommended for use (https://github.com/coralproject/rte)":
    /componentWillReceiveProps has been renamed, and is not recommended for use.*RTE/gs,
};

let matchedFail: MatchedItem[] = [];
const matchedMute: MatchedItem[] = [];
const originalError = global.console.error;
const originalWarn = global.console.warn;
const originalLog = global.console.log;

function argToString(arg: any): string {
  if (typeof arg === "string") {
    return arg;
  }
  if (arg.toString !== undefined) {
    return arg.toString();
  }
  try {
    return JSON.stringify(arg);
  } catch {
    return "";
  }
}

function getMatchingPatterns(patterns: PatternMap, args: any[]): MatchedItem[] {
  try {
    const str = args.map((a) => argToString(a)).join(" ");
    const matchedPatterns: MatchedItem[] = [];
    Object.keys(patterns).forEach((k) => {
      const matching =
        typeof patterns[k] === "string"
          ? str.includes(patterns[k] as string)
          : str.match(patterns[k]);
      if (matching !== false && matching !== null) {
        matchedPatterns.push({
          patternName: k,
          match: str,
        });
      }
    });
    return matchedPatterns;
  } catch {
    return [];
  }
}

function createMockImplementation(originalFunction: (...args: any[]) => void) {
  return (...args: any[]) => {
    const muted = getMatchingPatterns(mutePatterns, args);
    if (muted.length) {
      matchedMute.push(...muted);
      return;
    }
    matchedFail.push(...getMatchingPatterns(failPatterns, args));

    // Get filename and line from stack trace.
    const stackFrame = stackTrace.parse(new Error())[1];
    const origin = `${stackFrame
      .getFileName()
      .replace(`${process.cwd()}/`, "")}:${stackFrame.getLineNumber()}\n`;

    originalFunction(origin, ...args);
    return;
  };
}

global.console.error = createMockImplementation(originalError);
global.console.warn = createMockImplementation(originalWarn);
global.console.log = createMockImplementation(originalLog);

beforeEach(() => {
  matchedFail = [];
});

afterEach(() => {
  if (matchedFail.length) {
    throw new Error(
      `Found following issues in the console logs: ${Array.from(
        new Set(matchedFail.map((m) => `"${m.patternName}" - ${m.match}`))
      ).join("\n\n")}`
    );
  }
});

afterAll(() => {
  if (matchedMute.length) {
    originalLog(
      `Muted warnings: ${Array.from(
        new Set(matchedMute.map((m) => m.patternName))
      ).join(", ")}`
    );
  }
});
