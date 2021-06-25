import TraceableError from "./traceableError";

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
export default class UnknownServerError extends TraceableError {
  // Keep origin of original server response.
  public origin: UnknownErrorExtension;
  public traceID?: string;

  constructor(msg: string, error: UnknownErrorExtension) {
    super(msg);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnknownServerError);
    }

    const traceID: string | null | undefined = (error as any).traceID as string;
    const traceIDs: string[] | null | undefined = (error as any)
      .traceIDs as string[];

    if (traceID) {
      this.traceID = traceID;
    }
    if (traceIDs) {
      this.traceID = traceIDs.join(", ");
    }

    this.origin = error;
  }
}
