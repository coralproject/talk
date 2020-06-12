import vm from "vm";

import logger from "coral-server/logger";

export type TestWithTimeout = (testString: string) => boolean | null;

/**
 * createTesterWithTimeout will create a tester that after the timeout, will
 * return null instead of a boolean.
 *
 * @param regexp the regular expression to wrap
 * @param timeout the timeout to use
 */
export default function createTesterWithTimeout(
  regexp: RegExp,
  timeout: number
): TestWithTimeout {
  // Create the script we're executing as a part of this regex test operation.
  const script = new vm.Script("regexp.test(testString)");

  // Create a null context object to isolate it with primitives.
  const sandbox = Object.create(null);
  sandbox.regexp = regexp;
  sandbox.testString = "";

  // Turn the sandbox into a context.
  const ctx = vm.createContext(sandbox);

  return (testString: string) => {
    let result: boolean;

    try {
      // Set the testString to the one we're evaluating for this context.
      sandbox.testString = testString;

      // Run the operation in this context.
      result = script.runInContext(ctx, { timeout });
    } catch (err) {
      if (err.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
        return null;
      }

      logger.error(
        { err },
        "an error occurred evaluating the regular expression"
      );

      return null;
    }

    return result;
  };
}
