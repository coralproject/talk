// Jest assertions will not fail if they live inside a try-catch block due to
// https://github.com/facebook/jest/issues/3917.

// This file returns a version of `expect` that that
// fails the test immediately when an exception is thrown.

/**
 * isPromise detects whether given object is a promise or not.
 */
const isPromise = (obj: any): obj is PromiseLike<any> =>
  !!obj &&
  (typeof obj === "object" || typeof obj === "function") &&
  typeof obj.then === "function";

/**
 * Wrap a jest matcher so if the expectation fails, it also fails the test.
 * @param func the jest matcher that will be wrapped.
 */
const wrapMatcher = (func: any) => {
  const wrappedMatcher: any = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const keys = Object.keys(func);
  keys.forEach((k) => {
    if (typeof func[k] === "function") {
      wrappedMatcher[k] = (...args: any[]) => {
        try {
          const result = func[k](...args);
          if (isPromise(result)) {
            return result.then(undefined, (e) => {
              // Remove this function from stacktrace.
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              Error.captureStackTrace(e, wrappedMatcher[k]);
              fail(e);
              throw e;
            });
          }
          return result;
        } catch (e) {
          // Remove this function from stacktrace.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Error.captureStackTrace(e, wrappedMatcher[k]);
          fail(e);
          throw e;
        }
      };
    } else {
      // This should be not, resolves, rejects.
      wrappedMatcher[k] = wrapMatcher(func[k]);
    }
  });
  return wrappedMatcher;
};

const expectAndFail = (...args: unknown[]) => {
  const matcher = (global as unknown).expect(...args);
  return wrapMatcher(matcher);
};

export default expectAndFail;
