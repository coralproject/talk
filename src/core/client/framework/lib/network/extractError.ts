import { ERROR_TYPES } from "talk-common/errors";

import {
  InvalidRequestError,
  ModerationNudgeError,
  UnknownServerError,
} from "../errors";

interface TalkError {
  type: string;
  code: string;
  message: string;
}

function isTalkError(err: any): err is TalkError {
  return err.type && err.code && err.message;
}

export default function extractError(
  err: TalkError,
  unknownErrorMessage: string = "Unknown error"
): Error {
  if (!isTalkError(err)) {
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
