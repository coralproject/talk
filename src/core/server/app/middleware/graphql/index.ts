import { GraphQLOptions } from "apollo-server-express";
import { Handler } from "express";
import { FieldDefinitionNode, GraphQLError, ValidationContext } from "graphql";
import { Counter, Histogram } from "prom-client";

// TODO: when https://github.com/apollographql/apollo-server/pull/1907 is merged, update this import path
import {
  ExpressGraphQLOptionsFunction,
  graphqlExpress,
} from "apollo-server-express/dist/expressApollo";

import { Omit } from "coral-common/types";
import { Config } from "coral-server/config";
import {
  ErrorWrappingExtension,
  LoggerExtension,
  MetricsExtension,
} from "coral-server/graph/common/extensions";

export * from "./batch";

// Sourced from: https://github.com/apollographql/apollo-server/blob/958846887598491fadea57b3f9373d129300f250/packages/apollo-server-core/src/ApolloServer.ts#L46-L57
const NoIntrospection = (context: ValidationContext) => ({
  Field(node: FieldDefinitionNode) {
    if (node.name.value === "__schema" || node.name.value === "__type") {
      context.reportError(
        new GraphQLError(
          "GraphQL introspection is not allowed in production, but the query contained __schema or __type.",
          [node]
        )
      );
    }
  },
});

/**
 * graphqlMiddleware wraps the GraphQL middleware server with some custom
 * extension management.
 *
 * @param config application configuration
 * @param requestOptions options to pass to the graphql server
 */
export const graphqlMiddleware = (
  config: Config,
  requestOptions: ExpressGraphQLOptionsFunction
): Handler => {
  // Configure the metrics handlers.
  const executedGraphQueriesTotalCounter = new Counter({
    name: "coral_executed_graph_queries_total",
    help: "number of GraphQL queries executed",
    labelNames: ["operation_type", "operation_name"],
  });

  const graphQLExecutionTimingsHistogram = new Histogram({
    name: "coral_executed_graph_queries_timings",
    help: "timings for execution times of GraphQL operations",
    buckets: [0.1, 5, 15, 50, 100, 500],
    labelNames: ["operation_type", "operation_name"],
  });

  // Create a new baseOptions that will be merged into the new options.
  const baseOptions: Omit<GraphQLOptions, "schema"> = {
    // Disable the debug mode, as we already add in our logging function.
    debug: false,
    // Include extensions.
    extensions: [
      () => new ErrorWrappingExtension(),
      () => new LoggerExtension(),
      () =>
        // Pass the metrics to the extension so it can increment.
        new MetricsExtension({
          executedGraphQueriesTotalCounter,
          graphQLExecutionTimingsHistogram,
        }),
    ],
  };

  if (config.get("env") === "production" && !config.get("enable_graphiql")) {
    // Disable introspection in production.
    baseOptions.validationRules = [NoIntrospection];
  }

  // Generate the actual middleware.
  return graphqlExpress(async (req, res) => {
    // Resolve the options for the GraphQL middleware.
    const options = await requestOptions(req, res);

    // Provide the options.
    return {
      ...options,
      ...baseOptions,
    };
  });
};
