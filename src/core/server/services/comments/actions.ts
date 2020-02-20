import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { CommentNotFoundError } from "coral-server/errors";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import {
  ACTION_TYPE,
  CreateActionInput,
  createActions,
  encodeActionCounts,
  EncodedCommentActionCounts,
  invertEncodedActionCounts,
  removeAction,
  RemoveActionInput,
  retrieveUserAction,
} from "coral-server/models/action/comment";
import {
  Comment,
  retrieveComment,
  updateCommentActionCounts,
} from "coral-server/models/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { AugmentedRedis } from "coral-server/services/redis";
import {
  publishChanges,
  updateAllCommentCounts,
} from "coral-server/stacks/helpers";

import { GQLCOMMENT_FLAG_REPORTED_REASON } from "coral-server/graph/schema/__generated__/types";

export type CreateAction = CreateActionInput;

export async function addCommentActions(
  mongo: Db,
  tenant: Tenant,
  inputs: CreateAction[],
  now = new Date()
) {
  // Create each of the actions, returning each of the action results.
  const results = await createActions(mongo, tenant.id, inputs, now);

  // Get the actions that were upserted, we only want to increment the action
  // counts of actions that were just created.
  return results
    .filter(({ wasUpserted }) => wasUpserted)
    .map(({ action }) => action);
}

export async function addCommentActionCounts(
  mongo: Db,
  tenant: Tenant,
  oldComment: Readonly<Comment>,
  action: EncodedCommentActionCounts
) {
  // Grab the last revision (the most recent).
  const revision = getLatestRevision(oldComment);

  // Update the comment action counts here.
  const updatedComment = await updateCommentActionCounts(
    mongo,
    tenant.id,
    oldComment.id,
    revision.id,
    action
  );
  if (!updatedComment) {
    // TODO: (wyattjoh) return a better error.
    throw new Error("could not update comment action counts");
  }

  return updatedComment;
}

async function addCommentAction(
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  input: Omit<CreateActionInput, "storyID" | "siteID">,
  now = new Date()
): Promise<Readonly<Comment>> {
  const oldComment = await retrieveComment(mongo, tenant.id, input.commentID);
  if (!oldComment) {
    throw new CommentNotFoundError(input.commentID);
  }

  // Create the action creator input.
  const action: CreateAction = {
    ...input,
    storyID: oldComment.storyID,
    siteID: oldComment.siteID,
  };

  // Update the actions for the comment.
  const commentActions = await addCommentActions(mongo, tenant, [action], now);
  if (commentActions.length > 0) {
    // Compute the action counts.
    const actionCounts = encodeActionCounts(...commentActions);

    // Update the comment action counts.
    const updatedComment = await addCommentActionCounts(
      mongo,
      tenant,
      oldComment,
      actionCounts
    );

    // Update the comment counts onto other documents.
    const counts = await updateAllCommentCounts(mongo, redis, {
      tenant,
      actionCounts,
      before: oldComment,
      after: updatedComment,
    });

    // Publish changes to the event publisher.
    await publishChanges(broker, {
      ...counts,
      before: oldComment,
      after: updatedComment,
    });

    return updatedComment;
  }

  return oldComment;
}

export async function removeCommentAction(
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  input: Omit<RemoveActionInput, "commentRevisionID" | "reason">
): Promise<Readonly<Comment>> {
  // Get the Comment that we are leaving the Action on.
  const oldComment = await retrieveComment(mongo, tenant.id, input.commentID);
  if (!oldComment) {
    throw new CommentNotFoundError(input.commentID);
  }

  // Get the revision for the specific action being removed.
  const action = await retrieveUserAction(
    mongo,
    tenant.id,
    input.userID,
    input.commentID,
    input.actionType
  );
  if (!action) {
    // The action that is trying to get removed does not exist!
    return oldComment;
  }

  // Grab the revision ID out of the action.
  const { commentID, commentRevisionID } = action;

  // Create each of the actions, returning each of the action results.
  const { wasRemoved } = await removeAction(mongo, tenant.id, {
    ...input,
    commentRevisionID,
  });
  if (wasRemoved) {
    // Compute the action counts, and invert them (because we're deleting an
    // action).
    const actionCounts = invertEncodedActionCounts(encodeActionCounts(action));

    // Update the comment action counts here.
    const updatedComment = await updateCommentActionCounts(
      mongo,
      tenant.id,
      commentID,
      commentRevisionID,
      actionCounts
    );

    // Check to see if there was an actual comment returned.
    if (!updatedComment) {
      // TODO: (wyattjoh) return a better error.
      throw new Error("could not update comment action counts");
    }

    // Update the comment counts onto other documents.
    const counts = await updateAllCommentCounts(mongo, redis, {
      tenant,
      actionCounts,
      before: oldComment,
      after: updatedComment,
    });

    // Publish changes to the event publisher.
    await publishChanges(broker, {
      ...counts,
      before: oldComment,
      after: updatedComment,
    });

    return updatedComment;
  }

  return oldComment;
}

export type CreateCommentReaction = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID"
>;

export async function createReaction(
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: CreateCommentReaction,
  now = new Date()
) {
  return addCommentAction(
    mongo,
    redis,
    broker,
    tenant,
    {
      actionType: ACTION_TYPE.REACTION,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      userID: author.id,
    },
    now
  );
}

export type RemoveCommentReaction = Pick<RemoveActionInput, "commentID">;

export async function removeReaction(
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: RemoveCommentReaction
) {
  return removeCommentAction(mongo, redis, broker, tenant, {
    actionType: ACTION_TYPE.REACTION,
    commentID: input.commentID,
    userID: author.id,
  });
}

export type CreateCommentDontAgree = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID" | "additionalDetails"
>;

export async function createDontAgree(
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: CreateCommentDontAgree,
  now = new Date()
) {
  return addCommentAction(
    mongo,
    redis,
    broker,
    tenant,
    {
      actionType: ACTION_TYPE.DONT_AGREE,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      additionalDetails: input.additionalDetails,
      userID: author.id,
    },
    now
  );
}

export type RemoveCommentDontAgree = Pick<RemoveActionInput, "commentID">;

export async function removeDontAgree(
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: RemoveCommentDontAgree
) {
  return removeCommentAction(mongo, redis, broker, tenant, {
    actionType: ACTION_TYPE.DONT_AGREE,
    commentID: input.commentID,
    userID: author.id,
  });
}

export type CreateCommentFlag = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID" | "additionalDetails"
> & {
  reason: GQLCOMMENT_FLAG_REPORTED_REASON;
};

export async function createFlag(
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: CreateCommentFlag,
  now = new Date()
) {
  return addCommentAction(
    mongo,
    redis,
    broker,
    tenant,
    {
      actionType: ACTION_TYPE.FLAG,
      reason: input.reason,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      additionalDetails: input.additionalDetails,
      userID: author.id,
    },
    now
  );
}
