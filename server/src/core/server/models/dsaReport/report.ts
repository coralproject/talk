import { isNumber } from "lodash";
import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/common/lib/types";
import { MongoContext } from "coral-server/data/context";
import {
  Connection,
  ConnectionInput,
  FilterQuery,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";

import {
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
  GQLREPORT_SORT,
} from "coral-server/graph/schema/__generated__/types";

import { TenantResource } from "../tenant";

export interface ReportHistoryItem {
  status?: string;
  createdAt: Date;
  createdBy: string;
  type: GQLDSAReportHistoryType;
  body?: string;
}

export interface DSAReport extends TenantResource {
  readonly id: string;

  userID: string;

  createdAt: Date;

  lawBrokenDescription: string;

  additionalInformation: string;

  commentID: string;

  submissionID: string;

  referenceID: string;

  status: GQLDSAReportStatus;

  history: ReportHistoryItem[];
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

export async function retrieveManyDSAReports(
  mongo: MongoContext,
  tenantID: string,
  ids: ReadonlyArray<string>
) {
  const cursor = mongo.dsaReports().find({
    id: { $in: ids },
    tenantID,
  });
  const dsaReports = await cursor.toArray();

  return ids.map((id) => dsaReports.find((report) => report.id === id) || null);
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

  // shorter, url-friendly referenceID generated from the report id, userID, and commentID
  const referenceID =
    userID.slice(0, 4) + "-" + commentID.slice(0, 4) + "-" + id.slice(0, 4);

  // defaults are the properties set by the application when a new DSAReport is
  // created.
  const defaults: Sub<DSAReport, CreateDSAReportInput> = {
    id,
    tenantID,
    createdAt: now,
    referenceID,
    history: [
      {
        createdAt: now,
        type: GQLDSAReportHistoryType.STATUS_CHANGED,
        status: GQLDSAReportStatus.AWAITING_REVIEW,
        createdBy: userID,
      },
    ],
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

  // check if there's already a dsareport submitted by this user for this comment
  // and return a duplicate error if so
  const alreadyExisting = await mongo.dsaReports().findOne(filter);

  if (alreadyExisting) {
    // TODO: update error thrown
    throw new Error(
      "dsa report submitted by user for this comment already exists"
    );
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
