import { GraphQLExtension, GraphQLOptions } from "apollo-server-express";
import { Handler } from "express";
import { FieldDefinitionNode, GraphQLError, ValidationContext } from "graphql";

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
import { Metrics } from "coral-server/services/metrics";

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
const graphqlMiddleware = (
  config: Config,
  requestOptions: ExpressGraphQLOptionsFunction,
  metrics?: Metrics
): Handler => {
  const extensions: Array<() => GraphQLExtension> = [
    () => new ErrorWrappingExtension(),
    () => new LoggerExtension(),
  ];

  // Add the metrics extension if provided.
  if (metrics) {
    extensions.push(
      () =>
        // Pass the metrics to the extension so it can increment.
        new MetricsExtension(metrics)
    );
  }

  // Create a new baseOptions that will be merged into the new options.
  const baseOptions: Omit<GraphQLOptions, "schema"> = {
    // Disable the debug mode, as we already add in our logging function.
    debug: false,
    extensions,
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

export default graphqlMiddleware;
