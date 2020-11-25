import { addResolversToSchema } from "@graphql-tools/schema";
import { IResolvers, IResolverValidationOptions } from "@graphql-tools/utils";
import { getGraphQLProjectConfig } from "graphql-config";

export default function loadSchema(
  projectName: string,
  resolvers: IResolvers,
  options?: IResolverValidationOptions
) {
  // Load the configuration from the provided `.graphqlconfig` file.
  const config = getGraphQLProjectConfig(__dirname, projectName);

  // Get the GraphQLSchema from the configuration.
  const schema = config.getSchema();

  // Attach the resolvers to the schema.
  return addResolversToSchema(schema, resolvers, options);
}
