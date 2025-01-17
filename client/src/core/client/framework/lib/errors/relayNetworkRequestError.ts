import { FluentBundle } from "@fluent/bundle/compat";
import { RRNLRequestError } from "react-relay-network-modern/es";

import { getMessage } from "../i18n";

interface DupErrorObj {
  error?: {
    traceID: string;
    code: string;
    message: string;
  };
}

interface UsernameNotProvidedErrorObj {
  error?: {
    traceID: string;
    code: string;
    message: string;
  };
}

const parseDuplicateEmailError = (
  error: RRNLRequestError
): DupErrorObj | null => {
  if (!error.res || error.res.status !== 403 || !error.res.text) {
    return null;
  }

  try {
    const json = JSON.parse(error.res.text) as DupErrorObj;
    if (!json || !json.error || json.error.code !== "DUPLICATE_EMAIL") {
      return null;
    }

    return json;
  } catch {
    return null;
  }
};

const parseUsernameNotProvidedError = (
  error: RRNLRequestError
): UsernameNotProvidedErrorObj | null => {
  if (!error.res || error.res.status !== 403 || !error.res.text) {
    return null;
  }

  try {
    const json = JSON.parse(error.res.text) as UsernameNotProvidedErrorObj;
    if (!json || !json.error || json.error.code !== "USERNAME_NOT_PROVIDED") {
      return null;
    }

    return json;
  } catch {
    return null;
  }
};

const computeCodeMessage = (
  error: RRNLRequestError,
  localeBundles: FluentBundle[]
) => {
  if (!error.res) {
    return "";
  }

  const codePrefix = getMessage(
    localeBundles,
    "framework-error-relayNetworkRequestError-code",
    "Code"
  );

  let msg = `[${codePrefix}]`;
  if (error.res && error.res.status) {
    msg += ` ${error.res.status.toString()}`;
  }
  if (error.res && error.res.statusText) {
    msg += ` ${error.res.statusText}`;
  }

  return msg;
};

const computeMessage = (
  error: RRNLRequestError,
  localeBundles: FluentBundle[]
): string => {
  const defaultMessage = getMessage(
    localeBundles,
    "framework-error-relayNetworkRequestError-anUnexpectedNetworkError",
    "An unexpected network error occured, please try again later."
  );

  const dupeEmail = parseDuplicateEmailError(error);
  if (dupeEmail && dupeEmail.error) {
    return dupeEmail.error.message;
  }

  const usernameNotProvided = parseUsernameNotProvidedError(error);
  if (usernameNotProvided && usernameNotProvided.error) {
    return usernameNotProvided.error.message;
  }

  if (error.res) {
    return `${defaultMessage} ${computeCodeMessage(error, localeBundles)}`;
  }

  return defaultMessage;
};

/**
 * RelayNetworkRequestError wraps Request errors thrown by Relay Network Layer.
 */
export default class RelayNetworkRequestError extends Error {
  // Keep origin of original server response.
  public origin: RRNLRequestError;

  constructor(error: RRNLRequestError, localeBundles: FluentBundle[]) {
    super(computeMessage(error, localeBundles));

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RelayNetworkRequestError);
    }

    this.origin = error;
  }
}
