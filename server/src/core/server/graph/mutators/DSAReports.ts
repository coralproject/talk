import GraphContext from "coral-server/graph/context";
import { createIllegalContent } from "coral-server/services/comments";
import {
  addDSAReportNote,
  addDSAReportShare,
  changeDSAReportStatus,
  createDSAReport,
  deleteDSAReportNote,
  makeDSAReportDecision,
} from "coral-server/services/dsaReports/reports";

import {
  GQLAddDSAReportNoteInput,
  GQLAddDSAReportShareInput,
  GQLChangeDSAReportStatusInput,
  GQLCreateDSAReportInput,
  GQLDeleteDSAReportNoteInput,
  GQLMakeDSAReportDecisionInput,
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
    const report = await createDSAReport(ctx.mongo, ctx.tenant, {
      commentID,
      userID,
      lawBrokenDescription,
      additionalInformation,
      submissionID,
    });

    await createIllegalContent(
      ctx.mongo,
      ctx.redis,
      ctx.config,
      ctx.i18n,
      ctx.cache.commentActions,
      ctx.broker,
      ctx.tenant,
      ctx.user ?? null,
      await ctx.loaders.Comments.comment.load(commentID),
      { commentID, commentRevisionID, reportID: report.id },
      ctx.now
    );
  },
  addDSAReportNote: ({ userID, body, reportID }: GQLAddDSAReportNoteInput) =>
    addDSAReportNote(ctx.mongo, ctx.tenant, { userID, body, reportID }),
  addDSAReportShare: ({ userID, reportID }: GQLAddDSAReportShareInput) =>
    addDSAReportShare(ctx.mongo, ctx.tenant, { userID, reportID }),
  deleteDSAReportNote: ({ id, reportID }: GQLDeleteDSAReportNoteInput) =>
    deleteDSAReportNote(ctx.mongo, ctx.tenant, { id, reportID }),
  changeDSAReportStatus: ({
    userID,
    status,
    reportID,
  }: GQLChangeDSAReportStatusInput) =>
    changeDSAReportStatus(ctx.mongo, ctx.tenant, { userID, status, reportID }),
  makeDSAReportDecision: async ({
    userID,
    legality,
    legalGrounds,
    detailedExplanation,
    reportID,
    commentID,
    commentRevisionID,
  }: GQLMakeDSAReportDecisionInput) =>
    makeDSAReportDecision(
      ctx.mongo,
      ctx.redis,
      ctx.cache,
      ctx.config,
      ctx.i18n,
      ctx.broker,
      ctx.notifications,
      ctx.tenant,
      await ctx.loaders.Comments.comment.load(commentID),
      {
        userID,
        legality,
        legalGrounds,
        detailedExplanation,
        reportID,
        commentID,
        commentRevisionID,
      },
      ctx.req
    ),
});
