import { GQLTAG } from "coral-stream/schema";
import { RecordSourceProxy } from "relay-runtime";

export default function incrementTagCommentCounts(
  store: RecordSourceProxy,
  storyID: string,
  tag: GQLTAG,
  increment = 1
) {
  // Updating Comment Count
  const story = store.get(storyID);
  if (!story) {
    return;
  }

  const commentCounts = story.getLinkedRecord("commentCounts");
  if (!commentCounts) {
    return;
  }

  const tags = commentCounts.getLinkedRecord("tags");
  if (!tags) {
    return;
  }

  const currentCount = (tags.getValue(tag) as number) || 0;

  tags.setValue(currentCount + increment, tag);
}
