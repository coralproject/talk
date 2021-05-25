import { RecordSourceProxy } from "relay-runtime";

import { GQLTAG } from "coral-framework/schema";

export default function incrementStoryCommentCounts(
  store: RecordSourceProxy,
  storyID: string,
  increment = 1,
  tag?: GQLTAG
) {
  // Updating Comment Count
  const story = store.get(storyID);
  if (story) {
    const record = story.getLinkedRecord("commentCounts");
    if (record) {
      if (tag) {
        const tagsRecord = record.getLinkedRecord("tags");
        if (tagsRecord) {
          const currentCount = tagsRecord.getValue(tag);
          tagsRecord.setValue((currentCount as number) + increment, tag);
        }
      }
      // TODO: when we have moderation, we'll need to be careful here.
      const currentCount = record.getValue("totalPublished");
      record.setValue((currentCount as number) + increment, "totalPublished");
    }
  }
}
