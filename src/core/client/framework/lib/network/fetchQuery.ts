import { FetchFunction } from "relay-runtime";

import {
  BadUserInputError,
  GraphQLError,
  NetworkError,
  UnknownServerError,
} from "../errors";

// Normalize errors.
function getError(errors: Error[]): Error {
  if (errors.length > 1) {
    // Multiple errors are GraphQL errors.
    // TODO: (cvle) Is this assumption correct?
    return new GraphQLError(errors as any);
  }
  const err = errors[0] as Error;
  if ((err as any).extensions) {
    if ((err as any).code === "BAD_USER_INPUT") {
      return new BadUserInputError((err as any).extensions);
    }
    return new UnknownServerError(err.message, (err as any).extensions);
  }
  // No extensions == GraphQL error.
  // TODO: (cvle) harmonize with server.
  return new GraphQLError(errors as any);
}

/**
 * fetchQuery is a simple implementation of the `FetchFunction`
 * required by Relay. It'll return a `NetworkError` on failure.
 */
const fetchQuery: FetchFunction = async (operation, variables) => {
  try {
    const response = await fetch("/api/tenant/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    });
    const data = await response.json();
    if (data.errors) {
      throw getError(data.errors);
    }
    return data;
  } catch (err) {
    throw new NetworkError(err);
  }
};

export default fetchQuery;
