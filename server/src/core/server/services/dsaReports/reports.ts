import { Config } from "coral-server/config";
import { DataCache } from "coral-server/data/cache/dataCache";
import { MongoContext } from "coral-server/data/context";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import { Comment } from "coral-server/models/comment";
import {
  changeDSAReportStatus as changeReportStatus,
  createDSAReport as createReport,
  createDSAReportNote as createReportNote,
  createDSAReportShare as createReportShare,
  deleteDSAReportNote as deleteReportNote,
  makeDSAReportDecision as makeReportDecision,
  retrieveDSAReport,
} from "coral-server/models/dsaReport/report";
import { Tenant } from "coral-server/models/tenant";
import { rejectComment } from "coral-server/stacks";
import { Request } from "coral-server/types/express";

import {
  GQLDSAReportDecisionLegality,
  GQLDSAReportStatus,
  GQLREJECTION_REASON_CODE,
} from "coral-server/graph/schema/__generated__/types";

import { I18n } from "../i18n";
import {
  InternalNotificationContext,
  NotificationType,
} from "../notifications/internal/context";
import { AugmentedRedis } from "../redis";

export interface CreateDSAReportInput {
  commentID: string;
  userID: string;
  lawBrokenDescription: string;
  additionalInformation: string;
  submissionID?: string;
}

/**
 * createDSAReport creates a new DSAReport
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param input is the input used for creating the DSAReport
 * @param now is the time this DSAReport was created
 * @returns the newly created DSAReport.
 */
export async function createDSAReport(
  mongo: MongoContext,
  tenant: Tenant,
  input: CreateDSAReportInput,
  now = new Date()
) {
  const result = await createReport(mongo, tenant.id, input, now);
  const { dsaReport } = result;
  return dsaReport;
}

export interface AddDSAReportNoteInput {
  userID: string;
  body: string;
  reportID: string;
}

/**
 * addDSAReportNote adds a note to the history of a DSAReport
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param input is the input used for adding the note
 * @param now is the time this note was created
 * @returns the DSAReport with the new note added to its history.
 */
export async function addDSAReportNote(
  mongo: MongoContext,
  tenant: Tenant,
  input: AddDSAReportNoteInput,
  now = new Date()
) {
  const result = await createReportNote(mongo, tenant.id, input, now);
  const { dsaReport } = result;
  return dsaReport;
}

export interface AddDSAReportShareInput {
  userID: string;
  reportID: string;
}

/**
 * addDSAReportNote adds a share item to the history of a DSAReport
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param input is the input used for adding the share item
 * @param now is the time this DSAReport was shared
 * @returns the DSAReport with the new share added to its history.
 */
export async function addDSAReportShare(
  mongo: MongoContext,
  tenant: Tenant,
  input: AddDSAReportShareInput,
  now = new Date()
) {
  const result = await createReportShare(mongo, tenant.id, input, now);
  const { dsaReport } = result;
  return dsaReport;
}

export interface DeleteDSAReportNoteInput {
  id: string;
  reportID: string;
}

/**
 * deleteDSAReportNote deletes a note from the history of a DSAReport
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param input is the input used for deleting the note
 * @returns the DSAReport with the note deleted from is history.
 */
export async function deleteDSAReportNote(
  mongo: MongoContext,
  tenant: Tenant,
  input: DeleteDSAReportNoteInput,
  now = new Date()
) {
  const result = await deleteReportNote(mongo, tenant.id, input);
  const { dsaReport } = result;
  return dsaReport;
}

export interface ChangeDSAReportStatusInput {
  userID: string;
  status: GQLDSAReportStatus;
  reportID: string;
}

/**
 * changeDSAReportStatus changes the status of a DSAReport
 * and also adds the status change to its history
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param input is the input used for changing the status
 * @returns the DSAReport with its new status
 */
export async function changeDSAReportStatus(
  mongo: MongoContext,
  tenant: Tenant,
  input: ChangeDSAReportStatusInput,
  now = new Date()
) {
  const result = await changeReportStatus(mongo, tenant.id, input, now);
  const { dsaReport } = result;
  return dsaReport;
}

export interface MakeDSAReportDecisionInput {
  commentID: string;
  commentRevisionID: string;
  userID: string;
  reportID: string;
  legality: GQLDSAReportDecisionLegality;
  legalGrounds?: string;
  detailedExplanation?: string;
}

/**
 * makeDSAReportDecison makes an illegal vs legal decision for a DSAReport
 * and also adds the decision to its history
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param input is the input used for making the decision
 * @returns the DSAReport with its decision
 */
export async function makeDSAReportDecision(
  mongo: MongoContext,
  redis: AugmentedRedis,
  cache: DataCache,
  config: Config,
  i18n: I18n,
  broker: CoralEventPublisherBroker,
  notifications: InternalNotificationContext,
  tenant: Tenant,
  comment: Readonly<Comment> | null,
  input: MakeDSAReportDecisionInput,
  req: Request | undefined,
  now = new Date()
) {
  const {
    commentID,
    commentRevisionID,
    userID,
    legalGrounds,
    detailedExplanation,
    reportID,
  } = input;

  // REJECT if ILLEGAL
  if (input.legality === GQLDSAReportDecisionLegality.ILLEGAL) {
    const rejectedComment = await rejectComment(
      mongo,
      redis,
      cache,
      config,
      i18n,
      broker,
      notifications,
      tenant,
      commentID,
      commentRevisionID,
      userID,
      now,
      {
        code: GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT,
        legalGrounds,
        detailedExplanation,
      },
      req,
      true
    );

    if (rejectedComment.authorID) {
      await notifications.create(tenant.id, tenant.locale, {
        targetUserID: rejectedComment.authorID,
        type: NotificationType.ILLEGAL_REJECTED,
        comment: rejectedComment,
        legal: {
          legality: input.legality,
          grounds: legalGrounds,
          explanation: detailedExplanation,
        },
      });
    }
  }

  const report = await retrieveDSAReport(mongo, tenant.id, reportID);
  if (report) {
    await notifications.create(tenant.id, tenant.locale, {
      targetUserID: report.userID,
      type: NotificationType.DSA_REPORT_DECISION_MADE,
      comment,
      report,
      legal: {
        legality: input.legality,
        grounds: legalGrounds,
        explanation: detailedExplanation,
      },
    });
  }

  const result = await makeReportDecision(mongo, tenant.id, input, now);

  const { dsaReport } = result;
  return dsaReport;
}
