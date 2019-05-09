import { ExecutionArgs, GraphQLError } from "graphql";
import {
  EndHandler,
  GraphQLExtension,
  GraphQLResponse,
} from "graphql-extensions";
import now from "performance-now";

import CommonContext from "talk-server/graph/common/context";
import { getOperationMetadata } from "./helpers";

export function logError(ctx: CommonContext, err: GraphQLError) {
  ctx.logger.error({ err }, "graphql query error");
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
        o.executionArgs.contextValue.logger.debug(
          {
            responseTime,
            ...getOperationMetadata(o.executionArgs.document),
          },
          "graphql query"
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
