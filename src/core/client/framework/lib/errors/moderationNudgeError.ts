import { ERROR_CODES } from "coral-common/errors";

import TraceableError from "./traceableError";

/**
 * Shape of the `ModerationNudge` extension as
 * the client requires. Note: the only crucial
 * field is the `code` field.
 */
interface ModerationNudgeExtension {
  code: ERROR_CODES;
  message?: string;
  id?: string;
  traceID: string;
}

/**
 * ModeratioNudgeError wraps the `MODERATION_NUDGE_ERROR` error returned from the
 * server.
 */
export default class ModeratioNudgeError extends TraceableError
  implements ModerationNudgeExtension {
  // Keep extension of original server response.
  public readonly extension: ModerationNudgeExtension;
  public readonly code: ERROR_CODES;
  public readonly id?: string;
  public readonly message: string;
  public readonly extensions: string;

  constructor(extension: ModerationNudgeExtension) {
    super("ModeratioNudgeError", extension.traceID);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ModeratioNudgeError);
    }
    this.extension = extension;
    this.code = extension.code;
    this.id = extension.id;
    this.message = extension.message || extension.code;
  }
}
