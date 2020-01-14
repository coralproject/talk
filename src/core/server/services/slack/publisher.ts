import { Db } from "mongodb";

import { reconstructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { CommentCreatedInput } from "coral-server/graph/resolvers/Subscription/commentCreated";
import { CommentEnteredModerationQueueInput } from "coral-server/graph/resolvers/Subscription/commentEnteredModerationQueue";
import { CommentFeaturedInput } from "coral-server/graph/resolvers/Subscription/commentFeatured";
import { CommentLeftModerationQueueInput } from "coral-server/graph/resolvers/Subscription/commentLeftModerationQueue";
import { CommentReleasedInput } from "coral-server/graph/resolvers/Subscription/commentReleased";
import { CommentReplyCreatedInput } from "coral-server/graph/resolvers/Subscription/commentReplyCreated";
import { CommentStatusUpdatedInput } from "coral-server/graph/resolvers/Subscription/commentStatusUpdated";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/resolvers/Subscription/types";
import logger from "coral-server/logger";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import {
  getStoryTitle,
  getURLWithCommentID,
} from "coral-server/models/story/helpers";
import { Tenant } from "coral-server/models/tenant";

import { GQLMODERATION_QUEUE } from "coral-server/graph/schema/__generated__/types";

import SlackContext from "./context";

type Payload =
  | CommentEnteredModerationQueueInput
  | CommentLeftModerationQueueInput
  | CommentStatusUpdatedInput
  | CommentReplyCreatedInput
  | CommentCreatedInput
  | CommentFeaturedInput
  | CommentReleasedInput;

function isFeatured(channel: SUBSCRIPTION_CHANNELS) {
  return channel === SUBSCRIPTION_CHANNELS.COMMENT_FEATURED;
}

function isReported(channel: SUBSCRIPTION_CHANNELS, payload: Payload) {
  return (
    channel === SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE &&
    (payload as CommentEnteredModerationQueueInput).queue ===
      GQLMODERATION_QUEUE.REPORTED
  );
}

function isPending(channel: SUBSCRIPTION_CHANNELS, payload: Payload) {
  return (
    channel === SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE &&
    (payload as CommentEnteredModerationQueueInput).queue ===
      GQLMODERATION_QUEUE.PENDING
  );
}

function createModerationLink(ctx: SlackContext, commentID: string) {
  return reconstructTenantURL(
    ctx.config,
    ctx.tenant,
    ctx.req,
    `/admin/moderate/comment/${commentID}`
  );
}

async function postCommentToSlack(
  ctx: SlackContext,
  message: string,
  commentID: string,
  hookURL: string
) {
  const comment = await ctx.comments.load(commentID);
  if (comment === null || !comment.authorID) {
    return;
  }
  const author = await ctx.users.load(comment.authorID);
  if (author === null) {
    return;
  }
  const story = await ctx.stories.load(comment.storyID);
  if (story === null) {
    return;
  }

  // Get some properties about the event.
  const storyTitle = getStoryTitle(story);
  const commentBody = getLatestRevision(comment).body;
  const moderateLink = createModerationLink(ctx, commentID);
  const commentLink = getURLWithCommentID(story.url, comment.id);

  // Replace HTML link breaks with newlines.
  const body = commentBody.replace(/<br\/?>/g, "\n");

  const data = {
    text: `${message} on *<${story.url}|${storyTitle}>*`,
    attachments: [
      {
        text: body,
        footer: `Authored by *${author.username}* | <${moderateLink}|Go to Moderation> | <${commentLink}|See Comment>`,
      },
    ],
  };

  try {
    // Send the post to the Slack URL.
    const res = await fetch(hookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      logger.error({ res }, "error sending Slack comment");
    }
  } catch (err) {
    logger.error({ err }, "error sending Slack comment");
  }
}

export type SlackPublisher = (
  channel: SUBSCRIPTION_CHANNELS,
  payload: Payload
) => Promise<void>;

function createSlackPublisher(
  mongo: Db,
  config: Config,
  tenant: Tenant
): SlackPublisher {
  if (
    !tenant.slack ||
    !tenant.slack.channels ||
    tenant.slack.channels.length === 0
  ) {
    return async () => {
      // noop
    };
  }

  const { channels } = tenant.slack;

  return async (channel: SUBSCRIPTION_CHANNELS, payload: Payload) => {
    const ctx = new SlackContext({ mongo, config, tenant });

    try {
      const reported = isReported(channel, payload);
      const pending = isPending(channel, payload);
      const featured = isFeatured(channel);

      // If the comment doesn't match any filter, then we don't need to send
      // anything.
      if (!reported && !pending && !featured) {
        return;
      }

      const { commentID } = payload;

      for (const ch of channels) {
        if (!ch) {
          return;
        }
        if (!ch.enabled) {
          return;
        }
        const { hookURL } = ch;
        if (!hookURL) {
          return;
        }
        const { triggers } = ch;
        if (!triggers) {
          return;
        }

        // Add ticket to add back all comments option (including approved)

        if (triggers.reportedComments && reported) {
          await postCommentToSlack(
            ctx,
            "This comment has been reported",
            commentID,
            hookURL
          );
        } else if (triggers.pendingComments && pending) {
          await postCommentToSlack(
            ctx,
            "This comment is pending",
            commentID,
            hookURL
          );
        } else if (triggers.featuredComments && featured) {
          await postCommentToSlack(
            ctx,
            "This comment has been featured",
            commentID,
            hookURL
          );
        }
      }
    } catch (err) {
      logger.error(
        { err, tenantID: tenant.id, channel, payload },
        "could not handle comment in Slack publisher"
      );
    }
  };
}

export default createSlackPublisher;
