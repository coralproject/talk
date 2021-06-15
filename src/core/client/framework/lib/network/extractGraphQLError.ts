import { GraphQLResponseErrors } from "react-relay-network-modern/es";

import extractError from "./extractError";

interface GraphQLErrorWithExtension {
  extensions: any;
}

function isGraphQLErrorWithExtension(
  err: any
): err is GraphQLErrorWithExtension {
  return Boolean(err && err.extensions);
}

class MultiError implements Error {
  public traceIDs: string[];

  public name: string;
  public message: string;

  constructor(errors: GraphQLResponseErrors) {
    this.traceIDs = [];
    this.name = "GraphQLResponseError";
    this.message = "";

    const messages: string[] = [];

    errors.forEach((e: { message: string }) => {
      if (e) {
        const traceID = (e as any).traceID as string;

        if (traceID && !this.traceIDs.includes(traceID)) {
          this.traceIDs.push(traceID);
        }

        messages.push(e.message);
      }
    });

    this.message = messages.join(", ");
  }
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
    return new MultiError(errors);
  }
  return extractError(err.extensions, err.message);
}
