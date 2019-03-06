declare module "found-relay" {
  import { Resolver } from "found";
  import { Environment } from "relay-runtime";
  export class Resolver implements Resolver {
    constructor(relayEnvironment: Environment);
    public resolveElements: Resolver["resolveElements"];
  }
}
