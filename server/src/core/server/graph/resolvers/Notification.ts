import { CommentNotFoundError } from "coral-server/errors";
import { Notification } from "coral-server/models/notifications/notification";

import { GQLNotificationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const NotificationResolver: Required<
  GQLNotificationTypeResolver<Notification>
> = {
  id: ({ id }) => id,
  ownerID: ({ ownerID }) => ownerID,
  createdAt: ({ createdAt }) => createdAt,
  title: ({ title }) => title,
  body: ({ body }) => body,
  comment: async ({ commentID }, input, ctx) => {
    if (!commentID) {
      return null;
    }

    const comment = await ctx.loaders.Comments.comment.load(commentID);
    if (!comment) {
      throw new CommentNotFoundError(commentID);
    }

    return comment;
  },
  dsaReport: async ({ reportID }, input, ctx) => {
    if (!reportID) {
      return null;
    }

    return await ctx.loaders.DSAReports.find.load({ id: reportID });
  },
};
