/**
 * NetworkOfflineError thrown when an action that required internet connection
 * but network was offline.
 */
export default class NetworkOfflineError extends Error {
  // Keep origin of original server response.
  public origin: Error;

  constructor(error: Error) {
    if (navigator.onLine === false) {
      super("Network Error: You are currently offline.");
    } else {
      super("Network Error: Please check your internet connection.");
    }

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkOfflineError);
    }

    this.origin = error;
  }
}
