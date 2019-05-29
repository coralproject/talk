import { RecordSourceSelectorProxy } from "relay-runtime";

export default function incrementStoryCommentCounts(
  store: RecordSourceSelectorProxy,
  storyID: string
) {
  // Updating Comment Count
  const story = store.get(storyID);
  if (story) {
    const record = story.getLinkedRecord("commentCounts");
    if (record) {
      // TODO: when we have moderation, we'll need to be careful here.
      const currentCount = record.getValue("totalVisible");
      record.setValue(currentCount + 1, "totalVisible");
    }
  }
}
