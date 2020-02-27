import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import {
  Comment,
  CommentModerationQueueCounts,
  hasModeratorStatus,
  hasPublishedStatus,
} from "coral-server/models/comment";
import {
  publishCommentCreated,
  publishCommentReleased,
  publishCommentReplyCreated,
  publishCommentStatusChanges,
  publishModerationQueueChanges,
} from "coral-server/services/events";

interface PublishChangesInput {
  before?: Readonly<Comment>;
  after: Readonly<Comment>;
  moderationQueue: CommentModerationQueueCounts;
  moderatorID?: string;
  commentRevisionID: string;
}

export default async function publishChanges(
  broker: CoralEventPublisherBroker,
  input: PublishChangesInput
) {
  // Publish changes.
  publishModerationQueueChanges(broker, input.moderationQueue, input.after);

  // If this was a change, and it has a "before" state for the comment, process
  // those updates too.
  if (input.before) {
    publishCommentStatusChanges(
      broker,
      input.before.status,
      input.after.status,
      input.after.id,
      input.commentRevisionID,
      input.moderatorID || null
    );

    if (hasModeratorStatus(input.before) && hasPublishedStatus(input.after)) {
      publishCommentReleased(broker, input.after);
    }
  } else {
    // This block is only hit if there is no before (if this is a new comment).

    // If this is a reply, publish it.
    if (input.after.parentID) {
      publishCommentReplyCreated(broker, input.after);
    }

    // If this comment is visible (and not a reply), publish it.
    if (!input.after.parentID && hasPublishedStatus(input.after)) {
      publishCommentCreated(broker, input.after);
    }
  }
}
