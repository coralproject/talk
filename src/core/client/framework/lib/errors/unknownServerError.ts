/**
 * Shape of the `UnknownError` extension.
 */
interface UnknownErrorExtension {
  code: string;
}

/**
 * UnknownServerError wraps any error returned from the
 * server that we don't know of.
 */
export default class UnknownServerError extends Error {
  // Keep origin of original server response.
  public origin: UnknownErrorExtension;

  constructor(msg: string, error: UnknownErrorExtension) {
    super(msg);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnknownServerError);
    }

    this.origin = error;
  }
}
