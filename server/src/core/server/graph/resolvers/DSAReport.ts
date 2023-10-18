import * as dsaReport from "coral-server/models/dsaReport";

import { GQLDSAReportTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const DSAReport: GQLDSAReportTypeResolver<dsaReport.DSAReport> = {
  reporter: ({ userID }, args, ctx) => {
    if (userID) {
      return ctx.loaders.Users.user.load(userID);
    }

    return null;
  },
  comment: ({ commentID }, args, ctx) => {
    if (commentID) {
      return ctx.loaders.Comments.comment.load(commentID);
    }

    return null;
  },
};
