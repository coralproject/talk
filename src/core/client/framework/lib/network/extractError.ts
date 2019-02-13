import { InvalidRequestError, UnknownServerError } from "../errors";

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
  if ((err as any).extensions.type === "invalid_request_error") {
    return new InvalidRequestError((err as any).extensions);
  }
  return new UnknownServerError(err.message, (err as any).extensions);
}
