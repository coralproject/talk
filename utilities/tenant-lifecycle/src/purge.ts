import path from "path";
import { Document, Filter } from "mongodb";

import { collectionKey, purgeCollections, tenantFilter } from "./collections";
import {
  readManifest,
  sourceFingerprint,
  verifyFiles,
  writeManifest,
} from "./manifest";
import {
  assertTenantIndex,
  connectMongo,
  databaseFor,
  loadRuntimeConfig,
  sleep,
} from "./runtime";

export interface PurgeOptions {
  batchSize: number;
  sleepMS: number;
}

export async function purgeTenant(
  bundleDir: string,
  options: PurgeOptions
): Promise<void> {
  if (!Number.isInteger(options.batchSize) || options.batchSize < 1) {
    throw new Error("batch size must be a positive integer");
  }
  if (!Number.isInteger(options.sleepMS) || options.sleepMS < 0) {
    throw new Error("sleep duration must be a non-negative integer");
  }

  const absoluteBundle = path.resolve(bundleDir);
  const manifest = await readManifest(absoluteBundle);
  if (!["verified", "purging", "purge-failed"].includes(manifest.status)) {
    throw new Error(`cannot purge archive in status ${manifest.status}`);
  }

  await verifyFiles(absoluteBundle, manifest.files);
  const config = loadRuntimeConfig();
  if (
    manifest.source.live.database !== config.liveDatabase ||
    manifest.source.live.fingerprint !==
      sourceFingerprint(config.liveURI, config.liveDatabase) ||
    manifest.source.archive.database !== config.archiveDatabase ||
    manifest.source.archive.fingerprint !==
      sourceFingerprint(config.archiveURI, config.archiveDatabase)
  ) {
    throw new Error(
      "current MongoDB sources do not match the archive manifest"
    );
  }

  const connections = await connectMongo(config);
  try {
    for (const spec of purgeCollections()) {
      await assertTenantIndex(databaseFor(connections, spec), spec);
    }

    manifest.status = "purging";
    delete manifest.error;
    await writeManifest(absoluteBundle, manifest);

    for (const spec of purgeCollections()) {
      const key = collectionKey(spec);
      const record = manifest.collections[key];
      if (!record || record.countAfter === undefined) {
        throw new Error(`manifest has no completed archive count for ${key}`);
      }

      const database = databaseFor(connections, spec);
      const exists = await database
        .listCollections({ name: spec.name }, { nameOnly: true })
        .hasNext();
      if (!exists) {
        record.purged = record.countAfter;
        await writeManifest(absoluteBundle, manifest);
        continue;
      }

      const collection = database.collection(spec.name);
      const filter = tenantFilter(spec, manifest.tenantID);
      let remaining = await collection.countDocuments(filter, {
        maxTimeMS: 30 * 60 * 1000,
      });
      const previouslyPurged = record.purged || 0;
      const expectedRemaining = record.countAfter - previouslyPurged;
      if (remaining > expectedRemaining) {
        throw new Error(
          `${key} has ${remaining} records; expected at most ${expectedRemaining}`
        );
      }

      // Reconcile a completed database write if the process stopped before its
      // manifest checkpoint was persisted.
      record.purged = record.countAfter - remaining;
      await writeManifest(absoluteBundle, manifest);

      process.stdout.write(`Purging ${key} (${remaining} documents remain)\n`);
      while (remaining > 0) {
        const documents = await collection
          .find(filter, { projection: { _id: 1 }, maxTimeMS: 30 * 60 * 1000 })
          .limit(options.batchSize)
          .toArray();
        if (documents.length === 0) {
          throw new Error(`${key} count was nonzero but no batch was returned`);
        }

        const batchFilter = {
          ...filter,
          _id: { $in: documents.map(({ _id }) => _id) },
        } as Filter<Document>;
        const result = await collection.deleteMany(batchFilter, {
          writeConcern: { w: "majority" },
        });
        if (result.deletedCount === 0) {
          throw new Error(`${key} batch did not delete any documents`);
        }

        record.purged = (record.purged || 0) + result.deletedCount;
        remaining -= result.deletedCount;
        await writeManifest(absoluteBundle, manifest);
        if (remaining > 0 && options.sleepMS > 0) {
          await sleep(options.sleepMS);
        }
      }

      const finalCount = await collection.countDocuments(filter, {
        maxTimeMS: 30 * 60 * 1000,
      });
      if (finalCount !== 0) {
        throw new Error(`${key} still has ${finalCount} documents after purge`);
      }
    }

    manifest.status = "purged";
    await writeManifest(absoluteBundle, manifest);
  } catch (err) {
    manifest.status = "purge-failed";
    manifest.error = err instanceof Error ? err.message : String(err);
    await writeManifest(absoluteBundle, manifest);
    throw err;
  } finally {
    await connections.close();
  }
}
