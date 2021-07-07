import { RRNLRequestError } from "react-relay-network-modern/es";

/**
 * RelayNetworkRequestError wraps Request errors thrown by Relay Network Layer.
 */
export default class RelayNetworkRequestError extends Error {
  // Keep origin of original server response.
  public origin: RRNLRequestError;

  constructor(error: RRNLRequestError) {
    let msg = "An unexpected network error occured, please try again later.";

    if (error.res) {
      msg += ` [Code: ${error.res.status.toString()}`;
      if (error.res.statusText) {
        msg += " " + error.res.statusText;
      }
      msg += "]";
    }
    super(msg);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RelayNetworkRequestError);
    }

    this.origin = error;
  }
}
