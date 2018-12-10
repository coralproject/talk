import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { pull } from "lodash";
import qs from "query-string";
import { URL } from "url";

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
  const query = qs.parse(url.search);
  url.search = qs.stringify({ ...query, commentID });

  return url.toString();
}
