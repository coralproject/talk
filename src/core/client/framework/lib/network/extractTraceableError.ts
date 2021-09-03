import { ERROR_TYPES } from "coral-common/errors";

import {
  InvalidRequestError,
  ModerationNudgeError,
  UnknownServerError,
} from "../errors";
import TraceableError from "../errors/traceableError";

interface GraphQLErrorWithExtensions {
  extensions: any;
}

function isGraphQLErrorWithExtensions(
  err: any
): err is GraphQLErrorWithExtensions {
  return Boolean(err && err.extensions);
}

interface CoralErrorExtensions {
  type: string;
  code: string;
  message: string;
  traceID: string;
}

function isCoralErrorExtension(err: any): err is CoralErrorExtensions {
  return err.type && err.code && err.message;
}

function extractTraceableErrorFromExtensions(
  extensions: CoralErrorExtensions,
  origin: Error
): TraceableError {
  if (!isCoralErrorExtension(extensions)) {
    throw origin || extensions;
  }
  if (extensions.type === ERROR_TYPES.INVALID_REQUEST_ERROR) {
    return new InvalidRequestError(extensions as any);
  }
  if (extensions.type === ERROR_TYPES.MODERATION_NUDGE_ERROR) {
    return new ModerationNudgeError(extensions as any);
  }
  return new UnknownServerError(extensions as any, origin);
}

export default function extractTraceableError(error: Error): TraceableError {
  if (!isGraphQLErrorWithExtensions(error)) {
    return extractTraceableErrorFromExtensions(error as any, error);
  }
  return extractTraceableErrorFromExtensions(error.extensions, error);
}
