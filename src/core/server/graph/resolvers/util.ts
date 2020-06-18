import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { pull } from "lodash";

import { reconstructTenantURL } from "coral-server/app/url";

import GraphContext from "../context";

/**
 * getRequestedFields returns the fields in an array that are being queried for.
 *
 * @param info query information
 */
export function getRequestedFields<T>(info: GraphQLResolveInfo) {
  return pull(Object.keys(graphqlFields<T>(info)), "__typename");
}

export function reconstructTenantURLResolver<T = any>(path: string) {
  return (parent: T, args: unknown, ctx: GraphContext) =>
    reconstructTenantURL(ctx.config, ctx.tenant, ctx.req, path);
}
