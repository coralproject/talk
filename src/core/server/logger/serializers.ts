import { stdSerializers } from "bunyan";
import { GraphQLError } from "graphql";
import StackUtils from "stack-utils";

interface SerializedError {
  message: string;
  name: string;
  stack?: string;
  extensions?: Record<string, any>;
  originalError?: SerializedError;
}

const stackUtils = new StackUtils();

const errSerializer = (err: Error) => {
  const obj: SerializedError = {
    message: err.message,
    name: err.name,
  };

  if (err.stack) {
    obj.stack = stackUtils.clean(err.stack);
  }

  if (err instanceof GraphQLError) {
    if (err.extensions) {
      obj.extensions = err.extensions;
    }

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
