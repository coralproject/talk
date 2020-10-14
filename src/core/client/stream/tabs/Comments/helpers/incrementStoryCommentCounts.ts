import { RecordSourceProxy } from "relay-runtime";

export default function incrementStoryCommentCounts(
  store: RecordSourceProxy,
  storyID: string,
  increment = 1
) {
  // Updating Comment Count
  const story = store.get(storyID);
  if (story) {
    const record = story.getLinkedRecord("commentCounts");
    if (record) {
      // TODO: when we have moderation, we'll need to be careful here.
      const currentCount = record.getValue("totalPublished");
      record.setValue((currentCount as number) + increment, "totalPublished");
    }
  }
}
