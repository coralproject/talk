import { addResolversToSchema } from "@graphql-tools/schema";
import { IResolvers, IResolverValidationOptions } from "@graphql-tools/utils";
import { loadConfigSync } from "graphql-config";

export default function loadSchema(
  projectName: string,
  resolvers: IResolvers,
  options?: IResolverValidationOptions
) {
  // Load the configuration from the provided `graphql-config` configuration file.
  const config = loadConfigSync({});
  const project = config.getProject(projectName);
  const schema = project.getSchemaSync();

  // Attach the resolvers to the schema.
  return addResolversToSchema(schema, resolvers, options);
}
