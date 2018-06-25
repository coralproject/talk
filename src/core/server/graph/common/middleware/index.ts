import { resolveGraphqlOptions } from "apollo-server-core";
import {
  ExpressGraphQLOptionsFunction,
  graphqlExpress,
  GraphQLOptions,
} from "apollo-server-express";
import { FieldDefinitionNode, GraphQLError, ValidationContext } from "graphql";
import { Config } from "talk-server/config";

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

export const graphqlMiddleware = (
  config: Config,
  baseOptions: GraphQLOptions | ExpressGraphQLOptionsFunction
) => {
  // Generate the validation rules.
  const validationRules: Array<(context: ValidationContext) => any> = [];

  if (config.get("env") === "production") {
    // Disable introspection in production.
    validationRules.push(NoIntrospection);
  }

  // Generate the actual middleware.
  return graphqlExpress(async (req, res) => {
    // Resolve the base options.
    const requestOptions = await resolveGraphqlOptions(baseOptions, req, res);

    // Apply the validators, sourced from: https://github.com/apollographql/apollo-server/blob/958846887598491fadea57b3f9373d129300f250/packages/apollo-server-core/src/ApolloServer.ts#L104-L107
    requestOptions.validationRules = requestOptions.validationRules
      ? requestOptions.validationRules.concat(validationRules)
      : validationRules;

    return requestOptions;
  });
};
