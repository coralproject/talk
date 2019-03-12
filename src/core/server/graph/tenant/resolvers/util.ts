import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { pull } from "lodash";
import { URL } from "url";

import { parseQuery, stringifyQuery } from "talk-common/utils";
import { constructTenantURL, reconstructURL } from "talk-server/app/url";

import TenantContext from "../context";

/**
 * getRequestedFields returns the fields in an array that are being queried for.
 *
 * @param info query information
 */
export function getRequestedFields<T>(info: GraphQLResolveInfo) {
  return pull(Object.keys(graphqlFields<T>(info)), "__typename");
}

/**
 * getURLWithCommentID returns the url with the comment id.
 *
 * @param storyURL url of the story
 * @param commentID id of the comment
 */
export function getURLWithCommentID(storyURL: string, commentID?: string) {
  const url = new URL(storyURL);
  const query = parseQuery(url.search);
  url.search = stringifyQuery({ ...query, commentID });

  return url.toString();
}

export function reconstructTenantURLResolver<T = any>(path: string) {
  return (parent: T, args: {}, ctx: TenantContext) => {
    // If the request is available, then prefer it over building from the tenant
    // as the tenant does not include the port number. This should only really
    // be a problem if the graph API is called internally.
    if (ctx.req) {
      return reconstructURL(ctx.req, path);
    }

    // Note that when constructing the callback url with the tenant, the port
    // information is lost.
    return constructTenantURL(ctx.config, ctx.tenant, path);
  };
}
