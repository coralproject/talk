import { CommentReplyCreatedInput } from "coral-server/graph/tenant/resolvers/Subscription/commentReplyCreated";
import { CommentStatusUpdatedInput } from "coral-server/graph/tenant/resolvers/Subscription/commentStatusUpdated";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/tenant/resolvers/Subscription/types";
import { hasPublishedStatus } from "coral-server/models/comment";
import { getStoryTitle, getURLWithCommentID } from "coral-server/models/story";
import { hasStaffRole } from "coral-server/models/user/helpers";

import NotificationContext from "../context";
import { Notification } from "../notification";
import { NotificationCategory } from "./category";

async function processor(
  ctx: NotificationContext,
  input: CommentReplyCreatedInput
): Promise<Notification | null> {
  const comment = await ctx.comments.load(input.commentID);
  if (!comment || !hasPublishedStatus(comment) || !comment.authorID) {
    return null;
  }

  // Check to see if this is a reply to an existing comment.
  if (!comment.parentID) {
    return null;
  }

  // Get the parent comment.
  const parent = await ctx.comments.load(comment.parentID);
  if (!parent || !hasPublishedStatus(parent) || !parent.authorID) {
    return null;
  }

  // Get the parent comment's author.
  const [author, parentAuthor] = await ctx.users.loadMany([
    comment.authorID,
    parent.authorID,
  ]);
  if (!author || !parentAuthor) {
    return null;
  }

  // Check to see if the author was a staff member.
  if (!hasStaffRole(author)) {
    return null;
  }

  // Check to see if the target user has notifications enabled for this type.
  if (!parentAuthor.notifications.onStaffReplies) {
    return null;
  }

  // Check to see if this is yourself replying to yourself, if that's the case
  // don't send a notification.
  if (parentAuthor.id === author.id) {
    return null;
  }

  // Get the story that this was written on.
  const story = await ctx.stories.load(comment.storyID);
  if (!story) {
    return null;
  }

  // Generate the unsubscribe URL.
  const unsubscribeURL = await ctx.generateUnsubscribeURL(parentAuthor);

  // The user does have notifications for replied comments enabled, queue the
  // notification to be sent.
  return {
    userID: parentAuthor.id,
    template: {
      name: "notification/on-staff-reply",
      context: {
        // We know that the user had a username because they wrote a comment!
        authorUsername: author.username!,
        commentPermalink: getURLWithCommentID(story.url, comment.id),
        storyTitle: getStoryTitle(story),
        storyURL: story.url,
        organizationName: ctx.tenant.organization.name,
        organizationURL: ctx.tenant.organization.url,
        unsubscribeURL,
      },
    },
  };
}

export const staffReply: NotificationCategory[] = [
  {
    name: "staffReply",
    process: processor,
    event: SUBSCRIPTION_CHANNELS.COMMENT_REPLY_CREATED,
    digestOrder: 30,
    supersedesCategories: ["reply"],
  },
  {
    name: "staffReply",
    process: async (ctx, input: CommentStatusUpdatedInput) => {
      const comment = await ctx.comments.load(input.commentID);
      if (!comment || !hasPublishedStatus(comment)) {
        return null;
      }

      // TODO: evaluate storing a history of comment statuses so we can ensure we don't double send.

      // We've checked the status, let the processing continue!
      return processor(ctx, {
        commentID: comment.id,
        ancestorIDs: comment.ancestorIDs,
      });
    },
    event: SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED,
    digestOrder: 30,
    supersedesCategories: ["reply"],
  },
];
