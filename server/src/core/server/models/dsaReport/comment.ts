import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/common/lib/types";
import { MongoContext } from "coral-server/data/context";
import { FilterQuery } from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";

export interface DSAReport extends TenantResource {
  readonly id: string;

  userID: string;

  createdAt: Date;

  lawBrokenDescription: string;

  additionalInformation: string;

  commentID: string;

  submissionID?: string;
}

export type CreateDSAReportInput = Omit<
  DSAReport,
  "id" | "tenantID" | "createdAt"
>;

export interface CreateDSAReportResultObject {
  /**
   * action contains the resultant DSAReport that was created.
   */
  dsaReport: DSAReport;

  /**
   * wasUpserted when true, indicates that this DSAReport was just newly created.
   * When false, it indicates that this DSAReport was just looked up, and had
   * existed prior to the `createDSAReport` call.
   */
  wasUpserted: boolean;
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

  // TODO: Also generate a publicID and add

  // defaults are the properties set by the application when a new DSAReport is
  // created.
  const defaults: Sub<DSAReport, CreateDSAReportInput> = {
    id,
    tenantID,
    createdAt: now,
  };

  // search for a

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

  // Create the upsert/update operation.
  const update: { $setOnInsert: Readonly<DSAReport> } = {
    $setOnInsert: report,
  };

  // TODO: Make sure appropriate checks in place not to create duplicate reports
  // by one user for a particular comment

  // Insert the report into the database using an upsert operation.
  const result = await mongo.dsaReports().findOneAndUpdate(filter, update, {
    // We are using this to create a report, so we need to upsert it.
    upsert: true,

    // False to return the updated document instead of the original document.
    // This lets us detect if the document was updated or not.
    returnOriginal: false,
  });

  // Check to see if this was a new document that was upserted, or one was found
  // that matched existing records. We are sure here that the record exists
  // because we're returning the updated document and performing an upsert
  // operation.

  // Because it's relevant that we know that the report was just created, or
  // was just looked up, we need to return the report with an object that
  // indicates if it was upserted.
  const wasUpserted = result.value!.id === id;

  // Return the report that was created/found with a boolean indicating if this
  // report was just upserted (and therefore was newly created).
  return {
    dsaReport: result.value!,
    wasUpserted,
  };
}
