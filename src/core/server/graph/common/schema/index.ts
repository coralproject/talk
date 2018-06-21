import { addResolveFunctionsToSchema, IResolvers } from "graphql-tools";
import { getGraphQLProjectConfig } from "graphql-config";

export default function loadSchema(projectName: string, resolvers: IResolvers) {
  // Load the configuration from the provided `.graphqlconfig` file.
  const config = getGraphQLProjectConfig(__dirname, projectName);

  // Get the GraphQLSchema from the configuration.
  const schema = config.getSchema();

  // Attach the resolvers to the schema.
  addResolveFunctionsToSchema({ schema, resolvers });

  return schema;
}
