import assert from "assert/strict";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import test from "node:test";
import { spawnSync } from "child_process";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { archiveTenant, verifyArchive } from "./archive";
import {
  COLLECTIONS,
  collectionKey,
  purgeCollections,
  tenantFilter,
} from "./collections";
import {
  ArchiveManifest,
  inventoryFiles,
  readManifest,
  sourceFingerprint,
  verifyFiles,
  writeManifest,
} from "./manifest";
import { purgeTenant } from "./purge";
import { runDatabaseTool } from "./runtime";

test("tenant filters and purge order keep the tenant document last", () => {
  const tenants = COLLECTIONS.find(({ name }) => name === "tenants");
  const comments = COLLECTIONS.find(({ name }) => name === "comments");
  assert.ok(tenants);
  assert.ok(comments);
  assert.deepEqual(tenantFilter(tenants, "tenant-a"), { id: "tenant-a" });
  assert.deepEqual(tenantFilter(comments, "tenant-a"), {
    tenantID: "tenant-a",
  });
  assert.equal(purgeCollections().at(-1)?.name, "tenants");
  assert.equal(
    COLLECTIONS.some(({ name }) => ["queries", "migrations"].includes(name)),
    false
  );
});

test("source fingerprints do not depend on embedded credentials", () => {
  const first = sourceFingerprint(
    "mongodb://first:secret@mongo.example/coral?replicaSet=main",
    "coral"
  );
  const second = sourceFingerprint(
    "mongodb://second:different@mongo.example/coral?replicaSet=main",
    "coral"
  );
  assert.equal(first, second);
});

