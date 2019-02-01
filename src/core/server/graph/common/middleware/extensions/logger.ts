import {
  DocumentNode,
  ExecutionArgs,
  GraphQLError,
  OperationDefinitionNode,
} from "graphql";
import {
  EndHandler,
  GraphQLExtension,
  GraphQLResponse,
} from "graphql-extensions";
import now from "performance-now";

import { TalkError } from "talk-server/errors";
import CommonContext from "talk-server/graph/common/context";

/**
 * enrichAndLogError will enrich and then log out the error.
 *
 * @param ctx the GraphQL context for the request
 * @param err the error that occurred
 */
function enrichAndLogError(
  ctx: CommonContext,
  err: GraphQLError
): GraphQLError {
  if (err.extensions) {
    // Translate the error message if we can.
    if (err.originalError && err.originalError instanceof TalkError) {
      // Get the translation bundle.
      const bundle = ctx.i18n.getBundle(ctx.lang);

      // Provide the translated message.
      err.originalError.translateMessage(bundle);

      // Re-hoist the message from the extensions.
      err.extensions.message = err.originalError.extensions.message;
    } else {
      // Default to the message on the error.
      err.extensions.message = err.message;
    }

    // Delete the exception field from the error extension, we never need to
    // provide that data.
    if (err.extensions && err.extensions.exception) {
      delete err.extensions.exception;
    }
  }

  ctx.logger.error({ err }, "graphql query error");

  return err;
}

export class LoggerExtension implements GraphQLExtension<CommonContext> {
  private getOperationMetadata(doc: DocumentNode) {
    if (doc.kind === "Document") {
      const operationDefinition = doc.definitions.find(
        ({ kind }) => kind === "OperationDefinition"
      ) as OperationDefinitionNode | undefined;
      if (operationDefinition) {
        let operationName: string | undefined;
        if (operationDefinition.name) {
          operationName = operationDefinition.name.value;
        }

        return {
          operationName,
          operation: operationDefinition.operation,
        };
      }
    }

    return {};
  }

  public executionDidStart(o: {
    executionArgs: ExecutionArgs;
  }): EndHandler | void {
    // Only try to log things if the context is provided.
    if (o.executionArgs.contextValue) {
      // Grab the start time so we can calculate the time it takes to execute
      // the graph query.
      const startTime = now();
      return () => {
        // Compute the end time.
        const responseTime = Math.round(now() - startTime);

        // Log out the details of the request.
        o.executionArgs.contextValue.logger.debug(
          {
            responseTime,
            ...this.getOperationMetadata(o.executionArgs.document),
          },
          "graphql query"
        );
      };
    }
  }

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
            enrichAndLogError(o.context, err)
          ),
        },
      };
    }
  }
}
