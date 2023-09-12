import { GraphQLResponseErrors } from "react-relay-network-modern/es";

import MultiError from "../errors/multiError";
import TraceableError from "../errors/traceableError";
import extractTraceableError from "./extractTraceableError";

export default function parseGraphQLResponseErrors(
  errors: GraphQLResponseErrors
): TraceableError {
  if (errors.length > 1) {
    return new MultiError(errors);
  }
  return extractTraceableError(errors[0] as Error);
}
