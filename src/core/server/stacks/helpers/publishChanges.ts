import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import { Logger } from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import { CommentModerationQueueCounts } from "coral-server/models/story";
import {
  publishCommentReleased,
  publishCommentStatusChanges,
  publishModerationQueueChanges,
} from "coral-server/services/events";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

const publishChanges = async (
  publish: Publisher,
  moderationQueue: CommentModerationQueueCounts,
  comment: Readonly<Comment>,
  oldStatus: GQLCOMMENT_STATUS,
  newStatus: GQLCOMMENT_STATUS,
  moderatorID: string | null,
  log: Logger
) => {
  // Publish changes.
  publishModerationQueueChanges(publish, moderationQueue, comment);
  publishCommentStatusChanges(
    publish,
    oldStatus,
    newStatus,
    comment.id,
    moderatorID
  );
  if (
    [GQLCOMMENT_STATUS.PREMOD, GQLCOMMENT_STATUS.SYSTEM_WITHHELD].includes(
      oldStatus
    ) &&
    newStatus === "APPROVED"
  ) {
    publishCommentReleased(publish, comment);
  }

  log.trace({ oldStatus }, "adjusted story comment counts");
};

export default publishChanges;
