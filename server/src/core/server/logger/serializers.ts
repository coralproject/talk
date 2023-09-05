import { stdSerializers } from "bunyan";
import { GraphQLError } from "graphql";
import StackUtils from "stack-utils";
import VError from "verror";

import { CoralError, CoralErrorContext } from "coral-server/errors";

interface SerializedError {
  id?: string;
  message: string;
  name: string;
  stack?: string;
  context?: CoralErrorContext | Record<string, any>;
  originalError?: SerializedError;
}

const stackUtils = new StackUtils();

const errSerializer = (err: Error) => {
  const obj: SerializedError = {
    message: err.message,
    name: err.name,
  };

  if (err.stack) {
    // Copy over a cleaned stack.
    obj.stack = stackUtils.clean(err.stack);
  }

  if (err instanceof GraphQLError && err.originalError) {
    // If the error was caused by another error, integrate it.
    obj.originalError = errSerializer(err.originalError);
  } else if (err instanceof CoralError) {
    // Copy over the CoralError specific details.
    obj.id = err.id;
    obj.context = err.context;

    // If the error was caused by another error, integrate it.
    const cause = err.cause();
    if (cause) {
      obj.originalError = errSerializer(cause);
    }
  } else if (err instanceof VError) {
    obj.context = VError.info(err);
  }

  return obj;
};

export default {
  ...stdSerializers,
  err: errSerializer,
};
