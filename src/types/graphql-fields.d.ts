declare module "graphql-fields" {
  import { GraphQLResolveInfo } from "graphql";

  export default function graphqlFields<T>(
    info: GraphQLResolveInfo
  ): { [P in keyof T]: any };
}
