import { GraphQLSchema } from "graphql";

export interface Schemas {
  management: GraphQLSchema;
  tenant: GraphQLSchema;
}
