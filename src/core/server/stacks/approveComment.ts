import { MongoContext } from "coral-server/data/context";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import { getLatestRevision } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { moderate } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";
import { submitCommentAsNotSpam } from "coral-server/services/spam";
import { Request } from "coral-server/types/express";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

import { publishChanges } from "./helpers";

const approveComment = async (
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  moderatorID: string,
  now: Date,
  request?: Request | undefined
) => {
  const updateAllCommentCountsArgs = { actionCounts: {} };

  // Approve the comment.
  const { result, counts } = await moderate(
    mongo,
    redis,
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
    (revision.actionCounts.COMMENT_REPORTED_SPAM > 0 ||
      revision.actionCounts.COMMENT_DETECTED_SPAM > 0)
  ) {
    await submitCommentAsNotSpam(mongo, tenant, result.before, request);
  }

  await enableRepliesToChildren(result.before.id, mongo);

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

  // Return the resulting comment.
  return result.after;
};

const enableRepliesToChildren = async (
  commentID: string,
  mongo: MongoContext
) => {
  const children = await mongo
    .comments()
    .find({
      parentID: commentID,
    })
    .toArray();

  if (children.length === 0) {
    return;
  }

  const nonRejectedChildIDs = children
    .filter(({ status }) => status !== GQLCOMMENT_STATUS.REJECTED)
    .map(({ id }) => id);

  const allChildIDs = children.map(({ id }) => id);

  await mongo
    .comments()
    .updateMany(
      { id: { $in: allChildIDs } },
      { $set: { rejectedAncestor: false } }
    );

  await Promise.all(
    nonRejectedChildIDs.map((id) => enableRepliesToChildren(id, mongo))
  );
};

export default approveComment;
