import { Middleware } from "react-relay-network-modern/es";
import { BadUserInputError, UnknownServerError } from "../errors";

function getError(errors: Error[]): Error | null {
  if (errors.length > 1 || !(errors[0] as any).extensions) {
    // Multiple errors are GraphQL errors.
    // TODO: (cvle) Is this assumption correct?
    // No extensions == GraphQL error.
    // TODO: (cvle) harmonize with server.
    return null;
  }
  const err = errors[0];
  if ((err as any).code === "BAD_USER_INPUT") {
    return new BadUserInputError((err as any).extensions);
  }
  return new UnknownServerError(err.message, (err as any).extensions);
}

const customErrorMiddleware: Middleware = next => async req => {
  const res = await next(req);
  if (req.isMutation() && res.errors) {
    // Extract custom error.
    const error = getError(res.errors);
    if (error) {
      throw error;
    }
  }
  return res;
};

export default customErrorMiddleware;
