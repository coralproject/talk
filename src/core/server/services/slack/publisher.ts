import { CommentCreatedInput } from "coral-server/graph/tenant/resolvers/Subscription/commentCreated";
import { CommentEnteredModerationQueueInput } from "coral-server/graph/tenant/resolvers/Subscription/commentEnteredModerationQueue";
import { CommentFeaturedInput } from "coral-server/graph/tenant/resolvers/Subscription/commentFeatured";
import { CommentLeftModerationQueueInput } from "coral-server/graph/tenant/resolvers/Subscription/commentLeftModerationQueue";
import { CommentReleasedInput } from "coral-server/graph/tenant/resolvers/Subscription/commentReleased";
import { CommentReplyCreatedInput } from "coral-server/graph/tenant/resolvers/Subscription/commentReplyCreated";
import { CommentStatusUpdatedInput } from "coral-server/graph/tenant/resolvers/Subscription/commentStatusUpdated";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/tenant/resolvers/Subscription/types";
import logger from "coral-server/logger";

import { GQLMODERATION_QUEUE } from "coral-server/graph/tenant/schema/__generated__/types";

import { Tenant } from "coral-server/models/tenant";
import { Db } from "mongodb";
import SlackContext from "./context";

type Payload =
  | CommentEnteredModerationQueueInput
  | CommentLeftModerationQueueInput
  | CommentStatusUpdatedInput
  | CommentReplyCreatedInput
  | CommentCreatedInput
  | CommentFeaturedInput
  | CommentReleasedInput;

function enteredModeration(channel: SUBSCRIPTION_CHANNELS, payload: Payload) {
  const p: any = payload;
  return (
    channel === SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE &&
    p.hasOwnProperty("queue") &&
    (p.queue === GQLMODERATION_QUEUE.REPORTED ||
      p.queue === GQLMODERATION_QUEUE.PENDING)
  );
}

function isFeatured(channel: SUBSCRIPTION_CHANNELS) {
  return channel === SUBSCRIPTION_CHANNELS.COMMENT_FEATURED;
}

function isReported(channel: SUBSCRIPTION_CHANNELS, payload: Payload) {
  const p: any = payload;
  return (
    channel === SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE &&
    p.hasOwnProperty("queue") &&
    p.queue === GQLMODERATION_QUEUE.REPORTED
  );
}

function isPending(channel: SUBSCRIPTION_CHANNELS, payload: Payload) {
  const p: any = payload;
  return (
    channel === SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE &&
    p.hasOwnProperty("queue") &&
    p.queue === GQLMODERATION_QUEUE.PENDING
  );
}

function createModerationLink(rootURL: string, commentID: string) {
  return `${rootURL}/admin/moderate/comment/${commentID}`;
}

function createCommentLink(storyURL: string, commentID: string) {
  const urlBuilder = new URL(storyURL);
  urlBuilder.searchParams.set("commentID", commentID);
  return urlBuilder.href;
}

async function postCommentToSlack(
  ctx: SlackContext,
  orgURL: string,
  commentID: string,
  webhookURL: string
) {
  const comment = await ctx.comments.load(commentID);
  if (comment === null) {
    return;
  }
  const story = await ctx.stories.load(comment.storyID);
  if (story === null) {
    return;
  }
  const author = await ctx.users.load(comment.authorID);
  if (author === null) {
    return;
  }

  const storyTitle = story.metadata ? story.metadata.title : "";
  const commentBody =
    comment.revisions.length > 0
      ? comment.revisions[comment.revisions.length - 1].body
      : "";
  const body = commentBody.replace(/<br\/?>/g, "\n");
  const moderateLink = createModerationLink(orgURL, comment.id);
  const commentLink = createCommentLink(story.url, comment.id);

  const data = {
    text: `${author.username} commented on: ${storyTitle}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${author.username} commented on:\n<${story.url}|${storyTitle}>`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${moderateLink}|Go to Moderation> | <${commentLink}|See Comment>`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: body,
        },
      },
    ],
  };

  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      logger.error({ response }, "error sending Slack comment");
    }
  } catch (err) {
    logger.error({ err }, "error sending Slack comment");
  }
}

export type SlackPublisher = (
  channel: SUBSCRIPTION_CHANNELS,
  payload: Payload
) => Promise<void>;

function createSlackPublisher(mongo: Db, tenant: Tenant): SlackPublisher {
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
    const ctx = new SlackContext({ mongo, tenantID: tenant.id });

    try {
      const inModeration = enteredModeration(channel, payload);
      const reported = isReported(channel, payload);
      const pending = isPending(channel, payload);
      const featured = isFeatured(channel);

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

        const orgURL = tenant.organization.url;

        if (
          triggers.allComments &&
          (reported || pending || featured || inModeration)
        ) {
          await postCommentToSlack(ctx, orgURL, commentID, hookURL);
        } else if (triggers.reportedComments && reported) {
          await postCommentToSlack(ctx, orgURL, commentID, hookURL);
        } else if (triggers.pendingComments && pending) {
          await postCommentToSlack(ctx, orgURL, commentID, hookURL);
        } else if (triggers.featuredComments && featured) {
          await postCommentToSlack(ctx, orgURL, commentID, hookURL);
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
