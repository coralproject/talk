import { Config } from "coral-server/config";
import { DataCache } from "coral-server/data/cache/dataCache";
import { MongoContext } from "coral-server/data/context";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import { getLatestRevision } from "coral-server/models/comment";
import { retrieveNotificationByCommentReply } from "coral-server/models/notifications/notification";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import { retrieveComment } from "coral-server/services/comments";
import { moderate } from "coral-server/services/comments/moderation";
import { I18n } from "coral-server/services/i18n";
import { InternalNotificationContext } from "coral-server/services/notifications/internal/context";
import { AugmentedRedis } from "coral-server/services/redis";
import { submitCommentAsNotSpam } from "coral-server/services/spam";
import { Request } from "coral-server/types/express";

import {
  GQLCOMMENT_STATUS,
  GQLNOTIFICATION_TYPE,
} from "coral-server/graph/schema/__generated__/types";

import { publishChanges } from "./helpers";

const approveComment = async (
  mongo: MongoContext,
  redis: AugmentedRedis,
  cache: DataCache,
  config: Config,
  i18n: I18n,
  broker: CoralEventPublisherBroker,
  notifications: InternalNotificationContext,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  moderatorID: string,
  now: Date,
  request?: Request | undefined,
  createNotification = true
) => {
  const updateAllCommentCountsArgs = { actionCounts: {} };

  // Get comment status before approval
  const previousComment = await retrieveComment(mongo, tenant.id, commentID);

  // Approve the comment.
  const { result, counts } = await moderate(
    mongo,
    redis,
    config,
    i18n,
    tenant,
    {
      commentID,
      commentRevisionID,
      moderatorID,
      status: GQLCOMMENT_STATUS.APPROVED,
    },
    now,
    undefined,
    updateAllCommentCountsArgs,
    previousComment?.status
  );

  const revision = getLatestRevision(result.before);
  if (
    revision &&
    tenant.integrations.akismet.enabled &&
    (revision.actionCounts.COMMENT_REPORTED_SPAM > 0 ||
      revision.actionCounts.COMMENT_DETECTED_SPAM > 0)
  ) {
    await submitCommentAsNotSpam(mongo, tenant, result.before, request);
  }

  // If the comment hasn't been updated, skip the rest of the steps.
  if (!result.after) {
    return result.before;
  }

  if (counts) {
    // Publish changes to the event publisher.
    await publishChanges(broker, {
      ...result,
      ...counts,
      moderatorID,
      commentRevisionID,
    });
  }

  const cacheAvailable = await cache.available(tenant.id);
  if (cacheAvailable) {
    await cache.comments.update(result.after);
    if (result.after.authorID) {
      await cache.users.populateUsers(tenant.id, [result.after.authorID]);
    }
  }

  if (createNotification) {
    await notifications.create(tenant.id, tenant.locale, {
      targetUserID: result.after.authorID!,
      comment: result.after,
      previousStatus: result.before.status,
      type: GQLNOTIFICATION_TYPE.COMMENT_APPROVED,
    });
  }

  // if comment was previously rejected, system withheld, or in pre-mod,
  // and there is a reply notification for it, increment the notificationCount
  // for that notification's owner since it was decremented upon original
  // rejection
  if (
    previousComment?.status === GQLCOMMENT_STATUS.REJECTED ||
    previousComment?.status === GQLCOMMENT_STATUS.PREMOD ||
    previousComment?.status === GQLCOMMENT_STATUS.SYSTEM_WITHHELD
  ) {
    const replyNotification = await retrieveNotificationByCommentReply(
      mongo,
      tenant.id,
      commentID
    );
    if (replyNotification) {
      const { ownerID } = replyNotification;
      const notificationOwner = await retrieveUser(mongo, tenant.id, ownerID);
      if (notificationOwner) {
        if (
          !notificationOwner.lastSeenNotificationDate ||
          (notificationOwner.lastSeenNotificationDate &&
            notificationOwner.lastSeenNotificationDate <
              replyNotification.createdAt)
        ) {
          await notifications.incrementCountForUser(tenant.id, ownerID);
        }
      }
    }
  }

  // Return the resulting comment.
  return result.after;
};

export default approveComment;
