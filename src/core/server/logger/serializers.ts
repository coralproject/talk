import { stdSerializers } from "bunyan";
import { GraphQLError } from "graphql";
import StackUtils from "stack-utils";

import { InternalError, TalkError, TalkErrorContext } from "talk-server/errors";

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

  if (err instanceof TalkError) {
    // Copy over the TalkError specific details.
    obj.id = err.id;
    obj.context = err.context;
  }

  // If there was an originalError because this was an InternalError or a
  // GraphQL error, then also serialize the original error.
  if (err instanceof GraphQLError || err instanceof InternalError) {
    if (err.originalError) {
      obj.originalError = errSerializer(err.originalError);
    }
  }

  return obj;
};

export default {
  ...stdSerializers,
  err: errSerializer,
};
