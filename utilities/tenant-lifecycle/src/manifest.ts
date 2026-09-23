import { createHash } from "crypto";
import { createReadStream, promises as fs } from "fs";
import path from "path";
import { createGunzip } from "zlib";
import { BSON } from "mongodb";

export type ManifestStatus =
  | "archiving"
  | "archive-failed"
  | "archived"
  | "verified"
  | "purging"
  | "purge-failed"
  | "purged";

export interface CollectionManifest {
  database: "live" | "archive";
  name: string;
  filter: Record<string, string>;
  countBefore: number;
  countAfter?: number;
  purged?: number;
}

export interface FileManifest {
  path: string;
  bytes: number;
  sha256: string;
}

export interface ArchiveManifest {
  schemaVersion: 1;
  runID: string;
  tenantID: string;
  createdAt: string;
  updatedAt: string;
  quiescenceAssertedAt: string;
  status: ManifestStatus;
  source: {
    live: { database: string; fingerprint: string };
    archive: { database: string; fingerprint: string };
  };
  tools: {
    node: string;
    mongodump?: string;
    mongorestore?: string;
  };
  collections: Record<string, CollectionManifest>;
  files: FileManifest[];
  error?: string;
}

export const MANIFEST_FILE = "manifest.json";

export function sourceFingerprint(uri: string, database: string): string {
  let normalized = uri;
  try {
    const parsed = new URL(uri);
    parsed.username = "";
    parsed.password = "";
    normalized = parsed.toString();
  } catch {
    normalized = uri.replace(/\/\/[^@/]+@/, "//");
  }

  return createHash("sha256").update(`${normalized}|${database}`).digest("hex");
}

export async function writeManifest(
  bundleDir: string,
  manifest: ArchiveManifest
): Promise<void> {
  manifest.updatedAt = new Date().toISOString();
  const target = path.join(bundleDir, MANIFEST_FILE);
  const temporary = `${target}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(temporary, target);
}

export async function readManifest(
  bundleDir: string
): Promise<ArchiveManifest> {
  const raw = await fs.readFile(path.join(bundleDir, MANIFEST_FILE), "utf8");
  const manifest = JSON.parse(raw) as ArchiveManifest;
  if (
    manifest.schemaVersion !== 1 ||
    !manifest.runID ||
    !manifest.tenantID ||
    !manifest.source ||
    !manifest.collections ||
    !Array.isArray(manifest.files)
  ) {
    throw new Error("archive manifest is missing required fields");
  }
  return manifest;
}

export async function sha256File(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}

export async function inventoryFiles(
  bundleDir: string,
  relativeDir = "dump"
): Promise<FileManifest[]> {
  const root = path.join(bundleDir, relativeDir);
  const files: FileManifest[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (entry.isFile()) {
        await fs.chmod(absolute, 0o600);
        const stat = await fs.stat(absolute);
        files.push({
          path: path.relative(bundleDir, absolute).split(path.sep).join("/"),
          bytes: stat.size,
          sha256: await sha256File(absolute),
        });
      }
    }
  }

  await walk(root);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

export async function verifyFiles(
  bundleDir: string,
  files: FileManifest[]
): Promise<void> {
  for (const file of files) {
    const absolute = path.join(bundleDir, file.path);
    const stat = await fs.stat(absolute);
    if (stat.size !== file.bytes) {
      throw new Error(`size mismatch for ${file.path}`);
    }
    if ((await sha256File(absolute)) !== file.sha256) {
      throw new Error(`checksum mismatch for ${file.path}`);
    }
  }
}

export async function countBSONDocuments(filePath: string): Promise<number> {
  const stream = createReadStream(filePath).pipe(createGunzip());
  let pending = Buffer.alloc(0);
  let count = 0;

  for await (const chunk of stream) {
    pending = Buffer.concat([pending, chunk as Buffer]);
    while (pending.length >= 4) {
      const documentSize = pending.readInt32LE(0);
      if (documentSize < 5 || documentSize > 16 * 1024 * 1024) {
        throw new Error(
          `invalid BSON document size ${documentSize} in ${filePath}`
        );
      }
      if (pending.length < documentSize) {
        break;
      }

      BSON.deserialize(pending.subarray(0, documentSize), {
        validation: { utf8: true },
      });
      pending = pending.subarray(documentSize);
      count += 1;
    }
  }

  if (pending.length !== 0) {
    throw new Error(`truncated BSON data in ${filePath}`);
  }
  return count;
}
