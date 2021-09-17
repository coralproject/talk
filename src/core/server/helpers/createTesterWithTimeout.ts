import vm from "vm";

import logger from "coral-server/logger";
import { WordlistMatch } from "coral-server/models/comment";

export interface MatchResult {
  isMatched: boolean | null;
  timedOut: boolean;
  matches: WordlistMatch[];
}

export type TestWithTimeout = (testString: string) => MatchResult;

function sumPriorLengths(items: string[], index: number): number {
  let sum = 0;
  for (let i = 0; i < index; i++) {
    const item = items[i];
    sum += item.length;
  }

  return sum;
}

/**
 * createTesterWithTimeout will create a tester that after the timeout, will
 * return null instead of a boolean.
 *
 * @param regexp the regular expression to wrap
 * @param timeout the timeout to use
 */
export default function createTesterWithTimeout(
  regexp: any,
  timeout: number
): TestWithTimeout {
  // Create the script we're executing as a part of this regex test operation.
  const script = new vm.Script("testString.split(regexp)");

  // Create a null context object to isolate it with primitives.
  const sandbox = Object.create(null);
  sandbox.regexp = regexp;
  sandbox.testString = "";

  // Turn the sandbox into a context.
  const ctx = vm.createContext(sandbox);

  return (testString: string) => {
    let result: MatchResult = {
      isMatched: false,
      timedOut: false,
      matches: [],
    };

    try {
      // Set the testString to the one we're evaluating for this context.
      sandbox.testString = testString;

      const tokens = script.runInContext(ctx, { timeout }) as string[];

      const matches: WordlistMatch[] = [];
      for (let t = 0; t < tokens.length; t++) {
        const token = tokens[t];
        // found a matched word
        if (t % 4 === 2) {
          const index = sumPriorLengths(tokens, t);
          matches.push({
            value: token,
            index,
            length: token.length,
          });
        }
      }

      // Run the operation in this context.

      result = {
        isMatched: matches.length > 0,
        timedOut: false,
        matches,
      };
    } catch (err) {
      if (err.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
        return {
          isMatched: null,
          timedOut: true,
          matches: [],
        };
      }

      logger.error(
        { err },
        "an error occurred evaluating the regular expression"
      );

      return {
        isMatched: null,
        timedOut: false,
        matches: [],
      };
    }

    return result;
  };
}
