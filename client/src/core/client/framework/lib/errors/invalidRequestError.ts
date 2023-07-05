import { FORM_ERROR } from "final-form";

import { ERROR_CODES } from "coral-common/errors";

import TraceableError from "./traceableError";

/**
 * Shape of the `InvalidRequest` extension as
 * the client requires. Note: the only crucial
 * field is the `code` field.
 */
interface InvalidRequestExtensions {
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
export default class InvalidRequestError
  extends TraceableError
  implements InvalidRequestExtensions
{
  // Keep extension of original server response.
  public readonly extensions: InvalidRequestExtensions;
  public readonly code: ERROR_CODES;
  public readonly id?: string;
  public readonly param?: string;
  public readonly message: string;

  constructor(extensions: InvalidRequestExtensions) {
    super("InvalidRequestError", extensions.traceID);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidRequestError);
    }

    this.extensions = extensions;
    this.code = extensions.code;
    this.id = extensions.id;
    this.param = extensions.param;
    this.message = extensions.message || extensions.code;
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
