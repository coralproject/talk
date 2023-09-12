import { ApolloServerPlugin } from "apollo-server-plugin-base";

import GraphContext from "../context";
import { enrichError } from "./helpers";

export const ErrorApolloServerPlugin: ApolloServerPlugin<GraphContext> = {
  requestDidStart() {
    return {
      willSendResponse({ response, context }) {
        // If there's any errors on the response, we need to enrich their
        // extensions with translated messages.
        if (response.errors) {
          response.errors = response.errors.map((err) =>
            enrichError(context, err)
          );
        }
      },
    };
  },
};

export default ErrorApolloServerPlugin;
