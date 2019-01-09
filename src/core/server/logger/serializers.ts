import { ApolloError } from "apollo-server-core";
import { stdSerializers } from "bunyan";

interface SerializedError {
  message: string;
  name: string;
  stack: string;
  code: string;
  signal: string;
  extensions?: Record<string, any>;
}

export default {
  ...stdSerializers,
  err: (err: Error) => {
    const obj: SerializedError = stdSerializers.err(err);
    if (err instanceof ApolloError) {
      obj.extensions = err.extensions;
    }

    return obj;
  },
};
