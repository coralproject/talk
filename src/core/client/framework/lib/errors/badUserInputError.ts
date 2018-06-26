import { mapValues, once } from "lodash";
import { ReactNode } from "react";
import { VALIDATION_REQUIRED, VALIDATION_TOO_SHORT } from "../messages";

/**
 * ValidationError represents all possible string values
 * that is responded by the server.
 */
type ValidationError = "TOO_SHORT";

/**
 * InvalidArgsMap as responded by the server.
 */
interface InvalidArgsMap {
  [key: string]: ValidationError;
}

/**
 * The localized version of `InvalidArgsMap`.
 */
interface InvalidArgsMapLocalilzed {
  [key: string]: ReactNode;
}

/**
 * Shape of the `BadUserInput` extension.
 */
interface BadUserInputExtension {
  code: "BAD_USER_INPUT";
  exception: {
    invalidArgs: InvalidArgsMap;
  };
}

/**
 * Map server `ValidationError` to a translation message.
 */
const validationMap = {
  TOO_SHORT: VALIDATION_TOO_SHORT,
  REQUIRED: VALIDATION_REQUIRED,
};

/**
 * BadUserInputError wraps the `BAD_USER_INPUT` error returned from the
 * server.
 */
export default class BadUserInputError extends Error {
  // Keep origin of original server response.
  public readonly origin: BadUserInputExtension;

  constructor(error: BadUserInputExtension) {
    super("Form Arguments invalid");

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadUserInputError);
    }

    this.origin = error;
  }

  get invalidArgs(): InvalidArgsMap {
    return this.origin.exception.invalidArgs;
  }

  get invalidArgsLocalized(): InvalidArgsMapLocalilzed {
    return this.computeInvalidArgsLocalized();
  }

  // Perform localization and memoize result.
  private computeInvalidArgsLocalized = once(() => {
    return mapValues(this.invalidArgs, v => {
      if (v in validationMap) {
        return validationMap[v]();
      }
      return v;
    });
  });
}
