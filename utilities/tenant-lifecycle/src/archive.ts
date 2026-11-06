import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { COLLECTIONS, collectionKey, tenantFilter } from "./collections";
import {
  ArchiveManifest,
  countBSONDocuments,
  inventoryFiles,
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
  runDatabaseTool,
  RuntimeConfig,
  toolVersion,
} from "./runtime";

async function collectionExists(
  database: ReturnType<typeof databaseFor>,
  name: string
): Promise<boolean> {
  return database.listCollections({ name }, { nameOnly: true }).hasNext();
}

async function inspectCounts(
  tenantID: string,
  config: RuntimeConfig
): Promise<Record<string, number>> {
  const connections = await connectMongo(config);
  try {
    const tenant = await connections.live
      .collection("tenants")
      .findOne({ id: tenantID }, { projection: { _id: 1 } });
    if (!tenant) {
      throw new Error(`tenant ${tenantID} was not found`);
    }

    for (const spec of COLLECTIONS) {
      await assertTenantIndex(databaseFor(connections, spec), spec);
    }

    const counts: Record<string, number> = {};
    for (const spec of COLLECTIONS) {
      const database = databaseFor(connections, spec);
      counts[collectionKey(spec)] = (await collectionExists(
        database,
        spec.name
      ))
        ? await database
            .collection(spec.name)
            .countDocuments(tenantFilter(spec, tenantID), {
              maxTimeMS: 30 * 60 * 1000,
            })
        : 0;
    }
    return counts;
  } finally {
    await connections.close();
  }
}

export async function inspectTenant(tenantID: string): Promise<void> {
  const counts = await inspectCounts(tenantID, loadRuntimeConfig());
  process.stdout.write(`${JSON.stringify({ tenantID, counts }, null, 2)}\n`);
}

export async function archiveTenant(
  tenantID: string,
  bundleDir: string
): Promise<void> {
  const config = loadRuntimeConfig();
  const counts = await inspectCounts(tenantID, config);
  const absoluteBundle = path.resolve(bundleDir);

  await fs.mkdir(absoluteBundle, { mode: 0o700 });
  await fs.mkdir(path.join(absoluteBundle, "queries"), { mode: 0o700 });
  await fs.mkdir(path.join(absoluteBundle, "dump"), { mode: 0o700 });

  const now = new Date().toISOString();
  const manifest: ArchiveManifest = {
    schemaVersion: 1,
    runID: randomUUID(),
    tenantID,
    createdAt: now,
    updatedAt: now,
    quiescenceAssertedAt: now,
    status: "archiving",
    source: {
      live: {
        database: config.liveDatabase,
        fingerprint: sourceFingerprint(config.liveURI, config.liveDatabase),
      },
      archive: {
        database: config.archiveDatabase,
        fingerprint: sourceFingerprint(
          config.archiveURI,
          config.archiveDatabase
        ),
      },
    },
    tools: {
      node: process.version,
      mongodump: await toolVersion("mongodump"),
    },
    collections: {},
    files: [],
  };

  for (const spec of COLLECTIONS) {
    manifest.collections[collectionKey(spec)] = {
      database: spec.database,
      name: spec.name,
      filter: tenantFilter(spec, tenantID) as Record<string, string>,
      countBefore: counts[collectionKey(spec)],
    };
  }
  await writeManifest(absoluteBundle, manifest);

  const connections = await connectMongo(config);
  try {
    for (const spec of COLLECTIONS) {
      const key = collectionKey(spec);
      const count = counts[key];
      const database = databaseFor(connections, spec);
      if (!(await collectionExists(database, spec.name))) {
        manifest.collections[key].countAfter = 0;
        await writeManifest(absoluteBundle, manifest);
        continue;
      }

      const queryPath = path.join(absoluteBundle, "queries", `${key}.json`);
      await fs.writeFile(
        queryPath,
        JSON.stringify(tenantFilter(spec, tenantID)),
        { encoding: "utf8", mode: 0o600 }
      );

      const dumpRoot = path.join(absoluteBundle, "dump", spec.database);
      await fs.mkdir(dumpRoot, { recursive: true, mode: 0o700 });
      const uri = spec.database === "live" ? config.liveURI : config.archiveURI;
      const databaseName =
        spec.database === "live" ? config.liveDatabase : config.archiveDatabase;

      process.stdout.write(`Archiving ${key} (${count} documents)\n`);
      await runDatabaseTool("mongodump", uri, [
        `--db=${databaseName}`,
        `--collection=${spec.name}`,
        `--queryFile=${queryPath}`,
        "--readPreference=primary",
        "--gzip",
        `--out=${dumpRoot}`,
      ]);

      const countAfter = await database
        .collection(spec.name)
        .countDocuments(tenantFilter(spec, tenantID), {
          maxTimeMS: 30 * 60 * 1000,
        });
      manifest.collections[key].countAfter = countAfter;
      if (countAfter !== count) {
        throw new Error(
          `${key} changed while archiving: expected ${count}, found ${countAfter}`
        );
      }
      await writeManifest(absoluteBundle, manifest);
    }

    manifest.files = await inventoryFiles(absoluteBundle);
    for (const [key, collection] of Object.entries(manifest.collections)) {
      if (
        collection.countBefore > 0 &&
        !manifest.files.some((file) =>
          file.path.endsWith(`/${collection.name}.bson.gz`)
        )
      ) {
        throw new Error(`archive output is missing BSON data for ${key}`);
      }
    }
    manifest.status = "archived";
    await writeManifest(absoluteBundle, manifest);
  } catch (err) {
    manifest.status = "archive-failed";
    manifest.error = err instanceof Error ? err.message : String(err);
    await writeManifest(absoluteBundle, manifest);
    throw err;
  } finally {
    await connections.close();
  }
}

export async function verifyArchive(bundleDir: string): Promise<void> {
  const absoluteBundle = path.resolve(bundleDir);
  const manifest = await readManifest(absoluteBundle);
  if (!["archived", "verified"].includes(manifest.status)) {
    throw new Error(`cannot verify archive in status ${manifest.status}`);
  }

  await verifyFiles(absoluteBundle, manifest.files);
  for (const [key, collection] of Object.entries(manifest.collections)) {
    const bsonFile = manifest.files.find(
      (file) =>
        file.path.startsWith(`dump/${collection.database}/`) &&
        file.path.endsWith(`/${collection.name}.bson.gz`)
    );
    if (!bsonFile) {
      if (collection.countBefore !== 0) {
        throw new Error(`archive output is missing BSON data for ${key}`);
      }
      continue;
    }

    const archivedCount = await countBSONDocuments(
      path.join(absoluteBundle, bsonFile.path)
    );
    if (archivedCount !== collection.countBefore) {
      throw new Error(
        `${key} archive contains ${archivedCount} documents; ` +
          `expected ${collection.countBefore}`
      );
    }
  }

  const config = loadRuntimeConfig();
  manifest.tools.mongorestore = await toolVersion("mongorestore");

  for (const role of ["live", "archive"] as const) {
    const roleDir = path.join(absoluteBundle, "dump", role);
    try {
      await fs.access(roleDir);
    } catch {
      continue;
    }
    const uri = role === "live" ? config.liveURI : config.archiveURI;
    await runDatabaseTool("mongorestore", uri, [
      `--dir=${roleDir}`,
      "--gzip",
      "--dryRun",
      "--objcheck",
      "--stopOnError",
      "--verbose",
    ]);
  }

  manifest.status = "verified";
  delete manifest.error;
  await writeManifest(absoluteBundle, manifest);
}
