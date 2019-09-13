import { DocumentNode, ExecutionArgs, GraphQLError } from "graphql";
import {
  EndHandler,
  GraphQLExtension,
  GraphQLResponse,
} from "graphql-extensions";
import now from "performance-now";

import CommonContext from "coral-server/graph/common/context";

import { getOperationMetadata, getPersistedQueryMetadata } from "./helpers";

export function logError(ctx: CommonContext, err: GraphQLError) {
  ctx.logger.error({ err }, "graphql query error");
}

export function logQuery(
  ctx: CommonContext,
  document: DocumentNode,
  persisted = ctx.persisted,
  responseTime?: number
) {
  ctx.logger.info(
    {
      responseTime,
      authenticated: ctx.user ? true : false,
      ...(persisted
        ? // A persisted query was provided, we can pull the operation metadata
          // out from the persisted object.
          getPersistedQueryMetadata(persisted)
        : // A persisted query was not provided, parse the operation metadata
          // out from the document.
          getOperationMetadata(document)),
    },
    "graphql query"
  );
}

export class LoggerExtension implements GraphQLExtension<CommonContext> {
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
        logQuery(
          o.executionArgs.contextValue,
          o.executionArgs.document,
          undefined,
          responseTime
        );
      };
    }
  }

  public willSendResponse(response: {
    graphqlResponse: GraphQLResponse;
    context: CommonContext;
  }): void {
    if (response.graphqlResponse.errors) {
      response.graphqlResponse.errors.forEach(err =>
        logError(response.context, err)
      );
    }
  }
}
