import GraphContext from "coral-server/graph/context";
import { createIllegalContent } from "coral-server/services/comments";
import {
  addDSAReportNote,
  changeDSAReportStatus,
  createDSAReport,
} from "coral-server/services/dsaReports/reports";

import {
  GQLAddDSAReportNoteInput,
  GQLChangeDSAReportStatusInput,
  GQLCreateDSAReportInput,
} from "coral-server/graph/schema/__generated__/types";

export const DSAReports = (ctx: GraphContext) => ({
  createDSAReport: async ({
    commentID,
    userID,
    lawBrokenDescription,
    additionalInformation,
    submissionID,
    commentRevisionID,
  }: GQLCreateDSAReportInput) => {
    await createDSAReport(ctx.mongo, ctx.tenant, {
      commentID,
      userID,
      lawBrokenDescription,
      additionalInformation,
      submissionID,
    });

    if (ctx.user) {
      await createIllegalContent(
        ctx.mongo,
        ctx.redis,
        ctx.config,
        ctx.cache.commentActions,
        ctx.broker,
        ctx.tenant,
        ctx.user,
        { commentID, commentRevisionID },
        ctx.now
      );
    }
  },
  addDSAReportNote: ({ userID, body, reportID }: GQLAddDSAReportNoteInput) =>
    addDSAReportNote(ctx.mongo, ctx.tenant, { userID, body, reportID }),
  changeDSAReportStatus: ({
    userID,
    status,
    reportID,
  }: GQLChangeDSAReportStatusInput) =>
    changeDSAReportStatus(ctx.mongo, ctx.tenant, { userID, status, reportID }),
});
