declare module "found-relay" {
  import { Resolver as FoundResolver } from "found";
  import { Environment } from "relay-runtime";
  export class Resolver implements FoundResolver {
    constructor(relayEnvironment: Environment);
    public resolveElements: FoundResolver["resolveElements"];
  }
}
