import { CommentFeaturedInput } from "coral-server/graph/resolvers/Subscription/commentFeatured";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/resolvers/Subscription/types";
import { hasPublishedStatus } from "coral-server/models/comment";

import { getStoryTitle, getURLWithCommentID } from "coral-server/models/story";
import NotificationContext from "../context";
import { Notification } from "../notification";
import { NotificationCategory } from "./category";

async function processor(
  ctx: NotificationContext,
  input: CommentFeaturedInput
): Promise<Notification | null> {
  // Get the comment that was featured.
  const comment = await ctx.comments.load(input.commentID);
  if (!comment || (!hasPublishedStatus(comment) || !comment.authorID)) {
    return null;
  }

  // Get the comment's author.
  const author = await ctx.users.load(comment.authorID);
  if (!author) {
    return null;
  }

  // Check to see if the user has this notification type enabled.
  if (!author.notifications.onFeatured) {
    return null;
  }

  // Get the story that this was written on.
  const story = await ctx.stories.load(comment.storyID);
  if (!story) {
    return null;
  }

  // Generate the unsubscribe URL.
  const unsubscribeURL = await ctx.generateUnsubscribeURL(author);

  return {
    userID: author.id,
    template: {
      name: "notification/on-featured",
      context: {
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

export const featured: NotificationCategory[] = [
  {
    name: "featured",
    process: processor,
    event: SUBSCRIPTION_CHANNELS.COMMENT_FEATURED,
    digestOrder: 30,
  },
];
