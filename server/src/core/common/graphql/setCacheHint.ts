import { CacheHint, CacheScope } from "apollo-cache-control";
import { GraphQLResolveInfo } from "graphql";

export default function setCacheHint(
  info: GraphQLResolveInfo,
  cacheHint: CacheHint = { scope: CacheScope.Private }
) {
  if (info.cacheControl) {
    info.cacheControl.setCacheHint(cacheHint);
  }
}