test("file inventory detects archive changes", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "coral-manifest-"));
  try {
    await fs.mkdir(path.join(directory, "dump"));
    const archive = path.join(directory, "dump", "comments.bson.gz");
    await fs.writeFile(archive, "archive");
    const files = await inventoryFiles(directory);
    assert.equal((await fs.stat(archive)).mode & 0o777, 0o600);
    await verifyFiles(directory, files);
    await fs.writeFile(archive, "changed");
    await assert.rejects(verifyFiles(directory, files), /mismatch/);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test(
  "archive creates a verified filtered BSON bundle",
  { timeout: 120_000 },
  async (context) => {
    if (
      spawnSync("mongodump", ["--version"]).status !== 0 ||
      spawnSync("mongorestore", ["--version"]).status !== 0
    ) {
      context.skip("MongoDB Database Tools are not installed");
      return;
    }

    const server = await MongoMemoryServer.create();
    const uri = server.getUri();
    const databaseName = "coral";
    const client = new MongoClient(uri);
    const parent = await fs.mkdtemp(path.join(os.tmpdir(), "coral-archive-"));
    const bundle = path.join(parent, "bundle");
    const previousEnv = {
      uri: process.env.MONGODB_URI,
      db: process.env.MONGODB_DB_NAME,
      archiveURI: process.env.MONGODB_ARCHIVE_URI,
      archiveDB: process.env.MONGODB_ARCHIVE_DB_NAME,
    };

    try {
      process.env.MONGODB_URI = uri;
      process.env.MONGODB_DB_NAME = databaseName;
      process.env.MONGODB_ARCHIVE_URI = uri;
      process.env.MONGODB_ARCHIVE_DB_NAME = databaseName;
      await client.connect();
      const db = client.db(databaseName);
      await db.collection("tenants").createIndex({ id: 1 });
      await db.collection("comments").createIndex({ tenantID: 1 });
      await db.collection("tenants").insertOne({ id: "tenant-a" });
      await db.collection("comments").insertMany([
        { tenantID: "tenant-a", id: "a-1" },
        { tenantID: "tenant-a", id: "a-2" },
        { tenantID: "tenant-b", id: "b-1" },
      ]);

      await archiveTenant("tenant-a", bundle);
      await verifyArchive(bundle);
      const manifest = await readManifest(bundle);
      assert.equal(manifest.status, "verified");
      assert.equal(manifest.collections["live.comments"].countBefore, 2);
      assert.equal(manifest.collections["live.comments"].countAfter, 2);
      assert.ok(
        manifest.files.some(({ path: filePath }) =>
          filePath.endsWith("/comments.bson.gz")
        )
      );

      await runDatabaseTool("mongorestore", uri, [
        `--dir=${path.join(bundle, "dump", "live")}`,
        "--gzip",
        "--nsFrom=coral.*",
        "--nsTo=tenant_restore.*",
        "--stopOnError",
      ]);
      assert.equal(
        await client
          .db("tenant_restore")
          .collection("comments")
          .countDocuments({ tenantID: "tenant-a" }),
        2
      );
      assert.equal(
        await client
          .db("tenant_restore")
          .collection("comments")
          .countDocuments({ tenantID: "tenant-b" }),
        0
      );
    } finally {
      if (previousEnv.uri === undefined) delete process.env.MONGODB_URI;
      else process.env.MONGODB_URI = previousEnv.uri;
      if (previousEnv.db === undefined) delete process.env.MONGODB_DB_NAME;
      else process.env.MONGODB_DB_NAME = previousEnv.db;
      if (previousEnv.archiveURI === undefined)
        delete process.env.MONGODB_ARCHIVE_URI;
      else process.env.MONGODB_ARCHIVE_URI = previousEnv.archiveURI;
      if (previousEnv.archiveDB === undefined)
        delete process.env.MONGODB_ARCHIVE_DB_NAME;
      else process.env.MONGODB_ARCHIVE_DB_NAME = previousEnv.archiveDB;
      await client.close();
      await server.stop();
      await fs.rm(parent, { recursive: true, force: true });
    }
  }
);

test(
  "purge removes only the archived tenant and is resumable",
  { timeout: 120_000 },
  async () => {
    const server = await MongoMemoryServer.create();
    const uri = server.getUri();
    const databaseName = "coral";
    const client = new MongoClient(uri);
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "coral-purge-"));
    const previousEnv = {
      uri: process.env.MONGODB_URI,
      db: process.env.MONGODB_DB_NAME,
      archiveURI: process.env.MONGODB_ARCHIVE_URI,
      archiveDB: process.env.MONGODB_ARCHIVE_DB_NAME,
    };

    try {
      process.env.MONGODB_URI = uri;
      process.env.MONGODB_DB_NAME = databaseName;
      process.env.MONGODB_ARCHIVE_URI = uri;
      process.env.MONGODB_ARCHIVE_DB_NAME = databaseName;
      await client.connect();
      const db = client.db(databaseName);
      await db.collection("tenants").createIndex({ id: 1 });
      await db.collection("comments").createIndex({ tenantID: 1 });
      await db.collection("archivedComments").createIndex({ tenantID: 1 });
      await db.collection("notifications").createIndex({ tenantID: 1 });
      await db
        .collection("tenants")
        .insertMany([{ id: "tenant-a" }, { id: "tenant-b" }]);
      await db.collection("comments").insertMany([
        { tenantID: "tenant-a", id: "a-1" },
        { tenantID: "tenant-a", id: "a-2" },
        { tenantID: "tenant-b", id: "b-1" },
      ]);
      await db
        .collection("archivedComments")
        .insertOne({ tenantID: "tenant-a", id: "archived-a-1" });
      await db
        .collection("notifications")
        .insertOne({ tenantID: "tenant-a", id: "notification-a-1" });

      const collections: ArchiveManifest["collections"] = {};
      for (const spec of COLLECTIONS) {
        const count = await db
          .collection(spec.name)
          .countDocuments(tenantFilter(spec, "tenant-a"));
        collections[collectionKey(spec)] = {
          database: spec.database,
          name: spec.name,
          filter: tenantFilter(spec, "tenant-a") as Record<string, string>,
          countBefore: count,
          countAfter: count,
        };
      }

      const now = new Date().toISOString();
      const manifest: ArchiveManifest = {
        schemaVersion: 1,
        runID: "test-run",
        tenantID: "tenant-a",
        createdAt: now,
        updatedAt: now,
        quiescenceAssertedAt: now,
        status: "verified",
        source: {
          live: {
            database: databaseName,
            fingerprint: sourceFingerprint(uri, databaseName),
          },
          archive: {
            database: databaseName,
            fingerprint: sourceFingerprint(uri, databaseName),
          },
        },
        tools: { node: process.version },
        collections,
        files: [],
      };
      await writeManifest(directory, manifest);
      await db
        .collection("comments")
        .deleteOne({ tenantID: "tenant-a", id: "a-1" });
      manifest.status = "purge-failed";
      await writeManifest(directory, manifest);

      await purgeTenant(directory, { batchSize: 1, sleepMS: 0 });

      assert.equal(
        await db
          .collection("comments")
          .countDocuments({ tenantID: "tenant-a" }),
        0
      );
      assert.equal(
        await db
          .collection("comments")
          .countDocuments({ tenantID: "tenant-b" }),
        1
      );
      assert.equal(
        await db.collection("tenants").countDocuments({ id: "tenant-a" }),
        0
      );
      assert.equal(
        await db.collection("tenants").countDocuments({ id: "tenant-b" }),
        1
      );
    } finally {
      if (previousEnv.uri === undefined) delete process.env.MONGODB_URI;
      else process.env.MONGODB_URI = previousEnv.uri;
      if (previousEnv.db === undefined) delete process.env.MONGODB_DB_NAME;
      else process.env.MONGODB_DB_NAME = previousEnv.db;
      if (previousEnv.archiveURI === undefined)
        delete process.env.MONGODB_ARCHIVE_URI;
      else process.env.MONGODB_ARCHIVE_URI = previousEnv.archiveURI;
      if (previousEnv.archiveDB === undefined)
        delete process.env.MONGODB_ARCHIVE_DB_NAME;
      else process.env.MONGODB_ARCHIVE_DB_NAME = previousEnv.archiveDB;
      await client.close();
      await server.stop();
      await fs.rm(directory, { recursive: true, force: true });
    }
  }
);
