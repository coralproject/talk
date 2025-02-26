import { Config } from "coral-server/config";
import { DataCache } from "coral-server/data/cache/dataCache";
import { MongoContext } from "coral-server/data/context";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import {
  Comment,
  getLatestRevision,
  hasTag,
  UpdateCommentStatus,
} from "coral-server/models/comment";
import { retrieveNotificationByCommentReply } from "coral-server/models/notifications/notification";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import { removeTag } from "coral-server/services/comments";
import { moderate } from "coral-server/services/comments/moderation";
import { I18n } from "coral-server/services/i18n";
import { InternalNotificationContext } from "coral-server/services/notifications/internal/context";
import { AugmentedRedis } from "coral-server/services/redis";
import { submitCommentAsSpam } from "coral-server/services/spam";
import { Request } from "coral-server/types/express";

import {
  GQLCOMMENT_STATUS,
  GQLNOTIFICATION_TYPE,
  GQLREJECTION_REASON_CODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { publishChanges } from "./helpers";
import { updateTagCommentCounts } from "./helpers/updateAllCommentCounts";

const removeFromCache = async (
  cache: DataCache,
  tenantID: string,
  comment: Readonly<Comment>
) => {
  const cacheAvailable = await cache.available(tenantID);
  if (cacheAvailable) {
    await cache.comments.remove(comment);
  }
};

const stripTag = async (
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenant: Readonly<Tenant>,
  comment: Readonly<Comment>,
  tag: GQLTAG
) => {
  if (!hasTag(comment, tag)) {
    return comment;
  }

  const { comment: tagResult } = await removeTag(
    mongo,
    tenant,
    comment.id,
    tag
  );

  await updateTagCommentCounts(
    tenant.id,
    comment.storyID,
    comment.siteID!,
    mongo,
    redis,
    // Create a diff where "before" tags have the target tag and
    // the "after" does not since the previous `removeTag` took
    // away the target tag on the comment
    comment.tags,
    comment.tags.filter((t) => t.type !== tag)
  );

  return tagResult;
};

const rejectComment = async (
  mongo: MongoContext,
  redis: AugmentedRedis,
  cache: DataCache,
  config: Config,
  i18n: I18n,
  broker: CoralEventPublisherBroker | null,
  notifications: InternalNotificationContext,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  moderatorID: string,
  now: Date,
  reason?: {
    code: GQLREJECTION_REASON_CODE;
    legalGrounds?: string | undefined;
    detailedExplanation?: string | undefined;
    customReason?: string | undefined;
  },
  reportID?: string,
  request?: Request | undefined,
  sendNotification = true,
  isArchived = false
) => {
  const updateAllCommentCountsArgs = {
    actionCounts: {},
  };

  // Reject the comment.
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
      rejectionReason: reason,
      status: GQLCOMMENT_STATUS.REJECTED,
      reportID,
    },
    now,
    isArchived,
    updateAllCommentCountsArgs
  );

  const revision = getLatestRevision(result.before);
  if (
    revision &&
    tenant.integrations.akismet.enabled &&
    (revision.actionCounts.FLAG__COMMENT_REPORTED_SPAM > 0 ||
      revision.actionCounts.FLAG__COMMENT_DETECTED_SPAM > 0)
  ) {
    await submitCommentAsSpam(mongo, tenant, result.before, request);
  }

  // If the comment hasn't been updated, skip the rest of the steps.
  if (!result.after) {
    return result.before;
  }

  let rollingResult: Readonly<Comment> = result.after;

  rollingResult = await stripTag(
    mongo,
    redis,
    tenant,
    rollingResult,
    GQLTAG.FEATURED
  );

  rollingResult = await stripTag(
    mongo,
    redis,
    tenant,
    rollingResult,
    GQLTAG.UNANSWERED
  );

  await removeFromCache(cache, tenant.id, rollingResult);

  const updateStatus: UpdateCommentStatus = {
    before: result.before,
    after: rollingResult,
  };

  // TODO: (wyattjoh) (tessalt) broker cannot easily be passed to stack from tasks,
  // see CORL-935 in jira
  if (broker && counts && !isArchived) {
    // Publish changes to the event publisher.
    await publishChanges(broker, {
      ...updateStatus,
      ...counts,
      moderatorID,
      commentRevisionID,
    });
  }

  if (
    sendNotification &&
    !(reason?.code === GQLREJECTION_REASON_CODE.BANNED_WORD) &&
    tenant.dsa?.enabled
  ) {
    await notifications.create(tenant.id, tenant.locale, {
      targetUserID: result.after.authorID!,
      comment: result.after,
      rejectionReason: reason,
      type: GQLNOTIFICATION_TYPE.COMMENT_REJECTED,
      previousStatus: result.before.status,
    });
  }

  // check for a reply notification for the comment being rejected
  // if exists, check that notification user's lastSeenNotificationDate to see if less than reply createdAt
  // decrement notificationCount if so
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
        await notifications.decrementCountForUser(tenant.id, ownerID);
      }
    }
  }

  // Return the resulting comment.
  return rollingResult;
};

export default rejectComment;
