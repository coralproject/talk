import { isNumber } from "lodash";
import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/common/lib/types";
import { MongoContext } from "coral-server/data/context";
import {
  CommentNotFoundError,
  DuplicateDSAReportError,
} from "coral-server/errors";
import { FindDSAReportInput } from "coral-server/graph/loaders/DSAReports";

import {
  Connection,
  ConnectionInput,
  FilterQuery,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { Tenant, TenantResource } from "coral-server/models/tenant";

import {
  GQLDSAReportDecision,
  GQLDSAReportDecisionLegality,
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
  GQLREPORT_SORT,
} from "coral-server/graph/schema/__generated__/types";

export interface ReportHistoryItem {
  /**
   * id identifies this DSA Report history item specifically.
   */
  id: string;

  /**
   * createdAt is when this report history item was created
   */
  createdAt: Date;

  /**
   * createdBy is the id of the user who added the report history item
   */
  createdBy: string;

  /**
   * type is the kind of report history item (note added, status changed, decision made, etc.)
   */
  type: GQLDSAReportHistoryType;

  /**
   * body is the text of the note if the report history item is a note added
   */
  body?: string;

  /**
   * status is the new status if this report history item is a status change
   */
  status?: GQLDSAReportStatus;

  /**
   * decision is the legality decision made about the DSAReport
   */
  decision?: GQLDSAReportDecision;
}

export interface DSAReport extends TenantResource {
  /**
   * id identifies this DSA Report specifically.
   */
  readonly id: string;

  /**
   * userID is the id of the user who reported this comment for illegal content.
   */
  userID?: string | null;

  /**
   * createdAt is the date that this DSAReport was created
   */
  createdAt: Date;

  /**
   * lawBrokenDescription is the description of the law this comment is being
   * reported for breaking.
   */
  lawBrokenDescription: string;

  /**
   * additionalInformation is more explanation of how this comment being reported
   * breaks the law.
   */
  additionalInformation: string;

  /**
   * commentID is the id of the comment being reported.
   */
  commentID: string;

  /**
   * submissionID is the id that keeps track of all comments that are submitted together
   * as part of one illegal content report form by a user.
   */
  submissionID: string;

  /**
   * referenceID is a user-friendly id used to reference the DSA Report.
   */
  referenceID: string;

  /**
   * status keeps track of the current status of the DSA Report
   */
  status: GQLDSAReportStatus;

  /**
   * history keeps track of the history of a DSAReport, including notes added, when status is changed,
   * and when an illegal content decision is made
   */
  history: ReportHistoryItem[];

  /**
   * decision is the legality decision made about the DSAReport
   */
  decision?: GQLDSAReportDecision;

  /**
   * commentModerationActionID is the id of the comment moderation action associated with this DSAReport
   */
  commentModerationActionID?: string;
}

export type DSAReportConnectionInput = ConnectionInput<DSAReport> & {
  orderBy: GQLREPORT_SORT;
};

async function retrieveConnection(
  input: DSAReportConnectionInput,
  query: Query<DSAReport>
): Promise<Readonly<Connection<Readonly<DSAReport>>>> {
  if (input.orderBy === GQLREPORT_SORT.CREATED_AT_ASC) {
    query.orderBy({ createdAt: 1 });
  } else {
    query.orderBy({ createdAt: -1 });
  }

  const skip = isNumber(input.after) ? input.after : 0;
  if (skip) {
    query.after(skip);
  }

  if (input.filter) {
    query.where(input.filter);
  }

  // Return a connection.
  return resolveConnection(query, input, (_, index) => index + skip + 1);
}

export async function retrieveDSAReportConnection(
  mongo: MongoContext,
  tenantID: string,
  input: DSAReportConnectionInput
): Promise<Readonly<Connection<Readonly<DSAReport>>>> {
  // Create the query.
  const query = new Query(mongo.dsaReports()).where({ tenantID });

  return retrieveConnection(input, query);
}

export async function retrieveDSAReportRelatedReportsConnection(
  mongo: MongoContext,
  tenantID: string,
  submissionID: string,
  id: string,
  input: DSAReportConnectionInput
): Promise<Readonly<Connection<Readonly<DSAReport>>>> {
  // Create the query.
  const query = new Query(mongo.dsaReports()).where({
    tenantID,
    submissionID,
    id: { $ne: id },
  });

  return retrieveConnection(input, query);
}

export async function retrieveDSAReport(
  mongo: MongoContext,
  tenantID: string,
  id: string
) {
  return mongo.dsaReports().findOne({ tenantID, id });
}

export type CreateDSAReportInput = Omit<
  DSAReport,
  | "id"
  | "tenantID"
  | "createdAt"
  | "referenceID"
  | "status"
  | "submissionID"
  | "history"
  | "decision"
  | "commentModerationActionID"
> & { submissionID?: string };

export interface CreateDSAReportResultObject {
  /**
   * dsaReport contains the resultant DSAReport that was created.
   */
  dsaReport: DSAReport;
}

export async function createDSAReport(
  mongo: MongoContext,
  tenantID: string,
  input: CreateDSAReportInput,
  now = new Date()
): Promise<CreateDSAReportResultObject> {
  const { userID, commentID, submissionID } = input;

  // Create a new ID for the DSAReport.
  const id = uuid();
  let submissionIDToUse = submissionID;
  if (!submissionIDToUse) {
    submissionIDToUse = uuid();
  }

  // shorter, url-friendly referenceID generated from the report id, userID / submissionID, and commentID
  const firstID = userID ?? submissionIDToUse;
  const referenceID =
    firstID.slice(0, 4) + "-" + commentID.slice(0, 4) + "-" + id.slice(0, 4);

  // defaults are the properties set by the application when a new DSAReport is
  // created.
  const defaults: Sub<DSAReport, CreateDSAReportInput> = {
    id,
    tenantID,
    createdAt: now,
    referenceID,
    history: [],
    status: GQLDSAReportStatus.AWAITING_REVIEW,
  };

  // Extract the filter parameters.
  const filter: FilterQuery<DSAReport> = {
    tenantID,
    commentID,
    userID,
  };

  // Merge the defaults with the input.
  const report: Readonly<DSAReport> = {
    ...defaults,
    ...input,
    submissionID: submissionIDToUse,
  };

  // check that a comment for the comment ID exists and throw an error if not
  const commentExists = await mongo
    .comments()
    .findOne({ tenantID, id: commentID });

  if (!commentExists && mongo.archive) {
    // look in archived comments too
    const commentIsArchived = await mongo
      .archivedComments()
      .findOne({ tenantID, id: commentID });
    if (!commentIsArchived) {
      throw new CommentNotFoundError(commentID);
    }
  }

  // check if there's already a dsareport submitted by this user for this comment
  // and return a duplicate error if so
  // only check if there's a userID so we don't throw on anonymous reports
  if (userID) {
    const alreadyExistingReport = await mongo.dsaReports().findOne(filter);

    if (alreadyExistingReport) {
      throw new DuplicateDSAReportError(alreadyExistingReport.id);
    }
  }

  await mongo.dsaReports().insertOne(report);

  return {
    dsaReport: report,
  };
}

export interface DSAReportNote {
  id: string;
  createdBy: string;
  body: string;
  createdAt: Date;
}

export type CreateDSAReportNoteInput = Omit<
  DSAReportNote,
  "id" | "createdBy" | "createdAt"
> & { userID: string; reportID: string };

export interface CreateDSAReportNoteResultObject {
  /**
   * dsaReport contains the resultant DSAReport that was created.
   */
  dsaReport: DSAReport;
}

enum DSAReportHistoryType {
  STATUS_CHANGED = "STATUS_CHANGED",
  NOTE = "NOTE",
  DECISION_MADE = "DECISION_MADE",
  SHARE = "SHARE",
}

export async function createDSAReportNote(
  mongo: MongoContext,
  tenantID: string,
  input: CreateDSAReportNoteInput,
  now = new Date()
): Promise<CreateDSAReportNoteResultObject> {
  const { userID, body, reportID } = input;

  // Create a new ID for the DSAReportNote.
  const id = uuid();

  const note = {
    id,
    createdBy: userID,
    createdAt: now,
    body,
    type: DSAReportHistoryType.NOTE,
  };

  const updatedReport = await mongo.dsaReports().findOneAndUpdate(
    { id: reportID, tenantID },
    {
      $push: {
        history: note,
      },
    },
    { returnOriginal: false }
  );

  if (!updatedReport.value) {
    throw new Error();
  }

  return {
    dsaReport: updatedReport.value,
  };
}

export interface CreateDSAReportShareInput {
  reportID: string;
  userID: string;
}

export interface CreateDSAReportShareResultObject {
  /**
   * dsaReport contains the resultant DSAReport that was updated.
   */
  dsaReport: DSAReport;
}

export async function createDSAReportShare(
  mongo: MongoContext,
  tenantID: string,
  input: CreateDSAReportShareInput,
  now = new Date()
): Promise<CreateDSAReportShareResultObject> {
  const { userID, reportID } = input;

  // Create a new ID for the DSAReportShare.
  const id = uuid();

  const note = {
    id,
    createdBy: userID,
    createdAt: now,
    type: DSAReportHistoryType.SHARE,
  };

  const updatedReport = await mongo.dsaReports().findOneAndUpdate(
    { id: reportID, tenantID },
    {
      $push: {
        history: note,
      },
    },
    { returnOriginal: false }
  );

  if (!updatedReport.value) {
    throw new Error();
  }

  return {
    dsaReport: updatedReport.value,
  };
}

export interface DeleteDSAReportNoteInput {
  id: string;
  reportID: string;
}

export interface DeleteDSAReportNoteResultObject {
  /**
   * dsaReport contains the resultant DSAReport from which a note was deleted from its history.
   */
  dsaReport: DSAReport;
}

export async function deleteDSAReportNote(
  mongo: MongoContext,
  tenantID: string,
  input: DeleteDSAReportNoteInput
): Promise<DeleteDSAReportNoteResultObject> {
  const { id, reportID } = input;

  const updatedReport = await mongo.dsaReports().findOneAndUpdate(
    { id: reportID, tenantID },
    {
      $pull: {
        history: { id: { $eq: id } },
      },
    },
    { returnOriginal: false }
  );

  if (!updatedReport.value) {
    throw new Error();
  }

  return {
    dsaReport: updatedReport.value,
  };
}

export interface ChangeDSAReportStatusInput {
  reportID: string;
  status: string;
  userID: string;
}

export interface ChangeDSAReportStatusResultObject {
  /**
   * dsaReport contains the resultant DSAReport that was updated.
   */
  dsaReport: DSAReport;
}

export async function changeDSAReportStatus(
  mongo: MongoContext,
  tenantID: string,
  input: ChangeDSAReportStatusInput,
  now = new Date()
): Promise<ChangeDSAReportStatusResultObject> {
  const { userID, status, reportID } = input;

  // Create a new ID for the DSAReportHistoryItem.
  const id = uuid();

  const statusChangeHistoryItem = {
    id,
    createdBy: userID,
    createdAt: now,
    status,
    type: DSAReportHistoryType.STATUS_CHANGED,
  };

  const updatedReport = await mongo.dsaReports().findOneAndUpdate(
    { id: reportID, tenantID },
    {
      $push: {
        history: statusChangeHistoryItem,
      },
      $set: { status },
    },
    { returnOriginal: false }
  );

  if (!updatedReport.value) {
    throw new Error();
  }

  return {
    dsaReport: updatedReport.value,
  };
}

export interface MakeDSAReportDecisionInput {
  reportID: string;
  userID: string;
  legality: GQLDSAReportDecisionLegality;
  legalGrounds?: string;
  detailedExplanation?: string;
}

export interface MakeDSAReportDecisionResultObject {
  /**
   * dsaReport contains the resultant DSAReport that was updated.
   */
  dsaReport: DSAReport;
}

export async function makeDSAReportDecision(
  mongo: MongoContext,
  tenantID: string,
  input: MakeDSAReportDecisionInput,
  now = new Date()
): Promise<MakeDSAReportDecisionResultObject> {
  const { userID, legality, legalGrounds, detailedExplanation, reportID } =
    input;

  // Create new IDs for the DSAReportHistoryItems.
  const statusChangeHistoryId = uuid();
  const decisionMadeHistoryId = uuid();

  const statusChangeHistoryItem = {
    id: statusChangeHistoryId,
    createdBy: userID,
    createdAt: now,
    type: DSAReportHistoryType.STATUS_CHANGED,
    status: GQLDSAReportStatus.COMPLETED,
  };

  const decisionMadeHistoryItem = {
    id: decisionMadeHistoryId,
    createdBy: userID,
    createdAt: now,
    type: DSAReportHistoryType.DECISION_MADE,
    decision: {
      legality,
      legalGrounds,
      detailedExplanation,
    },
  };

  const updatedReport = await mongo.dsaReports().findOneAndUpdate(
    { id: reportID, tenantID },
    {
      $push: {
        history: { $each: [statusChangeHistoryItem, decisionMadeHistoryItem] },
      },
      $set: {
        decision: {
          legality,
          legalGrounds,
          detailedExplanation,
        },
        status: GQLDSAReportStatus.COMPLETED,
      },
    },
    { returnOriginal: false }
  );

  if (!updatedReport.value) {
    throw new Error();
  }

  return {
    dsaReport: updatedReport.value,
  };
}

export async function find(
  mongo: MongoContext,
  tenant: Tenant,
  input: FindDSAReportInput
) {
  return findDSAReport(mongo, tenant.id, input.id);
}

export async function findDSAReport(
  mongo: MongoContext,
  tenantID: string,
  id: string
): Promise<DSAReport | null> {
  const result = await mongo.dsaReports().findOne({
    tenantID,
    id,
  });

  return result ?? null;
}
