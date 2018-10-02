import { modifyQuery } from "talk-framework/utils";

export default function getURLWithCommentID(
  assetURL: string,
  commentID?: string
) {
  return modifyQuery(assetURL, { commentID });
}
