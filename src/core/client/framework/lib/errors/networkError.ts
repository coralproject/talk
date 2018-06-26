/**
 * NetworkError wraps errors at the network layer.
 */
export default class NetworkError extends Error {
  // Original error.
  public readonly origin: Error;

  constructor(origin: Error) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor.
    super(origin.message);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
    this.origin = origin;
  }
}
