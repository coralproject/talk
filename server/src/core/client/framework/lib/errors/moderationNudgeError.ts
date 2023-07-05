import { ERROR_CODES } from "coral-common/errors";

import TraceableError from "./traceableError";

/**
 * Shape of the `ModerationNudge` extension as
 * the client requires. Note: the only crucial
 * field is the `code` field.
 */
interface ModerationNudgeExtensions {
  code: ERROR_CODES;
  message?: string;
  id?: string;
  traceID: string;
}

/**
 * ModeratioNudgeError wraps the `MODERATION_NUDGE_ERROR` error returned from the
 * server.
 */
export default class ModeratioNudgeError
  extends TraceableError
  implements ModerationNudgeExtensions
{
  // Keep extension of original server response.
  public readonly extensions: ModerationNudgeExtensions;
  public readonly code: ERROR_CODES;
  public readonly id?: string;
  public readonly message: string;

  constructor(extensions: ModerationNudgeExtensions) {
    super("ModeratioNudgeError", extensions.traceID);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ModeratioNudgeError);
    }
    this.extensions = extensions;
    this.code = extensions.code;
    this.id = extensions.id;
    this.message = extensions.message || extensions.code;
  }
}
