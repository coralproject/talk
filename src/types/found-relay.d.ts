declare module "found-relay" {
  import { Resolver as FoundResolver, RouteMatch } from "found";
  import { Environment } from "relay-runtime";
  export class Resolver implements FoundResolver {
    constructor(relayEnvironment: Environment);
    public resolveElements: FoundResolver["resolveElements"];
    public getRouteVariables(match: any, routeMatches: RouteMatch);
  }
}
