import { FORM_ERROR } from "final-form";

import { ERROR_CODES } from "coral-common/errors";

import TraceableError from "./traceableError";

/**
 * Shape of the `InvalidRequest` extension as
 * the client requires. Note: the only crucial
 * field is the `code` field.
 */
interface InvalidRequestExtension {
  code: ERROR_CODES;
  message?: string;
  id?: string;
  param?: string;
  traceID: string;
}

/**
 * InvalidRequestError wraps the `INVALID_REQUEST_ERROR` error returned from the
 * server.
 */
export default class InvalidRequestError extends TraceableError
  implements InvalidRequestExtension {
  // Keep extension of original server response.
  public readonly extension: InvalidRequestExtension;
  public readonly code: ERROR_CODES;
  public readonly id?: string;
  public readonly traceID: string;
  public readonly param?: string;
  public readonly message: string;
  public readonly extensions: string;

  constructor(extension: InvalidRequestExtension) {
    super("InvalidRequestError");

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidRequestError);
    }

    this.extension = extension;
    this.code = extension.code;
    this.id = extension.id;
    this.traceID = extension.traceID;
    this.param = extension.param;
    this.message = extension.message || extension.code;
  }

  public get invalidArgs() {
    if (this.param) {
      return {
        [this.param.substr("input.".length)]: this.message,
      };
    }
    return {
      [FORM_ERROR]: this.message,
    };
  }
}
