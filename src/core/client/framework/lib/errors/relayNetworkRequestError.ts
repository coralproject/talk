import { FluentBundle } from "@fluent/bundle/compat";
import { RRNLRequestError } from "react-relay-network-modern/es";

import { getMessage } from "../i18n";

/**
 * RelayNetworkRequestError wraps Request errors thrown by Relay Network Layer.
 */
export default class RelayNetworkRequestError extends Error {
  // Keep origin of original server response.
  public origin: RRNLRequestError;

  constructor(error: RRNLRequestError, localeBundles: FluentBundle[]) {
    let msg = getMessage(
      localeBundles,
      "framework-error-relayNetworkRequestError-anUnexpectedNetworkError",
      "An unexpected network error occured, please try again later."
    );

    if (error.res) {
      const codePrefix = getMessage(
        localeBundles,
        "framework-error-relayNetworkRequestError-code",
        "Code"
      );

      msg += ` [${codePrefix}: ${error.res.status.toString()}`;
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
