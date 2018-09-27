declare module "found-relay" {
  import { Environment } from "relay-runtime";
  export class Resolver {
    constructor(relayEnvironment: Environment);
  }
}
