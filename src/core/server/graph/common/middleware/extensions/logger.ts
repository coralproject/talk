import { formatApolloErrors } from "apollo-server-errors";
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

import CommonContext from "talk-server/graph/common/context";

export class LoggerExtension implements GraphQLExtension<CommonContext> {
  private logError = (ctx: CommonContext) => (err: Error) => {
    if (err instanceof GraphQLError) {
      ctx.logger.error({ err: err.originalError }, "graphql error");
    } else {
      ctx.logger.error({ err }, "graphql query error");
    }

    return err;
  };

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
          errors: formatApolloErrors(o.graphqlResponse.errors, {
            formatter: this.logError(o.context),
            debug: false,
          }),
        },
      };
    }
  }
}
