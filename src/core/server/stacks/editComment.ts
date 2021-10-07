import { DateTime } from "luxon";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  CannotCreateCommentOnArchivedStory,
  CommentNotFoundError,
  StoryNotFoundError,
  UserSiteBanned,
} from "coral-server/errors";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import logger from "coral-server/logger";
import {
  encodeActionCounts,
  EncodedCommentActionCounts,
  filterDuplicateActions,
} from "coral-server/models/action/comment";
import { createCommentModerationAction } from "coral-server/models/action/moderation/comment";
import {
  editComment,
  EditCommentInput,
  ExternalMedia,
  getLatestRevision,
  GiphyMedia,
  retrieveComment,
  TwitterMedia,
  validateEditable,
  YouTubeMedia,
} from "coral-server/models/comment";
import { retrieveSite } from "coral-server/models/site";
import { resolveStoryMode, retrieveStory } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { isSiteBanned } from "coral-server/models/user/helpers";
import {
  addCommentActions,
  CreateAction,
} from "coral-server/services/comments/actions";
import {
  attachMedia,
  CreateCommentMediaInput,
} from "coral-server/services/comments/media";
import { processForModeration } from "coral-server/services/comments/pipeline";
import { AugmentedRedis } from "coral-server/services/redis";
import { Request } from "coral-server/types/express";

import {
  publishChanges,
  retrieveParent,
  updateAllCommentCounts,
} from "./helpers";

/**
 * getLastCommentEditableUntilDate will return the `createdAt` date that will
 * represent the _oldest_ date that a comment could have been created on in
 * order to still be editable.
 *
 * @param tenant the tenant that contains settings related editing
 * @param now the date that is the base, defaulting to the current time
 */
function getLastCommentEditableUntilDate(
  tenant: Pick<Tenant, "editCommentWindowLength">,
  now = new Date()
): Date {
  return DateTime.fromJSDate(now)
    .minus({ seconds: tenant.editCommentWindowLength })
    .toJSDate();
}

export type EditComment = Omit<
  EditCommentInput,
  "status" | "authorID" | "lastEditableCommentCreatedAt" | "metadata" | "media"
> & {
  media?: CreateCommentMediaInput;
};

export default async function edit(
  mongo: MongoContext,
  redis: AugmentedRedis,
  config: Config,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: EditComment,
  now = new Date(),
  req?: Request
) {
  let log = logger.child({ commentID: input.id, tenantID: tenant.id }, true);

  // Get the comment that we're editing. This comment is considered stale,
  // because it wasn't involved in the atomic transaction.
  const originalStaleComment = await retrieveComment(
    mongo.comments(),
    tenant.id,
    input.id
  );
  if (!originalStaleComment) {
    throw new CommentNotFoundError(input.id);
  }

  // If the original comment was a reply, then get it's parent!
  const { parentID, parentRevisionID, siteID } = originalStaleComment;
  const parent = await retrieveParent(mongo, tenant.id, {
    parentID,
    parentRevisionID,
  });

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

  // The editable time is based on the current time, and the edit window
  // length. By subtracting the current date from the edit window length, we
  // get the maximum value for the `createdAt` time that would be permitted
  // for the comment edit to succeed.
  const lastEditableCommentCreatedAt = getLastCommentEditableUntilDate(
    tenant,
    now
  );

  // Validate and potentially return with a more useful error.
  validateEditable(originalStaleComment, {
    authorID: author.id,
    lastEditableCommentCreatedAt,
  });

  // Grab the story that we'll use to check moderation pieces with.
  const story = await retrieveStory(
    mongo,
    tenant.id,
    originalStaleComment.storyID
  );
  if (!story) {
    throw new StoryNotFoundError(originalStaleComment.storyID);
  }

  if (story.isArchiving || story.isArchived) {
    throw new CannotCreateCommentOnArchivedStory(tenant.id, story.id);
  }

  // Get the story mode of this Story.
  const storyMode = resolveStoryMode(story.settings, tenant);

  const lastRevision = getLatestRevision(originalStaleComment);

  let media:
    | GiphyMedia
    | TwitterMedia
    | YouTubeMedia
    | ExternalMedia
    | undefined;

  // attach a new media object from input IF:
  //   input.media is defined AND EITHER:
  //      - previous revision has no media OR
  //      - previous revision has media with a different URL
  // otherwise, attach previous revision media if present

  if (input.media) {
    if (!lastRevision.media || lastRevision.media.url !== input.media.url) {
      media = await attachMedia(tenant, input.media, input.body);
    } else if (lastRevision.media) {
      media = lastRevision.media;
    }
  }

  // Run the comment through the moderation phases.
  const { body, status, metadata, actions } = await processForModeration({
    action: "EDIT",
    log,
    mongo,
    redis,
    config,
    tenant,
    story,
    storyMode,
    parent,
    comment: {
      ...originalStaleComment,
      ...input,
      authorID: author.id,
    },
    media,
    author,
    req,
    now,
  });

  let actionCounts: EncodedCommentActionCounts = {};
  if (actions.length > 0) {
    // Encode the new action counts that are going to be added to the new
    // revision.
    actionCounts = encodeActionCounts(...filterDuplicateActions(actions));
  }

  // Perform the edit.
  const result = await editComment(
    mongo,
    tenant.id,
    {
      id: input.id,
      authorID: author.id,
      body,
      status,
      metadata,
      actionCounts,
      lastEditableCommentCreatedAt,
      media,
    },
    now
  );
  if (!result) {
    throw new CommentNotFoundError(input.id);
  }

  log = log.child({ revisionID: result.revision.id }, true);

  // If there were actions to insert, then insert them into the commentActions
  // collection.
  if (actions.length > 0) {
    await addCommentActions(
      mongo,
      tenant,
      actions.map(
        (action): CreateAction => ({
          ...action,
          commentID: result.after.id,
          commentRevisionID: result.revision.id,
          storyID: story.id,
          siteID: story.siteID,
          section: story.metadata?.section,

          // All these actions are created by the system.
          userID: null,
        })
      ),
      now
    );
  }

  // If the comment status changed as a result of a pipeline operation, create a
  // moderation action (but don't associate it with a moderator).
  if (result.before.status !== result.after.status) {
    await createCommentModerationAction(
      mongo,
      tenant.id,
      {
        storyID: story.id,
        commentID: result.after.id,
        commentRevisionID: result.revision.id,
        status: result.after.status,
        moderatorID: null,
      },
      now
    );
  }

  // Update all the comment counts on stories and users.
  const counts = await updateAllCommentCounts(mongo, redis, {
    tenant,
    actionCounts,
    ...result,
  });

  // Publish changes to the event publisher.
  await publishChanges(broker, {
    ...result,
    ...counts,
    commentRevisionID: result.revision.id,
  });

  // Return the resulting comment.
  return result.after;
}
