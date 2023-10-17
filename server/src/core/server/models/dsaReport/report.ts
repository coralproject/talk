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

import { GQLDSAReportStatus } from "coral-server/graph/schema/__generated__/types";

import { TenantResource } from "../tenant";

export interface DSAReport extends TenantResource {
  readonly id: string;

  userID: string;

  createdAt: Date;

  lawBrokenDescription: string;

  additionalInformation: string;

  commentID: string;

  submissionID: string;

  publicID: string;

  status: GQLDSAReportStatus;
}

export type DSAReportConnectionInput = ConnectionInput<DSAReport>;

async function retrieveConnection(
  input: DSAReportConnectionInput,
  query: Query<DSAReport>
): Promise<Readonly<Connection<Readonly<DSAReport>>>> {
  // Apply the pagination arguments to the query.
  query.orderBy({ name: 1 });
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

export type CreateDSAReportInput = Omit<
  DSAReport,
  "id" | "tenantID" | "createdAt" | "publicID" | "status" | "submissionID"
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

  // TODO: update how publicID generated
  const publicID = uuid();

  // defaults are the properties set by the application when a new DSAReport is
  // created.
  const defaults: Sub<DSAReport, CreateDSAReportInput> = {
    id,
    tenantID,
    createdAt: now,
    publicID,
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
