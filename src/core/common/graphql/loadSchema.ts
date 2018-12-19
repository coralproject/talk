import { getGraphQLProjectConfig } from "graphql-config";
import {
  addResolveFunctionsToSchema,
  IResolvers,
  IResolverValidationOptions,
} from "graphql-tools";

export default function loadSchema(
  projectName: string,
  resolvers: IResolvers,
  resolverValidationOptions?: IResolverValidationOptions
) {
  // Load the configuration from the provided `.graphqlconfig` file.
  const config = getGraphQLProjectConfig(__dirname, projectName);

  // Get the GraphQLSchema from the configuration.
  const schema = config.getSchema();

  // Attach the resolvers to the schema.
  addResolveFunctionsToSchema({ schema, resolvers, resolverValidationOptions });

  return schema;
}
