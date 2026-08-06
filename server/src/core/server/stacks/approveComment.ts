import { Config } from "coral-server/config";
import { DataCache } from "coral-server/data/cache/dataCache";
import { MongoContext } from "coral-server/data/context";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import {
  addCommentTag,
  Comment,
  getLatestRevision,
  hasExpertReply,
  hasTag,
} from "coral-server/models/comment";
import { retrieveNotificationByCommentReply } from "coral-server/models/notifications/notification";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import { retrieveComment } from "coral-server/services/comments";
import {
  moderate,
  PENDING_STATUS,
} from "coral-server/services/comments/moderation";
import { I18n } from "coral-server/services/i18n";
import { InternalNotificationContext } from "coral-server/services/notifications/internal/context";
import { AugmentedRedis } from "coral-server/services/redis";
import { submitCommentAsNotSpam } from "coral-server/services/spam";
import { Request } from "coral-server/types/express";
import { v4 as uuid } from "uuid";

import {
  GQLCOMMENT_STATUS,
  GQLFEATURE_FLAG,
  GQLNOTIFICATION_TYPE,
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { retrieveSite } from "coral-server/models/site";
import {
  isUserStoryExpert,
  resolveStoryMode,
  retrieveStory,
} from "coral-server/models/story";
import { ExternalNotificationsQueue } from "coral-server/queue/tasks/externalNotifications";
import { ExternalNotificationsService } from "coral-server/services/notifications/externalService";
import { buildExternalReplyNotification } from "./createComment";
import { publishChanges } from "./helpers";
import { updateTagCommentCounts } from "./helpers/updateAllCommentCounts";

const buildApproveNotification = async (
  mongo: MongoContext,
  externalNotifications: ExternalNotificationsService,
  tenant: Tenant,
  comment: Comment
) => {
  const externalNotificationsDisabledOnTenant = hasFeatureFlag(
    tenant,
    GQLFEATURE_FLAG.DISABLE_EXTERNAL_NOTIFICATIONS
  );
  if (
    !externalNotifications.active() ||
    externalNotificationsDisabledOnTenant ||
    !comment.authorID ||
    !comment.siteID
  ) {
    return null;
  }

  const author = await retrieveUser(mongo, tenant.id, comment.authorID);
  if (!author) {
    return null;
  }

  const site = await retrieveSite(mongo, tenant.id, comment.siteID);
  if (!site) {
    return null;
  }

  const story = await retrieveStory(mongo, tenant.id, comment.storyID);
  if (!story) {
    return null;
  }

  return externalNotifications.buildApprove({
    to: author,
    comment,
    story,
    site,
  });
};

/**
 * restoreUnansweredTag re-applies the UNANSWERED tag to a Q&A question that
 * had it stripped when it was rejected. Without this, a question that is
 * rejected and then approved is treated as answered for the rest of its life,
 * because being answered is represented by the absence of the tag.
 */
const restoreUnansweredTag = async (
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenant: Tenant,
  comment: Readonly<Comment>,
  now: Date
): Promise<Readonly<Comment>> => {
  // Only top level comments are questions in Q&A.
  if (comment.parentID || hasTag(comment, GQLTAG.UNANSWERED)) {
    return comment;
  }

  const story = await retrieveStory(mongo, tenant.id, comment.storyID);
  if (!story || resolveStoryMode(story.settings, tenant) !== GQLSTORY_MODE.QA) {
    return comment;
  }

  // Questions asked by an expert are never tagged as unanswered.
  if (comment.authorID && isUserStoryExpert(story.settings, comment.authorID)) {
    return comment;
  }

  // If an expert has already answered this question then it was answered
  // before the rejection, so the tag is not ours to restore.
  if (await hasExpertReply(mongo, tenant.id, comment)) {
    return comment;
  }

  const tagged = await addCommentTag(mongo, tenant.id, comment.id, {
    type: GQLTAG.UNANSWERED,
    createdAt: now,
  });

  await updateTagCommentCounts(
    tenant.id,
    comment.storyID,
    comment.siteID!,
    mongo,
    redis,
    comment.tags,
    tagged.tags
  );

  return tagged;
};

const approveComment = async (
  mongo: MongoContext,
  redis: AugmentedRedis,
  cache: DataCache,
  config: Config,
  i18n: I18n,
  broker: CoralEventPublisherBroker,
  notifications: InternalNotificationContext,
  externalNotifications: ExternalNotificationsService,
  externalNotificationsQueue: ExternalNotificationsQueue,
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
    updateAllCommentCountsArgs
  );

  const revision = getLatestRevision(result.before);
  if (
    revision &&
    tenant.integrations.akismet.enabled &&
    (revision.actionCounts.FLAG__COMMENT_REPORTED_SPAM > 0 ||
      revision.actionCounts.FLAG__COMMENT_DETECTED_SPAM > 0)
  ) {
    await submitCommentAsNotSpam(mongo, tenant, result.before, request);
  }

  // If the comment hasn't been updated, skip the rest of the steps.
  if (!result.after) {
    return result.before;
  }

  let rollingResult: Readonly<Comment> = result.after;

  // Rejecting a comment strips its UNANSWERED tag, so a question coming back
  // out of the rejected state needs that tag restored.
  if (previousComment?.status === GQLCOMMENT_STATUS.REJECTED) {
    rollingResult = await restoreUnansweredTag(
      mongo,
      redis,
      tenant,
      rollingResult,
      now
    );
  }

  if (counts) {
    // Publish changes to the event publisher.
    await publishChanges(broker, {
      before: result.before,
      after: rollingResult,
      ...counts,
      moderatorID,
      commentRevisionID,
    });
  }

  const cacheAvailable = await cache.available(tenant.id);
  if (cacheAvailable) {
    await cache.comments.update(rollingResult);
    if (rollingResult.authorID) {
      await cache.users.populateUsers(tenant.id, [rollingResult.authorID]);
    }
  }

  // only create notification upon approval of comments with previous pending status
  if (createNotification && PENDING_STATUS.includes(result.before.status)) {
    await notifications.create(tenant.id, tenant.locale, {
      targetUserID: result.after.authorID!,
      comment: result.after,
      previousStatus: result.before.status,
      type: GQLNOTIFICATION_TYPE.COMMENT_APPROVED,
    });

    const extToSend: any[] = [
      await buildApproveNotification(
        mongo,
        externalNotifications,
        tenant,
        result.after
      ),
    ];

    if (result.after.parentID) {
      extToSend.push(
        await buildExternalReplyNotification(
          mongo,
          externalNotifications,
          tenant,
          result.after
        )
      );
    }

    await externalNotificationsQueue.add({
      tenantID: tenant.id,
      taskID: uuid(),
      notifications: extToSend,
    });
  }

  // create notification if dsa enabled upon approval of previously rejected comment
  if (
    tenant.dsa?.enabled &&
    previousComment?.status === GQLCOMMENT_STATUS.REJECTED
  ) {
    await notifications.create(tenant.id, tenant.locale, {
      targetUserID: result.after.authorID!,
      comment: result.after,
      previousStatus: result.before.status,
      type: GQLNOTIFICATION_TYPE.PREVIOUSLY_REJECTED_COMMENT_APPROVED,
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
  return rollingResult;
};

export default approveComment;
