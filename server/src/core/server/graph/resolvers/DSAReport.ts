import * as dsaReport from "coral-server/models/dsaReport";

import { GQLDSAReportTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const DSAReport: GQLDSAReportTypeResolver<dsaReport.DSAReport> = {
  reporter: (report, args, ctx) => {
    if (report.userID) {
      return ctx.loaders.Users.user.load(report.userID);
    }

    return null;
  },
  comment: ({ commentID }, args, ctx) => {
    if (commentID) {
      return ctx.loaders.Comments.comment.load(commentID);
    }

    return null;
  },
  history: ({ history }, args, ctx) => {
    const consolidatedHistory = history.map((h) => {
      const createdUser = h.createdBy
        ? ctx.loaders.Users.user.load(h.createdBy)
        : null;
      return { ...h, createdBy: createdUser };
    });
    return consolidatedHistory ?? [];
  },
  lastUpdated: ({ history }, args, ctx) => {
    if (history.length > 0) {
      return history[history.length - 1].createdAt;
    } else {
      return null;
    }
  },
};
