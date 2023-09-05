import TraceableError from "./traceableError";

/**
 * Shape of the `UnknownError` extension.
 */
interface UnknownErrorExtensions {
  code: string;
  message?: string;
  traceID: string;
}

/**
 * UnknownServerError wraps any error returned from the
 * server that we don't know of.
 */
export default class UnknownServerError extends TraceableError {
  // Keep origin of original server response.
  public readonly origin: Error;
  public readonly code: string;

  constructor(extensions: UnknownErrorExtensions, origin: Error) {
    super(extensions.message || extensions.code, extensions.traceID);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnknownServerError);
    }

    this.origin = origin;
    this.code = extensions.code;
  }
}
