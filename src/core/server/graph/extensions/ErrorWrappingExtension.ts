import { ApolloError } from "apollo-server-core";
import { GraphQLFormattedError } from "graphql";
import { GraphQLExtension, GraphQLResponse } from "graphql-extensions";
import { merge } from "lodash";

import {
  CoralError,
  InternalDevelopmentError,
  InternalError,
} from "coral-server/errors";
import GraphContext from "coral-server/graph/context";
import { getOriginalError } from "./helpers";

function hoistCoralErrorExtensions(
  ctx: GraphContext,
  err: GraphQLFormattedError
): void {
  // Grab or wrap the originalError so that it's a CoralError.
  const originalError = getWrappedOriginalError(err, ctx);
  if (!originalError) {
    return;
  }

  // Get the translation bundle.
  const bundle = ctx.i18n.getBundle(ctx.lang);

  // Translate the extensions.
  const extensions = originalError.serializeExtensions(bundle);

  // Hoist the message from the original error into the message of the base
  // error.
  (err as any).message = extensions.message;

  // Re-hoist the extensions.
  merge(err.extensions, extensions);

  return;
}

/**
 * extractOriginalError will pull out the original error if available.
 *
 * @param err the error to have their original error extracted from.
 * @param ctx the Context to extract the environment state.
 */
function getWrappedOriginalError(
  err: GraphQLFormattedError,
  ctx: GraphContext
): CoralError | undefined {
  if (err instanceof ApolloError) {
    // ApolloError's don't need to be hoisted as they contain validation
    // messages about the graph.
    return;
  }

  const originalError = getOriginalError(err);

  if (!originalError) {
    // Only errors that have an originalError need to be hoisted.
    return;
  }

  if (originalError instanceof CoralError) {
    return originalError;
  }

  if (ctx.config.get("env") !== "production") {
    return new InternalDevelopmentError(
      originalError,
      "wrapped internal development error"
    );
  }

  return new InternalError(originalError, "wrapped internal error");
}

/**
 * enrichAndLogError will enrich and then log out the error.
 *
 * @param ctx the GraphQL context for the request
 * @param err the error that occurred
 */
export function enrichError(
  ctx: GraphContext,
  err: GraphQLFormattedError
): GraphQLFormattedError {
  if (err.extensions) {
    // Delete the exception field from the error extension, we never need to
    // provide that data.
    if (err.extensions.exception) {
      delete err.extensions.exception;
    }

    if (getOriginalError(err)) {
      // Hoist the extensions onto the error.
      hoistCoralErrorExtensions(ctx, err);
    }
  }

  return err;
}

export class ErrorWrappingExtension implements GraphQLExtension<GraphContext> {
  public willSendResponse(o: {
    graphqlResponse: GraphQLResponse;
    context: GraphContext;
  }): void | { graphqlResponse: GraphQLResponse; context: GraphContext } {
    if (o.graphqlResponse.errors) {
      return {
        ...o,
        graphqlResponse: {
          ...o.graphqlResponse,
          errors: o.graphqlResponse.errors.map((err) =>
            enrichError(o.context, err)
          ),
        },
      };
    }
  }
}
