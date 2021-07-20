import { RecordProxy, RecordSourceProxy } from "relay-runtime";

import { GQLTAG } from "coral-framework/schema";

/**
 * incrementStoryCommentCounts increases counts on a story.
 * CommentEdge should contain { tags { code } } in order to
 * apply tag counts as well.
 */
export default function incrementStoryCommentCounts(
  store: RecordSourceProxy,
  storyID: string,
  commentEdge: RecordProxy<any>
) {
  // Updating Comment Count
  const story = store.get(storyID);
  if (story) {
    const commentCounts = story.getLinkedRecord("commentCounts");
    if (commentCounts) {
      // Increment totalPublished.
      const currentTotalPublished = commentCounts.getValue(
        "totalPublished"
      ) as number;
      commentCounts.setValue(currentTotalPublished + 1, "totalPublished");

      // Now increment tag counts.
      const commentCountsTags = commentCounts.getLinkedRecord("tags");
      if (!commentCountsTags) {
        return;
      }
      const node = commentEdge.getLinkedRecord("node")!;
      const tags = node.getLinkedRecords("tags")!;
      for (const tag of tags) {
        const code = tag.getValue("code") as GQLTAG;
        const currentTagCount =
          (commentCountsTags.getValue(code) as number) || 0;
        commentCountsTags.setValue(currentTagCount + 1, code);
      }
    }
  }
}
