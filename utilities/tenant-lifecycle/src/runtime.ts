import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { Db, MongoClient } from "mongodb";

import { CollectionSpec } from "./collections";

export interface RuntimeConfig {
  liveURI: string;
  liveDatabase: string;
  archiveURI: string;
  archiveDatabase: string;
}

export interface MongoConnections {
  liveClient: MongoClient;
  archiveClient: MongoClient;
  live: Db;
  archive: Db;
  close(): Promise<void>;
}

export function loadRuntimeConfig(): RuntimeConfig {
  const liveURI = process.env.MONGODB_URI;
  if (!liveURI) {
    throw new Error("MONGODB_URI must be set");
  }

  const liveDatabase = process.env.MONGODB_DB_NAME || "coral";
  return {
    liveURI,
    liveDatabase,
    archiveURI: process.env.MONGODB_ARCHIVE_URI || liveURI,
    archiveDatabase: process.env.MONGODB_ARCHIVE_DB_NAME || liveDatabase,
  };
}

export async function connectMongo(
  config: RuntimeConfig
): Promise<MongoConnections> {
  const liveClient = new MongoClient(config.liveURI, {
    appName: "coral-tenant-lifecycle",
    ignoreUndefined: true,
    maxPoolSize: 5,
  });
  const archiveClient = new MongoClient(config.archiveURI, {
    appName: "coral-tenant-lifecycle-archive",
    ignoreUndefined: true,
    maxPoolSize: 5,
  });

  await liveClient.connect();
  try {
    await archiveClient.connect();
  } catch (err) {
    await liveClient.close();
    throw err;
  }

  return {
    liveClient,
    archiveClient,
    live: liveClient.db(config.liveDatabase),
    archive: archiveClient.db(config.archiveDatabase),
    async close() {
      await Promise.all([liveClient.close(), archiveClient.close()]);
    },
  };
}

export function databaseFor(
  connections: Pick<MongoConnections, "live" | "archive">,
  spec: CollectionSpec
): Db {
  return connections[spec.database];
}

export async function assertTenantIndex(
  db: Db,
  spec: CollectionSpec
): Promise<void> {
  const exists = await db
    .listCollections({ name: spec.name }, { nameOnly: true })
    .hasNext();
  if (!exists) {
    return;
  }

  const indexes = await db.collection(spec.name).listIndexes().toArray();
  const hasIndex = indexes.some(
    ({ key }) => Object.keys(key)[0] === spec.tenantField
  );
  if (!hasIndex) {
    throw new Error(
      `${spec.database}.${spec.name} has no index beginning with ` +
        `${spec.tenantField}; create the required index documented in the README`
    );
  }
}

interface ToolResult {
  stdout: string;
  stderr: string;
}

function spawnTool(command: string, args: string[]): Promise<ToolResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
      process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
      process.stderr.write(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `${command} exited with code ${code}: ${
              stderr.trim() || stdout.trim()
            }`
          )
        );
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

export async function toolVersion(command: string): Promise<string> {
  const result = await spawnTool(command, ["--version"]);
  return (result.stdout || result.stderr).split("\n")[0].trim();
}

export async function runDatabaseTool(
  command: "mongodump" | "mongorestore",
  uri: string,
  args: string[]
): Promise<ToolResult> {
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coral-tenant-lifecycle-")
  );
  const configPath = path.join(tempDir, "database-tools.json");
  try {
    await fs.writeFile(configPath, JSON.stringify({ uri }), {
      encoding: "utf8",
      mode: 0o600,
    });
    return await spawnTool(command, [`--config=${configPath}`, ...args]);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

export async function sleep(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
