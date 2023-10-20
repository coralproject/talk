import GraphContext from "coral-server/graph/context";
import {
  addDSAReportNote,
  createDSAReport,
} from "coral-server/services/dsaReports/reports";

import {
  GQLAddDSAReportNoteInput,
  GQLCreateDSAReportInput,
} from "coral-server/graph/schema/__generated__/types";

export const DSAReports = (ctx: GraphContext) => ({
  createDSAReport: ({
    commentID,
    userID,
    lawBrokenDescription,
    additionalInformation,
    submissionID,
  }: GQLCreateDSAReportInput) =>
    createDSAReport(ctx.mongo, ctx.tenant, {
      commentID,
      userID,
      lawBrokenDescription,
      additionalInformation,
      submissionID,
    }),
  addDSAReportNote: ({ userID, body, reportID }: GQLAddDSAReportNoteInput) =>
    addDSAReportNote(ctx.mongo, ctx.tenant, { userID, body, reportID }),
});
