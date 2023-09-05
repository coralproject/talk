import { GraphQLResponseErrors } from "react-relay-network-modern/es";

import extractTraceableError from "../network/extractTraceableError";
import TraceableError from "./traceableError";

class MultiError extends TraceableError {
  public readonly errors: TraceableError[];

  constructor(errors: GraphQLResponseErrors) {
    if (errors.length < 2) {
      throw new Error("MultiError must have at least 2 errors");
    }

    const errHold = errors.map((e) => extractTraceableError(e as Error));

    const messages = errHold.map((e) => e.message).join(", ");
    const traceID = errHold[0].traceID;
    super(messages, traceID);

    this.errors = errHold;
  }
}

export default MultiError;
