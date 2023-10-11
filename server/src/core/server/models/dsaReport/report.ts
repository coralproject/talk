import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/common/lib/types";
import { MongoContext } from "coral-server/data/context";
import {
  CommentNotFoundError,
  DuplicateDSAReportError,
} from "coral-server/errors";
import { FilterQuery } from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";

import { GQLDSAReportStatus } from "coral-server/graph/schema/__generated__/types";

export interface DSAReport extends TenantResource {
  /**
   * id identifies this DSA Report specifically.
   */
  readonly id: string;

  /**
   * userID is the id of the user who reported this comment for illegal content.
   */
  userID: string;

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
  submissionID?: string;

  /**
   * publicID is a user-friendly id used to reference the DSA Report.
   */
  publicID: string;

  /**
   * status keeps track of the current status of the DSA Report
   */
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

  // shorter, url-friendly publicID generated from the report id
  const publicID = Buffer.from(id.replace(/-/g, ""), "hex").toString(
    "base64url"
  );

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

  // check that a comment for the comment ID exists and throw an error if not
  const commentExists = await mongo
    .comments()
    .findOne({ tenantID, id: commentID });

  if (!commentExists) {
    throw new CommentNotFoundError(commentID);
  }

  // check if there's already a dsareport submitted by this user for this comment
  // and return a duplicate error if so
  const alreadyExistingReport = await mongo.dsaReports().findOne(filter);

  if (alreadyExistingReport) {
    throw new DuplicateDSAReportError(alreadyExistingReport.id);
  }

  await mongo.dsaReports().insertOne(report);

  return {
    dsaReport: report,
  };
}
