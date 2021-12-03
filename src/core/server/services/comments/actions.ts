import { MongoContext } from "coral-server/data/context";
import { CommentNotFoundError, UserSiteBanned } from "coral-server/errors";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import logger from "coral-server/logger";
import {
  ACTION_TYPE,
  CommentAction,
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
import { retrieveSite } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { isSiteBanned } from "coral-server/models/user/helpers";
import { AugmentedRedis } from "coral-server/services/redis";
import {
  publishChanges,
  updateAllCommentCounts,
} from "coral-server/stacks/helpers";
import { Request } from "coral-server/types/express";

import { GQLCOMMENT_FLAG_REPORTED_REASON } from "coral-server/graph/schema/__generated__/types";

import {
  publishCommentFlagCreated,
  publishCommentReactionCreated,
} from "../events";
import { submitCommentAsSpam } from "../spam";

export type CreateAction = CreateActionInput;

export async function addCommentActions(
  mongo: MongoContext,
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
  mongo: MongoContext,
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

interface AddCommentAction {
  comment: Readonly<Comment>;
  action?: CommentAction;
}

async function addCommentAction(
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  input: Omit<CreateActionInput, "storyID" | "siteID" | "userID">,
  author: User,
  now = new Date()
): Promise<AddCommentAction> {
  const oldComment = await retrieveComment(
    mongo.comments(),
    tenant.id,
    input.commentID
  );
  if (!oldComment) {
    throw new CommentNotFoundError(input.commentID);
  }

  // Check that revision ID exists before we process the action
  if (!oldComment.revisions.find((r) => r.id === input.commentRevisionID)) {
    throw new CommentNotFoundError(input.commentID);
  }

  // Grab some useful properties.
  const { storyID, siteID, section } = oldComment;

  // Check if the user is banned on this site, if they are, throw an error right
  // now.
  // NOTE: this should be removed with attribute based auth checks.
  if (isSiteBanned(author, siteID)) {
    // Get the site in question.
    const site = await retrieveSite(mongo, tenant.id, siteID);
    if (!site) {
      throw new Error(`referenced site not found: ${siteID}`);
    }

    throw new UserSiteBanned(author.id, site.id, site.name);
  }

  // Create the action creator input.
  const action: CreateAction = {
    ...input,
    storyID,
    siteID,
    userID: author.id,
    section,
  };

  // Update the actions for the comment.
  const commentActions = await addCommentActions(mongo, tenant, [action], now);
  if (commentActions.length > 0) {
    // Get the comment action.
    const [commentAction] = commentActions;

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
      commentRevisionID: input.commentRevisionID,
    });

    return { comment: updatedComment, action: commentAction };
  }

  return { comment: oldComment };
}

export async function removeCommentAction(
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  input: Omit<RemoveActionInput, "reason">
): Promise<Readonly<Comment>> {
  // Get the Comment that we are leaving the Action on.
  const oldComment = await retrieveComment(
    mongo.comments(),
    tenant.id,
    input.commentID
  );
  if (!oldComment) {
    throw new CommentNotFoundError(input.commentID);
  }

  // Check that revision ID exists before we process the action
  if (!oldComment.revisions.find((r) => r.id === input.commentRevisionID)) {
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
      commentRevisionID,
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
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: CreateCommentReaction,
  now = new Date()
) {
  const { comment, action } = await addCommentAction(
    mongo,
    redis,
    broker,
    tenant,
    {
      actionType: ACTION_TYPE.REACTION,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
    },
    author,
    now
  );
  if (action) {
    // A comment reaction was created! Publish it.
    publishCommentReactionCreated(
      broker,
      comment,
      input.commentRevisionID,
      action
    ).catch((err) => {
      logger.error({ err }, "could not publish comment flag created");
    });
  }

  return comment;
}

export type RemoveCommentReaction = Pick<
  RemoveActionInput,
  "commentID" | "commentRevisionID"
>;

export async function removeReaction(
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: RemoveCommentReaction
) {
  return removeCommentAction(mongo, redis, broker, tenant, {
    actionType: ACTION_TYPE.REACTION,
    commentID: input.commentID,
    commentRevisionID: input.commentRevisionID,
    userID: author.id,
  });
}

export type CreateCommentDontAgree = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID" | "additionalDetails"
>;

export async function createDontAgree(
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: CreateCommentDontAgree,
  now = new Date()
) {
  const { comment } = await addCommentAction(
    mongo,
    redis,
    broker,
    tenant,
    {
      actionType: ACTION_TYPE.DONT_AGREE,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      additionalDetails: input.additionalDetails,
    },
    author,
    now
  );

  return comment;
}

export type RemoveCommentDontAgree = Pick<
  RemoveActionInput,
  "commentID" | "commentRevisionID"
>;

export async function removeDontAgree(
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: RemoveCommentDontAgree
) {
  return removeCommentAction(mongo, redis, broker, tenant, {
    actionType: ACTION_TYPE.DONT_AGREE,
    commentID: input.commentID,
    commentRevisionID: input.commentRevisionID,
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
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: CreateCommentFlag,
  now = new Date(),
  request?: Request | undefined
) {
  const { comment, action } = await addCommentAction(
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
    },
    author,
    now
  );
  if (action) {
    // A action was created! Publish the event.
    publishCommentFlagCreated(
      broker,
      comment,
      input.commentRevisionID,
      action
    ).catch((err) => {
      logger.error({ err }, "could not publish comment flag created");
    });

    const revision = getLatestRevision(comment);
    if (
      revision &&
      tenant.integrations.akismet.enabled &&
      action.actionType === ACTION_TYPE.FLAG &&
      action.reason === GQLCOMMENT_FLAG_REPORTED_REASON.COMMENT_REPORTED_SPAM
    ) {
      await submitCommentAsSpam(mongo, tenant, comment, request);
    }
  }

  return comment;
}
