import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/common/lib/types";
import { MongoContext } from "coral-server/data/context";
import { FilterQuery } from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";

import { GQLDSAReportStatus } from "coral-server/graph/schema/__generated__/types";

export interface DSAReport extends TenantResource {
  readonly id: string;

  userID: string;

  createdAt: Date;

  lawBrokenDescription: string;

  additionalInformation: string;

  commentID: string;

  submissionID?: string;

  publicID: string;

  status: GQLDSAReportStatus;
}

export type CreateDSAReportInput = Omit<
  DSAReport,
  "id" | "tenantID" | "createdAt" | "publicID" | "status"
>;

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
