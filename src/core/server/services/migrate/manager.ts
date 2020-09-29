import fs from "fs-extra";
import path from "path";
import { inject, singleton } from "tsyringe";
import * as uuid from "uuid";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import {
  failMigration,
  finishMigration,
  MIGRATION_STATE,
  retrieveAllMigrationRecords,
  startMigration,
} from "coral-server/models/migration";
import { I18nService } from "coral-server/services/i18n";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { REDIS, Redis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  FailedMigrationDetectedError,
  InProgressMigrationDetectedError,
} from "./error";
import Migration from "./migration";

// Extract the id from the filename with this regex.
const fileNamePattern = /^(\d+)_([\S_]+)\.[tj]s$/;

@singleton()
export default class MigrationManager {
  private clientID: string;
  private migrations: Migration[];
  private ran = false;

  constructor(
    private readonly tenantCache: TenantCache,
    // QUESTION: Is this the best way of doing this??
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(REDIS) private readonly redis: Redis,
    i18n: I18nService
  ) {
    this.clientID = uuid.v4();
    this.migrations = [];

    const fileNames = fs.readdirSync(path.join(__dirname, "migrations"));
    for (const fileName of fileNames) {
      // Test to see if this fileName is one of our migrations.
      if (!fileNamePattern.test(fileName)) {
        if (fileName.endsWith(".map")) {
          // This was a mapping file (in production), skip this.
          continue;
        }

        logger.warn(
          { fileName },
          "found a file in the migrations folder that did not have an expected format"
        );
        continue;
      }

      // Load the migration.
      const filePath = path.join(__dirname, "migrations", fileName);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require(filePath);

      // Parse the timestamp out of the migration filename.
      const matches = fileNamePattern.exec(fileName);
      if (!matches || matches.length !== 3) {
        throw new Error("fileName format is invalid");
      }
      const id = parseInt(matches[1], 10);
      const name = matches[2];

      // Skip this migration if it was disabled.
      if (m.default.disabled) {
        logger.warn(
          { migrationID: id, migrationName: name },
          "skipping disabled migration"
        );
        continue;
      }

      // Create the migration instance.
      const migration = new m.default({ id, name, i18n });

      // Insert the migration into the migrations array.
      if (!(migration instanceof Migration)) {
        throw new Error(`migration at ${filePath} did not export a Migration`);
      }

      this.migrations.push(migration);
    }

    // Sort the migrations.
    this.migrations.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }

      if (a.id > b.id) {
        return 1;
      }

      return 0;
    });
  }

  /**
   * pending will return the pending migrations that need to be completed.
   *
   * @param mongo the database handle to use to get the migrations
   */
  private async pending(): Promise<Migration[]> {
    // Get all the migration records in the database.
    const records = await retrieveAllMigrationRecords(this.mongo);

    // Check to see if any of the migrations have failed or are in progress.
    for (const record of records) {
      switch (record.state) {
        case MIGRATION_STATE.FAILED:
          throw new FailedMigrationDetectedError(record);
        case MIGRATION_STATE.STARTED:
          throw new InProgressMigrationDetectedError(record);
        default:
          break;
      }
    }

    return this.migrations.filter((migration) => {
      // Find the record based on the migration.
      const record = records.find(({ id }) => migration.id === id);
      if (record) {
        // The record exists, so it isn't pending, it's already finished.
        return false;
      }

      // A record of the migration does not exist, so mark it as pending.
      return true;
    });
  }

  private async currentMigration() {
    const records = await retrieveAllMigrationRecords(this.mongo);
    return records.length > 0 ? records[records.length - 1] : null;
  }

  public async executePendingMigrations(silent = false) {
    // Error out if this is ran twice.
    if (this.ran) {
      if (silent) {
        return;
      }

      throw new Error("pending migrations have already been executed");
    }

    // Mark the migrations as ran.
    this.ran = true;

    // Check the current migration id.
    let currentMigration = await this.currentMigration();

    // Determine which migrations need to be ran.
    const pending = await this.pending();
    if (pending.length === 0) {
      logger.info(
        {
          currentMigrationID: currentMigration ? currentMigration.id : null,
        },
        "there was no pending migrations to run"
      );
      return;
    }

    logger.info({ pending: pending.length }, "executing pending migrations");

    const migrationsStartTimer = createTimer();

    for (const migration of pending) {
      let log = logger.child(
        {
          migrationName: migration.name,
          migrationID: migration.id,
        },
        true
      );

      // Mark the migration as started.
      const record = await startMigration(
        this.mongo,
        migration.id,
        this.clientID
      );
      if (record.clientID !== this.clientID) {
        throw new InProgressMigrationDetectedError(record);
      }

      // Apply any index changes for the migration.
      if (migration.indexes) {
        const migrationStartTime = createTimer();
        log.info("starting index migration");
        await migration.indexes(this.mongo);
        log.info(
          { executionTime: migrationStartTime() },
          "finished index migration"
        );
      }

      if (migration.up) {
        // The migration provides an up method, we should run this per Tenant.
        // If no tenants are installed, this will essentially be a no-op.
        for await (const tenant of this.tenantCache) {
          log = log.child({ tenantID: tenant.id }, true);

          const migrationStartTimer = createTimer();
          log.info("starting migration");

          try {
            // Up the migration.
            await migration.up(this.mongo, tenant.id);

            // Test the migration.
            if (migration.test) {
              await migration.test(this.mongo, tenant.id);
            }
          } catch (err) {
            // The migration or test has failed, try to roll back the operation.
            if (migration.down) {
              log.error({ err }, "migration has failed, attempting rollback");

              // Attempt the down migration.
              await migration.down(this.mongo, tenant.id);
            } else {
              log.error(
                { err },
                "migration has failed, and does not have a down method available, migration will not be rolled back"
              );
            }

            // Mark the migration as failed.
            await failMigration(this.mongo, migration.id);

            // Rethrow the error here to cause the application to crash.
            throw err;
          }

          log.info(
            { executionTime: migrationStartTimer() },
            "finished migration"
          );
        }
      }

      // Mark the migration as completed.
      await finishMigration(this.mongo, migration.id);
    }

    currentMigration = await this.currentMigration();

    logger.info(
      {
        finishTime: migrationsStartTimer(),
        currentMigrationID: currentMigration ? currentMigration.id : null,
      },
      "finished running pending migrations"
    );

    for await (const tenant of this.tenantCache) {
      // Flush the tenant cache now for each tenant.
      await this.tenantCache.delete(this.redis, tenant.id, tenant.domain);
    }
  }
}
