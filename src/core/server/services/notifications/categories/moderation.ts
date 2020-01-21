import { CommentStatusUpdatedInput } from "coral-server/graph/resolvers/Subscription/commentStatusUpdated";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/resolvers/Subscription/types";
import { hasModeratorStatus } from "coral-server/models/comment";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";
import { getURLWithCommentID } from "coral-server/models/story";
import NotificationContext from "../context";
import { Notification } from "../notification";
import { NotificationCategory } from "./category";

async function processor(
  ctx: NotificationContext,
  input: CommentStatusUpdatedInput
): Promise<Notification | null> {
  // Check to see if this comment was previously in a moderation status.
  if (!hasModeratorStatus({ status: input.oldStatus })) {
    return null;
  }

  // Load the comment in question.
  const comment = await ctx.comments.load(input.commentID);
  if (!comment || !comment.authorID) {
    return null;
  }

  // Get the comment author.
  const author = await ctx.users.load(comment.authorID);
  if (!author) {
    return null;
  }

  // Check to see if this user has notifications enabled.
  if (!author.notifications.onModeration) {
    return null;
  }

  // Generate the unsubscribe URL.
  const unsubscribeURL = await ctx.generateUnsubscribeURL(author);

  // Check to see which template we should use.
  if (comment.status === GQLCOMMENT_STATUS.APPROVED) {
    // Get the story that this was written on.
    const story = await ctx.stories.load(comment.storyID);
    if (!story) {
      return null;
    }

    return {
      userID: author.id,
      template: {
        name: "notification/on-comment-approved",
        context: {
          commentPermalink: getURLWithCommentID(story.url, comment.id),
          organizationName: ctx.tenant.organization.name,
          organizationURL: ctx.tenant.organization.url,
          unsubscribeURL,
        },
      },
    };
  } else if (comment.status === GQLCOMMENT_STATUS.REJECTED) {
    return {
      userID: author.id,
      template: {
        name: "notification/on-comment-rejected",
        context: {
          organizationName: ctx.tenant.organization.name,
          organizationURL: ctx.tenant.organization.url,
          unsubscribeURL,
        },
      },
    };
  }

  return null;
}

export const moderation: NotificationCategory[] = [
  {
    name: "moderation",
    process: processor,
    event: SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED,
    digestOrder: 30,
  },
];
