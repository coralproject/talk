declare module "relay-local-schema" {
  import { GraphQLSchema } from "graphql";
  import { INetwork as RelayNetwork, FetchFunction } from "relay-runtime";

  interface CreateArguments {
    schema: GraphQLSchema;
    rootValue?: any;
    contextValue?: any;
  }

  export class Network {
    static create(data: CreateArguments): RelayNetwork;
  }

  export function createFetch(data: CreateArguments): FetchFunction;
}
