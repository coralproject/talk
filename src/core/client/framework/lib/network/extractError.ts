import { ERROR_TYPES } from "talk-common/errors";

import {
  InvalidRequestError,
  ModerationNudgeError,
  UnknownServerError,
} from "../errors";

export default function extractError(errors: Error[]): Error | null {
  if (errors.length > 1 || !(errors[0] as any).extensions) {
    // Multiple errors are GraphQL errors.
    // TODO: (cvle) Is this assumption correct?
    // No extensions == GraphQL error.
    // TODO: (cvle) harmonize with server.
    return null;
  }
  // Handle custom errors here.
  const err = errors[0];
  if ((err as any).extensions.type === ERROR_TYPES.INVALID_REQUEST_ERROR) {
    return new InvalidRequestError((err as any).extensions);
  }
  if ((err as any).extensions.type === ERROR_TYPES.MODERATION_NUDGE_ERROR) {
    return new ModerationNudgeError((err as any).extensions);
  }
  return new UnknownServerError(err.message, (err as any).extensions);
}
