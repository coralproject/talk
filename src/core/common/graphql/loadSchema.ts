import { loadConfigSync } from "graphql-config";
import {
  addResolveFunctionsToSchema,
  IResolvers,
  IResolverValidationOptions,
} from "graphql-tools";

export default function loadSchema(
  resolvers: IResolvers,
  resolverValidationOptions?: IResolverValidationOptions
) {
  // Load the schema based on the .graphqlrc.json configuration file.
  const schema = loadConfigSync({
    throwOnEmpty: true,
    throwOnMissing: true,
  })
    .getDefault()
    .getSchemaSync();

  // Attach the resolvers to the schema.
  addResolveFunctionsToSchema({ schema, resolvers, resolverValidationOptions });

  return schema;
}
