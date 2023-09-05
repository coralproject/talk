import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import {
  Comment,
  CommentModerationQueueCounts,
  hasModeratorStatus,
  hasPublishedStatus,
} from "coral-server/models/comment";
import {
  publishCommentCreated,
  publishCommentEdited,
  publishCommentReleased,
  publishCommentReplyCreated,
  publishCommentReplyReleased,
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
  const promises: Promise<any>[] = [];

  // Publish changes.
  promises.push(
    publishModerationQueueChanges(broker, input.moderationQueue, input.after)
  );

  // If this was a change, and it has a "before" state for the comment, process
  // those updates too.
  if (input.before) {
    promises.push(
      publishCommentStatusChanges(
        broker,
        input.before.status,
        input.after.status,
        input.after.id,
        input.commentRevisionID,
        input.after.storyID,
        input.moderatorID || null
      )
    );

    if (hasPublishedStatus(input.after)) {
      promises.push(publishCommentEdited(broker, input.after));
    }

    if (hasModeratorStatus(input.before) && hasPublishedStatus(input.after)) {
      if (input.after.parentID) {
        promises.push(publishCommentReplyReleased(broker, input.after));
      } else {
        promises.push(publishCommentReleased(broker, input.after));
      }
    }
  } else {
    // This block is only hit if there is no before (if this is a new comment).

    // If this is a reply, publish it.
    if (input.after.parentID) {
      promises.push(publishCommentReplyCreated(broker, input.after));
    }

    // If this comment is visible (and not a reply), publish it.
    if (!input.after.parentID && hasPublishedStatus(input.after)) {
      promises.push(publishCommentCreated(broker, input.after));
    }
  }
  await Promise.all(promises);
}
