import { GraphQLResponseErrors } from "react-relay-network-modern/es";

import MultiError from "../errors/multiError";
import extractError from "./extractError";

interface GraphQLErrorWithExtension {
  extensions: any;
}

function isGraphQLErrorWithExtension(
  err: any
): err is GraphQLErrorWithExtension {
  return Boolean(err && err.extensions);
}

export default function extractGraphQLError(
  errors: GraphQLResponseErrors
): Error | null {
  if (errors.length > 1) {
    // Multiple errors are GraphQL errors.
    // TODO: (cvle) Is this assumption correct?
    return new MultiError(errors);
  }
  const err = errors[0];
  if (!isGraphQLErrorWithExtension(err)) {
    // No extensions == GraphQL error.
    // TODO: (cvle) harmonize with server.
    throw new Error("expected a GraphQL error with extension");
  }
  return extractError(err.extensions, err.message);
}
