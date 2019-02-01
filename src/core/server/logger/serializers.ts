import { stdSerializers } from "bunyan";
import { GraphQLError } from "graphql";
import StackUtils from "stack-utils";

import { TalkError, TalkErrorContext } from "talk-server/errors";

interface SerializedError {
  id?: string;
  message: string;
  name: string;
  stack?: string;
  context?: TalkErrorContext;
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
  } else if (err instanceof TalkError) {
    // Copy over the TalkError specific details.
    obj.id = err.id;
    obj.context = err.context;

    // If the error was caused by another error, integrate it.
    const cause = err.cause();
    if (cause) {
      obj.originalError = errSerializer(cause);
    }
  }

  return obj;
};

export default {
  ...stdSerializers,
  err: errSerializer,
};
