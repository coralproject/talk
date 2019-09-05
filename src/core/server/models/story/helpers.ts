import { URL } from "url";

import { parseQuery, stringifyQuery } from "coral-common/utils";

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
