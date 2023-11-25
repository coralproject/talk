import { DSAReport } from "coral-server/models/dsaReport/report";

import { GQLNotificationDSAReportDetailsTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const NotificationDSAReportDetailsResolver: Required<
  GQLNotificationDSAReportDetailsTypeResolver<DSAReport>
> = {
  id: ({ id }) => id,
  createdAt: ({ createdAt }) => createdAt,
  referenceID: ({ referenceID }) => referenceID,
  comment: async ({ commentID }, input, ctx) => {
    if (!commentID) {
      return null;
    }

    return await ctx.loaders.Comments.comment.load(commentID);
  },
  user: async ({ userID }, input, ctx) => {
    if (!userID) {
      return null;
    }

    return await ctx.loaders.Users.user.load(userID);
  },
  lawBrokenDescription: ({ lawBrokenDescription }) => lawBrokenDescription,
  additionalInformation: ({ additionalInformation }) => additionalInformation,
  submissionID: ({ submissionID }) => submissionID,
};
