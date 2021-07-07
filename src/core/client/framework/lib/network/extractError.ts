import { ERROR_TYPES } from "coral-common/errors";

import {
  InvalidRequestError,
  ModerationNudgeError,
  UnknownServerError,
} from "../errors";

interface CoralError {
  type: string;
  code: string;
  message: string;
  traceID: string;
}

function isCoralError(err: any): err is CoralError {
  return err.type && err.code && err.message;
}

export default function extractError(
  err: CoralError,
  unknownErrorMessage = "Unknown error"
): Error {
  if (!isCoralError(err)) {
    return new UnknownServerError(unknownErrorMessage, err);
  }
  if (err.type === ERROR_TYPES.INVALID_REQUEST_ERROR) {
    return new InvalidRequestError(err as any);
  }
  if (err.type === ERROR_TYPES.MODERATION_NUDGE_ERROR) {
    return new ModerationNudgeError(err as any);
  }
  return new UnknownServerError(err.message, err);
}
