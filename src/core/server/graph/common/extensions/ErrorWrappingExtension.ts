import { GraphQLError } from "graphql";
import { GraphQLExtension, GraphQLResponse } from "graphql-extensions";
import { merge } from "lodash";

import { CoralError, InternalError } from "coral-server/errors";
import CommonContext from "coral-server/graph/common/context";

function hoistCoralErrorExtensions(
  ctx: CommonContext,
  err: GraphQLError
): void {
  if (!err.originalError) {
    // Only errors that have an originalError need to be hoisted.
    return;
  }

  // Grab or wrap the originalError so that it's a CoralError.
  const originalError: CoralError =
    err.originalError instanceof CoralError
      ? err.originalError
      : new InternalError(err.originalError, "wrapped internal error");

  // Get the translation bundle.
  const bundle = ctx.i18n.getBundle(ctx.lang);

  // Translate the extensions.
  const extensions = originalError.serializeExtensions(bundle);

  // Hoist the message from the original error into the message of the base
  // error.
  err.message = extensions.message;

  // Re-hoist the extensions.
  merge(err.extensions, extensions);

  return;
}

/**
 * enrichAndLogError will enrich and then log out the error.
 *
 * @param ctx the GraphQL context for the request
 * @param err the error that occurred
 */
export function enrichError(
  ctx: CommonContext,
  err: GraphQLError
): GraphQLError {
  if (err.extensions) {
    // Delete the exception field from the error extension, we never need to
    // provide that data.
    if (err.extensions.exception) {
      delete err.extensions.exception;
    }

    if (err.originalError) {
      // Hoist the extensions onto the error.
      hoistCoralErrorExtensions(ctx, err);
    }
  }

  return err;
}

export class ErrorWrappingExtension implements GraphQLExtension<CommonContext> {
  public willSendResponse(o: {
    graphqlResponse: GraphQLResponse;
    context: CommonContext;
  }): void | { graphqlResponse: GraphQLResponse; context: CommonContext } {
    if (o.graphqlResponse.errors) {
      return {
        ...o,
        graphqlResponse: {
          ...o.graphqlResponse,
          errors: o.graphqlResponse.errors.map(err =>
            enrichError(o.context, err)
          ),
        },
      };
    }
  }
}
