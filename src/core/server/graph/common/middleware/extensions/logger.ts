import { formatApolloErrors } from "apollo-server-errors";
import { GraphQLError } from "graphql";
import { GraphQLExtension, GraphQLResponse } from "graphql-extensions";

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

  public requestDidStart(o: {
    operationName?: string;
    context: CommonContext;
  }) {
    o.context.logger.debug({ operationName: o.operationName }, "graphql query");
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
