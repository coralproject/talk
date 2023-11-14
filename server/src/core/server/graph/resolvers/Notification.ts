import { CommentNotFoundError } from "coral-server/errors";
import { Notification } from "coral-server/models/notifications/notification";

import {
  GQLNOTIFICATION_TYPE,
  GQLNotificationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const NotificationResolver: Required<
  GQLNotificationTypeResolver<Notification>
> = {
  id: ({ id }) => id,
  ownerID: ({ ownerID }) => ownerID,
  type: ({ type }) => (type ? type : GQLNOTIFICATION_TYPE.UNKNOWN),
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
  commentStatus: ({ commentStatus }) => commentStatus,
  dsaReport: async ({ reportID }, input, ctx) => {
    if (!reportID) {
      return null;
    }

    return await ctx.loaders.DSAReports.dsaReport.load({ id: reportID });
  },
};
