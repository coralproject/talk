import { FetchFunction } from "relay-runtime";

/**
 * Decorates the fetch function with error logging.
 * Intended for testing purposes.
 */
export default function wrapFetchWithLogger(
  fetch: FetchFunction,
  options: { logResult?: boolean; muteErrors?: boolean } = {}
): FetchFunction {
  return async (...args: any[]) => {
    try {
      const result = await (fetch as any)(...args);
      if (options.logResult) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(result));
      }
      return result;
    } catch (err) {
      if (!options.muteErrors) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      throw err;
    }
  };
}
