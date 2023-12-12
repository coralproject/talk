import { modifyQuery } from "coral-framework/utils";

export default function getURLWithCommentID(
  storyURL: string,
  commentID?: string,
  view?: string
) {
  return modifyQuery(storyURL, { commentID, view });
}
