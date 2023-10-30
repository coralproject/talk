import { MongoContext } from "coral-server/data/context";
import {
  GQLDSAReportDecisionLegality,
  GQLDSAReportStatus,
} from "coral-server/graph/schema/__generated__/types";
import {
  changeDSAReportStatus as changeReportStatus,
  createDSAReport as createReport,
  createDSAReportNote as createReportNote,
  createDSAReportShare as createReportShare,
  deleteDSAReportNote as deleteReportNote,
  makeDSAReportDecision as makeReportDecision,
} from "coral-server/models/dsaReport/report";
import { Tenant } from "coral-server/models/tenant";

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
  userID: string;
  reportID: string;
  legality: GQLDSAReportDecisionLegality;
  legalGrounds: string;
  detailedExplanation: string;
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
  tenant: Tenant,
  input: MakeDSAReportDecisionInput,
  now = new Date()
) {
  const result = await makeReportDecision(mongo, tenant.id, input, now);
  const { dsaReport } = result;
  return dsaReport;
}
