import GraphContext from "coral-server/graph/context";
import { createDSAReport } from "coral-server/services/dsaReports/reports";

import { GQLCreateDSAReportInput } from "coral-server/graph/schema/__generated__/types";

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
});
