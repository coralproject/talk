import {
  CommentReplyCreatedCoralEventPayload,
  CommentStatusUpdatedCoralEventPayload,
  CoralEventType,
} from "coral-server/events";
import { mapErrorsToNull } from "coral-server/helpers/dataloader";
import { hasPublishedStatus } from "coral-server/models/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import { getStoryTitle, getURLWithCommentID } from "coral-server/models/story";
import { IgnoredUser } from "coral-server/models/user";

import { NotificationCategory } from "./category";

type Payloads =
  | CommentReplyCreatedCoralEventPayload
  | CommentStatusUpdatedCoralEventPayload;

export const reply: NotificationCategory<Payloads> = {
  name: "reply",
  process: async (ctx, input) => {
    const comment = await ctx.comments.load(input.data.commentID);
    if (!comment || !hasPublishedStatus(comment)) {
      return null;
    }

    // If the comment was already in a published state, don't notify again
    if (
      "oldStatus" in input.data &&
      PUBLISHED_STATUSES.includes(input.data.oldStatus)
    ) {
      return null;
    }

    // TODO: evaluate storing a history of comment statuses so we can ensure we don't double send.

    // Check to see if this is a reply to an existing comment.
    if (!comment.parentID || !comment.authorID) {
      return null;
    }

    // Get the parent comment.
    const parent = await ctx.comments.load(comment.parentID);
    if (!parent || !hasPublishedStatus(parent) || !parent.authorID) {
      return null;
    }

    // Get the parent comment's author.
    const [author, parentAuthor] = await ctx.users
      .loadMany([comment.authorID, parent.authorID])
      .then(mapErrorsToNull);
    if (!author || !parentAuthor) {
      return null;
    }

    // Check to see if the target user has notifications enabled for this type.
    if (!parentAuthor.notifications.onReply) {
      return null;
    }

    // Check to see if this is yourself replying to yourself, if that's the case
    // don't send a notification.
    if (parentAuthor.id === author.id) {
      return null;
    }

    // Check to see if this user is ignoring the user who replied to their
    // comment.
    if (
      parentAuthor.ignoredUsers.some(
        (ignoredUser: IgnoredUser) => ignoredUser.id === author.id
      )
    ) {
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
        name: "notification/on-reply",
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
  },
  events: [
    CoralEventType.COMMENT_STATUS_UPDATED,
    CoralEventType.COMMENT_REPLY_CREATED,
  ],
  digestOrder: 30,
};
