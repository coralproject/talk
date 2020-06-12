import vm from "vm";

import logger from "coral-server/logger";

export type ManagedRegExp = (
  testString: string,
  timeout: number
) => boolean | null;

export default function createManagedRegExp(regexp: RegExp): ManagedRegExp {
  // Create the script we're executing as a part of this regex test operation.
  const script = new vm.Script("regexp.test(testString)");

  return (testString: string, timeout: number) => {
    let result: boolean;

    try {
      // Create a null context object to isolate it with primitives.
      const ctx = Object.create(null);
      ctx.regexp = regexp;
      ctx.testString = testString;

      // Run the operation in this context.
      result = script.runInNewContext(ctx, { timeout });
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
