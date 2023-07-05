/* eslint-disable max-classes-per-file */

import VError from "verror";

import { MigrationRecord } from "coral-server/models/migration";

export class MigrationError extends VError {
  public readonly tenantID: string;
  public readonly reason: string;
  public readonly affectedCollection?: string;
  public readonly affectedIDs?: string[];

  constructor(
    tenantID: string,
    reason: string,
    affectedCollection?: string,
    affectedIDs?: string[]
  ) {
    super(
      {
        name: "MigrationError",
        info: {
          tenantID,
          affectedCollection,
          affectedIDs,
        },
      },
      'MigrationError: "%s"',
      reason
    );

    this.tenantID = tenantID;
    this.reason = reason;
    this.affectedCollection = affectedCollection;
    this.affectedIDs = affectedIDs;
  }
}

export class FailedMigrationDetectedError extends VError {
  constructor(record: MigrationRecord) {
    super(
      {
        name: "FailedMigrationDetectedError",
        info: record,
      },
      'FailedMigrationDetectedError: migration "%d" failed, remove this document to restart the migration process',
      record.id
    );
  }
}

export class InProgressMigrationDetectedError extends VError {
  constructor(record: MigrationRecord) {
    super(
      {
        name: "InProgressMigrationDetectedError",
        info: record,
      },
      'InProgressMigrationDetectedError: migration "%d" was in progress',
      record.id
    );
  }
}
