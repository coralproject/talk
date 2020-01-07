import { Publisher } from "coral-server/graph/subscriptions/publisher";
import {
  Comment,
  hasModeratorStatus,
  hasPublishedStatus,
} from "coral-server/models/comment";
import { CommentModerationQueueCounts } from "coral-server/models/story";
import {
  publishCommentReleased,
  publishCommentStatusChanges,
  publishModerationQueueChanges,
} from "coral-server/services/events";

interface PublishChangesInput {
  before?: Readonly<Comment>;
  after: Readonly<Comment>;
  moderationQueue: CommentModerationQueueCounts;
  moderatorID: string | null;
}

export default async function publishChanges(
  publish: Publisher,
  input: PublishChangesInput
) {
  // Publish changes.
  publishModerationQueueChanges(publish, input.moderationQueue, input.after);

  // If this was a change, and it has a "before" state for the comment, process
  // those updates too.
  if (input.before) {
    publishCommentStatusChanges(
      publish,
      input.before.status,
      input.after.status,
      input.after.id,
      input.moderatorID
    );

    if (hasModeratorStatus(input.before) && hasPublishedStatus(input.after)) {
      publishCommentReleased(publish, input.after);
    }
  }
}
