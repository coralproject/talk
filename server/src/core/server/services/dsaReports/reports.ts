import { MongoContext } from "coral-server/data/context";
import {
  createDSAReport as createReport,
  createDSAReportNote as createReportNote,
} from "coral-server/models/dsaReport/report";
import { Tenant } from "coral-server/models/tenant";

export interface CreateDSAReportInput {
  commentID: string;
  userID: string;
  lawBrokenDescription: string;
  additionalInformation: string;
  submissionID?: string;
}

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
