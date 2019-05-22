import { modifyQuery } from "coral-framework/utils";

export default function getURLWithCommentID(
  storyURL: string,
  commentID?: string
) {
  return modifyQuery(storyURL, { commentID });
}
